/* =====================================================================
   Wise Choice · UGC NET Urdu — data/manifest.js  (keep this file inside the data folder)
   Exam rules, the 10 syllabus units ("topics"), quotes and paper list.

   HOW TO ADD A NEW PAPER
   1. Copy data/2021-1.js to data/2022-2.js, change the key at the top to
      '2022-2' (year-shift) and replace the questions.
   2. Add one line to PAPER_LIST:  {year:2022, shift:2, file:'data/2022-2.js'}
   ===================================================================== */
window.RULES = {
  examName: 'UGC NET Urdu',
  fullMinutes: 120,   // time for a full-paper test
  marks: 2,           // marks per correct answer (use 1 if you want a 100-mark paper)
  negative: 0,        // marks cut per wrong answer (0 = no negative marking, as in the real exam)
  shifts: { 1: 'Shift 1', 2: 'Shift 2' },

  /* `n` must match the "s" field of every question EXACTLY. ur = Urdu title, i = icon, k = short code (radar chart).
     Edit names to match the latest NTA syllabus. */
  topics: [
    { n: 'Origin & Growth of Urdu Language',    ur: 'اردو زبان کا آغاز و ارتقا',     i: '🌱', k: 'Language'  },
    { n: 'History of Urdu Literature',          ur: 'اردو ادب کی تاریخ',            i: '🏛️', k: 'History'   },
    { n: 'Classical Poetry',                    ur: 'کلاسیکی شاعری',                 i: '🪔', k: 'Classical' },
    { n: 'Marsiya, Qasida & Nazm',              ur: 'مرثیہ، قصیدہ اور نظم',          i: '🕯️', k: 'Marsiya'   },
    { n: 'Modern Poetry & Movements',           ur: 'جدید شاعری اور تحریکیں',        i: '🌙', k: 'Modern'    },
    { n: 'Fiction',                             ur: 'فکشن: داستان، ناول، افسانہ',    i: '📖', k: 'Fiction'   },
    { n: 'Drama & Prose',                       ur: 'ڈراما اور نثر',                 i: '🎭', k: 'Prose'     },
    { n: 'Criticism & Theory',                  ur: 'تنقید اور نظریات',              i: '🔎', k: 'Criticism' },
    { n: 'Research, Tadvin & Linguistics',      ur: 'تحقیق، تدوین اور لسانیات',      i: '🧭', k: 'Research'  },
    { n: 'Prosody, Rhetoric & Journalism',      ur: 'عروض، بلاغت اور صحافت',         i: '✒️', k: 'Prosody'   }
  ]
};

window.PAPER_LIST = [
  { year: 2021, shift: 1, file: 'data/2021-1.js' },
  { year: 2021, shift: 2, file: 'data/2021-2.js' }
];

window.QUOTES = [
  'Consistency beats intensity — one solid hour every day wins the exam.',
  'Every wrong answer you review today is a mark you keep tomorrow.',
  'You don\'t need to be perfect. You need to be better than yesterday.',
  'Mock tests are rehearsals. Make your mistakes here, not in the exam hall.',
  'Revision is where marks are made.',
  'Slow progress is still progress.',
  'Today\'s effort is tomorrow\'s confidence.',
  'ہر دن تھوڑا سا پڑھنا، بڑی کامیابی کی بنیاد ہے۔'
];
