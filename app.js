import { QUESTIONS, CATEGORIES } from './questions.js';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

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
const floorLabel = (f, top) => (f <= 0 ? 'L' : f >= top ? 'R' : String(f));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
  $('#againBtn').onclick = () => { if (solo) { H.toLobby(); H.start(); } else if (H) H.toLobby(); };
  ['#setCount', '#setTime', '#setCat'].forEach((s) => $(s).addEventListener('change', () => H && H.updateSettings()));
  $('#copyLinkBtn').onclick = async () => {
    const url = location.origin + location.pathname + '?room=' + roomCode;
    try { await navigator.clipboard.writeText(url); toast('Invite link copied!'); } catch { toast(url, 6000); }
  };

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

function createHost(publish) {
  const h = {
    phase: 'lobby',
    settings: { count: 10, time: 15, cat: 'All' },
    players: {},
    deck: [], qIndex: -1, startedAt: 0, answers: {}, timer: null, reveal: null,

    publicState() {
      const q = this.deck[this.qIndex];
      return {
        phase: this.phase, settings: this.settings, hostId: me.id,
        players: this.players, qIndex: this.qIndex, total: this.deck.length || this.settings.count,
        top: this.top(),
        q: q && (this.phase === 'question' || this.phase === 'reveal') ? { cat: q.cat, text: q.text, choices: q.choices } : null,
        timeLeft: this.phase === 'question' ? Math.max(0, this.startedAt + this.settings.time * 1000 - Date.now()) : 0,
        locked: Object.keys(this.answers),
        reveal: this.phase === 'reveal' || this.phase === 'end' ? this.reveal : null,
      };
    },
    top() { return Math.max(3, this.deck.length || this.settings.count); },
    push() { publish(this.publicState()); },

    syncRoster(roster) {
      for (const [id, p] of Object.entries(roster)) {
        if (!this.players[id]) this.players[id] = { name: p.name, emoji: p.emoji, color: p.color, floor: 0, streak: 0, correct: 0, ms: 0, present: true };
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
      this.settings = { count: +$('#setCount').value, time: +$('#setTime').value, cat: $('#setCat').value };
      this.push();
    },
    start() {
      if (this.phase !== 'lobby') return;
      this.updateSettings();
      const pool = QUESTIONS.filter((q) => this.settings.cat === 'All' || q.c === this.settings.cat);
      this.deck = shuffle(pool).slice(0, this.settings.count).map((q) => {
        const choices = shuffle(q.a);
        return { cat: q.c, text: q.q, choices, correct: choices.indexOf(q.a[0]) };
      });
      for (const p of Object.values(this.players)) Object.assign(p, { floor: 0, streak: 0, correct: 0, ms: 0 });
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
      if (!(choice >= 0 && choice < 4)) return;
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
      const picks = {}; const gains = {};
      for (const [id, p] of Object.entries(this.players)) {
        const a = this.answers[id];
        if (a) picks[id] = a.choice;
        if (a && a.choice === q.correct) {
          p.streak++; p.correct++; p.ms += a.ms;
          let g = 1;
          if (p.streak % 3 === 0) g = 2; // Express elevator!
          gains[id] = Math.min(g, top - p.floor);
          p.floor = Math.min(top, p.floor + g);
        } else {
          p.streak = 0; gains[id] = 0;
        }
      }
      this.reveal = { qIndex: this.qIndex, correct: q.correct, picks, gains };
      this.phase = 'reveal';
      this.push();
      const someoneTop = Object.values(this.players).some((p) => p.floor >= top);
      this.timer = setTimeout(() => (someoneTop ? this.end() : this.next()), REVEAL_MS);
    },
    end() { clearTimeout(this.timer); this.phase = 'end'; this.push(); },
    toLobby() {
      clearTimeout(this.timer);
      this.phase = 'lobby'; this.deck = []; this.qIndex = -1; this.reveal = null; this.answers = {};
      for (const [id, p] of Object.entries(this.players)) { if (!p.present) delete this.players[id]; else Object.assign(p, { floor: 0, streak: 0, correct: 0, ms: 0 }); }
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
  H.syncRoster({ [me.id]: me });
  H.start();
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
    // Wait for the host to send us the state
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
let endShownFor = null;

function applyState(st) {
  const prev = S; S = st;
  const amHost = !!H;

  if (st.phase === 'lobby') {
    shownQ = -1; revealedQ = -1; endShownFor = null;
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
    show('game');
    renderBuilding(st);
  }
  if (st.phase === 'end') {
    if (prev && prev.phase === 'reveal' && revealedQ !== st.qIndex && st.reveal) runReveal(st);
    const key = st.qIndex + ':' + Object.keys(st.players).length;
    if (endShownFor !== key) {
      endShownFor = key;
      const delay = prev && prev.phase === 'question' ? 0 : 0;
      setTimeout(() => renderEnd(st, amHost), delay);
    } else renderEnd(st, amHost, true);
  }
}

function renderLobby(st, amHost) {
  $('#roomCode').textContent = roomCode || 'SOLO';
  const players = Object.entries(st.players);
  $('#playerCount').textContent = players.length;
  $('#lobbyPlayers').innerHTML = players.map(([id, p]) =>
    `<li style="border-color:${p.color}55"><span class="av">${p.emoji}</span><span>${esc(p.name)}</span>${id === st.hostId ? '<span class="tag">HOST</span>' : id === me.id ? '<span class="tag">YOU</span>' : ''}</li>`
  ).join('');
  $('#settingsBox').style.display = amHost ? '' : 'none';
  $('#startBtn').style.display = amHost ? '' : 'none';
  $('#waitHost').style.display = amHost ? 'none' : '';
  $('#settingsSummary').textContent = amHost ? '' : `${st.settings.count} questions · ${st.settings.time}s each · ${st.settings.cat}`;
  if (amHost) {
    $('#setCount').value = st.settings.count; $('#setTime').value = st.settings.time; $('#setCat').value = st.settings.cat;
  }
}

function setupQuestion(st, noTimer = false) {
  shownQ = st.qIndex; myChoice = null;
  const q = st.q;
  $('#qCat').textContent = q.cat;
  $('#qProgress').textContent = `Q ${st.qIndex + 1} / ${st.total}`;
  $('#qText').textContent = q.text;
  $('#statusLine').textContent = 'Step into an elevator!';
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

function choose(i) {
  if (!S || S.phase !== 'question' || myChoice !== null) return;
  myChoice = i; sfx.click(); setTimeout(sfx.doors, 120);
  document.querySelectorAll('.elevator').forEach((el, idx) => {
    el.disabled = true;
    if (idx === i) {
      el.classList.add('mine', 'closed', 'riding');
      el.querySelector('.ev-riders').innerHTML = `<span>${me.emoji}</span>`;
    } else el.classList.add('dim');
  });
  $('#statusLine').textContent = 'Doors closing… going up? 🤞';
  if (H) H.answer(me.id, i);
  else send({ t: 'answer', d: { pid: me.id, choice: i } });
}

function closeAllDoors() {
  document.querySelectorAll('.elevator').forEach((el) => { el.disabled = true; el.classList.add('closed'); });
  if (myChoice === null) $('#statusLine').textContent = '⏰ Too slow — the doors closed!';
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
  const els = document.querySelectorAll('.elevator');
  els.forEach((el, idx) => {
    el.disabled = true;
    el.classList.remove('riding', 'closed', 'dim');
    const riders = Object.entries(r.picks).filter(([, c]) => c === idx).map(([id]) => st.players[id]).filter(Boolean);
    el.querySelector('.ev-riders').innerHTML = riders.map((p) => `<span title="${esc(p.name)}">${p.emoji}</span>`).join('');
    if (idx === r.correct) el.classList.add('correct');
    else if (riders.length || idx === myChoice) el.classList.add('wrong');
    else el.classList.add('dim');
    if (idx !== r.correct) el.querySelector('.ev-arrow').textContent = '▼';
  });
  // re-close & open for the "arrival" feel
  sfx.doors();

  const mine = st.players[me.id];
  const gain = r.gains[me.id] || 0;
  const picked = r.picks[me.id];
  if (picked === r.correct) {
    sfx.ding();
    const top = st.top;
    const label = floorLabel(mine.floor, top);
    ding(gain >= 2 ? `EXPRESS! ${label}` : mine.floor >= top ? 'ROOFTOP!' : `FLOOR ${label}`, 'good', '▲');
    $('#statusLine').textContent = gain >= 2 ? '🚀 3 in a row — express elevator, +2 floors!' : 'Ding! Correct — up you go!';
  } else if (picked === undefined) {
    sfx.buzz();
    $('#statusLine').textContent = `Missed it! The answer was ${LETTERS[r.correct]}: ${st.q.choices[r.correct]}`;
  } else {
    sfx.buzz();
    ding('STUCK!', 'bad', '▼');
    $('#statusLine').textContent = `Wrong stop! The answer was ${LETTERS[r.correct]}: ${st.q.choices[r.correct]}`;
  }
}

function ranked(players) {
  return Object.entries(players).sort(([, a], [, b]) => b.floor - a.floor || b.correct - a.correct || a.ms - b.ms);
}

function renderBuilding(st) {
  const top = st.top;
  const shaft = $('#shaft');
  const h = shaft.clientHeight || 300;
  const step = (h - 34) / top;
  let floors = '';
  const every = top > 12 ? 2 : 1;
  for (let f = 0; f <= top; f++) {
    if (f % every && f !== top) continue;
    floors += `<div class="floor ${f === top ? 'top' : ''}" style="bottom:${f * step}px;height:${step}px">${f === top ? '🏁 ROOF' : floorLabel(f, top)}</div>`;
  }
  // Group by floor so tokens don't overlap
  const byFloor = {};
  const tokens = Object.entries(st.players).map(([id, p]) => {
    const n = (byFloor[p.floor] = (byFloor[p.floor] || 0) + 1) - 1;
    return { id, p, n };
  });
  const tokHtml = tokens.map(({ id, p, n }) => {
    const left = 46 + ((n * 34) % 180);
    return `<div class="token ${id === me.id ? 'me' : ''} ${p.present ? '' : 'gone'}" data-id="${id}" style="--c:${p.color};bottom:${p.floor * step + 2}px;left:${left}px" title="${esc(p.name)}">${p.emoji}</div>`;
  }).join('');

  // Preserve existing token elements so CSS transitions animate
  const existing = {};
  shaft.querySelectorAll('.token').forEach((t) => (existing[t.dataset.id] = t));
  if (!shaft.querySelector('.floor') || shaft.dataset.top != top) {
    shaft.innerHTML = floors + tokHtml; shaft.dataset.top = top;
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
  $('#myFloor').textContent = meP ? floorLabel(meP.floor, top) : 'L';
  $('#standings').innerHTML = ranked(st.players).map(([id, p]) => {
    const lock = st.phase === 'question' && st.locked.includes(id) ? '<span class="lock" title="Locked in">🔒</span>' : '';
    return `<li class="${id === me.id ? 'me' : ''}" style="${p.present ? '' : 'opacity:.45'}"><span>${p.emoji}</span><span class="name">${esc(p.name)}</span>${lock}<span class="fl">${floorLabel(p.floor, top)}</span></li>`;
  }).join('');
}

function renderEnd(st, amHost, quiet = false) {
  show('end');
  const list = ranked(st.players);
  const top = st.top;
  const winner = list[0] && list[0][1];
  const myRank = list.findIndex(([id]) => id === me.id) + 1;
  $('#endTitle').textContent = winner && winner.floor >= top ? `${winner.name} reached the rooftop!` : list.length > 1 ? `${winner.name} rode highest!` : `You reached floor ${floorLabel(winner.floor, top)}!`;
  const order = [1, 0, 2];
  $('#podium').innerHTML = order.filter((i) => list[i]).map((i) => {
    const [, p] = list[i];
    const hgt = [130, 95, 70][i];
    return `<div class="pod p${i + 1}"><div class="av">${p.emoji}</div><div class="nm">${esc(p.name)}</div><div class="block" style="height:${hgt}px">${i + 1}</div></div>`;
  }).join('');
  $('#finalList').innerHTML = list.map(([id, p], i) =>
    `<li style="${id === me.id ? 'background:rgba(242,196,109,.14)' : ''}"><b>#${i + 1}</b><span>${p.emoji}</span><span class="name">${esc(p.name)}</span><span class="muted">${p.correct} correct</span><span class="fl">${floorLabel(p.floor, top)}</span></li>`
  ).join('');
  $('#againBtn').style.display = amHost ? '' : 'none';
  $('#endWait').style.display = amHost ? 'none' : '';
  if (!quiet && myRank === 1) sfx.win();
}

/* ---------------- Boot ---------------- */
initMenu();
show('menu');
