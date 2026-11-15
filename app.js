import { QUESTIONS, CATEGORIES, MODES, checkTyped } from './questions.js?v=3';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js?v=3';

/* =========================================================
   The Not So Crazy Elevator
   - Host-authoritative game loop (the room creator runs it)
   - Supabase Realtime: presence = who's here, broadcast = game state
   ========================================================= */

const $ = (s) => document.querySelector(s);
const AVATARS = ['🦊', '🐼', '🐸', '🐙', '🦄', '🐯', '🐵', '🐧', '🐨', '🦖', '🐝', '🤖'];
const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9f1c', '#2ec4b6', '#f15bb5', '#a3e635', '#38bdf8'];
const LETTERS = ['A', 'B', 'C', 'D'];
const REVEAL_MS = 4500;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const me = {
  id: Math.random().toString(36).slice(2, 10),
  name: store.get('nsce.name', ''),
  emoji: store.get('nsce.emoji', AVATARS[Math.floor(Math.random() * AVATARS.length)]),
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
};

const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/* ---------- Floors ----------
   Internally a player climbs "levels" (0..top, one per question).
   The tower's real height depends on the mode (100 floors … 1 KRILLION). */
const modeOf = (st) => MODES[(st && st.settings && st.settings.mode) || 'easy'];
const realFloor = (level, st) => Math.round((level / st.top) * modeOf(st).roof);
function floorText(level, st, short = false) {
  if (level <= 0) return 'L';
  if (level >= st.top) return 'ROOF';
  const f = realFloor(level, st);
  return short || f >= 1e7 ? compact.format(f) : f.toLocaleString('en');
}

/* ---------------- Sound ---------------- */
let audio = null;
let muted = store.get('nsce.muted', false);

// Background elevator music: loops quietly, starts on the first click (browsers block autoplay).
const music = new Audio('music.mp3');
music.loop = true;
music.volume = 0.3;
function syncMusic() {
  if (muted) music.pause();
  else music.play().catch(() => {});
}
document.addEventListener('pointerdown', function startMusic() {
  syncMusic();
  document.removeEventListener('pointerdown', startMusic);
});

function tone(freq, start, dur, type = 'sine', vol = 0.15) {
  if (muted) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime + start;
    const o = audio.createOscillator(); const g = audio.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dur + 0.05);
  } catch {}
}
const sfx = {
  ding: () => { tone(1318, 0, 0.9, 'sine', 0.18); tone(1046, 0.22, 1.1, 'sine', 0.16); },
  click: () => tone(660, 0, 0.08, 'square', 0.05),
  doors: () => { tone(180, 0, 0.5, 'triangle', 0.06); tone(150, 0.1, 0.5, 'triangle', 0.05); },
  buzz: () => { tone(140, 0, 0.35, 'sawtooth', 0.08); tone(110, 0.15, 0.45, 'sawtooth', 0.08); },
  fall: () => [600, 480, 360, 240].forEach((f, i) => tone(f, i * 0.09, 0.2, 'sawtooth', 0.06)),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.14, 0.5, 'triangle', 0.12)),
  tick: () => tone(1200, 0, 0.04, 'square', 0.03),
};

/* ---------------- UI helpers ---------------- */
function show(screen) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.toggle('active', el.id === 'screen-' + screen));
}
let toastTimer;
function toast(msg, ms = 2600) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}
function ding(text, kind, arrow) {
  const o = $('#dingOverlay');
  $('#dingText').textContent = text; $('#dingArrow').textContent = arrow;
  o.className = 'ding-overlay'; void o.offsetWidth; o.className = 'ding-overlay show ' + kind;
}

/* ---------------- Menu ---------------- */
function initMenu() {
  $('#nameInput').value = me.name;
  const grid = $('#avatarGrid');
  grid.innerHTML = AVATARS.map((a) => `<button type="button" data-a="${a}" class="${a === me.emoji ? 'sel' : ''}">${a}</button>`).join('');
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    me.emoji = b.dataset.a; store.set('nsce.emoji', me.emoji); sfx.click();
    grid.querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b));
  });
  $('#setCat').innerHTML = CATEGORIES.map((c) => `<option>${c}</option>`).join('');
  $('#setMode').innerHTML = Object.entries(MODES).map(([k, m]) => `<option value="${k}">${m.emoji} ${m.label}</option>`).join('');

  const params = new URLSearchParams(location.search);
  if (params.get('room')) $('#codeInput').value = params.get('room').toUpperCase().slice(0, 4);

  $('#muteBtn').textContent = muted ? '🔇' : '🔊';
  $('#muteBtn').onclick = () => { muted = !muted; store.set('nsce.muted', muted); $('#muteBtn').textContent = muted ? '🔇' : '🔊'; syncMusic(); };

  $('#soloBtn').onclick = () => { if (readName()) startSolo(); };
  $('#createBtn').onclick = () => { if (readName()) createRoom(); };
  $('#joinBtn').onclick = () => { if (readName()) joinRoom($('#codeInput').value.trim().toUpperCase()); };
  $('#codeInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#joinBtn').click(); });
  $('#leaveBtn').onclick = leave;
  $('#endLeaveBtn').onclick = leave;
  $('#brandHome').onclick = () => { if (!net && !solo) show('menu'); };
  $('#startBtn').onclick = () => H && H.start();
  $('#againBtn').onclick = () => H && H.toLobby();
  ['#setCount', '#setTime', '#setCat', '#setMode', '#setStyle'].forEach((s) => $(s).addEventListener('change', () => H && H.updateSettings()));
  $('#copyLinkBtn').onclick = async () => {
    const url = location.origin + location.pathname + '?room=' + roomCode;
    try { await navigator.clipboard.writeText(url); toast('Invite link copied!'); } catch { toast(url, 6000); }
  };
  $('#typedForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#typedInput').value.trim();
    if (v) choose(v);
  });

  // Hero indicator idles through floors
  let hf = 0; setInterval(() => { hf = (hf + 1) % 10; $('#heroFloor').textContent = hf === 0 ? 'L' : hf; }, 1200);
}
function readName() {
  const n = $('#nameInput').value.trim();
  $('#menuError').textContent = '';
  if (!n) { $('#menuError').textContent = 'Pick a name first!'; $('#nameInput').focus(); return false; }
  me.name = n.slice(0, 16); store.set('nsce.name', me.name); return true;
}

/* =========================================================
   HOST ENGINE (runs only on the host / in solo)
   ========================================================= */
let H = null;        // host engine (null for guests)
let net = null;      // { sb, ch }
let solo = false;
let roomCode = '';

function buildDeck(settings) {
  const mode = MODES[settings.mode] || MODES.easy;
  const ok = (q) => (settings.cat === 'All' || q.c === settings.cat) && !(settings.style === 'type' && q.nt);
  const main = shuffle(QUESTIONS.filter((q) => ok(q) && mode.tiers.includes(q.d)));
  const fill = shuffle(QUESTIONS.filter((q) => ok(q) && mode.fill.includes(q.d)));
  let picked = [...main, ...fill].slice(0, settings.count);
  // Still short (tiny category)? Pull from any difficulty in that category.
  if (picked.length < settings.count) {
    const rest = shuffle(QUESTIONS.filter((q) => ok(q) && !picked.includes(q)));
    picked = [...picked, ...rest].slice(0, settings.count);
  }
  return shuffle(picked).map((q) => {
    const choices = shuffle(q.a);
    return { cat: q.c, text: q.q, choices, correct: choices.indexOf(q.a[0]), answer: q.a[0], accepted: [q.a[0], ...(q.alt || [])] };
  });
}

function createHost(publish) {
  const saved = store.get('nsce.settings', {});
  const h = {
    phase: 'lobby',
    settings: { count: 10, time: 15, cat: 'All', mode: 'easy', style: 'pick', ...saved },
    players: {},
    deck: [], qIndex: -1, startedAt: 0, answers: {}, timer: null, reveal: null,

    publicState() {
      const q = this.deck[this.qIndex];
      const showQ = q && this.phase !== 'lobby';
      const typed = this.settings.style === 'type';
      return {
        phase: this.phase, settings: this.settings, hostId: me.id, solo,
        players: this.players, qIndex: this.qIndex, total: this.deck.length || this.settings.count,
        top: this.top(),
        q: showQ ? { cat: q.cat, text: q.text, choices: typed ? null : q.choices } : null,
        timeLeft: this.phase === 'question' ? Math.max(0, this.startedAt + this.settings.time * 1000 - Date.now()) : 0,
        locked: Object.keys(this.answers),
        reveal: this.phase === 'reveal' || this.phase === 'end' ? this.reveal : null,
      };
    },
    top() { return Math.max(3, this.deck.length || this.settings.count); },
    push() { publish(this.publicState()); },

    syncRoster(roster) {
      for (const [id, p] of Object.entries(roster)) {
        if (!this.players[id]) this.players[id] = { name: p.name, emoji: p.emoji, color: p.color, floor: 0, best: 0, streak: 0, correct: 0, ms: 0, present: true };
        else Object.assign(this.players[id], { name: p.name, emoji: p.emoji, present: true });
      }
      for (const id of Object.keys(this.players)) {
        if (!roster[id]) {
          if (this.phase === 'lobby') delete this.players[id];
          else this.players[id].present = false;
        }
      }
      this.push();
      if (this.phase === 'question') this.checkAllAnswered();
    },
    updateSettings() {
      if (this.phase !== 'lobby') return;
      this.settings = { count: +$('#setCount').value, time: +$('#setTime').value, cat: $('#setCat').value, mode: $('#setMode').value, style: $('#setStyle').value };
      store.set('nsce.settings', this.settings);
      this.push();
    },
    start() {
      if (this.phase !== 'lobby') return;
      this.updateSettings();
      this.deck = buildDeck(this.settings);
      for (const p of Object.values(this.players)) Object.assign(p, { floor: 0, best: 0, streak: 0, correct: 0, ms: 0 });
      this.qIndex = -1; this.reveal = null;
      this.next();
    },
    next() {
      clearTimeout(this.timer);
      this.qIndex++;
      if (this.qIndex >= this.deck.length) return this.end();
      this.phase = 'question'; this.answers = {}; this.startedAt = Date.now();
      this.push();
      this.timer = setTimeout(() => this.doReveal(), this.settings.time * 1000 + 300);
    },
    answer(pid, choice) {
      if (this.phase !== 'question' || this.answers[pid] || !this.players[pid]) return;
      if (this.settings.style === 'type') {
        if (typeof choice !== 'string' || !choice.trim()) return;
        choice = choice.trim().slice(0, 60);
      } else if (!(choice >= 0 && choice < 4)) return;
      this.answers[pid] = { choice, ms: Date.now() - this.startedAt };
      this.push();
      this.checkAllAnswered();
    },
    checkAllAnswered() {
      const present = Object.entries(this.players).filter(([, p]) => p.present).map(([id]) => id);
      if (present.length && present.every((id) => this.answers[id])) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.doReveal(), 700);
      }
    },
    doReveal() {
      if (this.phase !== 'question') return;
      clearTimeout(this.timer);
      const q = this.deck[this.qIndex];
      const top = this.top();
      const typed = this.settings.style === 'type';
      const penalty = (MODES[this.settings.mode] || MODES.easy).penalty;
      const picks = {}; const gains = {}; const right = {};
      for (const [id, p] of Object.entries(this.players)) {
        const a = this.answers[id];
        const ok = !!a && (typed ? checkTyped(a.choice, q.accepted) : a.choice === q.correct);
        if (a) picks[id] = a.choice;
        right[id] = ok;
        const before = p.floor;
        if (ok) {
          p.streak++; p.correct++; p.ms += a.ms;
          const g = p.streak % 3 === 0 ? 2 : 1; // 3 in a row = express elevator
          p.floor = Math.min(top, p.floor + g);
        } else {
          p.streak = 0;
          if (p.present) p.floor = Math.max(0, p.floor - penalty);
        }
        p.best = Math.max(p.best || 0, p.floor);
        gains[id] = p.floor - before;
      }
      this.reveal = { qIndex: this.qIndex, correct: q.correct, answer: q.answer, picks, gains, right };
      this.phase = 'reveal';
      this.push();
      const someoneTop = Object.values(this.players).some((p) => p.floor >= top);
      this.timer = setTimeout(() => (someoneTop ? this.end() : this.next()), REVEAL_MS);
    },
    end() { clearTimeout(this.timer); this.phase = 'end'; this.push(); },
    toLobby() {
      clearTimeout(this.timer);
      this.phase = 'lobby'; this.deck = []; this.qIndex = -1; this.reveal = null; this.answers = {};
      for (const [id, p] of Object.entries(this.players)) { if (!p.present) delete this.players[id]; else Object.assign(p, { floor: 0, best: 0, streak: 0, correct: 0, ms: 0 }); }
      this.push();
    },
    stop() { clearTimeout(this.timer); },
  };
  return h;
}

/* =========================================================
   NETWORK (Supabase Realtime)
   ========================================================= */
let supabaseLib = null;
async function getClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Multiplayer is not configured yet.');
  if (!supabaseLib) supabaseLib = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/+esm');
  return supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { params: { eventsPerSecond: 20 } } });
}

function rosterFrom(ch) {
  const st = ch.presenceState(); const r = {};
  for (const [key, metas] of Object.entries(st)) if (metas && metas[0]) r[key] = metas[0];
  return r;
}

async function connect(code, asHost) {
  const sb = await getClient();
  const ch = sb.channel('nsce-room-' + code, { config: { broadcast: { self: false }, presence: { key: me.id } } });
  net = { sb, ch };

  ch.on('broadcast', { event: 'msg' }, ({ payload }) => onMessage(payload));
  ch.on('presence', { event: 'sync' }, () => {
    const roster = rosterFrom(ch);
    if (H) H.syncRoster(roster);
    else if (S && S.hostId && !roster[S.hostId]) hostLeft();
  });

  await new Promise((resolve, reject) => {
    const to = setTimeout(() => reject(new Error('Connection timed out')), 10000);
    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        clearTimeout(to);
        await ch.track({ name: me.name, emoji: me.emoji, color: me.color, host: asHost, at: Date.now() });
        resolve();
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(to); reject(new Error('Could not connect to the room server'));
      }
    });
  });
}
function send(payload) {
  if (net) net.ch.send({ type: 'broadcast', event: 'msg', payload });
}
function onMessage(m) {
  if (!m) return;
  if (m.t === 'state' && !H) applyState(m.d);
  else if (m.t === 'answer' && H) H.answer(m.d.pid, m.d.choice);
}
async function disconnect() {
  if (net) { try { await net.ch.untrack(); await net.sb.removeChannel(net.ch); } catch {} }
  net = null;
}

/* ---------------- Session flows ---------------- */
function startSolo() {
  solo = true; roomCode = '';
  H = createHost((st) => applyState(st));
  H.syncRoster({ [me.id]: me }); // shows the lobby, where you pick mode + style
}

async function createRoom() {
  const btn = $('#createBtn'); btn.disabled = true;
  try {
    roomCode = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('');
    H = createHost((st) => { applyState(st); send({ t: 'state', d: st }); });
    await connect(roomCode, true);
    history.replaceState(null, '', '?room=' + roomCode);
    H.push();
  } catch (e) {
    H = null; await disconnect();
    $('#menuError').textContent = e.message;
  } finally { btn.disabled = false; }
}

async function joinRoom(code) {
  if (!/^[A-Z]{4}$/.test(code)) { $('#menuError').textContent = 'Room codes are 4 letters.'; return; }
  const btn = $('#joinBtn'); btn.disabled = true; btn.textContent = '…';
  try {
    roomCode = code; S = null;
    await connect(code, false);
    const ok = await new Promise((res) => {
      const start = Date.now();
      const iv = setInterval(() => {
        if (S) { clearInterval(iv); res(true); }
        else if (Date.now() - start > 6000) { clearInterval(iv); res(false); }
      }, 150);
    });
    if (!ok) throw new Error(`Room ${code} not found. Check the code and try again.`);
    history.replaceState(null, '', '?room=' + roomCode);
  } catch (e) {
    await disconnect(); S = null;
    $('#menuError').textContent = e.message;
  } finally { btn.disabled = false; btn.textContent = 'Join'; }
}

async function leave() {
  if (H) H.stop();
  H = null; solo = false; S = null; shownQ = -1; revealedQ = -1;
  cancelAnimationFrame(timerRaf);
  await disconnect();
  history.replaceState(null, '', location.pathname);
  show('menu');
}

function hostLeft() {
  toast('The host left the building. 🚪', 4000);
  leave();
}

/* =========================================================
   CLIENT RENDERING (everyone, including host)
   ========================================================= */
let S = null;          // latest public state
let shownQ = -1;       // question index currently displayed
let revealedQ = -1;    // question index whose reveal has been animated
let myChoice = null;
let deadline = 0;
let timerRaf = 0;
let lastTick = 0;
let endShown = false;

function applyState(st) {
  const prev = S; S = st;
  const amHost = !!H;

  if (st.phase === 'lobby') {
    shownQ = -1; revealedQ = -1; endShown = false;
    renderLobby(st, amHost);
    show('lobby');
    return;
  }

  if (st.phase === 'question') {
    if (st.qIndex !== shownQ) setupQuestion(st);
    renderLocks(st);
  }
  if (st.phase === 'reveal') {
    if (st.qIndex !== shownQ) setupQuestion(st, true);
    if (revealedQ !== st.qIndex) runReveal(st);
  }
  if (st.phase === 'question' || st.phase === 'reveal') {
    endShown = false;
    show('game');
    renderBuilding(st);
  }
  if (st.phase === 'end') {
    const first = !endShown;
    endShown = true;
    renderEnd(st, amHost, !first);
  }
}

function renderLobby(st, amHost) {
  const mode = modeOf(st);
  $('#roomCodeWrap').style.display = st.solo ? 'none' : '';
  $('#soloTitle').style.display = st.solo ? '' : 'none';
  $('#roomCode').textContent = roomCode;
  const players = Object.entries(st.players);
  $('#playersBox').style.display = st.solo ? 'none' : '';
  $('#playerCount').textContent = players.length;
  $('#lobbyPlayers').innerHTML = players.map(([id, p]) =>
    `<li style="border-color:${p.color}55"><span class="av">${p.emoji}</span><span>${esc(p.name)}</span>${id === st.hostId ? '<span class="tag">HOST</span>' : id === me.id ? '<span class="tag">YOU</span>' : ''}</li>`
  ).join('');
  $('#settingsBox').style.display = amHost ? '' : 'none';
  $('#startBtn').style.display = amHost ? '' : 'none';
  $('#waitHost').style.display = amHost ? 'none' : '';
  $('#leaveBtn').textContent = st.solo ? 'Back' : 'Leave';
  $('#modeBlurb').innerHTML = `${mode.emoji} <b>${mode.label}</b>: ${esc(mode.blurb)}${st.settings.style === 'type' ? ' ⌨️ You type your answers.' : ' 🛗 You pick an elevator.'}`;
  $('#settingsSummary').textContent = amHost ? '' : `${st.settings.count} questions · ${st.settings.time}s each · ${st.settings.cat}`;
  if (amHost) {
    $('#setCount').value = st.settings.count; $('#setTime').value = st.settings.time; $('#setCat').value = st.settings.cat;
    $('#setMode').value = st.settings.mode; $('#setStyle').value = st.settings.style;
  }
}

function setupQuestion(st, noTimer = false) {
  shownQ = st.qIndex; myChoice = null;
  const q = st.q;
  const typed = st.settings.style === 'type';
  const mode = modeOf(st);
  $('#qMode').textContent = `${mode.emoji} ${mode.label}`;
  $('#qCat').textContent = q.cat;
  $('#qProgress').textContent = `Q ${st.qIndex + 1} / ${st.total}`;
  $('#qText').textContent = q.text;
  $('#statusLine').textContent = typed ? 'Type your answer and hit Enter to ride!' : 'Step into an elevator!';
  $('#elevators').style.display = typed ? 'none' : '';
  $('#typedWrap').style.display = typed ? '' : 'none';

  if (typed) {
    const car = $('#typedCar');
    car.className = 'elevator typed-car';
    car.querySelector('.ev-riders').innerHTML = '';
    car.querySelector('.ev-answer').textContent = '?';
    car.querySelector('.ev-arrow').textContent = '▲';
    $('#typedInput').value = '';
    $('#typedInput').disabled = false;
    $('#typedBtn').disabled = false;
    $('#typedResults').innerHTML = '';
    if (!noTimer) setTimeout(() => $('#typedInput').focus(), 50);
  } else {
    const box = $('#elevators');
    box.innerHTML = q.choices.map((c, i) => `
      <button class="elevator" data-i="${i}">
        <div class="ev-indicator"><span class="ev-arrow">▲</span><span>${LETTERS[i]}</span></div>
        <div class="ev-frame">
          <div class="ev-interior">
            <div class="ev-letter">${LETTERS[i]}</div>
            <div class="ev-answer">${esc(c)}</div>
            <div class="ev-riders"></div>
          </div>
          <div class="ev-door l"></div><div class="ev-door r"></div>
          <div class="ev-door-label">${esc(c)}</div>
        </div>
        <div class="ev-callbtn"></div>
      </button>`).join('');
    box.querySelectorAll('.elevator').forEach((el) => el.addEventListener('click', () => choose(+el.dataset.i)));
  }
  sfx.doors();

  cancelAnimationFrame(timerRaf);
  if (!noTimer) {
    deadline = performance.now() + st.timeLeft;
    const total = st.settings.time * 1000;
    const loop = (now) => {
      const left = Math.max(0, deadline - now);
      const frac = left / total;
      const fill = $('#timerFill');
      fill.style.transform = `scaleX(${frac})`;
      fill.style.backgroundPosition = `${(1 - frac) * 100}% 0`;
      if (left < 3500 && left > 0 && now - lastTick > 1000) { lastTick = now; sfx.tick(); }
      if (left <= 0) { closeAllDoors(); return; }
      timerRaf = requestAnimationFrame(loop);
    };
    timerRaf = requestAnimationFrame(loop);
  } else {
    $('#timerFill').style.transform = 'scaleX(0)';
  }
}

function choose(choice) {
  if (!S || S.phase !== 'question' || myChoice !== null) return;
  myChoice = choice; sfx.click(); setTimeout(sfx.doors, 120);
  if (typeof choice === 'string') {
    const car = $('#typedCar');
    car.classList.add('mine', 'closed', 'riding');
    car.querySelector('.ev-riders').innerHTML = `<span>${me.emoji}</span>`;
    car.querySelector('.ev-answer').textContent = choice;
    car.querySelector('.ev-door-label').textContent = `"${choice}"`;
    $('#typedInput').disabled = true; $('#typedBtn').disabled = true;
  } else {
    document.querySelectorAll('#elevators .elevator').forEach((el, idx) => {
      el.disabled = true;
      if (idx === choice) {
        el.classList.add('mine', 'closed', 'riding');
        el.querySelector('.ev-riders').innerHTML = `<span>${me.emoji}</span>`;
      } else el.classList.add('dim');
    });
  }
  $('#statusLine').textContent = 'Doors closing… going up? 🤞';
  if (H) H.answer(me.id, choice);
  else send({ t: 'answer', d: { pid: me.id, choice } });
}

function closeAllDoors() {
  document.querySelectorAll('#elevators .elevator').forEach((el) => { el.disabled = true; el.classList.add('closed'); });
  $('#typedCar').classList.add('closed');
  $('#typedInput').disabled = true; $('#typedBtn').disabled = true;
  if (myChoice === null) $('#statusLine').textContent = '⏰ Too slow! The doors closed.';
}

function renderLocks(st) {
  const ids = Object.entries(st.players).filter(([, p]) => p.present);
  const lockedCount = st.locked.filter((id) => st.players[id]).length;
  if (myChoice !== null && ids.length > 1) $('#statusLine').textContent = `Riding… ${lockedCount}/${ids.length} riders locked in`;
}

function runReveal(st) {
  revealedQ = st.qIndex;
  cancelAnimationFrame(timerRaf);
  $('#timerFill').style.transform = 'scaleX(0)';
  const r = st.reveal;
  if (!r || !st.q) return;
  const typed = st.settings.style === 'type';
  sfx.doors();

  if (typed) {
    const car = $('#typedCar');
    car.classList.remove('riding', 'closed');
    car.classList.add(r.right[me.id] ? 'correct' : 'wrong');
    car.querySelector('.ev-answer').textContent = r.answer;
    if (!r.right[me.id]) car.querySelector('.ev-arrow').textContent = '▼';
    $('#typedInput').disabled = true; $('#typedBtn').disabled = true;
    $('#typedResults').innerHTML = Object.entries(st.players).map(([id, p]) => {
      const said = r.picks[id];
      return `<li class="${r.right[id] ? 'ok' : 'no'}"><span>${p.emoji}</span><span class="name">${esc(p.name)}</span><span class="said">${said ? '"' + esc(said) + '"' : '<i>no answer</i>'}</span><span>${r.right[id] ? '✅' : '❌'}</span></li>`;
    }).join('');
  } else {
    document.querySelectorAll('#elevators .elevator').forEach((el, idx) => {
      el.disabled = true;
      el.classList.remove('riding', 'closed', 'dim');
      const riders = Object.entries(r.picks).filter(([, c]) => c === idx).map(([id]) => st.players[id]).filter(Boolean);
      el.querySelector('.ev-riders').innerHTML = riders.map((p) => `<span title="${esc(p.name)}">${p.emoji}</span>`).join('');
      if (idx === r.correct) el.classList.add('correct');
      else if (riders.length || idx === myChoice) el.classList.add('wrong');
      else el.classList.add('dim');
      if (idx !== r.correct) el.querySelector('.ev-arrow').textContent = '▼';
    });
  }

  const mine = st.players[me.id];
  if (!mine) return;
  const gain = r.gains[me.id] || 0;
  const answered = r.picks[me.id] !== undefined;
  const answerText = typed ? r.answer : `${LETTERS[r.correct]}: ${st.q.choices[r.correct]}`;
  const where = floorText(mine.floor, st, true);
  if (r.right[me.id]) {
    sfx.ding();
    ding(gain >= 2 ? `EXPRESS! ${where}` : mine.floor >= st.top ? 'ROOFTOP!' : `FLOOR ${where}`, 'good', '▲');
    $('#statusLine').textContent = gain >= 2 ? '🚀 3 in a row: express elevator, double climb!' : 'Ding! Correct. Up you go!';
  } else {
    if (gain < 0) { sfx.fall(); ding(`DOWN TO ${where}`, 'bad', '▼'); }
    else { sfx.buzz(); if (answered) ding('STUCK!', 'bad', '▼'); }
    const lead = !answered ? 'Missed it!' : typed ? `Not quite!` : 'Wrong stop!';
    $('#statusLine').textContent = `${lead} The answer was ${answerText}${gain < 0 ? ' · the elevator dropped!' : ''}`;
  }
}

function ranked(players) {
  return Object.entries(players).sort(([, a], [, b]) => b.floor - a.floor || (b.best || 0) - (a.best || 0) || b.correct - a.correct || a.ms - b.ms);
}

function renderBuilding(st) {
  const top = st.top;
  const mode = modeOf(st);
  $('#roofName').textContent = `Roof: ${mode.roofName} floors`;
  const shaft = $('#shaft');
  const h = shaft.clientHeight || 300;
  const step = (h - 34) / top;
  let floors = '';
  const every = top > 12 ? 2 : 1;
  for (let f = 0; f <= top; f++) {
    if (f % every && f !== top) continue;
    floors += `<div class="floor ${f === top ? 'top' : ''}" style="bottom:${f * step}px;height:${step}px">${f === top ? '🏁 ROOF' : floorText(f, st, true)}</div>`;
  }
  const byFloor = {};
  const tokens = Object.entries(st.players).map(([id, p]) => {
    const n = (byFloor[p.floor] = (byFloor[p.floor] || 0) + 1) - 1;
    return { id, p, n };
  });
  const tokHtml = tokens.map(({ id, p, n }) => {
    const left = 58 + ((n * 34) % 170);
    return `<div class="token ${id === me.id ? 'me' : ''} ${p.present ? '' : 'gone'}" data-id="${id}" style="--c:${p.color};bottom:${p.floor * step + 2}px;left:${left}px" title="${esc(p.name)}">${p.emoji}</div>`;
  }).join('');

  const key = top + ':' + st.settings.mode;
  const existing = {};
  shaft.querySelectorAll('.token').forEach((t) => (existing[t.dataset.id] = t));
  if (!shaft.querySelector('.floor') || shaft.dataset.key !== key) {
    shaft.innerHTML = floors + tokHtml; shaft.dataset.key = key;
  } else {
    const tmp = document.createElement('div'); tmp.innerHTML = tokHtml;
    const seen = new Set();
    tmp.querySelectorAll('.token').forEach((nt) => {
      const id = nt.dataset.id; seen.add(id);
      const old = existing[id];
      if (old) { old.className = nt.className; old.style.cssText = nt.style.cssText; old.title = nt.title; }
      else shaft.appendChild(nt);
    });
    Object.entries(existing).forEach(([id, el]) => { if (!seen.has(id)) el.remove(); });
  }

  const meP = st.players[me.id];
  $('#myFloor').textContent = meP ? floorText(meP.floor, st) : 'L';
  $('#standings').innerHTML = ranked(st.players).map(([id, p]) => {
    const lock = st.phase === 'question' && st.locked.includes(id) ? '<span class="lock" title="Locked in">🔒</span>' : '';
    return `<li class="${id === me.id ? 'me' : ''}" style="${p.present ? '' : 'opacity:.45'}"><span>${p.emoji}</span><span class="name">${esc(p.name)}</span>${lock}<span class="fl">${floorText(p.floor, st, true)}</span></li>`;
  }).join('');
}

function renderEnd(st, amHost, quiet = false) {
  show('end');
  const list = ranked(st.players);
  const top = st.top;
  const mode = modeOf(st);
  const winner = list[0] && list[0][1];
  const myRank = list.findIndex(([id]) => id === me.id) + 1;
  const mine = st.players[me.id];
  $('#endTitle').textContent = winner && winner.floor >= top ? `${winner.name} reached the rooftop!` : list.length > 1 ? `${winner.name} rode highest!` : 'Ride over!';

  // How far did I get?
  if (mine) {
    const climbed = realFloor(mine.floor, st);
    const left = mode.roof - climbed;
    const pct = Math.round((mine.floor / top) * 100);
    $('#endSub').innerHTML = mine.floor >= top
      ? `${mode.emoji} ${mode.label}: you made it all <b>${mode.roofName}</b> floors to the roof! 🏁`
      : `${mode.emoji} ${mode.label}: you reached floor <b>${climbed.toLocaleString('en')}</b> of ${mode.roofName}.<br>Only <b>${left.toLocaleString('en')}</b> floors to go (${pct}% of the way).`;
    $('#endMeter').style.setProperty('--pct', pct + '%');
    $('#endMeterWrap').style.display = '';
  } else $('#endMeterWrap').style.display = 'none';

  const order = [1, 0, 2];
  $('#podium').style.display = list.length > 1 ? '' : 'none';
  $('#podium').innerHTML = order.filter((i) => list[i]).map((i) => {
    const [, p] = list[i];
    const hgt = [130, 95, 70][i];
    return `<div class="pod p${i + 1}"><div class="av">${p.emoji}</div><div class="nm">${esc(p.name)}</div><div class="block" style="height:${hgt}px">${i + 1}</div></div>`;
  }).join('');
  $('#finalList').innerHTML = list.map(([id, p], i) =>
    `<li style="${id === me.id ? 'background:rgba(242,196,109,.14)' : ''}"><b>#${i + 1}</b><span>${p.emoji}</span><span class="name">${esc(p.name)}</span><span class="muted">${p.correct}/${st.total} right</span><span class="fl">${floorText(p.floor, st)}</span></li>`
  ).join('');
  $('#againBtn').style.display = amHost ? '' : 'none';
  $('#endWait').style.display = amHost ? 'none' : '';
  if (!quiet && myRank === 1) sfx.win();
}

/* ---------------- Boot ---------------- */
initMenu();
show('menu');
