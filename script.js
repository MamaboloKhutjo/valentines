// --------- Wrapped-style slides ---------
const slides = [
  { kicker: "A little story…", headline: "Hey… it’s me. Stitch.", sub: "" },
  { kicker: "Not gonna lie", headline: "I not good at big speeches.", sub: "So I keep it simple." },
  { kicker: "But I know one thing", headline: "Some people feel like home.", sub: "" },
  { kicker: "So listen", headline: "Nobody gets left behind.", sub: "Especially you." },
  { kicker: "Because", headline: "You matter. A lot.", sub: "" },
  { kicker: "Okay…", headline: "Stitch has important question…", sub: "Ready?" }
];

// --------- Video Intro (plays BEFORE quotes) ---------
const introClips = [
  "media/hi.mp4",
  "media/ohana.mp4",
];

const elVideoIntro = document.getElementById("videoIntro");
const introVideo = document.getElementById("introVideo");
const btnSkipIntro = document.getElementById("btnSkipIntro");

let introIndex = 0;
let introStarted = false;

function playIntroClip(i){
  introIndex = i;
  introVideo.src = introClips[introIndex];
  introVideo.currentTime = 0;

  const p = introVideo.play();
  if (p) p.catch(() => {});
}

function nextIntroClip(){
  introIndex++;
  if (introIndex < introClips.length){
    playIntroClip(introIndex);
  } else {
    endIntro();
  }
}

function endIntro(){
  // Hide intro section and start quotes
  elVideoIntro.style.display = "none";

  elSlides.classList.remove("hidden");
  elQuestion.classList.add("hidden");
  elResult.classList.add("hidden");
  setSlide(0);
  startAuto();
}

introVideo.addEventListener("ended", nextIntroClip);

btnSkipIntro.addEventListener("click", endIntro);

introVideo.addEventListener("click", async () => {
  introVideo.muted = !introVideo.muted;
  try { await introVideo.play(); } catch (_) {}
});


const bgVideos = Array.from(document.querySelectorAll(".bgVideo"));

const elSlides = document.getElementById("slides");
const elQuestion = document.getElementById("question");
const elResult = document.getElementById("result");

const kicker = document.getElementById("kicker");
const headline = document.getElementById("headline");
const sub = document.getElementById("sub");

const btnNext = document.getElementById("btnNext");
const btnSkip = document.getElementById("btnSkip");
const dotsWrap = document.getElementById("dots");

let idx = 0;
let autoTimer = null;

function renderDots(){
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === idx ? " active" : "");
    dotsWrap.appendChild(d);
  });
}

function setBgVideo(i){
  if (bgVideos.length === 0) return;
  const vIndex = i % bgVideos.length;
  bgVideos.forEach((v, k) => v.classList.toggle("isActive", k === vIndex));
  const v = bgVideos[vIndex];
  v.currentTime = 0;
  v.play().catch(() => {});
}

function setSlide(i){
  idx = Math.max(0, Math.min(slides.length - 1, i));
  const s = slides[idx];
  kicker.textContent = s.kicker;
  headline.textContent = s.headline;
  sub.textContent = s.sub ?? "";
  renderDots();
  setBgVideo(idx);
}

function goQuestion(){
  elSlides.classList.add("hidden");
  elQuestion.classList.remove("hidden");
}

function next(){
  if (idx < slides.length - 1){
    setSlide(idx + 1);
  } else {
    goQuestion();
  }
}

function startAuto(){
  stopAuto();
  autoTimer = setInterval(next, 5600);
}
function stopAuto(){
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

btnNext.addEventListener("click", () => { stopAuto(); next(); });
btnSkip.addEventListener("click", () => { stopAuto(); goQuestion(); });

// --------- Question screen (Yes/No) ---------
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const noMsg = document.getElementById("noMsg");

const noLines = [
  "Nice try 😂",
  "Stitch sees you.",
  "That button not for you.",
  "Be serious.",
  "Stitch already knows the answer."
];

let dodgeCount = 0;

function dodge(){
  dodgeCount++;
  noMsg.textContent = noLines[(dodgeCount - 1) % noLines.length];

  const plead = [
  "Pretty please? 💙",
  "PWEEEEEEEEEEESE? 💙",
  "I’m going to get mad… 💙",
  "Okay fine… Yes 💙"
];

// Start changing captions from dodge #3 onward
if (dodgeCount >= 3) {
  const index = Math.min(dodgeCount - 3, plead.length - 1);
  btnNo.textContent = plead[index];

  // Only turn into a real "Yes" on dodge #6+
  if (dodgeCount >= 6) {
    btnNo.classList.remove("danger");
    btnNo.classList.add("primary");
    btnNo.onclick = () => goResult();
    return;
  }
}


  const parent = btnNo.parentElement;
  const card = btnNo.closest(".card");
  const cardRect = card.getBoundingClientRect();

  const pad = 18;
  const maxX = cardRect.width - btnNo.offsetWidth - pad;
  const maxY = cardRect.height - btnNo.offsetHeight - pad;

  const x = pad + Math.random() * Math.max(0, maxX - pad);
  const y = pad + Math.random() * Math.max(0, maxY - pad);

  btnNo.style.position = "absolute";
  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;
  parent.style.position = "relative";
  parent.style.minHeight = "90px";
}

btnNo.addEventListener("mouseenter", dodge);
btnNo.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodge();
}, { passive: false });

btnYes.addEventListener("click", () => goResult());

// --------- Result screen + confetti ---------
const btnReplay = document.getElementById("btnReplay");
const resultLine = document.getElementById("resultLine");
const realLine = document.getElementById("realLine");

const resultOptions = [
  "We Ohana now 💙",
];

function goResult(){
  elQuestion.classList.add("hidden");
  elResult.classList.remove("hidden");

  resultLine.textContent = resultOptions[Math.floor(Math.random() * resultOptions.length)];
  realLine.textContent = "I’m really glad it’s you.";

  burstConfetti();
}

btnReplay.addEventListener("click", () => location.reload());

// --------- Simple confetti ---------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let confettiRAF = null;

function resizeCanvas(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function burstConfetti(){
  cancelAnimationFrame(confettiRAF);

  pieces = Array.from({ length: 140 }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 200,
    r: 3 + Math.random() * 4,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
    life: 120 + Math.random() * 80
  }));

  const tick = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.03;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life / 200);
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    });

    pieces = pieces.filter(p => p.life > 0 && p.y < window.innerHeight + 40);
    if (pieces.length > 0) confettiRAF = requestAnimationFrame(tick);
  };

  tick();
}

window.addEventListener("resize", () => location.reload());

// --------- Music toggle ---------
const musicBtn = document.getElementById("musicBtn");
const music = document.getElementById("music");
let musicOn = false;

musicBtn.addEventListener("click", async () => {
  try {
    if (!musicOn) {
      await music.play();
      musicOn = true;
      musicBtn.style.opacity = "1";
    } else {
      music.pause();
      musicOn = false;
      musicBtn.style.opacity = ".75";
    }
  } catch (_) {}
});

// Init
resizeCanvas();
playIntroClip(0);
// startAuto();