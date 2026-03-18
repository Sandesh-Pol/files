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
// Replace the value in config.js with your Groq API key.
// Get a free key at https://console.groq.com
const GROQ_API_KEY = CONFIG.GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

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

const MBTI_QUESTIONS = [
  {
    id: 1, text: "After a long, tiring day, what helps you recharge the most?",
    dimension: "EI",
    lowLabel: "Alone time / recharge solo",
    highLabel: "Social / hang out with others",
    lowCode: "I", highCode: "E"
  },
  {
    id: 2, text: "When you're in a new group of people, you usually start conversations and try to include everyone.",
    dimension: "EI",
    lowLabel: "Stay quiet, open up slowly",
    highLabel: "Jump in, make connections",
    lowCode: "I", highCode: "E"
  },
  {
    id: 3, text: "When making an important decision, I rely on objective logic and facts rather than emotions.",
    dimension: "TF",
    lowLabel: "Heart & emotions guide me",
    highLabel: "Logic & analysis guide me",
    lowCode: "F", highCode: "T"
  },
  {
    id: 4, text: "My ideal weekend involves going out, socializing, and having fun rather than staying home.",
    dimension: "EI",
    lowLabel: "Home, peace & quiet",
    highLabel: "Out, active & social",
    lowCode: "I", highCode: "E"
  },
  {
    id: 5, text: "When working on a project, I prefer a clear plan and deadlines over working freely at my own pace.",
    dimension: "JP",
    lowLabel: "Freedom & flexibility",
    highLabel: "Structure & clear plans",
    lowCode: "P", highCode: "J"
  },
  {
    id: 6, text: "When someone shares a problem with me, I instinctively comfort them emotionally rather than giving solutions.",
    dimension: "TF",
    lowLabel: "Give practical solutions",
    highLabel: "Offer emotional comfort",
    lowCode: "T", highCode: "F"
  },
  {
    id: 7, text: "When plans suddenly change, I adapt quickly and even enjoy the surprise.",
    dimension: "JP",
    lowLabel: "Prefer sticking to original plan",
    highLabel: "Enjoy adapting creatively",
    lowCode: "J", highCode: "P"
  },
  {
    id: 8, text: "In conversations, I enjoy talking about abstract ideas, dreams, and theories more than real-life topics.",
    dimension: "SN",
    lowLabel: "Real-life & concrete topics",
    highLabel: "Ideas, dreams & theories",
    lowCode: "S", highCode: "N"
  },
  {
    id: 9, text: "My room or workspace is usually organized, neat, and structured.",
    dimension: "JP",
    lowLabel: "Creative chaos is fine",
    highLabel: "Very organized & structured",
    lowCode: "P", highCode: "J"
  },
  {
    id: 10, text: "When learning something new, I prefer exploring concepts and possibilities rather than step-by-step instructions.",
    dimension: "SN",
    lowLabel: "Step-by-step, hands-on",
    highLabel: "Explore concepts & possibilities",
    lowCode: "S", highCode: "N"
  },
  {
    id: 11, text: "When facing a challenge, I try new and different approaches rather than relying on past experience.",
    dimension: "SN",
    lowLabel: "Use proven past experience",
    highLabel: "Try new different approaches",
    lowCode: "S", highCode: "N"
  },
  {
    id: 12, text: "My friends would describe me as energetic and outgoing rather than calm and thoughtful.",
    dimension: "EI",
    lowLabel: "Calm & thoughtful",
    highLabel: "Energetic & outgoing",
    lowCode: "I", highCode: "E"
  },
  {
    id: 13, text: "When I think about my future, I make clear plans and goals rather than keeping things open and flexible.",
    dimension: "JP",
    lowLabel: "Open, flexible & spontaneous",
    highLabel: "Clear plans & structured goals",
    lowCode: "P", highCode: "J"
  },
  {
    id: 14, text: "In a team, I usually take on the role of leader, motivator, or idea generator.",
    dimension: "EI",
    lowLabel: "Supportive & behind-the-scenes",
    highLabel: "Leader, motivator, or ideator",
    lowCode: "I", highCode: "E"
  },
  {
    id: 15, text: "When stressed, I prefer to talk it out with someone rather than staying alone and processing internally.",
    dimension: "EI",
    lowLabel: "Alone, process internally",
    highLabel: "Talk it out with others",
    lowCode: "I", highCode: "E"
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

  // Validate API key is configured
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_groq_api_key_here') {
    err.textContent = 'API key not configured. Please set GROQ_API_KEY in config.js.';
    return;
  }

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

  const prompt = buildPrompt(mbtiType);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 600,
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content: 'You are an expert in anime psychology and MBTI personality matching. Always respond with valid JSON only. No markdown, no extra text.'
          },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: ${response.status}`);
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
    err.textContent = e.message || 'Something went wrong. Try again.';
  } finally {
    btn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

function buildPrompt(mbtiType) {
  const availableChars = getFilteredCharacters(state.userGender);
  const charList = availableChars.join('\n  - ');

  return `Task: Match the user to the single most compatible anime character from the provided list.

USER PROFILE:
- Name: ${state.userName}
- Age: ${state.userAge}
- Gender Profile: ${state.userGender}
- Primary MBTI (Calculated): ${mbtiType}
- Favorite Color: ${state.favColor}
- Hobbies: ${state.hobbies.join(', ') || 'Various'}
- Anime Interests: ${state.animeGenre || 'General'}
- Philosophical Outlook (World): "${state.openQ1 || 'No data'}"
- Internal Drive: "${state.openQ2 || 'No data'}"
- External Perception: "${state.openQ3 || 'No data'}"

CHARACTER CANDIDATES (Choose ONLY from this list, use the EXACT name):
  - ${charList}

MATCHING LOGIC:
1. MBTI CONGRUENCE: Prioritize characters whose MBTI matches or is closely related to the Primary MBTI (${mbtiType}).
2. PSYCHOLOGICAL ALIGNMENT: Analyze the user's open-ended answers ("Ideal world", "Driven by", "How others see them") to find deep-seated traits that mirror the character's canon personality.
3. GENDER CONSISTENCY: Ensure the character matches the user's identified gender (${state.userGender}).

EXPECTED JSON RESPONSE (Strictly JSON, no markdown tags):
{
  "characterName": "Exact name from list",
  "animeSeries": "Name of the anime",
  "matchPercentage": 1-100,
  "traits": ["Four", "Distinct", "Key", "Traits"],
  "description": "A compelling 3-sentence explanation of why this character is their anime counterpart, specifically referencing their MBTI ${mbtiType} and their personal answers.",
  "mbtiType": "${mbtiType}"
}`;
}

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
        <div class="result-fancy-name">${state.userName} <span class="as-mark">AS</span> ${result.characterName || 'Unknown'}</div>
        <div class="result-series">${result.animeSeries || ''}</div>
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
    // Add a class for print/download mode to hide backgrounds where needed
    document.body.classList.add('downloading');

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const canvas = await html2canvas(card, {
      backgroundColor: isLight ? '#f0f2ff' : '#050816',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Remove class immediately after capture
    document.body.classList.remove('downloading');

    const link = document.createElement('a');
    link.download = `animatype_${(state.userName || 'result').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // After download is triggered, clear data and redirect
    setTimeout(() => {
      localStorage.removeItem('animatype_state');
      window.location.href = 'index.html';
    }, 1500); // Small delay to ensure download starts
  } catch (e) {
    document.body.classList.remove('downloading');
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
