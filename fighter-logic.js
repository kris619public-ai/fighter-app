// fighter-logic.js
// Extracted from fighter-app.html — logic only (no exercise definitions, no program day data)

const SK = 'fp4_state', LK = 'fp4_sessions';
const _st = (()=>{ try { return JSON.parse(localStorage.getItem(SK)||'{}') } catch { return {} } })();
let _curEx = null, _curInt = null;

const TYPE_META = {
  strength:     { label:'Strength',     cls:'et-strength' },
  hold:         { label:'Hold',         cls:'et-hold' },
  rehab:        { label:'Rehab',        cls:'et-rehab' },
  skill:        { label:'Skill',        cls:'et-skill' },
  mobility:     { label:'Mobility',     cls:'et-mobility' },
  conditioning: { label:'Conditioning', cls:'et-conditioning' },
};
const REST_DEFAULTS = { strength:90, hold:60, skill:60, rehab:30, mobility:30, conditioning:45 };
const FIGHTER_RANKS = [
  { key:'novice',   name:'Novice',   sessionsNeeded:0,   arc:'The Foundation Arc' },
  { key:'disciple', name:'Disciple', sessionsNeeded:20,  arc:'The Awakening Arc' },
  { key:'fighter',  name:'Fighter',  sessionsNeeded:50,  arc:'The Refinement Arc' },
  { key:'elite',    name:'Elite',    sessionsNeeded:100, arc:'The Trial Arc' },
  { key:'master',   name:'Master',   sessionsNeeded:200, arc:'The Summit Arc' },
];
const FIGHTER_POSES = {
  novice: {
    stroke:'#b8e0a8', filter:'',
    inner: `
      <circle cx="80" cy="28" r="14" stroke-width="2.5" fill="none"/>
      <path d="M66 22 Q80 16 94 22" stroke-width="2" fill="none"/>
      <circle cx="75" cy="27" r="2" fill="#b8e0a8" stroke="none"/>
      <circle cx="85" cy="27" r="2" fill="#b8e0a8" stroke="none"/>
      <line x1="80" y1="42" x2="80" y2="52" stroke-width="2.5"/>
      <line x1="80" y1="55" x2="58" y2="65" stroke-width="3"/>
      <line x1="80" y1="55" x2="102" y2="65" stroke-width="3"/>
      <line x1="80" y1="52" x2="80" y2="100" stroke-width="3.5"/>
      <line x1="68" y1="88" x2="92" y2="88" stroke-width="2"/>
      <line x1="58" y1="65" x2="50" y2="82" stroke-width="2.5"/>
      <line x1="50" y1="82" x2="44" y2="96" stroke-width="2"/>
      <line x1="102" y1="65" x2="110" y2="82" stroke-width="2.5"/>
      <line x1="110" y1="82" x2="116" y2="96" stroke-width="2"/>
      <line x1="80" y1="100" x2="65" y2="106" stroke-width="3"/>
      <line x1="80" y1="100" x2="95" y2="106" stroke-width="3"/>
      <line x1="65" y1="106" x2="60" y2="140" stroke-width="2.5"/>
      <line x1="60" y1="140" x2="56" y2="160" stroke-width="2"/>
      <line x1="95" y1="106" x2="100" y2="140" stroke-width="2.5"/>
      <line x1="100" y1="140" x2="104" y2="160" stroke-width="2"/>
      <line x1="56" y1="160" x2="46" y2="163" stroke-width="2"/>
      <line x1="104" y1="160" x2="114" y2="163" stroke-width="2"/>`,
    auras:[], particles:false
  },
  disciple: {
    stroke:'#90d870', filter:'drop-shadow(0 0 8px rgba(100,200,80,.4))',
    inner: `
      <line x1="80" y1="54" x2="79" y2="96" stroke="rgba(140,220,80,.3)" stroke-width="10"/>
      <circle cx="80" cy="27" r="14" stroke-width="2.5" fill="none"/>
      <path d="M66 20 Q72 14 80 15 Q88 14 94 20" stroke-width="2" fill="none"/>
      <path d="M66 20 Q63 15 65 10" stroke-width="1.8" fill="none"/>
      <path d="M94 20 Q97 15 95 10" stroke-width="1.8" fill="none"/>
      <line x1="65" y1="24" x2="95" y2="24" stroke="#e84040" stroke-width="3"/>
      <path d="M95 24 L100 30" stroke="#e84040" stroke-width="2" fill="none"/>
      <circle cx="75" cy="26" r="2.2" fill="#90d870" stroke="none"/>
      <circle cx="85" cy="26" r="2.2" fill="#90d870" stroke="none"/>
      <line x1="72" y1="22" x2="78" y2="20" stroke-width="1.8"/>
      <line x1="82" y1="20" x2="88" y2="22" stroke-width="1.8"/>
      <line x1="80" y1="41" x2="80" y2="51" stroke-width="2.5"/>
      <line x1="80" y1="54" x2="56" y2="62" stroke-width="3"/>
      <line x1="80" y1="54" x2="104" y2="64" stroke-width="3"/>
      <line x1="80" y1="51" x2="79" y2="100" stroke-width="3.5"/>
      <line x1="68" y1="87" x2="90" y2="88" stroke-width="2"/>
      <line x1="56" y1="62" x2="44" y2="76" stroke-width="2.5"/>
      <line x1="44" y1="76" x2="36" y2="88" stroke-width="2"/>
      <line x1="104" y1="64" x2="116" y2="76" stroke-width="2.5"/>
      <line x1="116" y1="76" x2="122" y2="88" stroke-width="2"/>
      <line x1="79" y1="100" x2="64" y2="107" stroke-width="3"/>
      <line x1="79" y1="100" x2="95" y2="107" stroke-width="3"/>
      <line x1="64" y1="107" x2="58" y2="142" stroke-width="2.5"/>
      <line x1="58" y1="142" x2="54" y2="162" stroke-width="2"/>
      <line x1="95" y1="107" x2="100" y2="142" stroke-width="2.5"/>
      <line x1="100" y1="142" x2="104" y2="162" stroke-width="2"/>
      <line x1="54" y1="162" x2="44" y2="165" stroke-width="2"/>
      <line x1="104" y1="162" x2="114" y2="165" stroke-width="2"/>`,
    auras:['rgba(100,200,80,.5)'], particles:false
  },
  fighter: {
    stroke:'#70e050', filter:'drop-shadow(0 0 14px rgba(100,200,80,.55))',
    inner: `
      <line x1="80" y1="52" x2="80" y2="96" stroke="rgba(100,220,60,.4)" stroke-width="12"/>
      <circle cx="80" cy="26" r="14" stroke-width="3" fill="none"/>
      <path d="M66 18 Q72 10 80 12 Q88 10 94 18" stroke-width="2.2" fill="none"/>
      <path d="M66 18 Q60 10 62 4" stroke-width="2" fill="none"/>
      <path d="M94 18 Q100 10 98 4" stroke-width="2" fill="none"/>
      <path d="M80 12 Q78 5 80 1" stroke-width="2" fill="none"/>
      <line x1="65" y1="22" x2="95" y2="22" stroke="#cc1818" stroke-width="3.5"/>
      <path d="M65 22 L60 28 M95 22 L100 28" stroke="#cc1818" stroke-width="2" fill="none"/>
      <path d="M72 25 L76 22 L80 25" stroke-width="2" fill="none"/>
      <path d="M80 25 L84 22 L88 25" stroke-width="2" fill="none"/>
      <circle cx="76" cy="25" r="2.5" fill="#70e050" stroke="none"/>
      <circle cx="84" cy="25" r="2.5" fill="#70e050" stroke="none"/>
      <line x1="71" y1="20" x2="79" y2="18" stroke-width="2.2"/>
      <line x1="81" y1="18" x2="89" y2="20" stroke-width="2.2"/>
      <line x1="80" y1="40" x2="80" y2="50" stroke-width="3"/>
      <line x1="80" y1="53" x2="50" y2="60" stroke-width="3.5"/>
      <line x1="80" y1="53" x2="110" y2="60" stroke-width="3.5"/>
      <line x1="80" y1="50" x2="80" y2="100" stroke-width="4"/>
      <line x1="68" y1="86" x2="92" y2="86" stroke-width="2.5"/>
      <line x1="50" y1="60" x2="34" y2="68" stroke-width="3"/>
      <line x1="34" y1="68" x2="22" y2="56" stroke-width="2.5"/>
      <circle cx="20" cy="53" r="5" stroke-width="2" fill="none"/>
      <line x1="110" y1="60" x2="126" y2="50" stroke-width="3"/>
      <line x1="126" y1="50" x2="138" y2="38" stroke-width="2.5"/>
      <circle cx="141" cy="35" r="5" stroke-width="2" fill="none"/>
      <line x1="146" y1="28" x2="152" y2="22" stroke="#c0ff80" stroke-width="1.8"/>
      <line x1="148" y1="34" x2="156" y2="32" stroke="#c0ff80" stroke-width="1.8"/>
      <line x1="146" y1="40" x2="154" y2="42" stroke="#c0ff80" stroke-width="1.8"/>
      <line x1="74" y1="62" x2="68" y2="68" stroke="rgba(180,255,100,.6)" stroke-width="1.5"/>
      <line x1="86" y1="62" x2="92" y2="68" stroke="rgba(180,255,100,.6)" stroke-width="1.5"/>
      <line x1="80" y1="100" x2="62" y2="108" stroke-width="3.5"/>
      <line x1="80" y1="100" x2="98" y2="108" stroke-width="3.5"/>
      <line x1="62" y1="108" x2="54" y2="144" stroke-width="3"/>
      <line x1="54" y1="144" x2="48" y2="165" stroke-width="2.5"/>
      <line x1="98" y1="108" x2="106" y2="144" stroke-width="3"/>
      <line x1="106" y1="144" x2="112" y2="165" stroke-width="2.5"/>
      <line x1="48" y1="165" x2="36" y2="168" stroke-width="2.5"/>
      <line x1="112" y1="165" x2="124" y2="168" stroke-width="2.5"/>`,
    auras:['rgba(100,220,80,.65)','rgba(100,200,80,.3)'], particles:false
  },
  elite: {
    stroke:'#50f030', filter:'drop-shadow(0 0 20px rgba(120,240,80,.7)) drop-shadow(0 0 40px rgba(60,200,200,.25))',
    inner: `
      <line x1="80" y1="50" x2="80" y2="96" stroke="rgba(80,240,40,.35)" stroke-width="18"/>
      <circle cx="80" cy="26" r="14" stroke-width="3" fill="none"/>
      <path d="M66 17 Q72 8 80 10 Q88 8 94 17" stroke-width="2.5" fill="none"/>
      <path d="M66 17 Q58 6 60 -1" stroke-width="2.2" fill="none"/>
      <path d="M94 17 Q102 6 100 -1" stroke-width="2.2" fill="none"/>
      <path d="M80 10 Q78 2 80 -3" stroke-width="2.2" fill="none"/>
      <path d="M72 12 Q66 2 68 -2" stroke-width="2" fill="none"/>
      <path d="M88 12 Q94 2 92 -2" stroke-width="2" fill="none"/>
      <circle cx="60" cy="-1" r="2.5" fill="#a0ff60" stroke="none"/>
      <circle cx="100" cy="-1" r="2.5" fill="#a0ff60" stroke="none"/>
      <circle cx="80" cy="-3" r="3" fill="#c0ff80" stroke="none"/>
      <line x1="65" y1="21" x2="95" y2="21" stroke="#cc1818" stroke-width="3.5"/>
      <path d="M65 21 L58 26 M95 21 L102 26" stroke="#cc1818" stroke-width="2" fill="none"/>
      <circle cx="75" cy="25" r="3" fill="#80ff40" stroke="none"/>
      <circle cx="85" cy="25" r="3" fill="#80ff40" stroke="none"/>
      <circle cx="75" cy="25" r="5.5" fill="rgba(120,255,60,.25)" stroke="none"/>
      <circle cx="85" cy="25" r="5.5" fill="rgba(120,255,60,.25)" stroke="none"/>
      <line x1="70" y1="19" x2="78" y2="17" stroke-width="2.5"/>
      <line x1="82" y1="17" x2="90" y2="19" stroke-width="2.5"/>
      <line x1="80" y1="40" x2="80" y2="50" stroke-width="3"/>
      <line x1="80" y1="53" x2="48" y2="58" stroke-width="3.5"/>
      <line x1="80" y1="53" x2="112" y2="58" stroke-width="3.5"/>
      <line x1="80" y1="50" x2="80" y2="98" stroke-width="4"/>
      <line x1="68" y1="85" x2="92" y2="85" stroke-width="2.5"/>
      <line x1="48" y1="58" x2="24" y2="46" stroke-width="3.5"/>
      <line x1="24" y1="46" x2="10" y2="36" stroke-width="3"/>
      <circle cx="7" cy="33" r="5.5" stroke-width="2.2" fill="none"/>
      <line x1="112" y1="58" x2="136" y2="46" stroke-width="3.5"/>
      <line x1="136" y1="46" x2="150" y2="36" stroke-width="3"/>
      <circle cx="153" cy="33" r="5.5" stroke-width="2.2" fill="none"/>
      <line x1="2" y1="27" x2="-2" y2="22" stroke="#d0ff80" stroke-width="1.8"/>
      <line x1="1" y1="33" x2="-4" y2="33" stroke="#d0ff80" stroke-width="1.8"/>
      <line x1="3" y1="38" x2="-1" y2="42" stroke="#d0ff80" stroke-width="1.8"/>
      <line x1="158" y1="27" x2="162" y2="22" stroke="#d0ff80" stroke-width="1.8"/>
      <line x1="159" y1="33" x2="164" y2="33" stroke="#d0ff80" stroke-width="1.8"/>
      <line x1="157" y1="38" x2="161" y2="42" stroke="#d0ff80" stroke-width="1.8"/>
      <line x1="80" y1="98" x2="52" y2="116" stroke-width="3.5"/>
      <line x1="52" y1="116" x2="30" y2="124" stroke-width="3"/>
      <line x1="30" y1="124" x2="16" y2="120" stroke-width="3"/>
      <line x1="80" y1="98" x2="104" y2="118" stroke-width="3.5"/>
      <line x1="104" y1="118" x2="116" y2="148" stroke-width="3"/>
      <line x1="116" y1="148" x2="118" y2="168" stroke-width="2.5"/>`,
    auras:['rgba(120,240,80,.8)','rgba(60,200,220,.45)','rgba(100,210,80,.2)'], particles:true
  },
  master: {
    stroke:'#d0ffb0', filter:'drop-shadow(0 0 28px rgba(180,255,110,.9)) drop-shadow(0 0 50px rgba(210,160,255,.4))',
    inner: `
      <line x1="80" y1="42" x2="80" y2="100" stroke="rgba(220,255,180,.5)" stroke-width="22"/>
      <line x1="80" y1="42" x2="80" y2="100" stroke="rgba(255,255,240,.3)" stroke-width="10"/>
      <line x1="80" y1="72" x2="10" y2="40" stroke="rgba(200,255,160,.12)" stroke-width="1" stroke-dasharray="4 6"/>
      <line x1="80" y1="72" x2="150" y2="40" stroke="rgba(200,255,160,.12)" stroke-width="1" stroke-dasharray="4 6"/>
      <line x1="80" y1="72" x2="10" y2="110" stroke="rgba(200,255,160,.1)" stroke-width="1" stroke-dasharray="4 6"/>
      <line x1="80" y1="72" x2="150" y2="110" stroke="rgba(200,255,160,.1)" stroke-width="1" stroke-dasharray="4 6"/>
      <circle cx="80" cy="25" r="14" stroke-width="3" fill="rgba(220,255,200,.08)"/>
      <circle cx="80" cy="25" r="8" stroke="rgba(200,255,160,.3)" stroke-width="1" fill="none"/>
      <path d="M66 16 Q72 7 80 9 Q88 7 94 16" stroke-width="2.5" fill="none"/>
      <path d="M66 16 Q58 5 60 -2" stroke-width="2.2" fill="none" stroke-dasharray="5 3"/>
      <path d="M94 16 Q102 5 100 -2" stroke-width="2.2" fill="none" stroke-dasharray="5 3"/>
      <path d="M80 9 Q78 1 80 -4" stroke-width="2.5" fill="none" stroke-dasharray="6 2"/>
      <circle cx="60" cy="-2" r="3" fill="rgba(200,255,160,.9)" stroke="none"/>
      <circle cx="100" cy="-2" r="3" fill="rgba(200,255,160,.9)" stroke="none"/>
      <circle cx="80" cy="-4" r="4" fill="rgba(230,255,200,.95)" stroke="none"/>
      <path d="M72 24 Q75 21 78 24" stroke-width="2.2" fill="none"/>
      <path d="M82 24 Q85 21 88 24" stroke-width="2.2" fill="none"/>
      <line x1="71" y1="20" x2="78" y2="19" stroke-width="1.5"/>
      <line x1="82" y1="19" x2="89" y2="20" stroke-width="1.5"/>
      <line x1="80" y1="39" x2="80" y2="50" stroke-width="2.5"/>
      <line x1="80" y1="53" x2="44" y2="46" stroke-width="3.5"/>
      <line x1="80" y1="53" x2="116" y2="46" stroke-width="3.5"/>
      <line x1="44" y1="46" x2="22" y2="38" stroke-width="3"/>
      <line x1="22" y1="38" x2="8" y2="28" stroke-width="2.5" stroke-dasharray="6 2"/>
      <line x1="116" y1="46" x2="138" y2="38" stroke-width="3"/>
      <line x1="138" y1="38" x2="152" y2="28" stroke-width="2.5" stroke-dasharray="6 2"/>
      <circle cx="6" cy="25" r="4" fill="rgba(210,255,180,.7)" stroke="none"/>
      <circle cx="154" cy="25" r="4" fill="rgba(210,255,180,.7)" stroke="none"/>
      <line x1="80" y1="50" x2="80" y2="100" stroke-width="4"/>
      <line x1="66" y1="86" x2="94" y2="86" stroke-width="2"/>
      <line x1="80" y1="100" x2="62" y2="108" stroke-width="3"/>
      <line x1="80" y1="100" x2="98" y2="108" stroke-width="3"/>
      <line x1="62" y1="108" x2="56" y2="140" stroke-width="2.5" stroke-dasharray="8 3"/>
      <line x1="98" y1="108" x2="104" y2="140" stroke-width="2.5" stroke-dasharray="8 3"/>
      <circle cx="50" cy="163" r="4" fill="rgba(200,255,170,.5)" stroke="none"/>
      <circle cx="110" cy="163" r="4" fill="rgba(200,255,170,.5)" stroke="none"/>`,
    auras:['rgba(180,255,110,.9)','rgba(100,210,255,.6)','rgba(210,160,255,.4)'], particles:true
  }
};
const BS_LOGGED = {
  monday: [
    { title: "The Iron Does Not Lie.", text: "Strength was built today. Your body remembers every rep. <strong>Monday belonged to you.</strong>" },
    { title: "Again. And Again.", text: "The rings demanded control. You gave it. <strong>The foundation holds.</strong>" },
    { title: "You Showed Up.", text: "That is the whole discipline. <strong>Everything else follows from this.</strong>" },
    { title: "Heavier Than Yesterday.", text: "Not in weight. In intention. <strong>The body reads the difference.</strong>" },
  ],
  tuesday: [
    { title: "Stillness Is Work.", text: "Mobility sessions are invisible strength. <strong>The fighter who cannot move cannot fight.</strong>" },
    { title: "The Hips Do Not Forget.", text: "Every hold chips away at the restriction. <strong>Slowly. Then suddenly.</strong>" },
    { title: "Restoration Is Not Rest.", text: "Today you built range. <strong>Range becomes power.</strong>" },
    { title: "Breathe Into It.", text: "Tension releases in the exhale. <strong>You practiced this today.</strong>" },
  ],
  wednesday: [
    { title: "The Midpoint.", text: "Wednesday is where weak weeks end. <strong>You did not end yours here.</strong>" },
    { title: "Conditioning Does Not Negotiate.", text: "You met the demand. <strong>The arc continues.</strong>" },
    { title: "Form Under Fatigue.", text: "Anyone can move when fresh. <strong>Today you moved correctly when it was hard.</strong>" },
    { title: "Halfway Belongs To You.", text: "Three days remain. <strong>The arc bends forward.</strong>" },
  ],
  thursday: [
    { title: "Depth Over Speed.", text: "Longer holds. Slower tempo. <strong>This is where mobility actually changes.</strong>" },
    { title: "The Patient Work.", text: "Thursday sessions accumulate silently. <strong>In six months you will feel today.</strong>" },
    { title: "The Body Keeps Score.", text: "Every second of hold time is a deposit. <strong>You made a deposit today.</strong>" },
    { title: "Recovery Is Training.", text: "Not every session ends with sweat. <strong>Some end with range.</strong>" },
  ],
  friday: [
    { title: "The Week Is Sealed.", text: "Five days. All of them yours. <strong>The arc does not forget.</strong>" },
    { title: "End Strong.", text: "The rings asked more on Friday. <strong>You answered.</strong>" },
    { title: "What You Built This Week:", text: "Strength. Range. Control. Patience. <strong>None of it disappears.</strong>" },
    { title: "The Week Closes.", text: "Rest was earned. <strong>Monday will ask again. You already know the answer.</strong>" },
  ],
};
const BS_MISSED = {
  monday: [
    { title: "The Week Starts Without You.", text: "Monday waited. <strong>Tuesday does not have to.</strong>" },
    { title: "One Session. Not One Week.", text: "The arc does not collapse from a single absence. <strong>Show up tomorrow.</strong>" },
  ],
  tuesday: [
    { title: "The Hips Are Still Waiting.", text: "The restriction does not rest when you do. <strong>Wednesday exists.</strong>" },
    { title: "A Gap In The Arc.", text: "Not a break. A gap. <strong>Gaps can be closed.</strong>" },
  ],
  wednesday: [
    { title: "The Midpoint Passed.", text: "It happens. <strong>The week still has two days.</strong>" },
    { title: "Wednesday Is Gone.", text: "Thursday is not. <strong>The arc bends toward whoever shows up.</strong>" },
  ],
  thursday: [
    { title: "The Deep Work Was Skipped.", text: "The hips and the tissue know. <strong>They do not punish. They wait.</strong>" },
    { title: "Absent From The Arc.", text: "One missed session leaves a gap. <strong>Friday can still close it.</strong>" },
  ],
  friday: [
    { title: "The Week Ends Unfinished.", text: "Not failed. Unfinished. <strong>There is a difference. Monday will come.</strong>" },
    { title: "Four Of Five.", text: "Eighty percent is not nothing. <strong>But the week remembers the gap.</strong>" },
  ],
};
const ARC_CLASSES = [
  { name:'Novice',   sessionsNeeded:0,   title:'The Foundation Arc',  xpNeeded:20  },
  { name:'Disciple', sessionsNeeded:20,  title:'The Awakening Arc',   xpNeeded:50  },
  { name:'Fighter',  sessionsNeeded:50,  title:'The Refinement Arc',  xpNeeded:100 },
  { name:'Elite',    sessionsNeeded:100, title:'The Trial Arc',       xpNeeded:200 },
  { name:'Master',   sessionsNeeded:200, title:'The Summit Arc',      xpNeeded:999 },
];
window.ARC_CLASSES = ARC_CLASSES;

// ─── Timer state ────────────────────────────────────────────────────────────
let _timerTotal  = 90;
let _timerLeft   = 90;
let _timerPaused = false;
let _timerDone   = false;
let _timerTick   = null;
let _pendingEx   = null;
let _pendingType = null;
const CIRC       = 94.25; // 2 * π * 15 (timer SVG arc radius)

// ─── General timer state (fullscreen countdown — separate from rest pill) ────
let _gtTotal  = 60;
let _gtLeft   = 60;
let _gtPaused = false;
let _gtDone   = false;
let _gtTick   = null;

// ─── Progress panel tab state ───────────────────────────────────────────────
function renderProgressShell() {
  const pills = [
    { id:'fighter',   l:'Fighter' },
    { id:'skills',    l:'Skills' },
    { id:'history',   l:'History' },
    { id:'chronicle', l:'Chronicle' },
  ];
  const chips = pills.map(p =>
    '<button class="day-chip prog-pill" data-prog="'+p.id+'" onclick="switchProg(\''+p.id+'\')">'+p.l+'</button>'
  ).join('');
  return '<div class="train-day-bar prog-pill-bar">'+chips+'</div>'
    + '<div id="prog-content"></div>';
}

let _view = 'train', _day = null, _moreTab = 'skills';

// ─── Utilities ───────────────────────────────────────────────────────────────
function getDayOfWeek() {
  return ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
}

// ─── Overview live render ─────────────────────────────────────────────────────
function renderOverview() {
  const total = loadSess().length;
  const phase = getPhase();

  // Arc eyebrow — phase number
  const eyebrow = document.querySelector('.arc-eyebrow');
  if (eyebrow) eyebrow.textContent = 'Training Arc · Phase ' + phase;

  // Insight text — session-count buckets
  let insightText;
  if (total === 0)       insightText = 'Begin your first session.';
  else if (total <= 10)  insightText = 'Foundation building — consistency is the work.';
  else if (total <= 30)  insightText = 'The habit is forming. Push the progressions.';
  else if (total <= 50)  insightText = 'You\'re past the hard part. Most people quit here.';
  else                   insightText = 'This is who you are now.';

  const insightEl = document.getElementById('arc-insight-text');
  if (insightEl) insightEl.textContent = insightText;

  // Phase cards — wire tap to setPhase + highlight current
  document.querySelectorAll('.phase-card').forEach((card, i) => {
    const n = i + 1;
    card.style.cursor = 'pointer';
    card.classList.toggle('phase-active', n === phase);
    card.onclick = () => setPhase(n);
  });
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function navigate(view, sub) {
  _view = view;
  document.querySelectorAll('.ntab').forEach(b => b.classList.remove('on'));
  const btn = document.querySelector('.ntab[data-view="'+view+'"]');
  if (btn) btn.classList.add('on');
  const app = document.getElementById('app');
  if (!app) return;

  if (view === 'overview') {
    app.innerHTML = OVERVIEW_HTML;
    app.querySelectorAll('[data-day]').forEach(el => {
      const d = el.dataset.day; if (d) el.onclick = () => navigate('train', d);
    });
    renderOverview();
  } else if (view === 'train') {
    const labels = { monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu', friday:'Fri' };
    const chips = ['monday','tuesday','wednesday','thursday','friday']
      .map(d => '<button class="day-chip" data-day="'+d+'" onclick="switchDay(\''+d+'\')">'+labels[d]+'</button>').join('');
    app.innerHTML = '<div class="train-day-bar">'+chips+'</div><div id="day-content"></div>';
    const valid = ['monday','tuesday','wednesday','thursday','friday'];
    const tod = getDayOfWeek();
    _day = sub && valid.includes(sub) ? sub : (_day && valid.includes(_day) ? _day : (valid.includes(tod) ? tod : 'monday'));
    renderDay(_day);
  } else if (view === 'fighter') {
    app.innerHTML = buildFighterShell();
    renderFighterPanel();
  } else if (view === 'progress') {
    app.innerHTML = renderProgressShell();
    switchProg(sub || _progTab || 'fighter');
  } else if (view === 'more') {
    const tabs = [{ id:'skills', l:'Skills' }, { id:'strategy', l:'Back & Knee' }, { id:'prompt', l:'AI Tool' }];
    const chips = tabs.map(t => '<button class="day-chip" data-more="'+t.id+'" onclick="activateMoreTab(\''+t.id+'\')">'+t.l+'</button>').join('');
    app.innerHTML = '<div class="train-day-bar">'+chips+'</div><div id="more-content"></div>';
    activateMoreTab(sub || _moreTab);
  }
  const nav = document.querySelector('.nav');
  if (nav) window.scrollTo({ top: nav.offsetTop - 4, behavior: 'smooth' });
}

function show(id)      { navigate(id); }
function showMain(id)  { navigate(id); }
function showTrain(d)  { navigate('train', d); }

function switchDay(day) {
  _day = day;
  const tod = getDayOfWeek();
  document.querySelectorAll('.day-chip[data-day]').forEach(c => {
    c.classList.toggle('on', c.dataset.day === day);
    c.classList.toggle('today-chip', c.dataset.day === tod && c.dataset.day !== day);
  });
  const el = document.getElementById('day-content');
  if (!el) return;
  el.innerHTML = buildDayHTML(day);
  document.querySelectorAll('#day-content .ex[data-id]').forEach(e => buildEx(e));
  refreshSessBar(day);
}

function renderDay(day) {
  _day = day;
  const tod = getDayOfWeek();
  document.querySelectorAll('.day-chip[data-day]').forEach(c => {
    c.classList.toggle('on', c.dataset.day === day);
    c.classList.toggle('today-chip', c.dataset.day === tod && c.dataset.day !== day);
  });
  const el = document.getElementById('day-content');
  if (!el) return;
  el.innerHTML = buildDayHTML(day);
  document.querySelectorAll('#day-content .ex[data-id]').forEach(e => buildEx(e));
  refreshSessBar(day);
}

// ─── Day HTML builder ────────────────────────────────────────────────────────
function buildDayHTML(day) {
  const d = PROGRAM[day];
  if (!d) return '<p style="padding:20px">No program for '+day+'</p>';
  const nums = ['01','02','03','04','05','06','07','08'];
  let h = '<div id="sb-'+day+'" class="sess-bar" style="display:none"></div>';
  if (d.warmup) h += '<div class="wcu"><strong>Warm-up — 5 min</strong>'+d.warmup+'</div>';
  d.blocks.forEach((b, i) => {
    const dn = b.danger;
    h += '<div class="block"><div class="block-hd"'+(dn?' style="background:var(--red-bg);border-color:rgba(192,57,43,.2)"':'')+'>'; 
    h += '<div class="block-num"'+(dn?' style="color:var(--red)"':'')+'>'+(nums[i]||i+1)+'</div>';
    h += '<div class="block-info"><div class="block-title"'+(dn?' style="color:var(--red)"':'')+'>'+( b.title||'')+'</div>';
    h += '<div class="block-meta"'+(dn?' style="color:#a05040"':'')+'>'+( b.meta||'')+'</div></div></div>';
    if (b.note) h += '<div class="block-note'+(dn?' danger':'')+'">'+b.note+'</div>';
    h += '<div class="exlist">'+b.exercises.map(id => '<div class="ex" data-id="'+id+'"></div>').join('')+'</div></div>';
  });
  if (d.cooldown) h += '<div class="wcu"><strong>Cool-down — 5 min</strong>'+d.cooldown+'</div>';
  return h;
}

// ─── Fighter panel shell ─────────────────────────────────────────────────────
function buildFighterShell() {
  const hexSvg = '<svg id="fp-hex-svg" width="280" height="280" viewBox="0 0 280 280">'
    + '<defs><filter id="fp-hex-glow"><feGaussianBlur stdDeviation="3" result="blur"/>'
    + '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
    + '<g id="fp-hex-grid"></g>'
    + '<polygon id="fp-hex-fill" points="140,140" fill="rgba(80,200,60,.25)" stroke="rgba(130,240,90,.9)" stroke-width="1.5" filter="url(#fp-hex-glow)"/>'
    + '<g id="fp-hex-labels" font-size="11" font-family="DM Mono,monospace" fill="rgba(200,240,180,.7)" text-anchor="middle"></g>'
    + '<g id="fp-hex-dots"></g>'
    + '<text id="fp-hex-center-label" x="140" y="148" text-anchor="middle" font-size="10" font-family="DM Mono,monospace" fill="rgba(200,240,180,.5)" display="none">Log a session to build your radar</text>'
    + '</svg>';

  return '<div class="panel-inner fighter-panel-outer">'
    + '<div class="fp-rank-card" id="fp-current-card">'
    + '<div class="fp-rank-fig" id="fp-current-fig"></div>'
    + '<div class="fp-rank-name" id="fp-current-rank">Novice</div>'
    + '<div class="fp-rank-arc"  id="fp-current-arc">The Foundation Arc</div>'
    + '<div class="fp-rank-prog-wrap">'
    + '<div class="fp-rank-prog-bar"><div class="fp-rank-prog-fill" id="fp-rank-fill"></div></div>'
    + '<div class="fp-rank-prog-label" id="fp-current-next"></div>'
    + '</div>'
    + '<div class="fp-rank-sess" id="fp-current-sess"></div>'
    + '</div>'
    + '<div class="fp-evo-label">Your Path</div>'
    + '<div class="fighter-panel-grid" id="fighter-panel-grid"></div>'
    + '<div class="fp-evo-label" style="margin-top:24px">Skill Shape</div>'
    + '<div id="fp-hex-wrap" class="prog-hex-wrap">' + hexSvg
    + '<div class="prog-hex-legend" id="fp-hex-legend"></div></div>'
    + '</div>';
}

function activateMoreTab(id) {
  _moreTab = id;
  document.querySelectorAll('[data-more]').forEach(c => c.classList.toggle('on', c.dataset.more === id));
  const el = document.getElementById('more-content');
  if (!el) return;
  if (id === 'skills')   el.innerHTML = MORE_SKILLS_HTML;
  if (id === 'strategy') el.innerHTML = MORE_STRATEGY_HTML;
  if (id === 'prompt')   el.innerHTML = MORE_PROMPT_HTML;
}

// ─── localStorage helpers ────────────────────────────────────────────────────
function loadSt()    { try { return JSON.parse(localStorage.getItem(SK)||'{}') } catch { return {} } }
function saveSt(o)   { try { localStorage.setItem(SK, JSON.stringify(o)) } catch {} }
function loadSess()  { try { return JSON.parse(localStorage.getItem(LK)||'[]') } catch { return [] } }
function saveSess(a) { try { localStorage.setItem(LK, JSON.stringify(a)) } catch {} }
function loadArc()   { try { return JSON.parse(localStorage.getItem(AK)||'null') } catch { return null } }
function saveArc(d)  { try { localStorage.setItem(AK, JSON.stringify(d)) } catch {} }

// ─── Phase persistence ───────────────────────────────────────────────────────
function getPhase()  { return parseInt(localStorage.getItem('fp4_phase') || '1', 10); }
function setPhase(n) {
  localStorage.setItem('fp4_phase', String(n));
  // Highlight active phase card if overview is visible
  document.querySelectorAll('.phase-card').forEach((c, i) => {
    c.classList.toggle('phase-active', (i + 1) === n);
  });
}

// ─── Exercise state helpers ──────────────────────────────────────────────────
function gs(id) {
  const el = document.getElementById(id);
  if (!_st[id]) _st[id] = { sets: el.dataset.sets||'3', reps: el.dataset.reps||'10', note:'', iIdx:1 };
  return _st[id];
}

function persist() { saveSt(_st); }

function calcNext(exId, curSets, curReps) {
  const el = document.getElementById(exId);
  if (!el) return null;
  const s = gs(exId);
  const opts = JSON.parse(el.dataset.intensities || '[]');
  const repsNum = parseInt(curReps);
  const setsNum = parseInt(curSets);
  if (!repsNum) return null;

  const repCeiling = 12;
  const curIdx = s.iIdx || 0;

  if (repsNum >= repCeiling && curIdx < opts.length - 1) {
    const nextOpt = opts[curIdx + 1];
    return { next: `Move to: ${nextOpt.l} — ${nextOpt.d}`, intensityUp: true };
  } else if (repsNum >= repCeiling) {
    return { next: 'Max intensity reached — maintain and refine form', intensityUp: false };
  } else {
    const nextReps = repsNum + 1;
    const setsTarget = setsNum < 4 ? setsNum + 1 : setsNum;
    if (setsTarget > setsNum) return { next: `${setsTarget}×${curReps}`, intensityUp: false };
    return { next: `${curSets}×${nextReps}`, intensityUp: false };
  }
}

function getNextTarget(exId) {
  const s = gs(exId);
  return calcNext(exId, s.sets, s.reps);
}

// ─── Session bar ─────────────────────────────────────────────────────────────
function refreshSessBar(day) {
  const bar = document.getElementById('sb-'+day);
  if (!bar) return;
  const sessions = loadSess().filter(s => s.day === day).sort((a,b) => b.ts - a.ts);
  const last = sessions[0];
  bar.style.display = 'block';

  let topHtml = '';
  if (last) {
    const d = new Date(last.ts);
    const ds = d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
    const ts = d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    const sessNote = last.sessionNote
      ? `<span class="sb-val" style="font-style:italic">"${last.sessionNote.slice(0,60)}${last.sessionNote.length>60?'…':''}"</span>`
      : `<span class="sb-val">${last.count} exercises logged</span>`;
    topHtml = `<div class="sb-dot"></div>
      <span class="sb-label">Last Session</span>
      ${sessNote}
      <span class="sb-date">${ds} · ${ts}</span>
      <button class="sb-btn" onclick="openLogModal('${day}')">History</button>`;
  } else {
    topHtml = `<div class="sb-dot" style="background:var(--muted2)"></div>
      <span class="sb-label">No sessions yet</span>
      <span class="sb-val">Add a note below and tap Log when done</span>`;
  }

  bar.innerHTML = `
    <div class="sb-top">${topHtml}</div>
    <div class="sb-note-row">
      <div class="sb-note-wrap">
        <label class="sb-note-lbl" for="sb-note-${day}">Session note (optional)</label>
        <textarea class="sb-note-input" id="sb-note-${day}" rows="1"
          placeholder="How it felt · energy level · anything to remember…"
          oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button class="sb-log-btn" id="sb-log-btn-${day}" onclick="logSession('${day}')">Log Today ✓</button>
        <button class="sb-btn sb-btn-reset" onclick="clearTodaySets('${day}')">Reset today's sets</button>
      </div>
    </div>`;

  injectLastRows(day);
}

function refreshSessBarEl(barEl, day) {
  const sessions = loadSess().filter(s => s.day === day).sort((a,b) => b.ts - a.ts);
  const last = sessions[0];
  if (!last) return;
  barEl.style.display = 'flex';
  barEl.innerHTML = `<span class='sb-date'>${new Date(last.ts).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span><span class='sb-vol'>${last.exercises?.length||0} exercises</span>`;
}

function injectLastRows(day) {
  const sessions = loadSess().filter(s => s.day === day).sort((a,b) => b.ts - a.ts);
  if (!sessions.length) return;
  const panel = document.getElementById('day-content') || document.getElementById(day);
  if (!panel) return;
  panel.querySelectorAll('.ex[data-name]').forEach(el => {
    if (!el.id) return;
    el.querySelectorAll('.ex-last-row').forEach(r => r.remove());
    let lastEntry = null;
    for (const sess of sessions) {
      const e = sess.entries && sess.entries.find(x => x.id === el.id);
      if (e) { lastEntry = { ...e, ts: sess.ts }; break; }
    }
    if (!lastEntry) return;
    const ds = new Date(lastEntry.ts).toLocaleDateString('en-US', { month:'short', day:'numeric' });
    const row = document.createElement('div');
    row.className = 'ex-last-row visible';
    const noteSnip = lastEntry.note ? `<span class="lr-note">"${lastEntry.note.slice(0,50)}${lastEntry.note.length>50?'…':''}"</span>` : '';
    row.innerHTML = `<span class="lr-lbl">Last</span>
      <span class="lr-vol">${lastEntry.sets}×${lastEntry.reps}</span>
      ${lastEntry.intensity ? `<span class="lr-int">· ${lastEntry.intensity}</span>` : ''}
      ${noteSnip}
      <span class="lr-date">${ds}</span>`;
    el.appendChild(row);
  });
}

// ─── Session logging ─────────────────────────────────────────────────────────
function logSession(day) {
  window._lastLoggedDay = day;
  const panel = document.getElementById('day-content') || document.getElementById(day);
  const entries = [];
  if (!panel) return;
  panel.querySelectorAll('.ex[data-name]').forEach(el => {
    if (!el.id) return;
    const s = gs(el.id);
    const opts = JSON.parse(el.dataset.intensities || '[]');
    const iOpt = opts[s.iIdx] || null;
    const setKey = 'setlog_' + el.id;
    const today  = new Date().toDateString();
    const setLog = JSON.parse(localStorage.getItem(setKey) || '{}');
    const setsLogged = (setLog.date === today) ? (setLog.sets || []) : [];
    entries.push({ id:el.id, name:el.dataset.name, sets:s.sets, reps:s.reps,
                   note:s.note, intensity:iOpt?iOpt.l:null, exType:el.dataset.exType,
                   iIdx:s.iIdx||0, setsLogged });
  });

  const sessionNoteEl = document.getElementById('sb-note-'+day);
  const sessionNote = sessionNoteEl ? sessionNoteEl.value.trim() : '';

  // ── Streak date picker ──────────────────────────────────────────────────────
  // Build 3rd option: previous weekday if today is Monday, else Friday
  const _now = new Date();
  const _dow = _now.getDay(); // 0=Sun,1=Mon…6=Sat
  let _prevLabel = null, _prevOffset = null;
  if (_dow === 1) { // Monday → show Friday
    _prevLabel = 'Friday'; _prevOffset = 3;
  } else if (_dow === 2) { // Tuesday → show Monday
    _prevLabel = 'Monday'; _prevOffset = 1;
  } else if (_dow === 3) {
    _prevLabel = 'Tuesday'; _prevOffset = 1;
  } else if (_dow === 4) {
    _prevLabel = 'Wednesday'; _prevOffset = 1;
  } else if (_dow === 5) {
    _prevLabel = 'Thursday'; _prevOffset = 1;
  } else {
    _prevLabel = null; // weekend — only Today/Yesterday
  }

  function _buildSessionTs(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    d.setHours(0, 0, 0, 0);
    // Use current wall-clock time-of-day within that date
    const nowMs = new Date();
    return d.getTime() + nowMs.getHours() * 3600000 + nowMs.getMinutes() * 60000 + nowMs.getSeconds() * 1000;
  }

  function _doSaveSession(ts) {
    const sessions = loadSess();
    sessions.push({ day, ts, count: entries.length, entries, exercises: entries, sessionNote });
    while (sessions.length > 80) sessions.shift();
    saveSess(sessions);
    const logBtn = document.getElementById('sb-log-btn-' + day);
    if (logBtn) { logBtn.textContent = 'Logged ✓'; logBtn.disabled = true; }
    // Remove sheet
    const _sheet = document.getElementById('session-date-sheet');
    if (_sheet) _sheet.remove();
    const _ov = document.getElementById('session-date-overlay');
    if (_ov) _ov.remove();
    refreshSessBar(day);
    showProgressionSummary(entries, day);
  }

  // Inject bottom sheet
  const _existSheet = document.getElementById('session-date-sheet');
  if (_existSheet) _existSheet.remove();
  const _existOv = document.getElementById('session-date-overlay');
  if (_existOv) _existOv.remove();

  const _overlay = document.createElement('div');
  _overlay.id = 'session-date-overlay';
  _overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1200;';

  const _sheet = document.createElement('div');
  _sheet.id = 'session-date-sheet';
  _sheet.style.cssText = [
    'position:fixed;bottom:0;left:0;right:0;z-index:1201;',
    'background:var(--surface,#fff);border-radius:18px 18px 0 0;',
    'padding:24px 20px 36px;box-shadow:0 -4px 32px rgba(0,0,0,.25);',
    'font-family:Inter,sans-serif;',
  ].join('');

  const _opts = [
    { label: 'Today',     offset: 0 },
    { label: 'Yesterday', offset: 1 },
  ];
  if (_prevLabel) _opts.push({ label: _prevLabel, offset: _prevOffset });

  _sheet.innerHTML =
    '<div style="width:36px;height:4px;background:rgba(0,0,0,.18);border-radius:2px;margin:0 auto 20px"></div>'
    + '<div style="font-size:15px;font-weight:700;color:var(--text1,#1a1a1a);margin-bottom:16px;text-align:center">When was this session?</div>'
    + _opts.map(o =>
        `<button onclick="window._sessionDatePick(${o.offset})" style="display:block;width:100%;padding:14px 16px;margin-bottom:10px;`
        + `border-radius:10px;border:1.5px solid var(--border,#ddd);background:var(--bg,#f0ece6);`
        + `font-size:15px;font-weight:600;color:var(--text1,#1a1a1a);cursor:pointer;text-align:center;">${o.label}</button>`
      ).join('');

  window._sessionDatePick = function(offset) {
    delete window._sessionDatePick;
    _doSaveSession(_buildSessionTs(offset));
  };

  document.body.appendChild(_overlay);
  document.body.appendChild(_sheet);
  // Tapping overlay = Today (safe default)
  _overlay.addEventListener('click', () => { if (window._sessionDatePick) window._sessionDatePick(0); });
  // Early return — save happens inside _doSaveSession callback
  return;
}

function showProgressionSummary(entries, day) {
  const sessions = loadSess();
  const total    = sessions.length;
  const streak   = arcComputeStreak(sessions);
  const cur      = FIGHTER_RANKS.filter(r => total >= r.sessionsNeeded).pop() || FIGHTER_RANKS[0];
  const next     = FIGHTER_RANKS.find(r => total < r.sessionsNeeded);

  const suggestions = [];
  entries.forEach(e => {
    const nextSug = calcNext(e.id, e.sets, e.reps);
    if (nextSug) suggestions.push({ name: e.name, current: `${e.sets}×${e.reps}`, next: nextSug, exType: e.exType });
  });

  const dayName  = day.charAt(0).toUpperCase() + day.slice(1);
  const streakTxt = streak > 1 ? `${streak} sessions in a row 🔥` : `Session ${total} complete`;

  const titleEl = document.getElementById('prog-modal-title');
  if (titleEl) titleEl.innerHTML =
    `<div style="font-size:32px;margin-bottom:4px">✓</div>`
    + `<div style="font-size:20px;font-weight:800;color:var(--green-dk)">${dayName} Done.</div>`
    + `<div style="font-size:12px;font-weight:500;color:var(--green-md);margin-top:4px">${streakTxt}</div>`;

  const statsHtml =
    `<div style="display:flex;gap:0;border-radius:10px;overflow:hidden;margin-bottom:16px;border:1px solid var(--border)">`
    + `<div style="flex:1;padding:12px 8px;text-align:center;border-right:1px solid var(--border)">`
    +   `<div style="font-size:22px;font-weight:800;color:var(--green-dk);font-family:'DM Mono',monospace">${total}</div>`
    +   `<div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--text3)">Sessions</div></div>`
    + `<div style="flex:1;padding:12px 8px;text-align:center;border-right:1px solid var(--border)">`
    +   `<div style="font-size:22px;font-weight:800;color:var(--green-dk);font-family:'DM Mono',monospace">${streak}</div>`
    +   `<div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--text3)">Streak</div></div>`
    + `<div style="flex:1;padding:12px 8px;text-align:center">`
    +   `<div style="font-size:14px;font-weight:800;color:var(--green-dk)">${cur.name}</div>`
    +   `<div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--text3)">Rank</div></div>`
    + `</div>`;

  const priority = ['strength','hold','rehab','skill','conditioning','mobility'];
  const shown = suggestions.sort((a,b) => priority.indexOf(a.exType) - priority.indexOf(b.exType)).slice(0,5);

  const listHtml = shown.length
    ? shown.map(s => `<div class="prog-item">
        <div style="flex:1;min-width:0">
          <div class="prog-item-name">${s.name}</div>
          <div class="prog-item-body">${s.current} → <span class="prog-item-next">${s.next.next}</span></div>
        </div></div>`).join('')
    : `<div style="font-size:13px;color:var(--text3);font-style:italic;padding:8px 0">All exercises tracked — keep your current targets.</div>`;

  const rankMsg = next
    ? `<div style="font-size:11px;color:var(--text3);margin-top:12px;text-align:center">${next.sessionsNeeded - total} sessions until <strong>${next.name}</strong></div>`
    : `<div style="font-size:11px;color:var(--green-md);margin-top:12px;text-align:center">Maximum rank reached. 🏆</div>`;

  const listEl = document.getElementById('prog-summary-list');
  if (listEl) listEl.innerHTML = statsHtml + listHtml + rankMsg;

  const noteEl = document.getElementById('prog-modal-note');
  if (noteEl) noteEl.textContent = '';

  document.getElementById('prog-modal').classList.add('open');
  toast('Session logged!');
}

// ─── Battle screen (post-session story card) ─────────────────────────────────
function bsOpen(day, wasLogged) {
  const arc    = loadArc();
  const sess   = loadSess();
  const streak = arcComputeStreak(sess);
  const total  = sess.length;
  const classes = window.ARC_CLASSES || ARC_CLASSES || [];
  const curClass = classes.filter(c => total >= c.sessionsNeeded).pop()
    || classes[0]
    || { name:'Novice', sessionsNeeded:0, arcName:'The Foundation Arc', title:'The Foundation Arc' };

  const pool  = wasLogged ? (BS_LOGGED[day] || BS_LOGGED.monday) : (BS_MISSED[day] || BS_MISSED.monday);
  const entry = pool[total % pool.length];

  document.getElementById('bs-chapter-label').textContent = wasLogged ? `Session ${total}` : `Day Missed`;
  document.getElementById('bs-chapter-arc').textContent   = curClass.arcName || 'The Foundation Arc';
  document.getElementById('bs-title').textContent         = entry.title;
  document.getElementById('bs-text').innerHTML            = entry.text;

  const dayName = day.charAt(0).toUpperCase() + day.slice(1);
  document.getElementById('bs-stats').innerHTML = `
    <div class="bs-stat"><div class="bs-stat-val">${total}</div><div class="bs-stat-lbl">Sessions</div></div>
    <div class="bs-stat"><div class="bs-stat-val">${streak}</div><div class="bs-stat-lbl">Day streak</div></div>
    <div class="bs-stat"><div class="bs-stat-val">${curClass.name}</div><div class="bs-stat-lbl">Rank</div></div>
  `;

  const box = document.getElementById('bs-box');
  box.classList.toggle('bs-missed', !wasLogged);
  document.getElementById('bs-continue').textContent = wasLogged ? 'Continue →' : 'Noted.';

  const chronLog = JSON.parse(localStorage.getItem('fp4_chronicle') || '[]');
  chronLog.push({
    ts: Date.now(), day, title: entry.title, text: entry.text,
    missed: !wasLogged, rank: curClass ? curClass.name : 'Novice',
    session: total, streak,
  });
  while (chronLog.length > 200) chronLog.shift();
  localStorage.setItem('fp4_chronicle', JSON.stringify(chronLog));

  document.getElementById('bs-overlay').classList.add('open');
}

function bsClose() {
  document.getElementById('bs-overlay').classList.remove('open');
}

// ─── Set logging ─────────────────────────────────────────────────────────────
function logSet(exId) {
  const s = gs(exId);
  const el = document.getElementById(exId);
  if (!el) return;
  const key   = 'setlog_' + exId;
  const today = new Date().toDateString();
  let log = JSON.parse(localStorage.getItem(key) || '{}');
  if (log.date !== today) log = { date: today, sets: [] };
  log.sets.push({ reps: s.reps, ts: Date.now() });
  localStorage.setItem(key, JSON.stringify(log));
  updateSetLog(exId, log);
}

function updateSetLog(exId, log) {
  const container = document.getElementById(exId + '-setlog');
  if (!container) return;
  if (!log.sets.length) { container.innerHTML = ''; return; }
  container.innerHTML = log.sets.map((s, i) =>
    `<span class="set-log-chip">Set ${i+1}: ${s.reps}<button class="set-chip-del" onclick="deleteSet('${exId}',${i})" title="Remove this set">×</button></span>`
  ).join('');
}

function deleteSet(exId, idx) {
  const key   = 'setlog_' + exId;
  const today = new Date().toDateString();
  let log = JSON.parse(localStorage.getItem(key) || '{}');
  if (log.date !== today || !log.sets) return;
  log.sets.splice(idx, 1);
  localStorage.setItem(key, JSON.stringify(log));
  updateSetLog(exId, log);
}

// ─── Exercise card rendering ──────────────────────────────────────────────────
function buildExCore(el) {
  const id       = el.id;
  const s        = gs(id);
  const name     = el.dataset.name || '';
  const coaching = el.dataset.coaching || '';
  const why      = el.dataset.why || '';
  const search   = encodeURIComponent(el.dataset.search || name);
  const ytUrl    = `https://www.youtube.com/results?search_query=${search}`;
  const isRing   = el.dataset.ring === 'true';
  const opts     = JSON.parse(el.dataset.intensities || '[]');
  const curOpt   = opts[s.iIdx] || opts[1] || null;
  const exType   = el.dataset.exType || '';
  const progRule = (el.dataset.progressRule || '');
  const tm       = TYPE_META[exType];
  const typeBadge = tm ? `<span class="ex-type-badge ${tm.cls}">${tm.label}</span>` : '';
  const subLine  = curOpt ? `<div class="ex-sub-line">${curOpt.l}: ${curOpt.d}</div>` : '';

  const notchKey   = 'ring_notch_' + id;
  const savedNotch = localStorage.getItem(notchKey) || '';
  const notchHtml  = isRing ? `
    <div class="ring-notch-row" onclick="event.stopPropagation()">
      <span class="ring-notch-label">🔗 Notch</span>
      <input class="ring-notch-input" id="${id}-notch" type="text" inputmode="numeric"
        placeholder="—" value="${savedNotch}"
        onchange="localStorage.setItem('ring_notch_${id}',this.value)"
        oninput="localStorage.setItem('ring_notch_${id}',this.value)"
        title="Ring height notch number for this exercise">
      <span class="ring-notch-hint">ring height</span>
    </div>` : '';

  const nextTarget = getNextTarget(id);
  const targetHtml = nextTarget
    ? `<div class="ex-target-row"><span class="ex-target-pill"><span class="arrow">→</span> Next: ${nextTarget.next}</span></div>`
    : '';

  const progHtml = progRule ? `
    <div class="prog-rule">
      <div class="prog-rule-lbl">When to progress</div>
      <div class="prog-rule-txt">${progRule}</div>
      ${nextTarget ? `<div class="prog-next"><span class="prog-next-lbl">Next target</span><span class="prog-next-val">${nextTarget.next}</span></div>` : ''}
    </div>` : '';

  const hasEdit = opts.length > 0;
  el.innerHTML = `
    <div class="ex-hd" onclick="toggleEx('${id}')">
      <span class="ex-name">${name}${typeBadge}</span>
      ${subLine}
      <div class="ex-controls-row">
        <div class="ex-vol-btn" onclick="openVolModal(event,'${id}')">${s.sets}×${s.reps}<span class="pencil"> ✎</span></div>
        ${opts.length ? `<button class="ex-level-chip" onclick="openIntModal(event,'${id}')">${curOpt?curOpt.l.slice(0,8).toUpperCase():'LEVEL'}</button>` : ''}
        <button class="ex-rest-btn" onclick="startRest(event,'${id}','${name}','${exType}')" title="Rest">Rest</button>
        <span class="ex-chevron" style="margin-left:auto">▾</span>
      </div>
    </div>
    ${targetHtml}
    <div class="ex-body">
      ${notchHtml}
      <div class="ex-tabs">
        <button class="ex-tab on" onclick="switchTab(event,'${id}','coaching')">Coaching</button>
        <button class="ex-tab"    onclick="switchTab(event,'${id}','notes')">Notes</button>
        ${hasEdit ? `<button class="ex-tab" onclick="switchTab(event,'${id}','edit')">Edit</button>` : ''}
      </div>
      <div id="${id}-coaching" class="ex-pane on">
        <div class="ex-coaching">${coaching}</div>
        <div class="ex-why">💡 ${why}</div>
        ${progHtml}
        <div class="set-log-label">Tap REST after each set to log it:</div>
        <div id="${id}-setlog" class="set-log-row"></div>
        <div class="yt-row">
          <a class="yt-link" href="${ytUrl}" target="_blank" rel="noopener noreferrer">
            <svg class="yt-icon" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube</a>
        </div>
      </div>
      <div id="${id}-notes" class="ex-pane">
        <textarea class="notes-area" id="${id}-ta" placeholder="How it felt · what to adjust...">${s.note}</textarea>
        <button class="notes-save" onclick="saveNote('${id}')" id="${id}-ns">Save</button>
      </div>
      ${hasEdit ? `
      <div id="${id}-edit" class="ex-pane">
        <div class="edit-grid">
          <div class="edit-field"><label>Sets</label><input type="text" id="${id}-es" value="${s.sets}" inputmode="numeric"></div>
          <div class="edit-field"><label>Reps / Time</label><input type="text" id="${id}-er" value="${s.reps}"></div>
        </div>
        <div class="edit-field" style="margin-bottom:14px">
          <label>Intensity</label>
          <select id="${id}-ei">
            ${opts.map((o,i) => `<option value="${i}" ${i===s.iIdx?'selected':''}>${o.l} — ${o.d}</option>`).join('')}
          </select>
        </div>
        <button class="apply-btn" onclick="applyEdit('${id}')">Apply</button>
      </div>` : ''}
    </div>`;

  const _sl = JSON.parse(localStorage.getItem('setlog_'+id) || '{}');
  if (_sl.date === new Date().toDateString()) updateSetLog(id, _sl);
}

function toggleEx(id) { document.getElementById(id).classList.toggle('open'); }

function switchTab(e, id, tab) {
  e.stopPropagation();
  const card = document.getElementById(id);
  card.querySelectorAll('.ex-pane').forEach(p => p.classList.remove('on'));
  card.querySelectorAll('.ex-tab').forEach(b => b.classList.remove('on'));
  const pane = document.getElementById(`${id}-${tab}`); if (pane) pane.classList.add('on');
  e.target.classList.add('on');
}

function saveNote(id) {
  const ta = document.getElementById(`${id}-ta`); if (!ta) return;
  gs(id).note = ta.value; persist();
  const btn = document.getElementById(`${id}-ns`);
  if (btn) {
    btn.textContent = 'Saved ✓'; btn.classList.add('saved');
    setTimeout(() => { btn.textContent = 'Save note'; btn.classList.remove('saved'); }, 1800);
  }
}

// ─── Volume / intensity modals ────────────────────────────────────────────────
function openVolModal(e, id) {
  e.stopPropagation(); _curEx = id;
  const s = gs(id);
  document.getElementById('vm-sets').value = s.sets;
  document.getElementById('vm-reps').value = s.reps;
  document.getElementById('vol-modal').classList.add('open');
}

function applyVolume() {
  if (!_curEx) return;
  const s = gs(_curEx);
  s.sets = document.getElementById('vm-sets').value || s.sets;
  s.reps = document.getElementById('vm-reps').value || s.reps;
  persist(); buildEx(document.getElementById(_curEx)); closeModal('vol-modal');
}

function openIntModal(e, id) {
  e.stopPropagation(); _curEx = id;
  const el = document.getElementById(id);
  const opts = JSON.parse(el.dataset.intensities || '[]');
  const s = gs(id); _curInt = s.iIdx;
  document.getElementById('int-modal-title').textContent = el.dataset.name;
  document.getElementById('int-opts').innerHTML = opts.map((o,i) => `
    <div class="int-opt ${i===_curInt?'selected':''}" onclick="selInt(${i},this)">
      <div class="int-opt-lbl">${o.l}</div>
      <div class="int-opt-desc">${o.d}</div>
    </div>`).join('');
  document.getElementById('int-modal').classList.add('open');
}

function applyEdit(id) {
  const s = gs(id);
  const sv = document.getElementById(`${id}-es`), rv = document.getElementById(`${id}-er`), iv = document.getElementById(`${id}-ei`);
  if (sv) s.sets = sv.value; if (rv) s.reps = rv.value; if (iv) s.iIdx = parseInt(iv.value);
  persist(); buildEx(document.getElementById(id));
  document.getElementById(id).classList.add('open');
  setTimeout(() => {
    const c = document.getElementById(id);
    const p = c.querySelector(`#${id}-edit`);
    if (p) {
      c.querySelectorAll('.ex-pane').forEach(x => x.classList.remove('on'));
      c.querySelectorAll('.ex-tab').forEach(x => x.classList.remove('on'));
      p.classList.add('on');
      const tabs = c.querySelectorAll('.ex-tab');
      if (tabs[2]) tabs[2].classList.add('on');
    }
  }, 10);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  _curEx = null; _curInt = null;
}

// ─── Rest timer ───────────────────────────────────────────────────────────────
function startRest(evt, exId, exName, exType) {
  evt.stopPropagation();
  const def = REST_DEFAULTS[exType] || 60;
  _pendingEx   = exName;
  _pendingType = exType;
  logSet(exId);
  launchTimer(def, exName);
}

function launchTimer(secs, name) {
  clearInterval(_timerTick);
  _timerTotal  = secs;
  _timerLeft   = secs;
  _timerPaused = false;
  _timerDone   = false;

  const pill = document.getElementById('rest-timer');
  pill.classList.remove('done');
  pill.classList.add('visible');
  document.getElementById('timer-ex-name').textContent = name || 'Rest';
  updateTimerDisplay();
  _timerTick = setInterval(timerTick, 1000);
}

function timerTick() {
  if (_timerPaused) return;
  _timerLeft--;
  updateTimerDisplay();
  if (_timerLeft <= 0) {
    clearInterval(_timerTick);
    _timerDone = true;
    document.getElementById('rest-timer').classList.add('done');
    document.getElementById('timer-label').textContent = 'Done — go!';
    document.getElementById('timer-num').textContent   = '✓';
    document.getElementById('timer-arc').style.strokeDashoffset = CIRC;
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    playBeep();
  }
}

function timerTogglePause() {
  if (_timerDone) { dismissTimer(); return; }
  _timerPaused = !_timerPaused;
  updateTimerDisplay();
}

function playBeep() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const beep = (freq, start, dur) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.4, start + 0.01);
      g.gain.linearRampToValueAtTime(0, start + dur - 0.01);
      o.start(start); o.stop(start + dur);
    };
    beep(880,  ctx.currentTime,        0.18);
    beep(880,  ctx.currentTime + 0.22, 0.18);
    beep(1100, ctx.currentTime + 0.44, 0.3);
  } catch(e) {}
}

function updateTimerDisplay() {
  const pct    = _timerLeft / _timerTotal;
  const offset = CIRC * (1 - pct);
  const m      = Math.floor(_timerLeft / 60);
  const s      = _timerLeft % 60;
  const label  = m > 0 ? `${m}:${String(s).padStart(2,'0')}` : String(_timerLeft);

  document.getElementById('timer-num').textContent = label;
  document.getElementById('timer-arc').style.strokeDashoffset = offset;

  const pct10  = Math.round(pct * 10);
  const colors = [
    'rgba(220,80,60,.9)', 'rgba(220,80,60,.9)', 'rgba(230,130,50,.9)',
    'rgba(230,160,50,.9)', 'rgba(220,200,80,.9)', 'rgba(160,220,80,.9)',
    'rgba(140,220,80,.9)', 'rgba(120,210,80,.9)', 'rgba(100,200,80,.9)',
    'rgba(100,200,80,.9)', 'rgba(160,240,120,.9)',
  ];
  document.getElementById('timer-arc').style.stroke = colors[Math.min(pct10, 10)];

  if (!_timerDone) {
    document.getElementById('timer-label').textContent = _timerPaused ? 'Paused — tap to resume' : 'Resting…';
  }
}

function dismissTimer() {
  clearInterval(_timerTick);
  document.getElementById('rest-timer').classList.remove('visible', 'done');
}

function openTimerModal() {
  document.getElementById('timer-modal').classList.add('open');
  document.querySelectorAll('.timer-preset').forEach(p => {
    p.classList.toggle('active', parseInt(p.textContent) === _timerTotal ||
      (p.textContent === '2m'   && _timerTotal === 120) ||
      (p.textContent === '2:30' && _timerTotal === 150) ||
      (p.textContent === '3m'   && _timerTotal === 180) ||
      (p.textContent === '4m'   && _timerTotal === 240));
  });
  document.getElementById('timer-custom-inp').value = '';
}

function timerPickPreset(s) {
  document.querySelectorAll('.timer-preset').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('timer-custom-inp').value = s;
}

function closeTimerModal() {
  document.getElementById('timer-modal').classList.remove('open');
}

function timerModalStart() {
  const v = parseInt(document.getElementById('timer-custom-inp').value);
  if (!v || v < 5 || v > 600) return;
  closeTimerModal();
  launchTimer(v, _pendingEx || 'Rest');
}

function timerFinishEarly() {
  clearInterval(_timerTick);
  _timerDone = true;
  document.getElementById('rest-timer').classList.add('done');
  document.getElementById('timer-label').textContent = 'Done — go!';
  document.getElementById('timer-num').textContent   = '✓';
  document.getElementById('timer-arc').style.strokeDashoffset = CIRC;
  document.getElementById('timer-arc').style.stroke = 'rgba(160,240,120,.9)';
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  playBeep();
  setTimeout(() => dismissTimer(), 2000);
}

// ─── General timer module ─────────────────────────────────────────────────────
// Fullscreen countdown overlay. Completely separate state from rest timer pill.
function openGeneralTimer() {
  _gtEnsureOverlay();
  document.getElementById('gt-overlay').classList.add('open');
  // Default-select the last used duration or 60s
  _gtHighlightPreset(_gtTotal);
  document.getElementById('gt-custom-inp').value = '';
}

function _gtEnsureOverlay() {
  if (document.getElementById('gt-overlay')) return;
  const el = document.createElement('div');
  el.id = 'gt-overlay';
  el.style.cssText = [
    'display:none;position:fixed;inset:0;z-index:2000;',
    'background:rgba(8,20,12,.96);',
    'flex-direction:column;align-items:center;justify-content:center;',
    'font-family:Inter,sans-serif;',
    'transition:opacity .2s;',
  ].join('');
  el.classList.add('gt-overlay');
  // Add .open toggle behavior via CSS
  const style = document.createElement('style');
  style.textContent = [
    '#gt-overlay{display:none}',
    '#gt-overlay.open{display:flex}',
    '.gt-preset-btn.gt-active{background:var(--green-dk,#2d4a38)!important;color:#d0ffb0!important;',
      'border-color:rgba(130,240,80,.6)!important;}',
    '.phase-card.phase-active{border-color:rgba(130,240,80,.7)!important;',
      'box-shadow:0 0 0 2px rgba(80,200,60,.25)!important;}',
    '@keyframes gt-pulse{0%,100%{opacity:1}50%{opacity:.35}}',
    '.gt-pulsing{animation:gt-pulse .7s ease-in-out infinite}',
  ].join('');
  document.head.appendChild(style);

  const presets = [
    { l:'30s', v:30 }, { l:'1m', v:60 }, { l:'2m', v:120 },
    { l:'3m', v:180 }, { l:'5m', v:300 }, { l:'10m', v:600 },
  ];

  el.innerHTML = `
    <div style="width:100%;max-width:390px;padding:28px 24px 40px;box-sizing:border-box;">
      <!-- Header with dismiss (only shown in picker state) -->
      <div id="gt-picker-hd" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px">
        <div style="font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(180,240,150,.6)">Timer</div>
        <button onclick="gtDismiss()" style="background:none;border:none;color:rgba(200,240,180,.5);font-size:22px;cursor:pointer;padding:4px 8px;line-height:1">✕</button>
      </div>

      <!-- Preset buttons -->
      <div id="gt-picker-body">
        <div id="gt-presets" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
          ${presets.map(p => `
            <button class="gt-preset-btn"
              onclick="gtPickPreset(${p.v},this)"
              style="padding:14px 0;border-radius:10px;border:1.5px solid rgba(255,255,255,.12);
                background:rgba(255,255,255,.05);color:rgba(200,240,180,.8);
                font-size:15px;font-weight:700;font-family:'DM Mono',monospace;cursor:pointer;"
              data-val="${p.v}">${p.l}</button>`).join('')}
        </div>
        <div style="display:flex;gap:10px;margin-bottom:24px">
          <input id="gt-custom-inp" type="number" inputmode="numeric" min="5" max="3600"
            placeholder="Custom seconds"
            style="flex:1;padding:13px 14px;border-radius:10px;border:1.5px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.06);color:#e8f5e0;font-size:15px;font-family:Inter,sans-serif;
              -webkit-appearance:none;"
            oninput="gtCustomInput(this)">
        </div>
        <button onclick="gtStart()"
          style="width:100%;padding:16px;border-radius:12px;border:none;
            background:var(--green-dk,#2d4a38);color:#d0ffb0;
            font-size:16px;font-weight:700;cursor:pointer;letter-spacing:.5px;">
          Start
        </button>
      </div>

      <!-- Countdown face (hidden until running) -->
      <div id="gt-face" style="display:none;flex-direction:column;align-items:center;gap:0">
        <div id="gt-num" style="font-size:88px;font-weight:800;font-family:'DM Mono',monospace;
          color:#d0ffb0;line-height:1;letter-spacing:-2px;margin-bottom:12px">1:00</div>
        <div id="gt-lbl" style="font-size:13px;font-weight:600;letter-spacing:2px;
          text-transform:uppercase;color:rgba(180,240,150,.55);margin-bottom:40px">Running</div>
        <div style="display:flex;gap:16px">
          <button onclick="gtTogglePause()"
            id="gt-pause-btn"
            style="padding:14px 32px;border-radius:12px;border:1.5px solid rgba(255,255,255,.18);
              background:rgba(255,255,255,.06);color:rgba(200,240,180,.85);
              font-size:15px;font-weight:700;cursor:pointer;">Pause</button>
          <button onclick="gtDismiss()"
            style="padding:14px 32px;border-radius:12px;border:1.5px solid rgba(255,255,255,.12);
              background:rgba(255,255,255,.03);color:rgba(200,240,180,.5);
              font-size:15px;font-weight:700;cursor:pointer;">Dismiss</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(el);
}

function _gtHighlightPreset(secs) {
  document.querySelectorAll('.gt-preset-btn').forEach(b => {
    b.classList.toggle('gt-active', parseInt(b.dataset.val) === secs);
  });
}

function gtPickPreset(v, btn) {
  _gtTotal = v;
  document.querySelectorAll('.gt-preset-btn').forEach(b => b.classList.remove('gt-active'));
  if (btn) btn.classList.add('gt-active');
  document.getElementById('gt-custom-inp').value = '';
}

function gtCustomInput(inp) {
  document.querySelectorAll('.gt-preset-btn').forEach(b => b.classList.remove('gt-active'));
  const v = parseInt(inp.value);
  if (v >= 5) _gtTotal = v;
}

function gtStart() {
  const customVal = parseInt((document.getElementById('gt-custom-inp') || {}).value || '0');
  if (customVal >= 5) _gtTotal = customVal;
  if (!_gtTotal || _gtTotal < 5) return;
  _gtLeft   = _gtTotal;
  _gtPaused = false;
  _gtDone   = false;
  clearInterval(_gtTick);

  // Switch to face
  const picker = document.getElementById('gt-picker-body');
  const pickerHd = document.getElementById('gt-picker-hd');
  const face   = document.getElementById('gt-face');
  if (picker) picker.style.display = 'none';
  if (pickerHd) pickerHd.style.display = 'none';
  if (face) face.style.display = 'flex';

  _gtUpdateDisplay();
  _gtTick = setInterval(_gtTick_fn, 1000);
}

function _gtTick_fn() {
  if (_gtPaused) return;
  _gtLeft--;
  _gtUpdateDisplay();
  if (_gtLeft <= 0) {
    clearInterval(_gtTick);
    _gtDone = true;
    const numEl = document.getElementById('gt-num');
    const lblEl = document.getElementById('gt-lbl');
    const pauseBtn = document.getElementById('gt-pause-btn');
    if (numEl) { numEl.textContent = '✓'; numEl.style.color = '#80ff60'; numEl.classList.add('gt-pulsing'); }
    if (lblEl) { lblEl.textContent = 'Done'; lblEl.style.color = 'rgba(130,240,80,.7)'; }
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    playBeep();
    setTimeout(() => gtDismiss(), 3000);
  }
}

function _gtUpdateDisplay() {
  const m   = Math.floor(_gtLeft / 60);
  const s   = _gtLeft % 60;
  const lbl = m > 0 ? `${m}:${String(s).padStart(2, '0')}` : String(_gtLeft);
  const numEl = document.getElementById('gt-num');
  const lblEl = document.getElementById('gt-lbl');
  const pauseBtn = document.getElementById('gt-pause-btn');
  if (numEl) numEl.textContent = lbl;
  if (lblEl) lblEl.textContent = _gtPaused ? 'Paused' : 'Running';
  if (pauseBtn) pauseBtn.textContent = _gtPaused ? 'Resume' : 'Pause';
}

function gtTogglePause() {
  if (_gtDone) return;
  _gtPaused = !_gtPaused;
  _gtUpdateDisplay();
}

function gtDismiss() {
  clearInterval(_gtTick);
  _gtDone   = false;
  _gtPaused = false;
  const ov = document.getElementById('gt-overlay');
  if (!ov) return;
  ov.classList.remove('open');
  // Reset to picker state for next open
  const picker = document.getElementById('gt-picker-body');
  const pickerHd = document.getElementById('gt-picker-hd');
  const face   = document.getElementById('gt-face');
  const numEl  = document.getElementById('gt-num');
  if (picker) picker.style.display = '';
  if (pickerHd) pickerHd.style.display = '';
  if (face) face.style.display = 'none';
  if (numEl) { numEl.style.color = '#d0ffb0'; numEl.classList.remove('gt-pulsing'); }
  document.getElementById('gt-custom-inp').value = '';
}
function openLogModal(filterDay) {
  const sessions = loadSess().sort((a,b) => b.ts - a.ts);
  const body = document.getElementById('log-modal-body');
  if (!sessions.length) {
    body.innerHTML = '<div class="log-empty">No sessions logged yet.</div>';
  } else {
    const grouped = {};
    sessions.forEach(s => {
      const d   = new Date(s.ts);
      const key = d.toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric', year:'numeric' });
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    });
    let h = '';
    for (const [date, ds] of Object.entries(grouped)) {
      h += '<div class="log-day">';
      ds.forEach(sess => {
        const t = new Date(sess.ts).toLocaleTimeString('en-US',{ hour:'numeric', minute:'2-digit' });
        const noteSnip = sess.sessionNote
          ? `<span style="font-style:italic;font-size:11px;color:var(--sage);margin-left:8px">"${sess.sessionNote.slice(0,50)}${sess.sessionNote.length>50?'…':''}"</span>`
          : '';
        h += `<div class="log-day-hd"><span>${date} · ${t}${noteSnip}</span><span style="display:flex;align-items:center;gap:8px"><span style="text-transform:capitalize">${sess.day}</span><button onclick="if(confirm('Delete this session?'))deleteSession(${sess.ts})" style="font-size:10px;color:var(--red,#c04040);background:none;border:none;cursor:pointer;padding:2px 6px;border-radius:4px;border:1px solid rgba(200,60,60,.3)">✕</button></span></div>`;
        (sess.entries||[]).forEach(e => {
          const sl = e.setsLogged || [];
          if (!sl.length) return;
          const volStr = sl.length > 0
            ? sl.map((s,i) => `Set ${i+1}: ${s.reps}`).join(' · ')
            : e.sets + '×' + e.reps;
          h += `<div class="log-entry"><span class="log-name">${e.name}</span><span class="log-vol">${volStr}${e.intensity?' · '+e.intensity:''}</span>${e.note?`<span class="log-note">${e.note.slice(0,70)}${e.note.length>70?'…':''}</span>`:''}</div>`;
        });
      });
      h += '</div>';
    }
    h += `<button class="danger-link" onclick="clearData()">Clear all saved data</button>`;
    body.innerHTML = h;
  }
  document.getElementById('log-modal').classList.add('open');
}

// ─── Fighter SVG renderer ─────────────────────────────────────────────────────
const AURA_SIZES = [44, 58, 72];

function makeFighterSVG(rankKey, w, h, cx, cy) {
  const pose = FIGHTER_POSES[rankKey];
  if (!pose) return '';
  const auraHtml = pose.auras.map((col, i) => {
    const r = Math.round(AURA_SIZES[i] * (w / 160));
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="1.2" style="animation:svg-ring-pulse ${2+i*0.6}s ease-in-out infinite ${i*0.3}s"/>`;
  }).join('');
  const style = pose.filter ? `filter:${pose.filter}` : '';
  return `<svg width="${w}" height="${h}" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow-prog-d" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glow-prog-f" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glow-prog-e" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5.5" result="b"/><feColorMatrix in="b" type="matrix" values="0.6 0.8 0 0 0  0.6 0.8 0.2 0 0  0 0.4 0.1 0 0  0 0 0 1.2 0" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glow-prog-m" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="7" result="b"/><feColorMatrix in="b" type="matrix" values="0.5 0.9 0.2 0 0  0.8 1.0 0.2 0 0  0.1 0.6 0 0 0  0 0 0 1.4 0" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    ${auraHtml}
    <g stroke="${pose.stroke}" stroke-linecap="round" stroke-linejoin="round" style="${style}">${pose.inner}</g>
  </svg>`;
}

// ─── Hex radar chart ──────────────────────────────────────────────────────────
const HEX_AXES = [
  { key:'force',       label:'Force',       color:'#e07838', desc:'Strength sessions' },
  { key:'agility',     label:'Agility',     color:'#40a8c0', desc:'Mobility sessions' },
  { key:'technique',   label:'Technique',   color:'#9060d0', desc:'Skill & conditioning' },
  { key:'endurance',   label:'Endurance',   color:'#c0a030', desc:'Total hold time (mins)' },
  { key:'consistency', label:'Consistency', color:'#60c060', desc:'Streak score' },
  { key:'recovery',    label:'Recovery',    color:'#c060a0', desc:'Mobility days logged' },
];
const N      = HEX_AXES.length;
const HEX_CX = 140, HEX_CY = 140, HEX_R = 100;

function buildHexChart(sess, containerIdOrPrefix) {
  const pfx    = (containerIdOrPrefix === 'fp-hex-wrap') ? 'fp-hex-' : 'hex-';
  const legPfx = (containerIdOrPrefix === 'fp-hex-wrap') ? 'fp-hex-legend' : 'prog-hex-legend';
  const gridEl   = document.getElementById(pfx + 'grid');
  const fillEl   = document.getElementById(pfx + 'fill');
  const labelsEl = document.getElementById(pfx + 'labels');
  const dotsEl   = document.getElementById(pfx + 'dots');
  const legEl    = document.getElementById(legPfx);
  if (!gridEl) return;

  const dayTypes = { monday:'force', friday:'force', tuesday:'agility', thursday:'agility', wednesday:'technique' };
  const rawStats = { force:0, agility:0, technique:0, endurance:0, consistency:0, recovery:0 };

  let totalHoldSecs = 0;
  sess.forEach(s => {
    const st = dayTypes[s.day];
    if (st) rawStats[st]++;
    const exList = s.exercises || s.entries || [];
    exList.forEach(ex => {
      const m = parseFloat(ex.reps);
      if (!isNaN(m) && /s$|s\/side$/i.test(ex.reps||'')) totalHoldSecs += m * (ex.sets||1);
    });
  });

  const streak = typeof arcComputeStreak === 'function' ? arcComputeStreak(sess) : 0;
  const mobDays = sess.filter(s => s.day === 'tuesday' || s.day === 'thursday').length;

  rawStats.endurance   = Math.round(totalHoldSecs / 60);
  rawStats.consistency = streak;
  rawStats.recovery    = mobDays;

  const caps  = { force:40, agility:40, technique:30, endurance:120, consistency:30, recovery:40 };
  const fracs = {};
  HEX_AXES.forEach(a => { fracs[a.key] = Math.min(1, (rawStats[a.key]||0) / caps[a.key]); });

  let gridHTML = '';
  [0.25, 0.5, 0.75, 1.0].forEach(f => {
    const pts = Array.from({ length: N }, (_, i) => {
      const p = hexPoint(i, f, HEX_R);
      return `${p.x},${p.y}`;
    }).join(' ');
    gridHTML += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,${f===1?'.30':'.15'})" stroke-width="${f===1?'1.5':'0.8'}"/>`;
  });
  for (let i = 0; i < N; i++) {
    const p = hexPoint(i, 1, HEX_R);
    gridHTML += `<line x1="${HEX_CX}" y1="${HEX_CY}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,.06)" stroke-width="0.8"/>`;
  }
  gridEl.innerHTML = gridHTML;

  const polyPts = HEX_AXES.map((a,i) => {
    const frac = Math.max(0.08, fracs[a.key]);
    const p = hexPoint(i, frac, HEX_R);
    return `${p.x},${p.y}`;
  }).join(' ');
  fillEl.setAttribute('points', polyPts);

  let labHTML = '';
  HEX_AXES.forEach((a, i) => {
    const p   = hexPoint(i, 1.22, HEX_R);
    const val = rawStats[a.key];
    const unit = a.key === 'endurance' ? 'm' : a.key === 'consistency' ? 'd' : '';
    labHTML += `<text x="${p.x}" y="${p.y}" fill="${a.color}" font-weight="700" font-size="11.5">${a.label}</text>`;
    labHTML += `<text x="${p.x}" y="${p.y+14}" fill="rgba(200,240,180,.55)" font-size="9.5">${val}${unit}</text>`;
  });
  labelsEl.innerHTML = labHTML;

  dotsEl.innerHTML = HEX_AXES.map((a,i) => {
    const frac = Math.max(0.04, fracs[a.key]);
    const p = hexPoint(i, frac, HEX_R);
    return `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${a.color}" stroke="#0a1810" stroke-width="1.5"/>`;
  }).join('');

  const centerEl = document.getElementById(pfx + 'center-label');
  if (centerEl) centerEl.style.display = sess.length === 0 ? 'block' : 'none';

  legEl.innerHTML = HEX_AXES.map(a =>
    `<div class="prog-hex-leg-item"><div class="prog-hex-dot" style="background:${a.color}"></div><span style="color:${a.color};font-weight:600">${a.label}</span>: <span style="color:rgba(200,240,180,.7)">${rawStats[a.key]}${a.key==='endurance'?'m':a.key==='consistency'?'d streak':''}</span></div>`
  ).join('');
}

function hexPoint(i, frac, r) {
  const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
  return {
    x: HEX_CX + Math.cos(angle) * r * frac,
    y: HEX_CY + Math.sin(angle) * r * frac,
  };
}

// ─── Chronicle ────────────────────────────────────────────────────────────────
function buildChronicle(targetId) {
  const elId = targetId || 'prog-chronicle';
  const el   = document.getElementById(elId);
  if (!el) return;
  const log = JSON.parse(localStorage.getItem('fp4_chronicle') || '[]');
  if (!log.length) {
    el.innerHTML = '<div class="prog-chronicle-empty">Your chronicle begins with your first logged session.</div>';
    return;
  }
  el.innerHTML = [...log].reverse().map((entry, i) => {
    const dt      = new Date(entry.ts).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    const dayName = entry.day ? entry.day.charAt(0).toUpperCase() + entry.day.slice(1) : '';
    return `<div class="prog-chron-entry">
      <div class="prog-chron-left">
        <div class="prog-chron-num ${entry.missed?'missed':''}"> ${entry.missed ? '✗' : '#'+(log.length - i)}</div>
        <div class="prog-chron-date">${dt}</div>
      </div>
      <div class="prog-chron-body">
        <div class="prog-chron-title ${entry.missed?'missed':''}">${entry.title}</div>
        <div class="prog-chron-text">${entry.text}</div>
        <div class="prog-chron-day ${entry.missed?'missed':''}">${entry.missed?'Missed':'Logged'} · ${dayName}${entry.rank?' · '+entry.rank:''}</div>
      </div>
    </div>`;
  }).join('');
}

// ─── Fighter panel renderer ───────────────────────────────────────────────────
function renderFighterPanel() {
  const sess  = loadSess();
  const total = sess.length;
  const cur   = FIGHTER_RANKS.filter(r => total >= r.sessionsNeeded).pop() || FIGHTER_RANKS[0];
  const next  = FIGHTER_RANKS.find(r => r.sessionsNeeded > total);

  const figEl  = document.getElementById('fp-current-fig');
  const rankEl = document.getElementById('fp-current-rank');
  const arcEl  = document.getElementById('fp-current-arc');
  const sessEl = document.getElementById('fp-current-sess');
  const nextEl = document.getElementById('fp-current-next');
  const fillEl = document.getElementById('fp-rank-fill');

  if (figEl)  figEl.innerHTML  = makeFighterSVG(cur.key, 160, 190, 80, 110);
  if (rankEl) rankEl.textContent = cur.name;
  if (arcEl)  arcEl.textContent  = cur.arc;
  if (sessEl) sessEl.textContent = total + ' session' + (total!==1?'s':'') + ' logged';

  if (next) {
    const prev  = cur.sessionsNeeded;
    const range = next.sessionsNeeded - prev;
    const done  = total - prev;
    const pct   = Math.min(100, Math.round((done / range) * 100));
    if (fillEl) fillEl.style.width = pct + '%';
    if (nextEl) nextEl.textContent = (next.sessionsNeeded - total) + ' sessions to ' + next.name;
  } else {
    if (fillEl) fillEl.style.width = '100%';
    if (nextEl) nextEl.textContent = 'Maximum rank reached.';
  }

  const grid = document.getElementById('fighter-panel-grid');
  if (grid) {
    grid.innerHTML = FIGHTER_RANKS.map(r => {
      const isCurrent = r.key === cur.key;
      const isLocked  = total < r.sessionsNeeded;
      return `<div class="fp-evo-cell ${isCurrent?'is-current':''} ${isLocked?'is-locked':''}">
        <div class="fp-evo-fig">${makeFighterSVG(r.key, 72, 90, 36, 58)}</div>
        <div class="fp-evo-name">${r.name}</div>
        <div class="fp-evo-req ${total>=r.sessionsNeeded?'done':''}">${total>=r.sessionsNeeded?'✓':r.sessionsNeeded+'s'}</div>
      </div>`;
    }).join('');
  }

  const hexWrap = document.getElementById('fp-hex-wrap');
  if (hexWrap) buildHexChart(sess, 'fp-hex-wrap');
}

// ─── Progress tab (skills pane) ───────────────────────────────────────────────
function renderProgressTab() {
  const sess = loadSess();
  if (!sess.length) {
    ['prog-rep-charts','prog-hold-charts'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<div class="prog-empty"><strong>No data yet.</strong>Log your first session to start seeing charts here.</div>';
    });
    return;
  }

  const streak     = arcComputeStreak(sess);
  const bestStreak = computeBestStreak(sess);
  const thisWeek   = countThisWeek(sess);

  document.getElementById('pstat-streak').textContent = streak;
  document.getElementById('pstat-best').textContent   = bestStreak;
  document.getElementById('pstat-total').textContent  = sess.length;
  document.getElementById('pstat-week').textContent   = thisWeek + '/5';

  buildFreqGrid(sess);

  const repData  = {};
  const holdData = {};

  sess.forEach(session => {
    const _exList1 = session.exercises || session.entries;
    if (!_exList1) return;
    _exList1.forEach(ex => {
      if (!ex.id || !ex.name) return;
      const repsRaw = ex.reps || '';
      const isHold  = /s$|s\/side$|s each$/i.test(repsRaw) ||
                      ['hold','rehab'].includes(ex.exType) && /^\d/.test(repsRaw);
      const numReps = parseFloat(repsRaw);
      if (isNaN(numReps)) return;
      const point = { ts: session.ts, val: numReps, sets: ex.sets || 1, repsRaw, iIdx: ex.iIdx || 0 };
      if (isHold) {
        if (!holdData[ex.id]) holdData[ex.id] = { name: ex.name, points: [] };
        holdData[ex.id].points.push(point);
      } else {
        if (!repData[ex.id]) repData[ex.id] = { name: ex.name, points: [], exType: ex.exType };
        repData[ex.id].points.push(point);
      }
    });
  });

  const repEl      = document.getElementById('prog-rep-charts');
  const repEntries = Object.entries(repData).filter(([,d]) => d.points.length >= 2);
  if (!repEntries.length) {
    repEl.innerHTML = '<div class="prog-empty"><strong>Not enough data yet.</strong>Rep charts appear after logging an exercise at least twice.</div>';
  } else {
    repEl.innerHTML = repEntries.map(([id, d]) => buildExChart(id, d, 'reps')).join('');
  }

  const holdEl      = document.getElementById('prog-hold-charts');
  const holdEntries = Object.entries(holdData).filter(([,d]) => d.points.length >= 2);
  if (!holdEntries.length) {
    holdEl.innerHTML = '<div class="prog-empty"><strong>Not enough data yet.</strong>Hold time charts appear after logging a timed exercise at least twice.</div>';
  } else {
    holdEl.innerHTML = holdEntries.map(([id, d]) => buildExChart(id, d, 'hold')).join('');
  }

  buildIntensityLog(sess);
}

function buildFighterCard(arc, totalSess) {
  const classes  = window.ARC_CLASSES || ARC_CLASSES || [];
  const curClass = classes.filter(c => totalSess >= c.sessionsNeeded).pop()
    || classes[0]
    || { name:'Novice', sessionsNeeded:0, arcName:'The Foundation Arc' };
  const rankKey = curClass.name.toLowerCase();

  const nameEl = document.getElementById('prog-fighter-name');
  const rankEl = document.getElementById('prog-fighter-rank');
  const subEl  = document.getElementById('prog-fighter-sub');
  const figEl  = document.getElementById('prog-fighter-fig');
  if (!figEl) return;

  if (nameEl) nameEl.textContent = curClass.name || 'Novice';
  if (rankEl) rankEl.textContent = curClass.arcName || curClass.title || 'The Foundation Arc';
  if (subEl)  subEl.textContent  = totalSess === 0
    ? 'Log your first session to begin the arc.'
    : `${totalSess} sessions logged. The arc continues.`;

  figEl.innerHTML = makeFighterSVG(rankKey, 130, 150, 80, 100);
  figEl.style.filter = '';
}

function buildEvoRow(currentRankKey, totalSess) {
  const row = document.getElementById('prog-evo-row');
  if (!row) return;
  const ranks = [
    { key:'novice',   name:'Novice',   req:0,   arc:'The Foundation Arc' },
    { key:'disciple', name:'Disciple', req:20,  arc:'The Awakening Arc' },
    { key:'fighter',  name:'Fighter',  req:50,  arc:'The Refinement Arc' },
    { key:'elite',    name:'Elite',    req:100, arc:'The Trial Arc' },
    { key:'master',   name:'Master',   req:200, arc:'The Summit Arc' },
  ];
  row.innerHTML = ranks.map(r => {
    const isCurrent = r.key === currentRankKey;
    const isLocked  = totalSess < r.req;
    const svg = makeFighterSVG(r.key, 80, 92, 80, 105);
    return `<div class="prog-evo-cell ${isCurrent?'is-current':''} ${isLocked?'is-locked':''}">
      <div class="prog-evo-fig">${svg}</div>
      <div class="prog-evo-name">${r.name}</div>
      <div class="prog-evo-req ${totalSess>=r.req?'done':''}"> ${totalSess>=r.req?'✓ Unlocked':r.req+' sessions'}</div>
      <div class="prog-evo-arc">${r.arc}</div>
    </div>`;
  }).join('');
}

function buildExChart(id, data, mode) {
  const pts   = data.points.slice(-20);
  const vals  = pts.map(p => p.val);
  const maxV  = Math.max(...vals, 1);
  const minV  = Math.min(...vals);
  const range = maxV - minV || 1;
  const best  = Math.max(...vals);

  const bars = pts.map((p, i) => {
    const heightPct = Math.max(8, Math.round(((p.val - minV) / range) * 85 + 8));
    const isIntUp   = i > 0 && p.iIdx > pts[i-1].iIdx;
    const isPB      = p.val === best && i === vals.lastIndexOf(best);
    const cls       = isPB ? 'personal-best' : isIntUp ? 'intensity-up' : '';
    const dt        = new Date(p.ts).toLocaleDateString('en-US', { month:'short', day:'numeric' });
    const lbl       = mode === 'hold' ? `${p.val}s` : `${p.sets}×${p.val}`;
    return `<div class="prog-bar ${cls}" style="height:${heightPct}%">
      <div class="prog-bar-tip">${dt}: ${lbl}</div>
    </div>`;
  }).join('');

  const firstDt = new Date(pts[0].ts).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const lastDt  = new Date(pts[pts.length-1].ts).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const unit    = mode === 'hold' ? 's' : 'reps';
  const trend   = vals[vals.length-1] > vals[0] ? '↑' : vals[vals.length-1] < vals[0] ? '↓' : '→';
  const trendCol = trend === '↑' ? 'rgba(100,220,80,.8)' : trend === '↓' ? 'rgba(220,100,80,.8)' : 'rgba(255,255,255,.4)';

  return `<div class="prog-ex-card">
    <div class="prog-ex-card-name">${data.name}</div>
    <div class="prog-ex-card-meta">${mode === 'hold' ? 'hold time' : 'volume'} · best: ${best}${unit} · <span style="color:${trendCol}">${trend} trend</span></div>
    <div class="prog-chart-wrap">
      <div class="prog-chart-bars">${bars}</div>
    </div>
    <div class="prog-chart-xaxis"><span>${firstDt}</span><span>${lastDt}</span></div>
    <div class="prog-legend-row">
      <span class="prog-legend-item"><span class="prog-legend-dot" style="background:rgba(100,200,80,.9)"></span>Best</span>
      <span class="prog-legend-item"><span class="prog-legend-dot" style="background:rgba(200,160,50,.7)"></span>Intensity up</span>
      <span class="prog-legend-item"><span class="prog-legend-dot" style="background:rgba(70,140,55,.6)"></span>Normal</span>
    </div>
  </div>`;
}

// ─── Streak / stats helpers ───────────────────────────────────────────────────
function arcComputeStreak() {
  const sessions = loadSess();
  if (!sessions.length) return 0;

  const trainDays = new Set(
    sessions.map(s => {
      const d = new Date(s.ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const today  = new Date();
  let streak   = 0;
  let cursor   = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dow     = cursor.getDay();
    const key     = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    const isRestDay = (dow === 0 || dow === 6);
    const isToday   = (i === 0);

    if (isRestDay) {
      // rest days never break streak
    } else if (trainDays.has(key)) {
      streak++;
    } else if (!isToday) {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ─── Exercise data hydration ──────────────────────────────────────────────────
function buildEx(el) {
  const id = el.dataset.id || el.id;
  if (!id || !EXERCISES[id]) { if (el.dataset.name) buildExCore(el); return; }
  const ex = EXERCISES[id];
  el.id = id; el.dataset.name = ex.name || ''; el.dataset.exType = ex.exType || '';
  el.dataset.sets = ex.sets || '3'; el.dataset.reps = ex.reps || '10';
  el.dataset.coaching = ex.coaching || ''; el.dataset.why = ex.why || '';
  el.dataset.search = ex.search || ''; el.dataset.progressRule = ex.progressRule || '';
  el.dataset.intensities = JSON.stringify(ex.intensities || []);
  if (ex.ring) el.dataset.ring = 'true';
  buildExCore(el);
}

// ─── Frequency grid ───────────────────────────────────────────────────────────
function buildFreqGrid(sess) {
  const grid = document.getElementById('prog-freq-grid');
  if (!grid) return;

  const logged = new Set(sess.map(s => {
    const d = new Date(s.ts);
    return d.toISOString().split('T')[0];
  }));

  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(today); start.setDate(start.getDate() - 83);
  const dow   = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dow);

  const cells = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const iso      = d.toISOString().split('T')[0];
    const wday     = d.getDay();
    const isRest   = wday === 0 || wday === 6;
    const isFuture = d > today;
    const isLogged = logged.has(iso);
    const isMissed = !isRest && !isFuture && !isLogged && d < today;
    const cls = isFuture ? 'future' : isRest ? 'rest' : isLogged ? 'logged' : isMissed ? 'missed' : '';
    cells.push(`<div class="prog-freq-cell ${cls}" title="${iso}"></div>`);
  }
  grid.innerHTML = cells.join('');
}

function computeBestStreak(sess) {
  if (!sess.length) return 0;
  const WEEKEND    = new Set([0, 6]);
  const loggedDays = new Set(sess.map(s => {
    const d = new Date(s.ts); d.setHours(0,0,0,0); return d.getTime();
  }));
  const sorted = [...loggedDays].sort((a,b) => a - b);
  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i-1]);
    let d = new Date(prev); d.setDate(d.getDate() + 1);
    while (WEEKEND.has(d.getDay())) d.setDate(d.getDate() + 1);
    if (d.getTime() === sorted[i]) { cur++; best = Math.max(best, cur); }
    else cur = 1;
  }
  return best;
}

function countThisWeek(sess) {
  const now   = new Date(); now.setHours(0,0,0,0);
  const dow   = (now.getDay() + 6) % 7;
  const start = new Date(now); start.setDate(start.getDate() - dow);
  return sess.filter(s => {
    const d = new Date(s.ts); d.setHours(0,0,0,0);
    return d >= start && d <= now;
  }).length;
}

// ─── Intensity log ────────────────────────────────────────────────────────────
function buildIntensityLog(sess) {
  const el = document.getElementById('prog-intensity-list');
  if (!el) return;

  const exIntensity  = {};
  const progressions = [];

  sess.slice().sort((a,b) => a.ts - b.ts).forEach(session => {
    const _exList2 = session.exercises || session.entries;
    if (!_exList2) return;
    _exList2.forEach(ex => {
      if (!ex.id || ex.iIdx === undefined) return;
      const prev = exIntensity[ex.id];
      if (prev !== undefined && ex.iIdx > prev) {
        progressions.push({ name: ex.name, from: prev, to: ex.iIdx, ts: session.ts });
      }
      exIntensity[ex.id] = ex.iIdx;
    });
  });

  if (!progressions.length) {
    el.innerHTML = "<div class=\"prog-intensity-empty\">No intensity progressions recorded yet. Keep training — they'll appear here when you level up an exercise.</div>";
    return;
  }

  el.innerHTML = progressions.slice(-15).reverse().map(p => {
    const dt     = new Date(p.ts).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    const labels = ['Easier','Current','Harder','Hardest'];
    const fromL  = labels[p.from] || `L${p.from}`;
    const toL    = labels[p.to]   || `L${p.to}`;
    return `<div class="prog-intensity-item">
      <span class="prog-intensity-badge">${fromL} → ${toL}</span>
      <span class="prog-intensity-name">${p.name}</span>
      <span class="prog-intensity-date">${dt}</span>
    </div>`;
  }).join('');
}

// ─── Misc UI helpers ──────────────────────────────────────────────────────────
function toggleProgSection(btn) {
  const body  = btn.nextElementSibling;
  const arrow = btn.querySelector('.prog-acc-arrow');
  const open  = body.classList.toggle('open');
  if (arrow) arrow.textContent = open ? '▲' : '▼';
}

function confirmClearAll() {
  if (!confirm('Delete ALL saved data? This cannot be undone.')) return;
  clearData();
}

function clearData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('fp4_') || k.startsWith('setlog_'));
  keys.forEach(k => localStorage.removeItem(k));
  toast('All data cleared.');
  navigate('progress');
}

function deleteSession(ts) {
  const sessions = loadSess().filter(s => s.ts !== ts);
  saveSess(sessions);
  openLogModal();
}

function clearTodaySets(day) {
  const today = new Date().toDateString();
  Object.keys(localStorage).filter(k => k.startsWith('setlog_')).forEach(k => {
    const v = JSON.parse(localStorage.getItem(k) || '{}');
    if (v.date === today) localStorage.removeItem(k);
  });
  toast("Today's set logs cleared.");
  const dc = document.getElementById('day-content');
  if (dc) dc.querySelectorAll('.set-log-row').forEach(el => el.innerHTML = '');
}

function toast(msg) {
  const t = document.getElementById('fp-toast'); if (!t) return;
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._t); t._t = setTimeout(() => { t.style.opacity = '0'; }, 2400);
}

// ─── Progress panel tab switcher ──────────────────────────────────────────────
let _progTab = 'fighter';

function switchProg(tab) {
  _progTab = tab;
  document.querySelectorAll('.prog-pill').forEach(b =>
    b.classList.toggle('on', b.dataset.prog === tab)
  );
  const el = document.getElementById('prog-content');
  if (!el) return;

  if      (tab === 'fighter')   renderProgFighter(el);
  else if (tab === 'skills')    renderProgSkills(el);
  else if (tab === 'history')   renderProgHistory(el);
  else if (tab === 'chronicle') renderProgChronicle(el);
}

// ── Fighter pane ──────────────────────────────────────────────────────────────
function renderProgFighter(el) {
  const sess  = loadSess();
  const total = sess.length;
  const cur   = FIGHTER_RANKS.filter(r => total >= r.sessionsNeeded).pop() || FIGHTER_RANKS[0];
  const next  = FIGHTER_RANKS.find(r => r.sessionsNeeded > total);

  const pct = next
    ? Math.min(100, Math.round(((total - cur.sessionsNeeded) / (next.sessionsNeeded - cur.sessionsNeeded)) * 100))
    : 100;

  el.innerHTML =
    '<div class="panel-inner">'
    + '<div class="fp-rank-card" id="pfp-card">'
    + '<div class="fp-rank-fig" id="pfp-fig"></div>'
    + '<div class="fp-rank-name" id="pfp-rank">' + cur.name + '</div>'
    + '<div class="fp-rank-arc" id="pfp-arc">' + cur.arc + '</div>'
    + '<div class="fp-rank-prog-wrap">'
    + '<div class="fp-rank-prog-bar"><div class="fp-rank-prog-fill" id="pfp-fill" style="width:' + pct + '%"></div></div>'
    + '<div class="fp-rank-prog-label">' + (next ? (next.sessionsNeeded - total) + ' sessions to ' + next.name : 'Maximum rank reached.') + '</div>'
    + '</div>'
    + '<div class="fp-rank-sess">' + total + ' session' + (total!==1?'s':'') + ' logged</div>'
    + '</div>'
    + '<div class="fp-evo-label" style="padding:0 16px;margin-bottom:12px">Evolution Path</div>'
    + '<div class="fighter-panel-grid" id="pfp-evo-grid" style="padding:0 16px"></div>'
    + '</div>';

  const fig = document.getElementById('pfp-fig');
  if (fig) fig.innerHTML = makeFighterSVG(cur.key, 160, 190, 80, 110);

  const grid = document.getElementById('pfp-evo-grid');
  if (grid) {
    grid.innerHTML = FIGHTER_RANKS.map(r => {
      const isCurrent = r.key === cur.key;
      const isLocked  = total < r.sessionsNeeded;
      return '<div class="fp-evo-cell ' + (isCurrent?'is-current':'') + ' ' + (isLocked?'is-locked':'') + '">'
        + '<div class="fp-evo-fig">' + makeFighterSVG(r.key, 72, 90, 36, 58) + '</div>'
        + '<div class="fp-evo-name">' + r.name + '</div>'
        + '<div class="fp-evo-req ' + (total>=r.sessionsNeeded?'done':'') + '">' + (total>=r.sessionsNeeded?'✓':r.sessionsNeeded+'s') + '</div>'
        + '</div>';
    }).join('');
  }
}

// ── Skills pane ───────────────────────────────────────────────────────────────
function renderProgSkills(el) {
  const hexSvg = '<svg id="hex-prog-svg" width="280" height="280" viewBox="0 0 280 280">'
    + '<defs><filter id="hex-glow"><feGaussianBlur stdDeviation="3" result="blur"/>'
    + '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
    + '<g id="hex-grid"></g>'
    + '<polygon id="hex-fill" points="140,140" fill="rgba(80,200,60,.25)" stroke="rgba(130,240,90,.9)" stroke-width="1.5" filter="url(#hex-glow)"/>'
    + '<g id="hex-labels" font-size="11" font-family="DM Mono,monospace" fill="rgba(200,240,180,.7)" text-anchor="middle"></g>'
    + '<g id="hex-dots"></g>'
    + '<text id="hex-center-label" x="140" y="148" text-anchor="middle" font-size="10" font-family="DM Mono,monospace" fill="rgba(200,240,180,.5)" display="none">Log a session to build your radar</text>'
    + '</svg>';

  el.innerHTML =
    '<div class="panel-inner">'
    + '<div class="prog-hex-wrap">' + hexSvg
    + '<div class="prog-hex-legend" id="prog-hex-legend"></div></div>'
    + '<div class="prog-stat-grid">'
    + '<div class="prog-stat-card"><div class="prog-stat-val" id="pstat-streak">—</div><div class="prog-stat-lbl">Current streak</div></div>'
    + '<div class="prog-stat-card"><div class="prog-stat-val" id="pstat-best">—</div><div class="prog-stat-lbl">Best streak</div></div>'
    + '<div class="prog-stat-card"><div class="prog-stat-val" id="pstat-total">—</div><div class="prog-stat-lbl">Total sessions</div></div>'
    + '<div class="prog-stat-card"><div class="prog-stat-val" id="pstat-week">—</div><div class="prog-stat-lbl">This week</div></div>'
    + '</div>'
    + '<div id="prog-rep-charts"  class="prog-charts-wrap"></div>'
    + '<div id="prog-hold-charts" class="prog-charts-wrap"></div>'
    + '<div id="prog-intensity-list" class="prog-intensity-list"></div>'
    + '</div>';

  const sess = loadSess();
  buildHexChart(sess);
  renderProgressTab();
}

// ── History pane ──────────────────────────────────────────────────────────────
function renderProgHistory(el) {
  el.innerHTML =
    '<div class="panel-inner">'
    + '<div class="fp-evo-label" style="padding:0 0 12px">Session History</div>'
    + '<div id="prog-freq-grid" class="prog-freq-grid" style="margin-bottom:20px"></div>'
    + '<div id="prog-hist-list"></div>'
    + '<div style="padding-top:16px;text-align:center">'
    + '<button class="sb-btn" onclick="openLogModal()">Full Log</button>'
    + '</div>'
    + '</div>';

  const sess = loadSess();
  buildFreqGrid(sess);

  const listEl = document.getElementById('prog-hist-list');
  if (!listEl) return;
  const recent = sess.slice().sort((a,b) => b.ts - a.ts).slice(0,10);
  if (!recent.length) {
    listEl.innerHTML = '<div class="prog-empty">No sessions logged yet.</div>';
    return;
  }
  listEl.innerHTML = recent.map((s,i) => {
    const d  = new Date(s.ts);
    const ds = d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
    const ts = d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    return '<div class="prog-hist-row">'
      + '<span class="prog-hist-day">' + (s.day||'').replace(/^./,c=>c.toUpperCase()) + '</span>'
      + '<span class="prog-hist-date">' + ds + ' · ' + ts + '</span>'
      + '<span class="prog-hist-count">' + (s.count||0) + ' ex</span>'
      + '</div>';
  }).join('');
}

// ── Chronicle pane ────────────────────────────────────────────────────────────
function renderProgChronicle(el) {
  el.innerHTML =
    '<div class="panel-inner">'
    + '<div id="prog-chronicle" class="prog-chronicle"></div>'
    + '<div class="prog-chron-actions">'
    + '<button class="danger-link" onclick="confirmClearAll()">Clear all saved data</button>'
    + '</div>'
    + '</div>';
  buildChronicle();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => navigate('train'));
