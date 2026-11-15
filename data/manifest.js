/* =====================================================================
   Wise Choice · UGC NET JRF Urdu — data/manifest.js
   Keep this file inside the data folder.

   TWO PAPERS
   • Paper I  — General Teaching & Research Aptitude (common paper, 10 units)
   • Paper II — Urdu (subject paper, 10 units)
   Each unit has `sub` = its sub-topics. In every question file:
       s = unit name (must match `n` below EXACTLY)
       c = sub-topic name (should match one of that unit's `sub` names)

   HOW TO ADD A PAPER
   1. Copy a file from data/ (e.g. data/2021-1.js), rename it, change the key at the top:
        Paper II key = 'year-shift'   → '2022-2'
        Paper I  key = 'P1-year-shift' → 'P1-2022-2'
   2. Add one line to PAPER_LIST below (paper:'I' or 'II').
   ===================================================================== */
window.RULES = {
  examName: 'UGC NET',
  shifts: { 1: 'Shift 1', 2: 'Shift 2' },
  papers: {
    II: {
      short: 'Paper II', tag: 'Urdu Literature', icon: '📜',
      count: 100, marks: 2, negative: 0, fullMinutes: 120,
      topics: [
        { n:'Origin & Growth of Urdu Language', ur:'اردو زبان کا آغاز و ارتقا', i:'🌱', k:'Language',
          sub:['Theories of Origin','Hindavi, Rekhta & Dakhni','Dialects & Khari Boli','Influence of Persian, Arabic & English','Script & Orthography'] },
        { n:'History of Urdu Literature', ur:'اردو ادب کی تاریخ', i:'🏛️', k:'History',
          sub:['Dakan Period','Delhi & Lucknow Schools','Fort William & Delhi College','1857 to Aligarh Movement','Progressive & Modern Eras','Tazkira & Literary Histories'] },
        { n:'Classical Poetry', ur:'کلاسیکی شاعری', i:'🪔', k:'Classical',
          sub:['Ghazal','Masnavi','Dakani Poets','Classical Masters (Mir, Sauda, Ghalib)','Rekhti & Other Forms'] },
        { n:'Marsiya, Qasida & Nazm', ur:'مرثیہ، قصیدہ اور نظم', i:'🕯️', k:'Marsiya',
          sub:['Marsiya','Qasida','Nazm & Early Nazm Writers','Rubai, Qita & Others'] },
        { n:'Modern Poetry & Movements', ur:'جدید شاعری اور تحریکیں', i:'🌙', k:'Modern',
          sub:['Iqbal','Progressive Poets','Modernism & Halqa-e-Arbab-e-Zauq','Contemporary Poetry','Poetic Collections'] },
        { n:'Fiction', ur:'فکشن: داستان، ناول، افسانہ', i:'📖', k:'Fiction',
          sub:['Dastan','Novel','Afsana (Short Story)','Fiction Movements & Critics'] },
        { n:'Drama & Prose', ur:'ڈراما اور نثر', i:'🎭', k:'Prose',
          sub:['Drama','Inshaiya, Khaka & Humour','Autobiography, Travelogue & Letters','Essay & Journalistic Prose'] },
        { n:'Criticism & Theory', ur:'تنقید اور نظریات', i:'🔎', k:'Criticism',
          sub:['Early Critics (Hali, Shibli)','Progressive & Modern Criticism','Western Theories','Eastern Poetics','Major Critics & Works'] },
        { n:'Research, Tadvin & Linguistics', ur:'تحقیق، تدوین اور لسانیات', i:'🧭', k:'Research',
          sub:['Research Methodology','Tadvin & Manuscripts','Tazkira Studies','Phonetics & Grammar','Lexicography'] },
        { n:'Prosody, Rhetoric & Journalism', ur:'عروض، بلاغت اور صحافت', i:'✒️', k:'Prosody',
          sub:['Arooz & Bahr','Qafia & Radif','Balaghat','Urdu Journalism','Translation & Others'] }
      ]
    },
    I: {
      short: 'Paper I', tag: 'Teaching & Research Aptitude', icon: '🧠',
      count: 50, marks: 2, negative: 0, fullMinutes: 60,
      topics: [
        { n:'Teaching Aptitude', ur:'تدریسی اہلیت', i:'🧑‍🏫', k:'Teaching',
          sub:['Nature, Objectives & Characteristics of Teaching','Learner Characteristics','Factors Affecting Teaching','Methods of Teaching','Teaching Aids','Evaluation Systems'] },
        { n:'Research Aptitude', ur:'تحقیقی اہلیت', i:'🔬', k:'Research',
          sub:['Meaning, Types & Characteristics of Research','Steps of Research','Methods of Research','Research Ethics','Paper, Seminar, Conference & Symposium','Thesis Writing'] },
        { n:'Comprehension', ur:'فہمِ عبارت', i:'📄', k:'Comprehension',
          sub:['Passage-based Questions'] },
        { n:'Communication', ur:'ابلاغ', i:'🗣️', k:'Communication',
          sub:['Nature & Types of Communication','Barriers to Communication','Classroom Communication','Mass Media & Society'] },
        { n:'Mathematical Reasoning & Aptitude', ur:'ریاضیاتی استدلال و اہلیت', i:'🔢', k:'Maths',
          sub:['Types of Reasoning','Number & Letter Series','Codes & Relationships','Mathematical Aptitude (Ratio, %, Profit & Loss, Time & Work)'] },
        { n:'Logical Reasoning', ur:'منطقی استدلال', i:'🧩', k:'Logic',
          sub:['Structure of Arguments','Deductive & Inductive Reasoning','Verbal Analogies & Classification','Venn Diagrams','Analytical Reasoning','Indian Logic (Pramana)'] },
        { n:'Data Interpretation', ur:'اعداد و شمار کی تعبیر', i:'📊', k:'Data',
          sub:['Sources & Classification of Data','Quantitative & Qualitative Data','Graphical Representation','Data Interpretation Sets','Data & Governance'] },
        { n:'Information & Communication Technology', ur:'معلوماتی و ابلاغی ٹیکنالوجی', i:'💻', k:'ICT',
          sub:['ICT: Terminology & Abbreviations','Internet, E-mail & Video Conferencing','Digital Initiatives in Higher Education','ICT & Governance'] },
        { n:'People, Development & Environment', ur:'انسان، ترقی اور ماحول', i:'🌍', k:'Environment',
          sub:['Development & Environment','Human–Environment Interaction','Environmental Issues & Pollutants','Natural & Energy Resources','Natural Hazards & Disasters','Environmental Laws & Agreements'] },
        { n:'Higher Education System', ur:'اعلیٰ تعلیمی نظام', i:'🏫', k:'Higher Ed',
          sub:['Higher Learning in Ancient India','Higher Education after Independence','Conventional & Non-conventional Learning','Professional, Technical & Skill Education','Value & Environmental Education','Policies, Governance & Administration'] }
      ]
    }
  }
};

window.PAPER_LIST = [
  { paper: 'II', year: 2021, shift: 1, file: 'data/2021-1.js' },
  { paper: 'II', year: 2021, shift: 2, file: 'data/2021-2.js' },
  { paper: 'I',  year: 2021, shift: 1, file: 'data/p1-2021-1.js' }
];

window.QUOTES = [
  'Consistency beats intensity — one solid hour every day wins the exam.',
  'Paper I is the shared ground: the aspirant who masters it gains marks everyone else loses.',
  'Every wrong answer you review today is a mark you keep tomorrow.',
  'Mock tests are rehearsals. Make your mistakes here, not in the exam hall.',
  'Revision is where marks are made.',
  'Slow progress is still progress.',
  'Today\'s effort is tomorrow\'s confidence.',
  'ہر دن تھوڑا سا پڑھنا، بڑی کامیابی کی بنیاد ہے۔'
];
