// scripts/seed_questions.js
// Simple CommonJS Prisma seeding script. Run with:
// cd /var/www/prod/medicportal/apps/backend
// node scripts/seed_questions.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const QUESTIONS = [
  // Emergency / Anaesthesia / Critical / Toxicology examples (AMC style)
  {
    text: 'A 24-year-old man presents with sudden-onset chest pain and dyspnea after smoking cannabis. HR 110, BP 118/76, O₂ 95%. Chest X-ray shows a small left-sided pneumothorax. Most appropriate management?',
    options: ['Needle decompression','Intercostal chest drain','High-flow oxygen and observation','CT thorax','Pleurodesis'],
    correctAnswerIndex: 2,
    explanation: 'Small, stable spontaneous pneumothorax → oxygen + observation.',
    topic: 'Spontaneous Pneumothorax',
    specialty: 'Emergency Medicine',
    difficulty: 'EASY'
  },
  {
    text: 'A 60-year-old man with COPD undergoes hernia repair under general anaesthesia. Post-op: shallow breathing, pinpoint pupils. Most likely cause?',
    options: ['Residual neuromuscular blockade','Opioid overdose','CO₂ retention','Myasthenic crisis','Hypothermia'],
    correctAnswerIndex: 1,
    explanation: 'Miosis + respiratory depression = opioid effect.',
    topic: 'Post-op Respiratory Depression',
    specialty: 'Anaesthesia',
    difficulty: 'EASY'
  },
  {
    text: 'In septic shock, which parameter best reflects tissue perfusion adequacy?',
    options: ['Heart rate','Blood pressure','Central venous pressure','Serum lactate','Urine output'],
    correctAnswerIndex: 3,
    explanation: 'Serum lactate is a key marker of tissue hypoperfusion.',
    topic: 'Septic Shock',
    specialty: 'Critical Care',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 3-year-old ingests 20 paracetamol tablets. 4 hours post-ingestion, asymptomatic. Next best step?',
    options: ['Activated charcoal','Gastric lavage','Check serum paracetamol level','Start NAC immediately','Discharge home'],
    correctAnswerIndex: 2,
    explanation: 'Serum level at 4 hours → guides NAC need via nomogram.',
    topic: 'Paracetamol Overdose',
    specialty: 'Toxicology',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 70-year-old collapses. ECG: narrow complex tachycardia, rate 180 bpm. BP 70/40 mmHg. Next step?',
    options: ['Adenosine','Amiodarone','DC cardioversion','Carotid massage','Verapamil'],
    correctAnswerIndex: 2,
    explanation: 'Unstable SVT → synchronized DC cardioversion.',
    topic: 'Supraventricular Tachycardia',
    specialty: 'Emergency Medicine',
    difficulty: 'MEDIUM'
  },
  {
    text: 'During spinal anaesthesia for C-section, BP drops to 70/40, HR 120. Best initial management?',
    options: ['Atropine','IV fluids and left lateral tilt','Ephedrine 10 mg IV','Phenylephrine bolus','Oxygen + wait'],
    correctAnswerIndex: 1,
    explanation: 'Hypotension due to aortocaval compression → fluids + left lateral tilt.',
    topic: 'Spinal Anaesthesia Complication',
    specialty: 'Anaesthesia',
    difficulty: 'MEDIUM'
  },
  {
    text: 'ARDS patient on ventilator. Which setting reduces ventilator-induced injury?',
    options: ['High tidal volume','Low PEEP','High FiO₂','Low tidal volume (6 mL/kg)','Zero PEEP'],
    correctAnswerIndex: 3,
    explanation: 'Lung-protective ventilation (low tidal volume) minimizes barotrauma.',
    topic: 'ARDS Ventilation',
    specialty: 'Critical Care',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 22-year-old ingests organophosphate pesticide. Pupils pinpoint, sweating, HR 40, salivation. Antidote?',
    options: ['Naloxone','Atropine','Flumazenil','N-acetylcysteine','Glucagon'],
    correctAnswerIndex: 1,
    explanation: 'Atropine counteracts muscarinic effects.',
    topic: 'Organophosphate Poisoning',
    specialty: 'Toxicology',
    difficulty: 'EASY'
  },
  {
    text: 'A trauma patient is unresponsive, breathing spontaneously but with gurgling sounds. Next step in management?',
    options: ['Head tilt–chin lift','Suction airway','Insert oropharyngeal airway','Intubate','Give oxygen'],
    correctAnswerIndex: 1,
    explanation: 'Clear airway obstruction first → suction.',
    topic: 'Airway Management',
    specialty: 'Emergency Medicine',
    difficulty: 'EASY'
  },
  {
    text: 'A 45-year-old ICU patient on broad-spectrum antibiotics develops diarrhea. Likely diagnosis?',
    options: ['Viral gastroenteritis','C. difficile colitis','Sepsis','Lactose intolerance','Drug side effect'],
    correctAnswerIndex: 1,
    explanation: 'Antibiotic use → C. difficile infection.',
    topic: 'Antibiotic-associated Diarrhea',
    specialty: 'Critical Care',
    difficulty: 'EASY'
  },

  // Basic sciences / mixed items (from your provided JSONs)
  {
    text: 'A 60-year-old man has difficulty abducting his right arm beyond 15 degrees. Which muscle is most likely affected?',
    options: ['Supraspinatus','Deltoid','Teres minor','Subscapularis','Infraspinatus'],
    correctAnswerIndex: 1,
    explanation: 'The deltoid abducts the arm from 15° to 90°.',
    topic: 'Shoulder Anatomy',
    specialty: 'Basic Sciences',
    difficulty: 'EASY'
  },
  {
    text: 'During cardiac action potential, which ion influx is primarily responsible for the plateau phase (phase 2)?',
    options: ['Na+','K+','Ca2+','Cl−','Mg2+'],
    correctAnswerIndex: 2,
    explanation: 'Plateau phase is maintained by slow inward calcium influx (L-type Ca2+ channels).',
    topic: 'Cardiac Electrophysiology',
    specialty: 'Basic Sciences',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A patient taking propranolol develops bradycardia. What is the primary mechanism of action of this drug?',
    options: ['Blocks α-adrenergic receptors','Stimulates β1 receptors','Blocks β-adrenergic receptors','Inhibits calcium channels','Inhibits ACE enzyme'],
    correctAnswerIndex: 2,
    explanation: 'Propranolol is a non-selective β-blocker.',
    topic: 'Pharmacology',
    specialty: 'Basic Sciences',
    difficulty: 'EASY'
  },
  {
    text: 'A mutation in the CFTR gene leads to defective chloride transport. What is the mode of inheritance of cystic fibrosis?',
    options: ['Autosomal dominant','Autosomal recessive','X-linked dominant','X-linked recessive','Mitochondrial'],
    correctAnswerIndex: 1,
    explanation: 'Cystic fibrosis is autosomal recessive due to CFTR mutation.',
    topic: 'Genetics',
    specialty: 'Basic Sciences',
    difficulty: 'EASY'
  },
  {
    text: 'A 45-year-old man with chronic alcohol use develops macrocytic anemia. Which vitamin deficiency is most likely?',
    options: ['Vitamin B1','Vitamin B2','Vitamin B6','Vitamin B9','Vitamin B12'],
    correctAnswerIndex: 4,
    explanation: 'Vitamin B12 deficiency causes megaloblastic anemia.',
    topic: 'Nutrition',
    specialty: 'Basic Sciences',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 55-year-old man has BP 160/100. Which antihypertensive acts by inhibiting ACE?',
    options: ['Amlodipine','Losartan','Captopril','Hydrochlorothiazide','Metoprolol'],
    correctAnswerIndex: 2,
    explanation: 'Captopril is an ACE inhibitor.',
    topic: 'Pharmacology',
    specialty: 'Basic Sciences',
    difficulty: 'EASY'
  },
  {
    text: 'Which part of the nephron is primarily responsible for glucose reabsorption?',
    options: ['Proximal convoluted tubule','Loop of Henle','Distal convoluted tubule','Collecting duct','Glomerulus'],
    correctAnswerIndex: 0,
    explanation: 'Most filtered glucose is reabsorbed in the proximal tubule via SGLT transporters.',
    topic: 'Renal Physiology',
    specialty: 'Basic Sciences',
    difficulty: 'EASY'
  },
  {
    text: 'A patient with chronic smoking has squamous metaplasia of bronchial epithelium. What best describes this change?',
    options: ['Dysplasia','Anaplasia','Metaplasia','Hyperplasia','Hypertrophy'],
    correctAnswerIndex: 2,
    explanation: 'Metaplasia = reversible change to another differentiated cell type in response to irritation.',
    topic: 'Pathology',
    specialty: 'Basic Sciences',
    difficulty: 'MEDIUM'
  },
  {
    text: 'Which artery is the main blood supply to the head of the femur in adults?',
    options: ['Obturator artery','Medial circumflex femoral artery','Lateral circumflex femoral artery','Femoral artery','Inferior gluteal artery'],
    correctAnswerIndex: 1,
    explanation: 'Medial circumflex femoral artery gives retinacular vessels to the femoral head.',
    topic: 'Orthopaedic Anatomy',
    specialty: 'Basic Sciences',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A newborn presents with SCID due to adenosine deaminase deficiency. What is the biochemical effect?',
    options: ['Increased ATP synthesis','Decreased uric acid levels','Accumulation of deoxyadenosine','Impaired glycolysis','Increased ammonia formation'],
    correctAnswerIndex: 2,
    explanation: 'ADA deficiency → accumulation of deoxyadenosine → lymphocyte toxicity.',
    topic: 'Immunology',
    specialty: 'Basic Sciences',
    difficulty: 'HARD'
  },

  // Women health / OB-GYN examples from your lists:
  {
    text: 'A 24-year-old woman presents with irregular menses and excessive facial hair. She is obese with BMI 31. Most likely diagnosis?',
    options: ['Cushing syndrome','Polycystic ovary syndrome','Thyroid dysfunction','Premature ovarian failure','Androgen-secreting tumor'],
    correctAnswerIndex: 1,
    explanation: 'PCOS presents with menstrual irregularity, hirsutism and obesity due to hyperandrogenism.',
    topic: 'PCOS',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 46-year-old woman has heavy, prolonged menstrual bleeding and a bulky irregular uterus. Most likely diagnosis?',
    options: ['Adenomyosis','Endometrial carcinoma','Uterine fibroids','Endometrial hyperplasia','Dysfunctional uterine bleeding'],
    correctAnswerIndex: 2,
    explanation: 'Leiomyomas (fibroids) commonly cause menorrhagia and enlarged irregular uterus.',
    topic: 'Uterine Fibroids',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },
  {
    text: 'Transvaginal ultrasound shows ovarian cysts with a "ground glass" appearance. Most likely diagnosis?',
    options: ['Endometriosis','Pelvic inflammatory disease','Ovarian torsion','Ectopic pregnancy','Functional cysts'],
    correctAnswerIndex: 0,
    explanation: 'Endometriomas (chocolate cysts) have homogenous ground-glass echotexture on US.',
    topic: 'Endometriosis',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 22-year-old woman with lower abdominal pain and fever and cervical motion tenderness. Most likely diagnosis?',
    options: ['Pelvic inflammatory disease','Endometriosis','Ectopic pregnancy','Appendicitis','Ovarian cyst rupture'],
    correctAnswerIndex: 0,
    explanation: 'PID presents with lower abdominal pain, fever and cervical motion tenderness due to ascending infection.',
    topic: 'PID',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },
  {
    text: 'A 27-year-old primigravida at 10 weeks with severe nausea, vomiting, uterine enlargement, and very high β-hCG. Most likely diagnosis?',
    options: ['Threatened miscarriage','Ectopic pregnancy','Molar pregnancy','Multiple gestation','Hyperemesis gravidarum'],
    correctAnswerIndex: 2,
    explanation: 'Molar pregnancy causes markedly elevated hCG and uterine enlargement.',
    topic: 'Molar Pregnancy',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },

  // Extra examples from provided JSONs (short form)
  {
    text: 'Which tumor marker is most commonly elevated in epithelial ovarian carcinoma?',
    options: ['CA 15-3','CA 19-9','CA 125','AFP'],
    correctAnswerIndex: 2,
    explanation: 'CA-125 is commonly used in epithelial ovarian cancer.',
    topic: 'Ovarian Tumors',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },
  {
    text: 'Which infection is most commonly associated with pelvic inflammatory disease (PID)?',
    options: ['E. coli','Chlamydia trachomatis','Candida albicans','Gardnerella vaginalis'],
    correctAnswerIndex: 1,
    explanation: 'Chlamydia trachomatis is a leading cause of PID.',
    topic: 'Pelvic Infections',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  },
  {
    text: 'The definitive management of symptomatic uterine fibroids in a woman who has completed childbearing is?',
    options: ['Myomectomy','Hysterectomy','Endometrial ablation','GnRH analogs'],
    correctAnswerIndex: 1,
    explanation: 'Hysterectomy is curative for symptomatic fibroids when fertility is not desired.',
    topic: 'Uterine Fibroids',
    specialty: 'Women\'s Health',
    difficulty: 'MEDIUM'
  }
];

async function main() {
  try {
    const qbankId = 1; // <- ensure this is the Clinical Medicine qbank id
    console.log('Seeding', QUESTIONS.length, 'questions to qbankId=', qbankId);

    for (const q of QUESTIONS) {
      // normalize fields and defaults
      const toCreate = {
        text: q.text,
        options: q.options,
        correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
        explanation: q.explanation ?? null,
        topic: q.topic ?? 'General',
        specialty: q.specialty ?? q.topic ?? 'General',
        difficulty: q.difficulty ?? 'MEDIUM',
        qbankId: qbankId
      };

      // create
      const created = await prisma.question.create({ data: toCreate });
      console.log('Created question id=', created.id);
    }

    console.log('Seeding finished.');
  } catch (err) {
    console.error('Error seeding questions:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
