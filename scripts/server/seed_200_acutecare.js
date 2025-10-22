// scripts/seed_200_acutecare.js
// Run from backend root:
// cd /var/www/prod/medicportal/apps/backend
// node scripts/seed_200_acutecare.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const QBANK_ID = 1; // change if needed
const TOTAL = 200;
const DIFFICULTIES = ['EASY','MEDIUM','HARD'];
const SPECIALTY = 'Acute Care Medicine';
const TOPICS = ['Anaesthesia','Critical Care Medicine','Emergency Medicine','Toxicology'];

// Templates per topic to produce realistic stems
const TEMPLATES = {
  Anaesthesia: [
    (i) => `A ${30 + (i % 40)}-year-old undergoing elective laparoscopic cholecystectomy receives spinal anaesthesia. Ten minutes later the patient becomes hypotensive and bradycardic. What is the most appropriate immediate management?`,
    (i) => `During general anaesthesia a patient develops a sudden rise in end-tidal CO₂, tachycardia and masseter muscle rigidity. What is the most likely diagnosis?`,
    (i) => `A patient with anticipated difficult airway has failed intubation attempts and oxygen saturation is falling despite bag-mask ventilation. What is the next best step?`
  ],
  'Critical Care Medicine': [
    (i) => `A 58-year-old with septic shock on high-dose norepinephrine has rising lactate and oliguria. Which intervention is most appropriate next?`,
    (i) => `A ventilated ARDS patient has worsening oxygenation despite FiO₂ 0.9. Which ventilator strategy best reduces ventilator-induced lung injury?`,
    (i) => `A patient with multi-organ failure has refractory hyperkalemia with peaked T waves on ECG. What is the immediate action to stabilize the myocardium?`
  ],
  'Emergency Medicine': [
    (i) => `A patient presents to the ED with sudden-onset severe chest pain, diaphoresis and hypotension. ECG shows anterior ST elevation. What is the best immediate action?`,
    (i) => `A trauma patient arrives with penetrating chest wound, hypotension, distended neck veins and muffled heart sounds. What is the most likely diagnosis?`,
    (i) => `A 6-year-old with suspected complete airway obstruction is cyanotic and unable to cough or breathe. What is the immediate maneuver?`
  ],
  Toxicology: [
    (i) => `A 4-year-old presents after ingestion of an unknown quantity of paracetamol 3 hours ago. What is the next best step?`,
    (i) => `An adult is found with pinpoint pupils, depressed consciousness and respiratory depression after opioid use. What is the immediate antidote?`,
    (i) => `A patient presents with confusion, flushing, dry mucous membranes and dilated pupils after ingesting unknown medication. Which toxidrome best fits?`
  ]
};

// pool of plausible distractors per topic (ensure 5 options total including correct)
const OPTIONS_POOL = {
  Anaesthesia: [
    'IV fluids and Trendelenburg position',
    'Administer ephedrine 10 mg IV',
    'Give phenylephrine bolus',
    'Administer IV atropine',
    'Immediate intubation and mechanical ventilation',
    'Give succinylcholine',
    'Stop volatile agent and hyperventilate',
    'Administer dantrolene',
    'Check neuromuscular monitoring',
    'Start fentanyl infusion'
  ],
  'Critical Care Medicine': [
    'Increase PEEP and lower tidal volume',
    'Start high-dose corticosteroids',
    'Give broad-spectrum antibiotics only',
    'Start renal replacement therapy immediately',
    'Administer IV calcium and insulin-glucose',
    'Increase tidal volume to 10 mL/kg',
    'Initiate ECMO',
    'Begin vasopressin infusion',
    'Give IV mannitol',
    'Begin norepinephrine infusion'
  ],
  'Emergency Medicine': [
    'Immediate pericardiocentesis',
    'Needle decompression of chest',
    'Administer aspirin and arrange urgent PCI',
    'Start broad-spectrum IV antibiotics',
    'Direct laryngoscopy and oropharyngeal suctioning',
    'Perform Heimlich maneuver (abdominal thrusts)',
    'Apply pressure dressing and observe',
    'Give IV fluids and observe',
    'CT head before any treatment',
    'Perform carotid massage'
  ],
  Toxicology: [
    'Administer N-acetylcysteine',
    'Give naloxone IV',
    'Start activated charcoal if within 1 hour',
    'Give flumazenil',
    'Start whole bowel irrigation',
    'Give physostigmine',
    'Perform gastric lavage',
    'Start IV lipid emulsion therapy',
    'Check serum paracetamol level at 4 hours',
    'Observe and discharge if asymptomatic'
  ]
};

function pick(arr, idx) { return arr[idx % arr.length]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shortRationale(topic, correctText) {
  if (topic === 'Anaesthesia') {
    if (correctText === 'Administer dantrolene') return 'features suggest malignant hyperthermia — dantrolene is required';
    if (correctText === 'Administer IV atropine') return 'bradycardia from high spinal/blockade responds to atropine';
    return 'supportive measures and vasoactive agents as required';
  }
  if (topic === 'Critical Care Medicine') {
    if (correctText.includes('PEEP')) return 'lung-protective ventilation reduces VILI in ARDS';
    if (correctText.includes('calcium')) return 'calcium stabilizes myocardium in hyperkalemia';
    return 'optimize perfusion and organ support';
  }
  if (topic === 'Emergency Medicine') {
    if (correctText.includes('PCI')) return 'early reperfusion reduces infarct size in STEMI';
    if (correctText.includes('pericardiocentesis')) return 'tamponade requires immediate pericardial decompression';
    return 'immediate life-saving ED maneuvers';
  }
  if (topic === 'Toxicology') {
    if (correctText.includes('paracetamol')) return 'paracetamol level at 4h guides NAC decision';
    if (correctText.includes('naloxone')) return 'naloxone reverses opioid respiratory depression';
    return 'antidote or supportive care as indicated';
  }
  return 'Clinical best practice';
}

function makeQuestion(i, topic) {
  const tplList = TEMPLATES[topic];
  const tpl = pick(tplList, i);
  const stem = typeof tpl === 'function' ? tpl(i) : String(tpl);

  // decide a correct answer based on topic and stem heuristics
  let correctText;
  if (topic === 'Anaesthesia') {
    if (/masseter|rigidity|rise in end-tidal/i.test(stem)) correctText = 'Administer dantrolene';
    else if (/hypotens|bradycardic/i.test(stem)) correctText = 'Administer IV atropine';
    else if (/failed intubation|oxygen saturation/i.test(stem)) correctText = 'Immediate intubation and mechanical ventilation';
    else correctText = 'IV fluids and Trendelenburg position';
  } else if (topic === 'Critical Care Medicine') {
    if (/ARDS|ventil/i.test(stem)) correctText = 'Increase PEEP and lower tidal volume';
    else if (/hyperkalemia|peaked T/i.test(stem)) correctText = 'Administer IV calcium and insulin-glucose';
    else if (/septic shock/i.test(stem)) correctText = 'Begin norepinephrine infusion';
    else correctText = 'Begin vasopressin infusion';
  } else if (topic === 'Emergency Medicine') {
    if (/ST elevation|STEMI/i.test(stem)) correctText = 'Administer aspirin and arrange urgent PCI';
    else if (/distended neck veins|muffled heart sounds|tamponade/i.test(stem)) correctText = 'Immediate pericardiocentesis';
    else if (/foreign body airway|Heimlich/i.test(stem)) correctText = 'Perform Heimlich maneuver (abdominal thrusts)';
    else correctText = 'Needle decompression of chest';
  } else if (topic === 'Toxicology') {
    if (/paracetamol/i.test(stem)) correctText = 'Check serum paracetamol level at 4 hours';
    else if (/opioid/i.test(stem)) correctText = 'Give naloxone IV';
    else if (/dilated pupils|anticholinergic/i.test(stem)) correctText = 'Give physostigmine';
    else correctText = 'Administer N-acetylcysteine';
  } else {
    correctText = 'Observe and follow up';
  }

  // build 5 options: include correct and 4 unique distractors from pool
  const pool = OPTIONS_POOL[topic].filter(x => x !== correctText);
  const distractors = shuffle(pool).slice(0, 4);
  const options = shuffle([correctText, ...distractors]);
  const correctIndex = options.indexOf(correctText);

  const difficulty = DIFFICULTIES[i % DIFFICULTIES.length];

  return {
    text: stem,
    options,
    correctAnswerIndex: correctIndex,
    explanation: `Best answer: ${correctText}. Short rationale: ${shortRationale(topic, correctText)}.`,
    topic,
    specialty: SPECIALTY,
    difficulty,
    qbankId: QBANK_ID
  };
}

async function main() {
  console.log('Seeding', TOTAL, 'Acute Care Medicine questions into qbankId=', QBANK_ID);
  let created = 0;
  const batchSize = 50;
  const buffer = [];

  for (let i = 0; i < TOTAL; i++) {
    const topic = TOPICS[i % TOPICS.length];
    const q = makeQuestion(i, topic);
    buffer.push(q);

    if (buffer.length >= batchSize || i === TOTAL - 1) {
      const toInsert = buffer.splice(0, buffer.length);
      try {
        const res = await prisma.question.createMany({ data: toInsert, skipDuplicates: true });
        created += res.count ?? toInsert.length;
        console.log('Inserted batch, total created:', created);
      } catch (err) {
        console.error('Batch insert failed, falling back to individual inserts. Error:', err);
        for (const item of toInsert) {
          try {
            await prisma.question.create({ data: item });
            created++;
          } catch (e) {
            console.error('Single insert failed:', e);
          }
        }
      }
    }
  }

  console.log('Done. Total created (approx):', created);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Fatal error', e);
  prisma.$disconnect().finally(()=>process.exit(1));
});
