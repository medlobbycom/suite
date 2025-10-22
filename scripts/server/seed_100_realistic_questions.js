// scripts/seed_100_realistic_questions.js
// Run: cd /var/www/prod/medicportal/apps/backend && node scripts/seed_100_realistic_questions.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const QBANK_ID = 1; // Clinical Medicine (Clinical Medicine qbank)
const QUESTIONS = [
  // 1
  {
    text: "A 65-year-old man with long-standing hypertension presents with sudden severe back pain radiating to the groin. BP 150/90, peripheral pulses present. What is the most likely diagnosis?",
    options: ["Acute renal colic","Aortic dissection","Abdominal aortic aneurysm rupture","Pancreatitis","Peptic ulcer disease"],
    correctAnswerIndex: 2,
    explanation: "Severe sudden back pain in older hypertensive patient suggests AAA rupture or leak; high suspicion for abdominal aortic aneurysm complication.",
    topic: "Vascular Surgery",
    specialty: "Vascular Surgery",
    difficulty: "MEDIUM"
  },
  // 2
  {
    text: "A 25-year-old woman presents with fever, cough, pleuritic chest pain and unilateral lobar consolidation on chest x-ray. Which organism is most commonly responsible?",
    options: ["Streptococcus pneumoniae","Mycoplasma pneumoniae","Haemophilus influenzae","Legionella pneumophila","Staphylococcus aureus"],
    correctAnswerIndex: 0,
    explanation: "Streptococcus pneumoniae is the commonest cause of community-acquired lobar pneumonia.",
    topic: "Community Acquired Pneumonia",
    specialty: "Respiratory Medicine",
    difficulty: "EASY"
  },
  // 3
  {
    text: "A 72-year-old man has progressive exertional chest pain relieved by rest. ECG between episodes is normal. What is the best next diagnostic test?",
    options: ["Resting echocardiogram","Exercise stress test (treadmill)","CT chest","Coronary angiography","Holter monitor"],
    correctAnswerIndex: 1,
    explanation: "Exercise stress testing is appropriate to evaluate stable exertional angina in patients able to exercise.",
    topic: "Ischaemic Heart Disease",
    specialty: "Cardiology",
    difficulty: "MEDIUM"
  },
  // 4
  {
    text: "A 45-year-old man presents with 3 months of progressive jaundice, weight loss and painless obstructive pattern LFTs. What is the most likely diagnosis?",
    options: ["Acute hepatitis","Choledocholithiasis","Cholangiocarcinoma","Primary biliary cholangitis","Hemolytic anemia"],
    correctAnswerIndex: 2,
    explanation: "Painless progressive obstructive jaundice suggests a biliary tract malignancy such as cholangiocarcinoma.",
    topic: "Hepatobiliary",
    specialty: "Gastroenterology",
    difficulty: "HARD"
  },
  // 5
  {
    text: "A 68-year-old woman with osteoporosis falls and sustains a hip fracture. Which management improves mortality and mobility most if provided early?",
    options: ["Delay surgery and optimize comorbidities","Immediate weight-bearing","Early surgical fixation within 48 hours","Bed rest for 2 weeks","Start high-dose steroids"],
    correctAnswerIndex: 2,
    explanation: "Early surgical fixation (within 48 hours) of hip fractures reduces complications and improves outcomes.",
    topic: "Hip Fracture",
    specialty: "Orthopaedics",
    difficulty: "MEDIUM"
  },
  // 6
  {
    text: "A 30-year-old woman presents with flank pain and microscopic hematuria. CT KUB shows a 6 mm distal ureteric stone. Best immediate management?",
    options: ["Conservative with fluids and analgesia","Immediate ureteroscopy","Percutaneous nephrolithotomy","Open surgery","Lithotripsy next day"],
    correctAnswerIndex: 0,
    explanation: "Small distal ureteral stones (≤6 mm) often pass with conservative measures including hydration and analgesia.",
    topic: "Urolithiasis",
    specialty: "Urology",
    difficulty: "EASY"
  },
  // 7
  {
    text: "A 50-year-old diabetic patient presents with sudden painless loss of vision in one eye. Fundus exam shows pale retina with a cherry-red spot. Most likely diagnosis?",
    options: ["Central retinal artery occlusion","Central retinal vein occlusion","Optic neuritis","Vitreous hemorrhage","Retinal detachment"],
    correctAnswerIndex: 0,
    explanation: "Pale retina with cherry-red spot indicates central retinal artery occlusion — an ophthalmic emergency.",
    topic: "Retinal Vascular Occlusion",
    specialty: "Ophthalmology",
    difficulty: "HARD"
  },
  // 8
  {
    text: "A 28-year-old woman with new headache, visual changes and papilledema. MRI shows venous sinus thrombosis. Which disorder is commonly associated?",
    options: ["Migraine","Pregnancy/postpartum state","Parkinson disease","Multiple sclerosis","Temporal arteritis"],
    correctAnswerIndex: 1,
    explanation: "Cerebral venous sinus thrombosis is associated with hypercoagulable states, including pregnancy and postpartum.",
    topic: "Neurovascular",
    specialty: "Neurology",
    difficulty: "MEDIUM"
  },
  // 9
  {
    text: "A 55-year-old alcoholic presents with severe epigastric pain radiating to the back and markedly elevated serum amylase and lipase. Best initial management?",
    options: ["Immediate ERCP","Nil per mouth, IV fluids, analgesia and monitoring","High-dose antibiotics","Urgent laparotomy","Start insulin infusion"],
    correctAnswerIndex: 1,
    explanation: "Acute pancreatitis initial management is supportive: NPO, aggressive IV fluids, analgesia and monitoring.",
    topic: "Acute Pancreatitis",
    specialty: "Gastroenterology",
    difficulty: "MEDIUM"
  },
  // 10
  {
    text: "A 40-year-old woman has a painless breast lump. Best next step in imaging for a 40-year-old woman?",
    options: ["Ultrasound only","Mammography","MRI breast only","Chest x-ray","Observation for 3 months"],
    correctAnswerIndex: 1,
    explanation: "Mammography is the investigation of choice for women ≥40 with a palpable breast lump.",
    topic: "Breast Lump",
    specialty: "Breast Surgery",
    difficulty: "EASY"
  },
  // 11
  {
    text: "A 23-year-old presents with fever, rhinorrhea and pharyngeal exudates; rapid strep test positive. Appropriate antibiotic?",
    options: ["Amoxicillin","Azithromycin","Ciprofloxacin","Metronidazole","Doxycycline"],
    correctAnswerIndex: 0,
    explanation: "Beta-lactam (amoxicillin/penicillin) is first-line for streptococcal pharyngitis.",
    topic: "Infectious Diseases",
    specialty: "General Practice",
    difficulty: "EASY"
  },
  // 12
  {
    text: "An 80-year-old with atrial fibrillation is started on warfarin. INR target for stroke prevention in non-valvular AF?",
    options: ["INR 1.0","INR 1.5","INR 2.0–3.0","INR 3.5–4.5","No INR monitoring needed"],
    correctAnswerIndex: 2,
    explanation: "Target INR for AF stroke prevention is typically 2.0–3.0 with warfarin.",
    topic: "Anticoagulation",
    specialty: "Cardiology",
    difficulty: "MEDIUM"
  },
  // 13
  {
    text: "A 16-year-old adolescent presents with a painful swollen knee after twisting. X-ray normal, exam suggests ACL tear. Best next imaging?",
    options: ["Repeat x-ray in 2 weeks","MRI knee","Ultrasound knee","CT knee","Bone scan"],
    correctAnswerIndex: 1,
    explanation: "MRI is best to evaluate soft tissue injuries such as ACL tears.",
    topic: "Knee Injury",
    specialty: "Orthopaedics",
    difficulty: "MEDIUM"
  },
  // 14
  {
    text: "A 35-year-old pregnant woman at 32 weeks has severe hypertension and proteinuria. Next best step?",
    options: ["Immediate delivery regardless of gestation","Start methyldopa outpatient","Admit, monitor and start antihypertensives, consider delivery if severe","Give oral antibiotics","Manage as chronic hypertension"],
    correctAnswerIndex: 2,
    explanation: "Pre-eclampsia at 32 weeks with severe features requires admission, BP control and consideration of delivery depending on maternal/fetal status.",
    topic: "Pre-eclampsia",
    specialty: "Obstetrics",
    difficulty: "HARD"
  },
  // 15
  {
    text: "A 50-year-old smoker has progressive dyspnea and FEV1/FVC ratio of 0.65 with low DLCO. Most likely diagnosis?",
    options: ["Asthma","COPD emphysema","Interstitial lung disease","Pulmonary embolism","Bronchiectasis"],
    correctAnswerIndex: 1,
    explanation: "Obstructive spirometry with reduced DLCO in a smoker suggests emphysema-type COPD.",
    topic: "Obstructive Lung Disease",
    specialty: "Respiratory Medicine",
    difficulty: "MEDIUM"
  },
  // 16
  {
    text: "A 6-month-old with fever, cough, respiratory distress and hyperinflation on chest x-ray — likely bronchiolitis. Best management?",
    options: ["Ribavirin routinely","Supportive care with oxygen and hydration","Early antibiotics","Routine bronchodilators for all","Immediate intubation"],
    correctAnswerIndex: 1,
    explanation: "Bronchiolitis management is mainly supportive: oxygen and hydration; ribavirin reserved for special cases.",
    topic: "Bronchiolitis",
    specialty: "Neonatology",
    difficulty: "EASY"
  },
  // 17
  {
    text: "A 70-year-old man with progressive tremor at rest, bradykinesia and rigidity. First-line management?",
    options: ["Levodopa/carbidopa","SSRI","Beta blockers","Benzodiazepines","Surgery first"],
    correctAnswerIndex: 0,
    explanation: "Levodopa/carbidopa remains the mainstay symptomatic therapy for Parkinson disease motor symptoms.",
    topic: "Parkinsonism",
    specialty: "Neurology",
    difficulty: "MEDIUM"
  },
  // 18
  {
    text: "A 22-year-old presents with palpitations and anxiety. ECG shows atrial fibrillation with rapid ventricular response. He is haemodynamically stable. Best immediate management?",
    options: ["Immediate synchronized cardioversion","Rate control with beta blocker or diltiazem","Urgent thrombolysis","Start high-dose steroids","Immediate pacemaker"],
    correctAnswerIndex: 1,
    explanation: "Stable AF with RVR is managed with rate control using beta-blocker or calcium-channel blocker; cardioversion reserved if unstable or required rhythm control.",
    topic: "Atrial Fibrillation",
    specialty: "Cardiology",
    difficulty: "MEDIUM"
  },
  // 19
  {
    text: "A 28-year-old man presents with severe testicular pain and absent cremasteric reflex. Most likely diagnosis?",
    options: ["Epididymo-orchitis","Testicular torsion","Inguinal hernia","Hydrocele","Varicocele"],
    correctAnswerIndex: 1,
    explanation: "Acute severe testicular pain with absent cremasteric reflex suggests testicular torsion — surgical emergency.",
    topic: "Acute Scrotum",
    specialty: "Urology",
    difficulty: "MEDIUM"
  },
  // 20
  {
    text: "An 8-year-old child with recurrent otitis media and speech delay. Best next step in management?",
    options: ["Start long-term antibiotics","Tonsillectomy","Hearing assessment and ENT review for grommet insertion","MRI head","No action — observe"],
    correctAnswerIndex: 2,
    explanation: "Recurrent otitis media with speech delay warrants hearing assessment and ENT evaluation for possible tympanostomy tubes.",
    topic: "Otitis Media",
    specialty: "ENT",
    difficulty: "MEDIUM"
  },
  // 21
  {
    text: "A 45-year-old with chronic diarrhoea and weight loss; stool ova and parasites negative; anti-tTG positive. Most likely diagnosis?",
    options: ["Crohn disease","Ulcerative colitis","Celiac disease","Irritable bowel syndrome","Lactose intolerance"],
    correctAnswerIndex: 2,
    explanation: "Positive anti-tTG antibodies strongly suggest celiac disease in the appropriate clinical context.",
    topic: "Malabsorption",
    specialty: "Gastroenterology",
    difficulty: "MEDIUM"
  },
  // 22
  {
    text: "A 55-year-old man presents with progressive jaundice and pruritus. Imaging shows a mass at the head of the pancreas. Best next diagnostic test?",
    options: ["ERCP with brushings","Endoscopic ultrasound with biopsy","Repeat ultrasound","MRI brain","Colonoscopy"],
    correctAnswerIndex: 1,
    explanation: "Endoscopic ultrasound with biopsy provides tissue diagnosis and staging for pancreatic head mass.",
    topic: "Pancreatic Mass",
    specialty: "Gastrointestinal Surgery",
    difficulty: "HARD"
  },
  // 23
  {
    text: "A 47-year-old woman with fatigue, pallor, low MCV and low ferritin. Most appropriate next step?",
    options: ["Start iron supplementation empirically","Check serum ferritin and transferrin saturation","Do bone marrow biopsy","Start folic acid","Refer to psychiatry"],
    correctAnswerIndex: 1,
    explanation: "Low ferritin confirms iron deficiency; ferritin and iron studies are needed to guide management and find cause.",
    topic: "Microcytic Anaemia",
    specialty: "Haematology",
    difficulty: "EASY"
  },
  // 24
  {
    text: "A 60-year-old with metastatic cancer develops SOB and tachycardia. CT pulmonary angiogram shows bilateral pulmonary emboli. Anticoagulation contraindicated due to intracranial hemorrhage last week. Best option?",
    options: ["IV heparin anyway","IV tPA thrombolysis","Inferior vena cava filter placement","No treatment","Start aspirin"],
    correctAnswerIndex: 2,
    explanation: "When anticoagulation is contraindicated in high-risk PE, IVC filter may be considered to prevent further emboli.",
    topic: "Pulmonary Embolism",
    specialty: "Vascular Surgery",
    difficulty: "HARD"
  },
  // 25
  {
    text: "A 29-year-old woman has BMI 34, irregular cycles and hirsutism. Serum testosterone mildly elevated; ultrasound shows polycystic ovaries. Best initial management for fertility?",
    options: ["Ovarian drilling","Letrozole (or clomiphene) ovulation induction","Metformin only","Immediate IVF","Hysterectomy"],
    correctAnswerIndex: 1,
    explanation: "Letrozole (or clomiphene) is first-line for ovulation induction in PCOS-related infertility.",
    topic: "PCOS and Infertility",
    specialty: "Gynaecology",
    difficulty: "MEDIUM"
  },
  // 26
  {
    text: "A patient with sepsis has MAP 55 mmHg despite fluids. Which vasopressor is first-line to restore perfusion?",
    options: ["Dopamine","Norepinephrine","Phenylephrine","Epinephrine","Vasopressin alone"],
    correctAnswerIndex: 1,
    explanation: "Norepinephrine is first-line vasopressor in septic shock to maintain MAP.",
    topic: "Septic Shock",
    specialty: "Critical Care",
    difficulty: "HARD"
  },
  // 27
  {
    text: "A 3-year-old is brought after ingestion of unknown number of paracetamol tablets four hours ago. Best immediate step?",
    options: ["Administer N-acetylcysteine immediately","Send serum paracetamol at 4 hours post-ingestion","Induce emesis","Discharge home","Give activated charcoal only if symptomatic"],
    correctAnswerIndex: 1,
    explanation: "Paracetamol level at 4 hours guides need for NAC using Rumack-Matthew nomogram; obtain serum level first.",
    topic: "Paracetamol Overdose",
    specialty: "Toxicology",
    difficulty: "MEDIUM"
  },
  // 28
  {
    text: "A 70-year-old has painful, swollen foot with hyperuricaemia, sudden onset nocturnal pain and swollen MTP joint. Best acute treatment?",
    options: ["Allopurinol","NSAIDs (e.g., ibuprofen) or colchicine","Long-term colchicine prophylaxis","Probenecid","Surgery"],
    correctAnswerIndex: 1,
    explanation: "Acute gout flare is treated with NSAIDs or colchicine; allopurinol is for long-term control, not acute therapy.",
    topic: "Gout",
    specialty: "Rheumatology",
    difficulty: "EASY"
  },
  // 29
  {
    text: "A 23-year-old with severe asthma on frequent oral steroids presents with muscle weakness and low serum potassium. Which drug likely caused hypokalemia?",
    options: ["High-dose inhaled steroid","Oral theophylline","Beta-2 agonist (salbutamol)","Montelukast","Omalizumab"],
    correctAnswerIndex: 2,
    explanation: "Beta-2 agonists shift potassium intracellularly causing hypokalemia and muscle weakness.",
    topic: "Drug Side Effects",
    specialty: "Respiratory Medicine",
    difficulty: "MEDIUM"
  },
  // 30
  {
    text: "A 56-year-old man complains of progressive dysphagia to solids only over months and weight loss. Most likely diagnosis?",
    options: ["Achalasia","Oesophageal carcinoma","Peptic stricture from reflux","Eosinophilic oesophagitis","Zenker diverticulum"],
    correctAnswerIndex: 1,
    explanation: "Progressive dysphagia to solids suggests mechanical obstruction like oesophageal carcinoma.",
    topic: "Dysphagia",
    specialty: "Gastrointestinal Surgery",
    difficulty: "MEDIUM"
  },
  // 31
  {
    text: "A 19-year-old has a seizure and is febrile with nuchal rigidity and petechial rash. Suspect meningococcal meningitis. Best immediate management?",
    options: ["Lumbar puncture before antibiotics","Start empirical IV antibiotics (ceftriaxone) immediately","Oral antibiotics at home","No treatment","CT scan only"],
    correctAnswerIndex: 1,
    explanation: "In suspected meningococcal meningitis, give immediate empirical IV antibiotics; LP can be done after stabilization.",
    topic: "Meningitis",
    specialty: "Infectious Diseases",
    difficulty: "HARD"
  },
  // 32
  {
    text: "A 40-year-old woman has chronic fatigue, pruritus and cholestatic LFTs with AMA positive. Most likely diagnosis?",
    options: ["Primary sclerosing cholangitis","Primary biliary cholangitis","Autoimmune hepatitis","Biliary atresia","Alcoholic liver disease"],
    correctAnswerIndex: 1,
    explanation: "Primary biliary cholangitis commonly presents in middle-aged women with AMA positivity and cholestatic LFTs.",
    topic: "Cholestatic Liver Disease",
    specialty: "Hepatology",
    difficulty: "MEDIUM"
  },
  // 33
  {
    text: "A 4-year-old with cough, inspiratory stridor, drooling and high fever — lateral neck x-ray shows thumbprint sign. Most likely diagnosis?",
    options: ["Croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bronchiolitis","Asthma exacerbation"],
    correctAnswerIndex: 1,
    explanation: "Thumbprint sign and drooling in a febrile child suggests epiglottitis — an airway emergency.",
    topic: "Pediatric Airway",
    specialty: "Paediatrics/ENT",
    difficulty: "HARD"
  },
  // 34
  {
    text: "A 52-year-old with progressive difficulty swallowing both solids and liquids simultaneously. Manometry shows aperistalsis and failed LES relaxation. Diagnosis?",
    options: ["Oesophageal cancer","Achalasia","Diffuse oesophageal spasm","Scleroderma","GERD"],
    correctAnswerIndex: 1,
    explanation: "Failure of LES relaxation with aperistalsis is classic for achalasia.",
    topic: "Esophageal Motility",
    specialty: "Gastroenterology",
    difficulty: "MEDIUM"
  },
  // 35
  {
    text: "A 30-year-old presents with new onset psychosis, auditory hallucinations and disorganized behaviour for 2 weeks. Best first-line medication class?",
    options: ["Typical antipsychotics only","Antipsychotics (risperidone/olanzapine)","SSRI antidepressants","Lithium monotherapy","Benzodiazepines alone"],
    correctAnswerIndex: 1,
    explanation: "Antipsychotics (atypical or typical) are first-line for acute psychosis; atypicals preferred for side-effect profile.",
    topic: "First Episode Psychosis",
    specialty: "Psychiatry",
    difficulty: "MEDIUM"
  },
  // 36
  {
    text: "A patient presents with weight loss, night sweats and lymphadenopathy. Lymph node biopsy shows Reed-Sternberg cells. Diagnosis?",
    options: ["Non-Hodgkin lymphoma","Hodgkin lymphoma","Leukaemia","Infectious mononucleosis","Sarcoidosis"],
    correctAnswerIndex: 1,
    explanation: "Reed-Sternberg cells are characteristic of Hodgkin lymphoma.",
    topic: "Lymphoma",
    specialty: "Oncology",
    difficulty: "MEDIUM"
  },
  // 37
  {
    text: "A 24-year-old presents with sudden-onset pleuritic chest pain after scuba diving. Suspect pulmonary barotrauma with pneumothorax. First step?",
    options: ["Hyperbaric oxygen immediately","High-flow oxygen and urgent chest x-ray","Immediate needle decompression in all cases","Administer aspirin","Start IV antibiotics"],
    correctAnswerIndex: 1,
    explanation: "High-flow oxygen and chest x-ray are initial steps; decompression if tension pneumothorax suspected.",
    topic: "Barotrauma",
    specialty: "Emergency Medicine",
    difficulty: "MEDIUM"
  },
  // 38
  {
    text: "A 60-year-old with chronic hepatitis B has a 2 cm hepatic lesion on surveillance ultrasound. Next best step?",
    options: ["Immediate biopsy","MRI liver with contrast","Start antiviral therapy only","PET scan","Observe for 2 years"],
    correctAnswerIndex: 1,
    explanation: "MRI with contrast is recommended for characterisation of hepatic lesions in chronic hepatitis B patients.",
    topic: "Hepatic Lesion",
    specialty: "Hepatology/Oncology",
    difficulty: "MEDIUM"
  },
  // 39
  {
    text: "A 35-year-old woman with rheumatoid arthritis on methotrexate complains of persistent cough and breathlessness. CXR shows interstitial changes. Most likely cause?",
    options: ["Methotrexate-induced pneumonitis","Rheumatoid lung disease","Pulmonary edema","Pulmonary embolism","Bacterial pneumonia"],
    correctAnswerIndex: 0,
    explanation: "Methotrexate can cause drug-induced pneumonitis; consider stopping drug and further evaluation.",
    topic: "Drug-induced Lung Disease",
    specialty: "Rheumatology/Respiratory",
    difficulty: "HARD"
  },
  // 40
  {
    text: "A 21-year-old female with sudden severe pelvic pain and amenorrhea presents hypotensive. Ultrasound shows adnexal mass and no intrauterine pregnancy. Diagnosis?",
    options: ["Ectopic pregnancy with rupture","Ovarian cyst","PID","Appendicitis","Urinary tract infection"],
    correctAnswerIndex: 0,
    explanation: "Hemodynamically unstable patient with adnexal mass and absent intrauterine pregnancy suggests ruptured ectopic pregnancy.",
    topic: "Ectopic Pregnancy",
    specialty: "Obstetrics/Gynaecology",
    difficulty: "HARD"
  },
  // 41
  {
    text: "A 65-year-old with progressive memory impairment, visuospatial deficits and fluctuating cognition with visual hallucinations. Most likely diagnosis?",
    options: ["Alzheimer disease","Vascular dementia","Lewy body dementia","Frontotemporal dementia","Normal ageing"],
    correctAnswerIndex: 2,
    explanation: "Fluctuating cognition and visual hallucinations are typical of Lewy body dementia.",
    topic: "Dementia",
    specialty: "Neurology/Psychiatry",
    difficulty: "HARD"
  },
  // 42
  {
    text: "A 55-year-old with known peptic ulcer disease presents with sudden severe abdominal pain and rigid abdomen. Next management?",
    options: ["Start PPI and discharge","Immediate upright chest x-ray and urgent surgery if pneumoperitoneum","Conservative management only","Colonoscopy","Start antibiotics orally"],
    correctAnswerIndex: 1,
    explanation: "Suspected perforated viscus requires upright chest x-ray for pneumoperitoneum and urgent surgical evaluation.",
    topic: "Perforated Peptic Ulcer",
    specialty: "General Surgery",
    difficulty: "HARD"
  },
  // 43
  {
    text: "A 45-year-old with chronic kidney disease stage 4 has hyperkalemia with ECG changes (peaked T waves). Best immediate treatment?",
    options: ["IV calcium gluconate, then insulin + glucose","Oral potassium binder only","Start loop diuretic only","Dialysis only","Give potassium chloride"],
    correctAnswerIndex: 0,
    explanation: "IV calcium stabilizes the myocardium, followed by insulin+glucose to shift K intracellularly.",
    topic: "Hyperkalemia",
    specialty: "Nephrology",
    difficulty: "HARD"
  },
  // 44
  {
    text: "A 58-year-old smoker with hematuria and a bladder mass on cystoscopy. Most likely etiology?",
    options: ["Schistosomiasis only","Transitional cell (urothelial) carcinoma","Prostate cancer","Renal cell carcinoma","Benign cyst"],
    correctAnswerIndex: 1,
    explanation: "Urothelial (transitional cell) carcinoma is the commonest bladder cancer associated with smoking.",
    topic: "Hematuria",
    specialty: "Urology",
    difficulty: "MEDIUM"
  },
  // 45
  {
    text: "A 19-year-old collegiate athlete collapses during exercise; ECG shows prolonged QT interval. Most likely risk?",
    options: ["Immediate syncope only","Risk of torsades de pointes and sudden cardiac death","No risk","Only hematuria","Stable angina"],
    correctAnswerIndex: 1,
    explanation: "Prolonged QT predisposes to torsades de pointes and ventricular arrhythmias causing sudden death.",
    topic: "Long QT",
    specialty: "Cardiology",
    difficulty: "HARD"
  },
  // 46
  {
    text: "A 40-year-old with refractory GERD despite PPI therapy. Endoscopy shows large sliding hiatus hernia. Recommended definitive surgical option?",
    options: ["Nissen fundoplication","Gastrectomy","Appendicectomy","Heller myotomy","Colectomy"],
    correctAnswerIndex: 0,
    explanation: "Nissen fundoplication is commonly used to treat reflux due to large hiatus hernia refractory to medical therapy.",
    topic: "Hiatus Hernia",
    specialty: "Gastrointestinal Surgery",
    difficulty: "MEDIUM"
  },
  // 47
  {
    text: "A 7-year-old child with fever, sore throat and a sandpaper rash. Rapid strep positive. Diagnosis?",
    options: ["Scarlet fever","Kawasaki disease","Measles","Rubella","Chickenpox"],
    correctAnswerIndex: 0,
    explanation: "Scarlet fever is caused by streptococcal infection with characteristic sandpaper rash.",
    topic: "Pediatric Infectious Disease",
    specialty: "Paediatrics",
    difficulty: "EASY"
  },
  // 48
  {
    text: "A patient has a suspected scaphoid fracture after a FOOSH; x-ray normal. Next step?",
    options: ["Discharge home","Immobilize in scaphoid thumb spica and repeat x-ray in 10–14 days","Immediate MRI only","Oral analgesics and observation","Apply sugar-tong splint only"],
    correctAnswerIndex: 1,
    explanation: "Suspected scaphoid fractures can be occult; immobilize and repeat imaging in 10–14 days or do MRI if available.",
    topic: "Wrist Injury",
    specialty: "Orthopaedics",
    difficulty: "MEDIUM"
  },
  // 49
  {
    text: "A 66-year-old with chronic cough, weight loss and a 50-pack-year history. CT shows a 3 cm spiculated lung nodule. Best next step?",
    options: ["Bronchoscopy with biopsy if central, or CT-guided biopsy","Immediate chemotherapy","Start antibiotics","No action","Supplemental oxygen only"],
    correctAnswerIndex: 0,
    explanation: "Spiculated pulmonary nodule in heavy smoker requires tissue diagnosis: bronchoscopy or CT-guided biopsy depending on location.",
    topic: "Lung Nodule",
    specialty: "Respiratory Medicine/Oncology",
    difficulty: "HARD"
  },
  // 50
  {
    text: "A 32-year-old woman presents with bilateral lower limb weakness, areflexia and recent diarrheal illness. Nerve conduction studies show demyelination. Likely diagnosis?",
    options: ["Myasthenia gravis","Guillain-Barré syndrome","Multiple sclerosis","Transverse myelitis","Periodic paralysis"],
    correctAnswerIndex: 1,
    explanation: "GBS is acute inflammatory demyelinating polyneuropathy often follows infection causing ascending weakness and areflexia.",
    topic: "Peripheral Neuropathy",
    specialty: "Neurology",
    difficulty: "MEDIUM"
  },
  // 51
  {
    text: "A 45-year-old with sudden severe unilateral scrotal pain and absent cremasteric reflex. Best immediate action?",
    options: ["Treat with antibiotics","Urgent surgical exploration for suspected torsion","Elective urology review next week","Order an MRI","Observe overnight"],
    correctAnswerIndex: 1,
    explanation: "Suspected testicular torsion requires urgent surgical exploration to salvage the testis.",
    topic: "Acute Scrotum",
    specialty: "Urology",
    difficulty: "HARD"
  },
  // 52
  {
    text: "A 60-year-old on long-term steroids presents with fever and a new sore throat; exam shows white pseudomembranes on oropharynx removable with scraping. Likely diagnosis?",
    options: ["Candida thrush","Herpes simplex","Diphtheria","Strep throat","Aphthous ulcers"],
    correctAnswerIndex: 0,
    explanation: "Immunosuppressed patients commonly get oral candidiasis presenting as white removable plaques.",
    topic: "Oral Thrush",
    specialty: "Infectious Diseases",
    difficulty: "EASY"
  },
  // 53
  {
    text: "A 72-year-old man complains of nocturnal diarrhea and weight loss. Colonoscopy finds a stricturing right colon lesion. Likely pathology?",
    options: ["Left-sided colorectal cancer","Right-sided colorectal cancer","Ulcerative colitis only","Diverticulosis","Ischemic colitis"],
    correctAnswerIndex: 1,
    explanation: "Right-sided colon cancers often present with weight loss and occult bleeding; strictures may occur.",
    topic: "Colorectal Cancer",
    specialty: "General Surgery/Oncology",
    difficulty: "MEDIUM"
  },
  // 54
  {
    text: "A 38-year-old presents with acute unilateral facial weakness involving forehead. Likely diagnosis?",
    options: ["Ischemic stroke in motor cortex","Bell's palsy (peripheral facial nerve palsy)","Myasthenia gravis","Meningitis","Temporal arteritis"],
    correctAnswerIndex: 1,
    explanation: "Peripheral facial nerve palsy (Bell's palsy) involves forehead and lower face; central lesions spare forehead.",
    topic: "Facial Palsy",
    specialty: "Neurology/ENT",
    difficulty: "EASY"
  },
  // 55
  {
    text: "A 50-year-old with type 2 diabetes has progressive proteinuria and declining eGFR. Best intervention to slow progression of diabetic nephropathy?",
    options: ["Start ACE inhibitor or ARB","Increase sugar intake","Stop all antihypertensives","Immediate dialysis","High-protein diet"],
    correctAnswerIndex: 0,
    explanation: "ACE inhibitors/ARBs reduce intraglomerular pressure and proteinuria, slowing diabetic nephropathy progression.",
    topic: "Diabetic Nephropathy",
    specialty: "Nephrology",
    difficulty: "MEDIUM"
  },
  // 56
  {
    text: "A 30-year-old IV drug user presents with fever and new murmur. Blood cultures positive for Staph aureus. Likely diagnosis?",
    options: ["Viral myocarditis","Infective endocarditis","Rheumatic fever","Pericarditis","Mitral valve prolapse"],
    correctAnswerIndex: 1,
    explanation: "IV drug use predisposes to infective endocarditis often due to Staphylococcus aureus.",
    topic: "Endocarditis",
    specialty: "Cardiology/Infectious Diseases",
    difficulty: "HARD"
  },
  // 57
  {
    text: "A 72-year-old woman with progressive exertional dizziness and syncope. Echo shows severe aortic stenosis. Best definitive treatment?",
    options: ["Medical therapy only","Balloon valvuloplasty indefinitely","Aortic valve replacement (surgical or TAVI)","Start nitrates","Pacemaker insertion only"],
    correctAnswerIndex: 2,
    explanation: "Severe symptomatic aortic stenosis requires aortic valve replacement (surgical or TAVI depending on risk).",
    topic: "Valvular Heart Disease",
    specialty: "Cardiology/Cardiothoracic Surgery",
    difficulty: "HARD"
  },
  // 58
  {
    text: "A 26-year-old woman has sudden-onset breathlessness and pleuritic chest pain post-cesarean delivery. O2 sat 88%. Best immediate action?",
    options: ["Give sublingual nitrates","Consider pulmonary embolism — urgent CTPA if stable or bedside echo if unstable and start anticoagulation","Start antibiotics","Give aspirin only","Do nothing"],
    correctAnswerIndex: 1,
    explanation: "Postpartum patients with acute dyspnea and hypoxia require urgent evaluation for pulmonary embolism and anticoagulation if confirmed and not contraindicated.",
    topic: "Pulmonary Embolism in Pregnancy",
    specialty: "Obstetrics/Emergency Medicine",
    difficulty: "HARD"
  },
  // 59
  {
    text: "A 42-year-old presents with new onset polyuria, polydipsia and random plasma glucose 16 mmol/L. Next step?",
    options: ["Start insulin only","Repeat fasting glucose and do HbA1c; start lifestyle advice and consider medication","Prescribe metformin without tests","Give IV fluids only","Refer to psychiatry"],
    correctAnswerIndex: 1,
    explanation: "Confirm diabetes with appropriate testing (fasting glucose/HbA1c) and begin lifestyle modification and pharmacotherapy as indicated.",
    topic: "Diabetes Diagnosis",
    specialty: "Endocrinology",
    difficulty: "EASY"
  },
  // 60
  {
    text: "A 68-year-old man with known prostate cancer has new bone pain and elevated ALP. Next best test?",
    options: ["Serum PSA only","Bone scan","MRI brain","CT abdomen only","Urine analysis"],
    correctAnswerIndex: 1,
    explanation: "Bone scan is sensitive for detecting skeletal metastases in prostate cancer presenting with bone pain and elevated ALP.",
    topic: "Prostate Cancer Metastasis",
    specialty: "Oncology/Urology",
    difficulty: "MEDIUM"
  },
  // 61
  {
    text: "An 8-year-old boy with fever for 5 days, conjunctival injection, mucosal changes, and swelling of hands/feet. Most likely diagnosis?",
    options: ["Scarlet fever","Kawasaki disease","Measles","Scarletina","Hand-foot-and-mouth disease"],
    correctAnswerIndex: 1,
    explanation: "Kawasaki disease presents with prolonged fever, mucocutaneous inflammation and extremity changes; treat with IVIG.",
    topic: "Kawasaki Disease",
    specialty: "Paediatrics",
    difficulty: "HARD"
  },
  // 62
  {
    text: "A 55-year-old with sudden painless loss of vision in one eye. Fundoscopy shows pale retina and no hemorrhages. Immediate management?",
    options: ["Start topical antibiotics","Refer to ophthalmology urgently for possible central retinal artery occlusion and consider ocular massage / thrombolysis","Give antivirals","Intravenous steroids","No action"],
    correctAnswerIndex: 1,
    explanation: "Central retinal artery occlusion is an emergency; urgent ophthalmology input is required.",
    topic: "Retinal Artery Occlusion",
    specialty: "Ophthalmology",
    difficulty: "HARD"
  },
  // 63
  {
    text: "A 27-year-old with suspected community-acquired pneumonia is allergic to penicillin with anaphylaxis history. Appropriate antibiotic?",
    options: ["Amoxicillin","Azithromycin or a macrolide","Ceftriaxone","Piperacillin-tazobactam","Doxycycline only"],
    correctAnswerIndex: 1,
    explanation: "Macrolides like azithromycin are appropriate alternatives in penicillin anaphylaxis for CAP coverage.",
    topic: "Antibiotic Choice",
    specialty: "Infectious Diseases",
    difficulty: "MEDIUM"
  },
  // 64
  {
    text: "A 44-year-old with chronic reflux develops dysphagia and weight loss. Endoscopy shows Barrett esophagus with dysplasia. Next step?",
    options: ["Continue PPIs only","Endoscopic mucosal resection or radiofrequency ablation","Immediate oesophagectomy for all cases","Lifestyle only","Start chemotherapy"],
    correctAnswerIndex: 1,
    explanation: "Endoscopic therapy (EMR/RFA) is recommended for Barrett esophagus with dysplasia to remove dysplastic epithelium.",
    topic: "Barrett's Oesophagus",
    specialty: "Gastrointestinal Surgery",
    difficulty: "HARD"
  },
  // 65
  {
    text: "A 70-year-old presents with resting tremor, rigidity and masked facies. Which neurotransmitter deficit is central to this disorder?",
    options: ["Serotonin","Dopamine","GABA","Acetylcholine","Norepinephrine"],
    correctAnswerIndex: 1,
    explanation: "Parkinson disease features are due to dopaminergic neuron loss in substantia nigra.",
    topic: "Parkinson Disease Pathophysiology",
    specialty: "Neurology",
    difficulty: "EASY"
  },
  // 66
  {
    text: "A 36-year-old pregnant woman at 28 weeks presents with painless vaginal bleeding. Fetal heart rate is normal. Most likely diagnosis?",
    options: ["Placental abruption","Placenta previa","Uterine rupture","Vasa previa","Cervical polyp"],
    correctAnswerIndex: 1,
    explanation: "Painless third-trimester bleeding with normal fetal heart suggests placenta previa until proven otherwise.",
    topic: "Antepartum Hemorrhage",
    specialty: "Obstetrics",
    difficulty: "MEDIUM"
  },
  // 67
  {
    text: "A 50-year-old has progressive muscle weakness that worsens with activity and improves with rest. Edrophonium test transiently improves strength. Diagnosis?",
    options: ["Lambert-Eaton syndrome","Myasthenia gravis","Motor neuron disease","Polymyositis","Guillain-Barré syndrome"],
    correctAnswerIndex: 1,
    explanation: "Myasthenia gravis shows fatigable weakness improving with edrophonium; autoimmune against ACh receptors.",
    topic: "Neuromuscular Junction",
    specialty: "Neurology",
    difficulty: "MEDIUM"
  },
  // 68
  {
    text: "A 65-year-old female smoker with hemoptysis and focal cavitating lesion on CXR. Next best step?",
    options: ["Sputum culture only","CT chest and refer for bronchoscopy with biopsy","Treat with oral antibiotics empirically","Start TB treatment immediately","Give inhaled bronchodilator"],
    correctAnswerIndex: 1,
    explanation: "Cavitating lung lesion with hemoptysis in smoker warrants CT and bronchoscopic evaluation to exclude malignancy or TB.",
    topic: "Hemoptysis",
    specialty: "Respiratory Medicine",
    difficulty: "HARD"
  },
  // 69
  {
    text: "A 45-year-old alcoholic has acute onset confusion, ophthalmoplegia and ataxia. Which deficiency likely?",
    options: ["Vitamin B12","Thiamine (B1)","Niacin (B3)","Vitamin C","Vitamin D"],
    correctAnswerIndex: 1,
    explanation: "Wernicke encephalopathy due to thiamine deficiency presents with ophthalmoplegia, ataxia and confusion.",
    topic: "Neurology/Toxicology",
    specialty: "Neurology/Internal Medicine",
    difficulty: "MEDIUM"
  },
  // 70
  {
    text: "A 30-year-old with peptic ulcer disease develops GI bleeding and hypotension. On endoscopy a bleeding ulcer is found and clips placed. Next step?",
    options: ["Start PPI infusion and observe","Immediately start broad-spectrum antibiotics","Stop all medications","Refer for colectomy","Discharge home"],
    correctAnswerIndex: 0,
    explanation: "After endoscopic hemostasis, PPI infusion reduces rebleeding; monitor and correct coagulopathy as needed.",
    topic: "Upper GI Bleed",
    specialty: "Gastroenterology",
    difficulty: "MEDIUM"
  },
  // 71
  {
    text: "A 19-year-old with primary amenorrhea, normal breast development but absent uterus on pelvic ultrasound. Karyotype 46,XX. Likely diagnosis?",
    options: ["Androgen insensitivity syndrome","Müllerian agenesis (Mayer-Rokitansky-Küster-Hauser)","Turner syndrome","Pregnancy","Prolactinoma"],
    correctAnswerIndex: 1,
    explanation: "Müllerian agenesis presents with normal secondary sexual characteristics but absent uterus and vaginal canal.",
    topic: "Primary Amenorrhea",
    specialty: "Gynaecology",
    difficulty: "HARD"
  },
  // 72
  {
    text: "A 56-year-old with metastatic breast cancer to bones is started on bisphosphonates. Major adverse effect to counsel about?",
    options: ["Osteonecrosis of the jaw","Renal stones","Hypercalcemia","Liver failure","Pulmonary fibrosis"],
    correctAnswerIndex: 0,
    explanation: "Bisphosphonates can rarely cause osteonecrosis of the jaw, especially after dental procedures.",
    topic: "Cancer Supportive Care",
    specialty: "Oncology",
    difficulty: "MEDIUM"
  },
  // 73
  {
    text: "A 32-year-old with acute psychosis is agitated and aggressive. Best immediate management in ED?",
    options: ["Physical restraint only","Calm verbal de-escalation and IM antipsychotic/benzodiazepine if necessary","Discharge","Start SSRI","Immediate ECT"],
    correctAnswerIndex: 1,
    explanation: "Safety, verbal de-escalation and pharmacological sedation (IM antipsychotic or benzodiazepine) as needed are appropriate immediate steps.",
    topic: "Acute Psychosis Management",
    specialty: "Psychiatry/Emergency Medicine",
    difficulty: "MEDIUM"
  },
  // 74
  {
    text: "A 29-year-old woman has sudden onset right lower quadrant pain, fever and leukocytosis. Pregnancy test negative. Best management?",
    options: ["MRI pelvis only","Immediate appendicectomy after clinical diagnosis or imaging confirmation","Start OCPs","Conservative therapy only","Refer to psychiatry"],
    correctAnswerIndex: 1,
    explanation: "Suspected acute appendicitis typically requires prompt surgical management after diagnosis.",
    topic: "Acute Abdomen",
    specialty: "General Surgery",
    difficulty: "MEDIUM"
  },
  // 75
  {
    text: "A 65-year-old with new-onset painless hematuria and smoking history. Next best investigation?",
    options: ["Urinary culture only","Urine cytology and cystoscopy","CT brain","Prostate ultrasound","Begin antibiotics"],
    correctAnswerIndex: 1,
    explanation: "Painless hematuria in smokers warrants urological evaluation including cystoscopy to exclude bladder cancer.",
    topic: "Hematuria Evaluation",
    specialty: "Urology",
    difficulty: "MEDIUM"
  },
  // 76
  {
    text: "A 50-year-old patient has generalized tonic-clonic seizures and MRI reveals a solitary enhancing brain lesion. Next best step?",
    options: ["Immediate excision if accessible and histology needed","Start aspirin","Observe only","Begin antidepressant therapy","Start insulin"],
    correctAnswerIndex: 0,
    explanation: "A solitary enhancing lesion with seizures often requires neurosurgical evaluation and possible resection for diagnosis and control.",
    topic: "Brain Lesion with Seizures",
    specialty: "Neurosurgery/Neurology",
    difficulty: "HARD"
  },
  // 77
  {
    text: "A 42-year-old with chronic liver disease is found to have oesophageal varices on endoscopy. Best prophylactic therapy to prevent bleed?",
    options: ["Nonselective beta-blockers (e.g., propranolol) or endoscopic variceal ligation","Immediate surgery","High-dose aspirin","Start ACE inhibitor","Begin chemotherapy"],
    correctAnswerIndex: 0,
    explanation: "Nonselective beta-blockers or endoscopic band ligation reduce risk of variceal bleeding in portal hypertension.",
    topic: "Variceal Bleeding Prophylaxis",
    specialty: "Hepatology",
    difficulty: "MEDIUM"
  },
  // 78
  {
    text: "A 5-year-old child with high fever for 3 days, conjunctivitis, oral mucosal changes and cervical lymphadenopathy. Concern for Kawasaki disease — immediate treatment?",
    options: ["Oral antibiotics only","IV immunoglobulin (IVIG) and aspirin","High-dose corticosteroids only","Start metronidazole","No treatment needed"],
    correctAnswerIndex: 1,
    explanation: "Kawasaki disease treated with IVIG and aspirin to reduce coronary artery complications.",
    topic: "Kawasaki Disease Management",
    specialty: "Paediatrics",
    difficulty: "HARD"
  },
  // 79
  {
    text: "A 28-year-old male with fever, myalgia, and rash after handling farm animals. Suspect leptospirosis. Best diagnostic test?",
    options: ["Blood culture only","Serology (MAT) and PCR for leptospira","Stool culture","Urine dipstick only","Skin biopsy"],
    correctAnswerIndex: 1,
    explanation: "Serology and PCR for leptospira are used to diagnose leptospirosis in the appropriate exposure history.",
    topic: "Zoonoses",
    specialty: "Infectious Diseases/Public Health",
    difficulty: "HARD"
  },
  // 80
  {
    text: "A 61-year-old with left-sided weakness and aphasia presents within 90 minutes of symptom onset. CT excludes hemorrhage. Most appropriate treatment?",
    options: ["Start antiplatelet only","IV thrombolysis (alteplase) if eligible","Start antibiotics","Perform lumbar puncture","Give aspirin and wait 24 hours"],
    correctAnswerIndex: 1,
    explanation: "Within the therapeutic window and after excluding hemorrhage, IV alteplase is indicated for ischemic stroke if no contraindications.",
    topic: "Acute Ischemic Stroke",
    specialty: "Neurology",
    difficulty: "HARD"
  },
  // 81
  {
    text: "A 34-year-old with HIV has CD4 150 and cough with fever. Sputum shows Pneumocystis jirovecii on staining. First-line treatment?",
    options: ["Trimethoprim-sulfamethoxazole (TMP-SMX)","Amoxicillin","Ciprofloxacin","Vancomycin","Isoniazid"],
    correctAnswerIndex: 0,
    explanation: "TMP-SMX is first-line therapy for Pneumocystis pneumonia; consider adjunctive steroids if hypoxic.",
    topic: "Opportunistic Infection",
    specialty: "Infectious Diseases",
    difficulty: "MEDIUM"
  },
  // 82
  {
    text: "A 48-year-old with sudden severe right upper quadrant pain radiating to the shoulder after fatty meal. Murphy's sign positive. Most likely diagnosis?",
    options: ["Acute appendicitis","Acute cholecystitis","Peptic ulcer disease","Hepatitis A","Pancreatitis"],
    correctAnswerIndex: 1,
    explanation: "RUQ pain after fatty meal with positive Murphy sign suggests acute cholecystitis.",
    topic: "Acute Cholecystitis",
    specialty: "General Surgery",
    difficulty: "MEDIUM"
  },
  // 83
  {
    text: "A 55-year-old with chronic cough and weight loss; sputum acid-fast bacilli positive. Best initial public health action?",
    options: ["Isolate patient and start anti-TB therapy per guidelines","No isolation needed","Prescribe oral antibiotics only","Advise rest only","Start antifungal therapy"],
    correctAnswerIndex: 0,
    explanation: "Pulmonary tuberculosis requires isolation and prompt anti-TB therapy and public health notification.",
    topic: "Tuberculosis Management",
    specialty: "Public Health/Infectious Diseases",
    difficulty: "MEDIUM"
  },
  // 84
  {
    text: "A 45-year-old woman with focal seizure and ring-enhancing lesion on brain MRI after travel to Africa. Consider differential?",
    options: ["Glioblastoma only","Neurocysticercosis or brain abscess or metastasis — consider serology and consult infectious diseases","Migraine","Parkinson disease","Stroke only"],
    correctAnswerIndex: 1,
    explanation: "In endemic areas, neurocysticercosis is a key cause of ring-enhancing lesions; consider abscess and metastasis too.",
    topic: "Brain Lesion Differential",
    specialty: "Neurology/Infectious Diseases",
    difficulty: "HARD"
  },
  // 85
  {
    text: "A 67-year-old with chronic leg swelling, varicose veins and sudden calf pain. Duplex ultrasound shows DVT. Best immediate treatment?",
    options: ["Start therapeutic anticoagulation","Compression only","Immediate thrombectomy for all","Bed rest indefinitely","Start antibiotics"],
    correctAnswerIndex: 0,
    explanation: "Therapeutic anticoagulation is first-line for DVT unless contraindicated.",
    topic: "Deep Vein Thrombosis",
    specialty: "Vascular Surgery/Internal Medicine",
    difficulty: "MEDIUM"
  },
  // 86
  {
    text: "A 40-year-old woman with new painful nodules on her breast and cyclical mastalgia. Mammography shows benign-appearing lesions. Best management?",
    options: ["Immediate mastectomy","Conservative management and observation with analgesia and follow-up imaging","Start chemotherapy","Urgent biopsy for all lesions","Immediate radiation"],
    correctAnswerIndex: 1,
    explanation: "Benign breast disease with cyclical mastalgia can often be managed conservatively with follow-up.",
    topic: "Benign Breast Disease",
    specialty: "Breast Surgery",
    difficulty: "EASY"
  },
  // 87
  {
    text: "A 60-year-old with severe osteoarthritis of knee and failed conservative therapy. Most appropriate definitive treatment?",
    options: ["Total knee arthroplasty","Arthroscopic washout only","Steroid injection forever","Physiotherapy only","Amputation"],
    correctAnswerIndex: 0,
    explanation: "Total knee arthroplasty is indicated for end-stage symptomatic osteoarthritis refractory to conservative care.",
    topic: "Knee Osteoarthritis",
    specialty: "Orthopaedics",
    difficulty: "MEDIUM"
  },
  // 88
  {
    text: "A 19-year-old presents with fever, neck stiffness and photophobia. Suspect meningitis. Which immediate pre-lumbar puncture step if CT unavailable?",
    options: ["Give empiric IV antibiotics after blood cultures","Wait for LP without antibiotics","Give oral antibiotics only","Start anti-tubercular therapy","No action"],
    correctAnswerIndex: 0,
    explanation: "If meningitis suspected, administer empirical IV antibiotics after blood cultures — do not delay treatment for LP if CT not available and patient is unstable.",
    topic: "Meningitis Management",
    specialty: "Infectious Diseases/Emergency Medicine",
    difficulty: "HARD"
  },
  // 89
  {
    text: "A 55-year-old with chronic low back pain has progressive neurological deficit and cauda equina signs. Most urgent management?",
    options: ["Urgent MRI and likely urgent surgical decompression","Conservative physiotherapy only","Start long-term opioids","Refer to rheumatology later","Observation"],
    correctAnswerIndex: 0,
    explanation: "Cauda equina syndrome requires urgent MRI and prompt surgical decompression to prevent permanent deficits.",
    topic: "Cauda Equina Syndrome",
    specialty: "Neurosurgery/Orthopaedics",
    difficulty: "HARD"
  },
  // 90
  {
    text: "A 25-year-old with sudden central chest pain and ST-elevation in II, III, aVF. He is 60 minutes from a PCI centre. Best reperfusion strategy?",
    options: ["Immediate thrombolysis if no contraindications (then transfer)","Wait for transfer without thrombolysis","Start antibiotics","Give oral aspirin only","Start IV steroids"],
    correctAnswerIndex: 0,
    explanation: "If primary PCI cannot be delivered within guideline timeframes, fibrinolysis followed by transfer (pharmaco-invasive) is recommended for STEMI.",
    topic: "Acute Myocardial Infarction",
    specialty: "Cardiology",
    difficulty: "HARD"
  },
  // 91
  {
    text: "A 60-year-old diabetic has frequent hypoglycemic episodes overnight. Which medication adjustment is most appropriate?",
    options: ["Increase insulin dose at night","Change long-acting insulin timing or dose and consider switching to agents with less nocturnal hypoglycemia","Start sulfonylurea at night","Stop all diabetes meds","Start high-dose beta-blocker"],
    correctAnswerIndex: 1,
    explanation: "Adjusting long-acting insulin dose/timing or using agents with lower hypoglycemia risk reduces nocturnal hypoglycemia.",
    topic: "Diabetes Management",
    specialty: "Endocrinology",
    difficulty: "MEDIUM"
  },
  // 92
  {
    text: "A 33-year-old pregnant woman at 37 weeks with breech presentation. Which is recommended management in a primigravida?",
    options: ["Attempt external cephalic version at 37 weeks first if no contraindications, otherwise plan cesarean section","Immediate induction of labour for vaginal breech","Forceps delivery","Home birth without monitoring","Start tocolytics"],
    correctAnswerIndex: 0,
    explanation: "External cephalic version may be attempted near term if no contraindications; many primigravidae with persistent breech are offered cesarean.",
    topic: "Breech Presentation",
    specialty: "Obstetrics",
    difficulty: "MEDIUM"
  },
  // 93
  {
    text: "A 56-year-old patient has chronic anemia with low reticulocyte count, high ferritin and low TIBC. Likely diagnosis?",
    options: ["Iron deficiency anemia","Anemia of chronic disease","Megaloblastic anemia","Hemolytic anemia","Aplastic anemia"],
    correctAnswerIndex: 1,
    explanation: "Anemia of chronic disease shows low reticulocyte count, normal/high ferritin and low TIBC.",
    topic: "Anemia",
    specialty: "Haematology",
    difficulty: "MEDIUM"
  },
  // 94
  {
    text: "A 40-year-old with sudden severe abdominal pain and rigid abdomen. FAST scan positive for free fluid and hypotension after trauma. Best immediate action?",
    options: ["Immediate laparotomy (damage control surgery)","CT abdomen only","Give oral analgesia","Observe in ward","Start physiotherapy"],
    correctAnswerIndex: 0,
    explanation: "Hemodynamically unstable trauma with positive FAST requires immediate operative intervention (laparotomy).",
    topic: "Trauma Abdomen",
    specialty: "Trauma Surgery",
    difficulty: "HARD"
  },
  // 95
  {
    text: "A 65-year-old male smoker with dysphagia, weight loss and hoarseness. Endoscopy reveals oesophageal ulcerated mass — biopsy shows squamous cell carcinoma. Best initial staging modality?",
    options: ["Chest CT and PET scan","Colonoscopy","Echocardiogram only","MRI brain only","Urine analysis"],
    correctAnswerIndex: 0,
    explanation: "CT chest and PET scan are useful for staging oesophageal cancer and detecting distant metastases.",
    topic: "Oesophageal Cancer Staging",
    specialty: "Oncology/Gastrointestinal Surgery",
    difficulty: "HARD"
  },
  // 96
  {
    text: "A 3-year-old with recurrent epistaxis and mucocutaneous telangiectasia. Family history positive. Most likely diagnosis?",
    options: ["Juvenile nasal polyps","Hereditary hemorrhagic telangiectasia (Osler-Weber-Rendu)","Nasal foreign body","Allergic rhinitis","Nasal carcinoma"],
    correctAnswerIndex: 1,
    explanation: "Hereditary hemorrhagic telangiectasia causes recurrent epistaxis and mucocutaneous telangiectasias with family history.",
    topic: "Epistaxis Etiology",
    specialty: "ENT",
    difficulty: "MEDIUM"
  },
  // 97
  {
    text: "A 72-year-old with progressive exertional dyspnea and bilateral interstitial fibrosis on HRCT. Which drug is indicated to slow disease progression in idiopathic pulmonary fibrosis?",
    options: ["Pirfenidone or nintedanib","High-dose steroids indefinitely","Long-term antibiotics","ACE inhibitor","Antifungal therapy"],
    correctAnswerIndex: 0,
    explanation: "Pirfenidone and nintedanib are antifibrotic agents that slow lung function decline in IPF.",
    topic: "Pulmonary Fibrosis",
    specialty: "Respiratory Medicine",
    difficulty: "HARD"
  },
  // 98
  {
    text: "A 28-year-old woman presents with severe unilateral flank pain and CT shows 8 mm proximal ureteric stone and hydronephrosis. Best management?",
    options: ["Medical expulsive therapy only","Ureteroscopy with stone extraction or stent placement","Observation only","Open surgery","Give antibiotics only"],
    correctAnswerIndex: 1,
    explanation: "Larger proximal ureteral stones with hydronephrosis often require ureteroscopy or lithotripsy rather than expectant management.",
    topic: "Urolithiasis Management",
    specialty: "Urology",
    difficulty: "MEDIUM"
  },
  // 99
  {
    text: "A 50-year-old with chronic hepatitis C cirrhosis is found to have platelet count 80 x10^9/L. Which screening is advised for hepatocellular carcinoma?",
    options: ["AFP and ultrasound liver every 6 months","CT brain every 6 months","Colonoscopy annually","Chest x-ray monthly","No surveillance needed"],
    correctAnswerIndex: 0,
    explanation: "AFP and liver ultrasound every 6 months is recommended surveillance for HCC in cirrhotic patients.",
    topic: "HCC Surveillance",
    specialty: "Hepatology/Oncology",
    difficulty: "MEDIUM"
  },
  // 100
  {
    text: "A 70-year-old with unstable angina refractory to medical therapy — what is the next best management?",
    options: ["Coronary angiography with revascularization (PCI or CABG) depending on anatomy","Conservative management only","Start antidepressants","Immediate thrombolysis","Referral to gastroenterology"],
    correctAnswerIndex: 0,
    explanation: "Refractory unstable angina warrants coronary angiography and revascularization based on coronary anatomy.",
    topic: "Acute Coronary Syndrome Management",
    specialty: "Cardiology",
    difficulty: "HARD"
  }
];

async function main() {
  console.log('Seeding', QUESTIONS.length, 'realistic questions into qbankId=', QBANK_ID);
  let created = 0;
  for (const q of QUESTIONS) {
    try {
      // Map to DB schema — options stored as JSON
      const createdQ = await prisma.question.create({
        data: {
          text: q.text,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation,
          topic: q.topic,
          specialty: q.specialty,
          difficulty: q.difficulty || 'MEDIUM',
          qbankId: QBANK_ID
        }
      });
      created++;
      if (created % 10 === 0) console.log('Created', created, 'questions...');
    } catch (err) {
      console.error('Failed to create question:', q.text.slice(0, 80), '... Error:', err);
    }
  }
  console.log('Done. Total created:', created);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Fatal error', e);
  prisma.$disconnect().finally(()=>process.exit(1));
});
