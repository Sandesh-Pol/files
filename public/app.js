// app.js — AnimaType Multi-Step Form & Groq API

// =============================================
// CHARACTER DATABASE (AI-analyzed image gender mapping)
// =============================================
// Each entry: { file: 'images/filename.jpg', gender: 'Male'|'Female', series: '...' }
const CHARACTER_DB = {
  // INTJ
  'Sasuke Uchiha': { file: 'images/sasuke_uchiha.jpg', gender: 'Male', series: 'Naruto', mbti: 'INTJ' },
  'Mei Mei': { file: 'images/mei_mei.jpg', gender: 'Female', series: 'Jujutsu Kaisen', mbti: 'INTJ' },
  // ENTJ
  'Erwin Smith': { file: 'images/erwin_smith.jpg', gender: 'Male', series: 'Attack on Titan', mbti: 'ENTJ' },
  'Sylvia Sherwood': { file: 'images/sylvia_sherwood.jpg', gender: 'Female', series: 'Spy x Family', mbti: 'ENTJ' },
  // INTP
  'Kakashi Hatake': { file: 'images/kakashi_hatake.jpg', gender: 'Male', series: 'Naruto', mbti: 'INTP' },
  'Frieren': { file: 'images/frieren.jpg', gender: 'Female', series: 'Frieren: Beyond Journey\'s End', mbti: 'INTP' },
  // ENTP
  'Satoru Gojo': { file: 'images/satoru_gojo.jpg', gender: 'Male', series: 'Jujutsu Kaisen', mbti: 'ENTP' },
  'Nico Robin': { file: 'images/niko_robin.jpg', gender: 'Female', series: 'One Piece', mbti: 'ENTP' },
  // INFJ
  'Itachi Uchiha': { file: 'images/itachi_uchiha.jpg', gender: 'Male', series: 'Naruto', mbti: 'INFJ' },
  'Tamayo': { file: 'images/tamayo.jpg', gender: 'Female', series: 'Demon Slayer', mbti: 'INFJ' },
  // INFP
  'Gaara': { file: 'images/gara.jpg', gender: 'Male', series: 'Naruto', mbti: 'INFP' },
  'Hinata Hyuga': { file: 'images/hinata_hyuga.jpg', gender: 'Female', series: 'Naruto', mbti: 'INFP' },
  // ENFJ
  'Tanjiro Kamado': { file: 'images/tanjiro_kamado.jpg', gender: 'Male', series: 'Demon Slayer', mbti: 'ENFJ' },
  'Tsunade': { file: 'images/tsunade.jpg', gender: 'Female', series: 'Naruto', mbti: 'ENFJ' },
  // ENFP
  'Naruto Uzumaki': { file: 'images/naruto_uzumaki.jpg', gender: 'Male', series: 'Naruto', mbti: 'ENFP' },
  'Kyoko Hori': { file: 'images/kyoko_hori.jpg', gender: 'Female', series: 'Horimiya', mbti: 'ENFP' },
  // ISTJ
  'Levi Ackerman': { file: 'images/levi_ackerman.jpg', gender: 'Male', series: 'Attack on Titan', mbti: 'ISTJ' },
  'Mikasa Ackerman': { file: 'images/mikasa_ackerman.jpg', gender: 'Female', series: 'Attack on Titan', mbti: 'ISTJ' },
  // ISFJ
  'Isagi Yoichi': { file: 'images/isagi_yoichi.jpg', gender: 'Male', series: 'Blue Lock', mbti: 'ISFJ' },
  'Noelle Silva': { file: 'images/noelle_silva.jpg', gender: 'Female', series: 'Black Clover', mbti: 'ISFJ' },
  // ESTJ
  'Kunigami Rensuke': { file: 'images/kunigami_rensuke.jpg', gender: 'Male', series: 'Blue Lock', mbti: 'ESTJ' },
  'Maki Zenin': { file: 'images/maki_zenin.jpg', gender: 'Female', series: 'Jujutsu Kaisen', mbti: 'ESTJ' },
  // ESFJ
  'Rock Lee': { file: 'images/rock_lee.jpg', gender: 'Male', series: 'Naruto', mbti: 'ESFJ' },
  'Sakura Haruno': { file: 'images/sakura_haruno.jpg', gender: 'Female', series: 'Naruto', mbti: 'ESFJ' },
  // ISTP
  'Roronoa Zoro': { file: 'images/roronoa_zoro.jpg', gender: 'Male', series: 'One Piece', mbti: 'ISTP' },
  'Mereoleona Vermillion': { file: 'images/mereoleona_vermillion.jpg', gender: 'Female', series: 'Black Clover', mbti: 'ISTP' },
  // ISFP
  'Eren Yeager': { file: 'images/eren_yeager.jpg', gender: 'Male', series: 'Attack on Titan', mbti: 'ISFP' },
  'Nezuko Kamado': { file: 'images/nezuko_kamado.jpg', gender: 'Female', series: 'Demon Slayer', mbti: 'ISFP' },
  // ESTP
  'Inosuke Hashibira': { file: 'images/inosuke_hashibira.jpg', gender: 'Male', series: 'Demon Slayer', mbti: 'ESTP' },
  'Temari': { file: 'images/temari.jpg', gender: 'Female', series: 'Naruto', mbti: 'ESTP' },
  // ESFP
  'Asta': { file: 'images/asta.jpg', gender: 'Male', series: 'Black Clover', mbti: 'ESFP' },
  'Kushina Uzumaki': { file: 'images/kushina_uzumaki.jpg', gender: 'Female', series: 'Naruto', mbti: 'ESFP' },
};

// Helper: get characters filtered by gender preference
function getFilteredCharacters(preferredGender) {
  return Object.entries(CHARACTER_DB)
    .filter(([, info]) => {
      if (!preferredGender || preferredGender === 'Other') return true;
      return info.gender === preferredGender;
    })
    .map(([name, info]) => `${name} (${info.series}, ${info.gender}, MBTI: ${info.mbti})`);
}

// Helper: look up a character by exact name or fuzzy match
function lookupCharacter(characterName) {
  if (!characterName) return null;
  // Exact match
  if (CHARACTER_DB[characterName]) return CHARACTER_DB[characterName];
  // Case-insensitive match
  const lower = characterName.toLowerCase();
  for (const [key, val] of Object.entries(CHARACTER_DB)) {
    if (key.toLowerCase() === lower) return val;
  }
  // Partial match (e.g. 'Ace' matches 'Portgas D. Ace')
  for (const [key, val] of Object.entries(CHARACTER_DB)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) return val;
  }
  return null;
}

// =============================================
// ENVIRONMENT CONFIG
// =============================================
// API key is now securely stored in environment variables (.env)
// The frontend calls /api/match which handles the Groq API request server-side
function getApiUrl() {
  const configuredBase = window.ANIMATYPE_API_BASE_URL || localStorage.getItem('animatype_api_base_url');
  if (configuredBase) {
    return `${configuredBase.replace(/\/$/, '')}/api/match`;
  }

  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (!isLocalHost || window.location.port === '3000') {
    return '/api/match';
  }

  return 'http://localhost:3000/api/match';
}

const API_MATCH_URL = getApiUrl();

// =============================================
// THEME MANAGEMENT
// =============================================
function initTheme() {
  const savedTheme = localStorage.getItem('animatype_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('animatype_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// =============================================
// DATA
// =============================================

// const MBTI_QUESTIONS = [
//   {
//     id: 1, text: "After a long, tiring day, what helps you recharge the most?",
//     dimension: "EI",
//     lowLabel: "Alone time / recharge solo",
//     highLabel: "Social / hang out with others",
//     lowCode: "I", highCode: "E"
//   },
//   {
//     id: 2, text: "When you're in a new group of people, you usually start conversations and try to include everyone.",
//     dimension: "EI",
//     lowLabel: "Stay quiet, open up slowly",
//     highLabel: "Jump in, make connections",
//     lowCode: "I", highCode: "E"
//   },
//   {
//     id: 3, text: "When making an important decision, I rely on objective logic and facts rather than emotions.",
//     dimension: "TF",
//     lowLabel: "Heart & emotions guide me",
//     highLabel: "Logic & analysis guide me",
//     lowCode: "F", highCode: "T"
//   },
//   {
//     id: 4, text: "My ideal weekend involves going out, socializing, and having fun rather than staying home.",
//     dimension: "EI",
//     lowLabel: "Home, peace & quiet",
//     highLabel: "Out, active & social",
//     lowCode: "I", highCode: "E"
//   },
//   {
//     id: 5, text: "When working on a project, I prefer a clear plan and deadlines over working freely at my own pace.",
//     dimension: "JP",
//     lowLabel: "Freedom & flexibility",
//     highLabel: "Structure & clear plans",
//     lowCode: "P", highCode: "J"
//   },
//   {
//     id: 6, text: "When someone shares a problem with me, I instinctively comfort them emotionally rather than giving solutions.",
//     dimension: "TF",
//     lowLabel: "Give practical solutions",
//     highLabel: "Offer emotional comfort",
//     lowCode: "T", highCode: "F"
//   },
//   {
//     id: 7, text: "When plans suddenly change, I adapt quickly and even enjoy the surprise.",
//     dimension: "JP",
//     lowLabel: "Prefer sticking to original plan",
//     highLabel: "Enjoy adapting creatively",
//     lowCode: "J", highCode: "P"
//   },
//   {
//     id: 8, text: "In conversations, I enjoy talking about abstract ideas, dreams, and theories more than real-life topics.",
//     dimension: "SN",
//     lowLabel: "Real-life & concrete topics",
//     highLabel: "Ideas, dreams & theories",
//     lowCode: "S", highCode: "N"
//   },
//   {
//     id: 9, text: "My room or workspace is usually organized, neat, and structured.",
//     dimension: "JP",
//     lowLabel: "Creative chaos is fine",
//     highLabel: "Very organized & structured",
//     lowCode: "P", highCode: "J"
//   },
//   {
//     id: 10, text: "When learning something new, I prefer exploring concepts and possibilities rather than step-by-step instructions.",
//     dimension: "SN",
//     lowLabel: "Step-by-step, hands-on",
//     highLabel: "Explore concepts & possibilities",
//     lowCode: "S", highCode: "N"
//   },
//   {
//     id: 11, text: "When facing a challenge, I try new and different approaches rather than relying on past experience.",
//     dimension: "SN",
//     lowLabel: "Use proven past experience",
//     highLabel: "Try new different approaches",
//     lowCode: "S", highCode: "N"
//   },
//   {
//     id: 12, text: "My friends would describe me as energetic and outgoing rather than calm and thoughtful.",
//     dimension: "EI",
//     lowLabel: "Calm & thoughtful",
//     highLabel: "Energetic & outgoing",
//     lowCode: "I", highCode: "E"
//   },
//   {
//     id: 13, text: "When I think about my future, I make clear plans and goals rather than keeping things open and flexible.",
//     dimension: "JP",
//     lowLabel: "Open, flexible & spontaneous",
//     highLabel: "Clear plans & structured goals",
//     lowCode: "P", highCode: "J"
//   },
//   {
//     id: 14, text: "In a team, I usually take on the role of leader, motivator, or idea generator.",
//     dimension: "EI",
//     lowLabel: "Supportive & behind-the-scenes",
//     highLabel: "Leader, motivator, or ideator",
//     lowCode: "I", highCode: "E"
//   },
//   {
//     id: 15, text: "When stressed, I prefer to talk it out with someone rather than staying alone and processing internally.",
//     dimension: "EI",
//     lowLabel: "Alone, process internally",
//     highLabel: "Talk it out with others",
//     lowCode: "I", highCode: "E"
//   }
// ];

const MBTI_QUESTIONS = [
  // E vs I
  {
    id: 1,
    text: "It’s Friday night and you’re free. What do you actually end up doing most often?",
    dimension: "EI",
    lowLabel: "Stay in — chill, scroll, watch, or do your thing",
    highLabel: "Reach out — meet, call, or go out with people",
    lowCode: "I",
    highCode: "E"
  },
  {
    id: 2,
    text: "At a gathering where you don’t know many people:",
    dimension: "EI",
    lowLabel: "Stick with 1–2 people or observe first",
    highLabel: "Move around and talk to multiple people",
    lowCode: "I",
    highCode: "E"
  },
  {
    id: 3,
    text: "When something is bothering you, what happens first?",
    dimension: "EI",
    lowLabel: "You process it internally before sharing",
    highLabel: "You feel the urge to talk it out quickly",
    lowCode: "I",
    highCode: "E"
  },
  {
    id: 4,
    text: "After a long day full of interaction, you usually feel:",
    dimension: "EI",
    lowLabel: "Drained — need time alone to reset",
    highLabel: "Fine or energized — ready for more",
    lowCode: "I",
    highCode: "E"
  },

  // S vs N
  {
    id: 5,
    text: "When choosing something to watch or read, you lean toward:",
    dimension: "SN",
    lowLabel: "Realistic, practical, or relatable content",
    highLabel: "Conceptual, imaginative, or idea-driven content",
    lowCode: "S",
    highCode: "N"
  },
  {
    id: 6,
    text: "When learning something new:",
    dimension: "SN",
    lowLabel: "You prefer clear steps and examples",
    highLabel: "You explore patterns and figure it out yourself",
    lowCode: "S",
    highCode: "N"
  },
  {
    id: 7,
    text: "In conversations, you naturally focus more on:",
    dimension: "SN",
    lowLabel: "What’s happening now or has happened",
    highLabel: "What could happen or what it means",
    lowCode: "S",
    highCode: "N"
  },
  {
    id: 8,
    text: "When thinking about the future, you mostly:",
    dimension: "SN",
    lowLabel: "Focus on clear, realistic next steps",
    highLabel: "Imagine different possibilities and directions",
    lowCode: "S",
    highCode: "N"
  },

  // T vs F
  {
    id: 9,
    text: "A friend asks your opinion on something they’re excited about, but you think it won’t work:",
    dimension: "TF",
    lowLabel: "Soften your response to avoid hurting them",
    highLabel: "Be honest, even if it’s blunt",
    lowCode: "F",
    highCode: "T"
  },
  {
    id: 10,
    text: "Someone in your team is underperforming:",
    dimension: "TF",
    lowLabel: "First check what’s going on with them personally",
    highLabel: "Address the issue and its impact directly",
    lowCode: "F",
    highCode: "T"
  },
  {
    id: 11,
    text: "You strongly disagree in a group discussion:",
    dimension: "TF",
    lowLabel: "Hold back to keep things smooth",
    highLabel: "Speak up to express your view",
    lowCode: "F",
    highCode: "T"
  },
  {
    id: 12,
    text: "People usually describe your feedback style as:",
    dimension: "TF",
    lowLabel: "Supportive and considerate",
    highLabel: "Straightforward and objective",
    lowCode: "F",
    highCode: "T"
  },

  // J vs P
  {
    id: 13,
    text: "Before a trip or event, you usually:",
    dimension: "JP",
    lowLabel: "Keep it loose and decide on the go",
    highLabel: "Plan things in advance",
    lowCode: "P",
    highCode: "J"
  },
  {
    id: 14,
    text: "Your personal space most of the time:",
    dimension: "JP",
    lowLabel: "A bit messy but manageable",
    highLabel: "Organized and in order",
    lowCode: "P",
    highCode: "J"
  },
  {
    id: 15,
    text: "When you have a deadline:",
    dimension: "JP",
    lowLabel: "Work in bursts, often close to the deadline",
    highLabel: "Start early and space it out",
    lowCode: "P",
    highCode: "J"
  },
  {
    id: 16,
    text: "When plans suddenly change:",
    dimension: "JP",
    lowLabel: "You adjust without much trouble",
    highLabel: "It feels frustrating or disruptive",
    lowCode: "P",
    highCode: "J"
  }
];

// =============================================
// STATE
// =============================================

let state = {
  currentStep: 1,
  userName: '',
  userAge: '',
  userGender: '',
  mbtiAnswers: {}, // questionId -> 1-10
  favColor: '#8b5cf6',
  hobbies: [],
  animeGenre: '',
  openQ1: '',
  openQ2: '',
  openQ3: ''
};

function saveState() {
  localStorage.setItem('animatype_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('animatype_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    } catch (e) { }
  }
}

// =============================================
// INIT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadState();
  renderQuestions();
  restoreFormValues();
  goToStep(state.currentStep);
  setupListeners();
});

function restoreFormValues() {
  setVal('userName', state.userName);
  setVal('userAge', state.userAge);
  setVal('favColor', state.favColor);
  document.getElementById('colorLabel').textContent = state.favColor;
  setVal('animeGenre', state.animeGenre);
  setVal('openQ1', state.openQ1);
  setVal('openQ2', state.openQ2);
  setVal('openQ3', state.openQ3);

  if (state.userGender) {
    document.querySelectorAll('.gender-btn').forEach(b => {
      b.classList.toggle('selected', b.dataset.gender === state.userGender);
    });
  }

  // Hobbies
  document.querySelectorAll('.hobby-tag').forEach(t => {
    t.classList.toggle('selected', state.hobbies.includes(t.dataset.hobby));
  });

  // Counters
  updateCounter('openQ1', 'q1Count');
  updateCounter('openQ2', 'q2Count');
  updateCounter('openQ3', 'q3Count');
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function setupListeners() {
  // Name
  document.getElementById('userName')?.addEventListener('input', e => {
    state.userName = e.target.value;
    saveState();
  });
  // Age
  document.getElementById('userAge')?.addEventListener('input', e => {
    state.userAge = e.target.value;
    saveState();
  });
  // Gender
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.userGender = btn.dataset.gender;
      document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      saveState();
    });
  });
  // Color
  document.getElementById('favColor')?.addEventListener('input', e => {
    state.favColor = e.target.value;
    document.getElementById('colorLabel').textContent = e.target.value;
    saveState();
  });
  // Hobbies
  document.querySelectorAll('.hobby-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const h = tag.dataset.hobby;
      if (state.hobbies.includes(h)) {
        state.hobbies = state.hobbies.filter(x => x !== h);
        tag.classList.remove('selected');
      } else if (state.hobbies.length < 3) {
        state.hobbies.push(h);
        tag.classList.add('selected');
      }
      saveState();
    });
  });
  // Genre
  document.getElementById('animeGenre')?.addEventListener('change', e => {
    state.animeGenre = e.target.value;
    saveState();
  });
  // Open Qs
  document.getElementById('openQ1')?.addEventListener('input', e => {
    state.openQ1 = e.target.value;
    updateCounter('openQ1', 'q1Count');
    saveState();
  });
  document.getElementById('openQ2')?.addEventListener('input', e => {
    state.openQ2 = e.target.value;
    updateCounter('openQ2', 'q2Count');
    saveState();
  });
  document.getElementById('openQ3')?.addEventListener('input', e => {
    state.openQ3 = e.target.value;
    updateCounter('openQ3', 'q3Count');
    saveState();
  });
}

function updateCounter(fieldId, countId) {
  const el = document.getElementById(fieldId);
  const countEl = document.getElementById(countId);
  if (el && countEl) countEl.textContent = (el.value || '').length;
}

// =============================================
// QUESTIONS
// =============================================

function renderQuestions() {
  const container = document.getElementById('questionsContainer');
  if (!container) return;
  container.innerHTML = '';

  MBTI_QUESTIONS.forEach((q, i) => {
    const savedVal = state.mbtiAnswers[q.id] ?? 5;
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-num">Q${String(i + 1).padStart(2, '0')} · ${q.dimension}</div>
      <div class="question-text">${q.text}</div>
      <div class="slider-wrap">
        <div class="slider-labels">
          <span>${q.lowLabel}</span>
          <span>${q.highLabel}</span>
        </div>
        <input type="range" class="q-slider" min="1" max="10" value="${savedVal}"
          data-qid="${q.id}" id="slider_${q.id}"/>
        <div class="slider-value" id="val_${q.id}">${savedVal}</div>
      </div>
    `;
    container.appendChild(card);
    updateSliderTrack(document.getElementById(`slider_${q.id}`), savedVal);
  });

  container.querySelectorAll('.q-slider').forEach(slider => {
    slider.addEventListener('input', e => {
      const qid = parseInt(e.target.dataset.qid);
      const val = parseInt(e.target.value);
      state.mbtiAnswers[qid] = val;
      document.getElementById(`val_${qid}`).textContent = val;
      updateSliderTrack(e.target, val);
      updateMbtiProgress();
      saveState();
    });
  });

  updateMbtiProgress();
}

function updateSliderTrack(slider, val) {
  const pct = ((val - 1) / 9) * 100;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const trackBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
  slider.style.background = `linear-gradient(to right, var(--violet) 0%, var(--magenta) ${pct}%, ${trackBg} ${pct}%)`;
}

function updateMbtiProgress() {
  const answered = Object.keys(state.mbtiAnswers).length;
  const total = MBTI_QUESTIONS.length;
  const pct = (answered / total) * 100;
  const fill = document.getElementById('mbtiFill');
  if (fill) fill.style.width = pct + '%';
  const numEl = document.getElementById('mbtiQNum');
  if (numEl) numEl.textContent = `Question ${Math.min(answered + 1, total)} of ${total}`;
}

// =============================================
// MBTI SCORING
// =============================================

function computeMBTI() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  MBTI_QUESTIONS.forEach(q => {
    const val = state.mbtiAnswers[q.id] ?? 5;
    const pct = (val - 1) / 9; // 0 to 1
    if (q.dimension === 'EI') {
      scores[q.highCode === 'E' ? 'E' : 'I'] += pct;
      scores[q.highCode === 'E' ? 'I' : 'E'] += (1 - pct);
    } else if (q.dimension === 'SN') {
      scores[q.highCode === 'N' ? 'N' : 'S'] += pct;
      scores[q.highCode === 'N' ? 'S' : 'N'] += (1 - pct);
    } else if (q.dimension === 'TF') {
      scores[q.highCode === 'T' ? 'T' : 'F'] += pct;
      scores[q.highCode === 'T' ? 'F' : 'T'] += (1 - pct);
    } else if (q.dimension === 'JP') {
      scores[q.highCode === 'J' ? 'J' : 'P'] += pct;
      scores[q.highCode === 'J' ? 'P' : 'J'] += (1 - pct);
    }
  });

  const e_or_i = scores.E >= scores.I ? 'E' : 'I';
  const s_or_n = scores.N >= scores.S ? 'N' : 'S';
  const t_or_f = scores.T >= scores.F ? 'T' : 'F';
  const j_or_p = scores.J >= scores.P ? 'J' : 'P';

  return e_or_i + s_or_n + t_or_f + j_or_p;
}

// =============================================
// STEP NAVIGATION
// =============================================

function goToStep(step) {
  // Validate
  if (step === 2 && state.currentStep === 1) {
    if (!validateStep1()) return;
  }
  if (step === 4 && state.currentStep === 3) {
    if (!validateStep3()) return;
  }

  // Deactivate all panels
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.progress-step').forEach((ps, i) => {
    ps.classList.remove('active', 'done');
    if (i + 1 < step) ps.classList.add('done');
    if (i + 1 === step) ps.classList.add('active');
  });
  document.querySelectorAll('.progress-line').forEach((line, i) => {
    line.classList.toggle('done', i + 1 < step);
  });

  // Activate new panel
  const panelId = step === 'result' ? 'stepResult' : 'step' + step;
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');

  // Nav label
  const labels = { 1: 'Step 1 of 4', 2: 'Step 2 of 4', 3: 'Step 3 of 4', 4: 'Step 4 of 4', result: 'Result' };
  const lbl = document.getElementById('navStepLabel');
  if (lbl) lbl.textContent = labels[step] || '';

  if (step !== 'result') state.currentStep = step;
  saveState();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const err = document.getElementById('step1Error');
  if (!state.userName.trim()) { err.textContent = 'Please enter your name.'; return false; }
  if (!state.userAge || parseInt(state.userAge) < 10) { err.textContent = 'Please enter a valid age.'; return false; }
  if (!state.userGender) { err.textContent = 'Please select your gender.'; return false; }
  err.textContent = '';
  return true;
}

function validateStep3() {
  const err = document.getElementById('step3Error');
  if (!state.animeGenre) { err.textContent = 'Please select your favorite anime genre.'; return false; }
  err.textContent = '';
  return true;
}



// =============================================
// SUBMIT & GROQ API
// =============================================

async function submitForm() {
  const err = document.getElementById('step4Error');
  err.textContent = '';

  state.openQ1 = document.getElementById('openQ1').value;
  state.openQ2 = document.getElementById('openQ2').value;
  state.openQ3 = document.getElementById('openQ3').value;

  const mbtiType = computeMBTI();

  // Loading state
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitBtnText');
  const btnLoader = document.getElementById('btnLoader');
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'flex';

  try {
    // Call our secure serverless function instead of Groq directly
    const response = await fetch(API_MATCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mbtiType,
        openQ1: state.openQ1,
        openQ2: state.openQ2,
        openQ3: state.openQ3,
        userName: state.userName,
        userAge: state.userAge,
        userGender: state.userGender
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (response.status === 405) {
        throw new Error('API route returned 405. Run `vercel dev` and open http://localhost:3000/public/app.html');
      }
      throw new Error(errData?.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    let result;
    try {
      result = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (e) {
      throw new Error('Failed to parse AI response. Please try again.');
    }

    renderResult(result, mbtiType);
    goToStep('result');

  } catch (e) {
    if (e instanceof TypeError && /fetch/i.test(e.message)) {
      err.textContent = 'Cannot reach API server. Start `vercel dev` and open http://localhost:3000/public/app.html';
      return;
    }
    err.textContent = e.message || 'Something went wrong. Try again.';
  } finally {
    btn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

// buildPrompt is now handled server-side in /api/match.js

// =============================================
// RENDER RESULT
// =============================================

function renderResult(result, mbtiType) {
  const card = document.getElementById('resultCard');
  if (!card) return;

  const charImg = getCharacterImageUrl(result.characterName);

  card.innerHTML = `
    <div class="result-user-row">
      <div class="result-user-name">✦ ${state.userName.toUpperCase()} · ${state.userAge}${state.userGender ? ' · ' + state.userGender : ''}</div>
      <div class="result-mbti-badge">${mbtiType}</div>
    </div>

    <div class="result-main">
      <div class="result-char-img" id="resultCharImg">
        <img src="${charImg}" alt="${result.characterName}"
          onerror="this.style.display='none';document.getElementById('charEmoji').style.display='flex'"/>
        <div id="charEmoji" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:3rem">🌸</div>
      </div>
      <div class="result-char-info">
        <div class="result-fancy-name">
          <div class="result-title-user">${(state.userName || 'User')}</div>
          <div class="result-title-as">AS</div>
          <div class="result-title-char">${result.characterName || 'Unknown'}</div>
        </div>
        <div class="result-desc">${result.description || ''}</div>
      </div>
    </div>

    <div class="match-bar-section">
      <div class="match-label-row">
        <div class="match-label-text">⚡ SOUL RESONANCE</div>
        <div class="match-pct-val" id="matchPctDisplay">0%</div>
      </div>
      <div class="match-bar-track">
        <div class="match-bar-fill" id="matchBarFill"></div>
      </div>
    </div>

    <div class="result-traits">
      ${(result.traits || []).map(t => `<div class="trait-tag">${t}</div>`).join('')}
    </div>
  `;

  // Animate match bar
  const pct = Math.min(Math.max(parseInt(result.matchPercentage) || 80, 1), 100);
  setTimeout(() => {
    const bar = document.getElementById('matchBarFill');
    const num = document.getElementById('matchPctDisplay');
    if (bar) bar.style.width = pct + '%';
    if (num) {
      let current = 0;
      const step = pct / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, pct);
        num.textContent = Math.ceil(current) + '%';
        if (current >= pct) clearInterval(timer);
      }, 20);
    }
  }, 300);

  // Try to load local image
  tryLoadLocalImage(result.characterName, document.querySelector('#resultCharImg img'));
}

function getCharacterImageUrl(name) {
  const entry = lookupCharacter(name);
  if (entry) return entry.file;
  // Fallback: generate slug with .jpg
  return `images/${charSlug(name)}.jpg`;
}

function tryLoadLocalImage(name, imgEl) {
  if (!imgEl) return;
  const url = getCharacterImageUrl(name);
  imgEl.src = url;
}

function charSlug(name) {
  return (name || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

// =============================================
// DOWNLOAD CARD
// =============================================

async function downloadCard() {
  const card = document.getElementById('resultCard');
  if (!card) return;

  try {
    const bgDeep = getComputedStyle(document.documentElement).getPropertyValue('--bg-deep').trim() || '#050816';
    document.body.classList.add('downloading');

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Ensure images in the card are loaded before rendering
    const images = card.querySelectorAll('img');
    if (images.length > 0) {
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 2000);
        });
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    const rect = card.getBoundingClientRect();
    const scale = window.innerWidth <= 480 ? 1 : 2;

    const canvas = await html2canvas(card, {
      backgroundColor: bgDeep,
      scale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      foreignObjectRendering: true,
      scrollX: 0,
      scrollY: 0,
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height)
    });

    document.body.classList.remove('downloading');

    const link = document.createElement('a');
    link.download = `animatype_${(state.userName || 'result').replace(/\s+/g, '_')}_card.png`;
    link.href = canvas.toDataURL('image/png', 0.95);
    link.click();

    // After download is triggered, clear data and redirect
    setTimeout(() => {
      localStorage.removeItem('animatype_state');
      window.location.href = 'index.html';
    }, 1500); // Small delay to ensure download starts
  } catch (e) {
    document.body.classList.remove('downloading');
    console.error('Download error:', e);
    alert('Download failed. Try right-clicking the card and saving as image.');
  }
}

// =============================================
// RESET
// =============================================

function resetApp() {
  if (!confirm('Reset all progress and start over?')) return;
  localStorage.removeItem('animatype_state');
  location.reload();
}
