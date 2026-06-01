// ----------------------------- 1. BACKGROUND PARTICLES -----------------------------
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = null, mouseY = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  setTimeout(() => { mouseX = null; mouseY = null; }, 150);
});

class Particle {
  constructor(x, y, size, speedX, speedY, color) {
    this.x = x; this.y = y; this.size = size;
    this.speedX = speedX; this.speedY = speedY;
    this.color = color; this.opacity = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (mouseX && mouseY) {
      const dx = this.x - mouseX, dy = this.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const angle = Math.atan2(dy, dx);
        const force = (100 - dist) / 100 * 1.5;
        this.speedX += Math.cos(angle) * force * 0.2;
        this.speedY += Math.sin(angle) * force * 0.2;
      }
    }
    if (this.x + this.size < 0) this.x = canvas.width + this.size;
    if (this.x - this.size > canvas.width) this.x = -this.size;
    if (this.y + this.size < 0) this.y = canvas.height + this.size;
    if (this.y - this.size > canvas.height) this.y = -this.size;
    let maxSpeed = 1.5;
    this.speedX = Math.min(maxSpeed, Math.max(-maxSpeed, this.speedX));
    this.speedY = Math.min(maxSpeed, Math.max(-maxSpeed, this.speedY));
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles = [];
  let count = Math.min(100, Math.max(60, (canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) {
    let size = Math.random() * 5 + 2;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let speedX = (Math.random() - 0.5) * 1;
    let speedY = (Math.random() - 0.5) * 1;
    const colors = ['#FFB7C5', '#FF9EB5', '#FFC0D0', '#FFA5C0', '#FF85A1'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, size, speedX, speedY, color));
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) { p.update(); p.draw(); }
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// ----------------------------- 2. CONFETTI -----------------------------
(function() {
  window.confetti = window.confetti || function(options) {
    const defaults = { particleCount: 50, spread: 45, startVelocity: 15, origin: { x: 0.5, y: 0.5 }, colors: ['#FFB7C5', '#FF85A1', '#FF4D6D'], decay: 0.9, ticks: 200, gravity: 1 };
    const settings = Object.assign({}, defaults, options);
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    canvas.width = width; canvas.height = height;
    let particles = [];
    for (let i = 0; i < settings.particleCount; i++) {
      particles.push({
        x: settings.origin.x * width, y: settings.origin.y * height,
        size: Math.random() * 6 + 3,
        speedX: (Math.random() - 0.5) * settings.spread * 0.5,
        speedY: -Math.random() * settings.startVelocity - 3,
        color: settings.colors[Math.floor(Math.random() * settings.colors.length)],
        rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 8,
        ticks: settings.ticks, gravity: settings.gravity,
      });
    }
    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity * 0.3;
        p.rotation += p.rotationSpeed;
        p.ticks--;
      }
      particles = particles.filter(p => p.ticks > 0 && p.y < height + 100);
      if (particles.length) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  };
})();

function triggerConfetti() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#FFB7C5', '#FF85A1', '#FF4D6D'] });
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.2 } });
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.8 } });
    }, i * 200);
  }
}

// ----------------------------- 3. PAGE 1: RANDOM MESSAGE FROM 4-5 TEXTS -----------------------------
const messageList = [
  "🌸 You make my world brighter just by being in it. Happy Birthday, bestie! 🌸",
  "🎂 Cheers to another year of amazing friendship! Love you loads! 🎂",
  "💖 Every day with you is a gift. So grateful for you! 💖",
  "✨ You're not just my best friend, you're my family. Happy Birthday! ✨",
  "🌹 Sending you a giant hug and all my love on your special day! 🌹"
];

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * messageList.length);
  return messageList[randomIndex];
}

// Display random message in inbox-p1 instantly
const inboxP1 = document.getElementById('inbox-p1');
inboxP1.textContent = getRandomMessage();

// ----------------------------- 4. PAGE 2: THREE PARAGRAPHS IN RANDOM ORDER (TYPEWRITER) -----------------------------
const originalParagraphs = [
  "You are truly one of the most amazing souls I've ever met. Every laugh, every late-night conversation, every moment of your support has made me a better person. 💕",
  "I'm so grateful that life brought us together. You make ordinary days feel special, and you've shown me what true friendship means.",
  "On your birthday, I just want you to know: you're cherished, you're important, and you'll always have me cheering for you. 🎂✨"
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function typewriter(element, text, speed = 40) {
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text.charAt(i);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

let page2TypingStarted = false;

async function startPage2Typewriter() {
  if (page2TypingStarted) return;
  page2TypingStarted = true;
  
  const shuffled = shuffleArray([...originalParagraphs]);
  const line1 = document.getElementById('p2-line1');
  const line2 = document.getElementById('p2-line2');
  const line3 = document.getElementById('p2-line3');
  
  await typewriter(line1, shuffled[0], 35);
  await typewriter(line2, shuffled[1], 35);
  await typewriter(line3, shuffled[2], 35);
}

// ----------------------------- 5. PAGE SWITCH LOGIC -----------------------------
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backHome');
const popAudio = document.getElementById('pop-sound');

nextBtn.addEventListener('click', () => {
  popAudio.play().catch(e => console.log);
  triggerConfetti();
  nextBtn.style.transform = 'scale(0.95)';
  setTimeout(() => nextBtn.style.transform = '', 200);
  setTimeout(() => {
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
    startPage2Typewriter();
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
  }, 400);
});

backBtn.addEventListener('click', () => {
  page2.classList.add('hidden');
  page1.classList.remove('hidden');
  // Reset page2 typing flag and clear lines for next time
  page2TypingStarted = false;
  const line1 = document.getElementById('p2-line1');
  const line2 = document.getElementById('p2-line2');
  const line3 = document.getElementById('p2-line3');
  line1.textContent = '';
  line2.textContent = '';
  line3.textContent = '';
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
});

// ----------------------------- 6. FLOATING HEARTS (REDUCED) -----------------------------
function createFloatingHearts() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '7';
  document.body.appendChild(container);
  
  const emojis = ['🌹', '💖', '🌸', '💕', '✨', '🎈', '💗'];
  const count = 28;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 24 + 14) + 'px';
    heart.style.animationDuration = (Math.random() * 10 + 6) + 's';
    heart.style.animationDelay = Math.random() * 12 + 's';
    container.appendChild(heart);
  }
}
createFloatingHearts();

// Optional: initial confetti on load
window.addEventListener('load', () => {
  setTimeout(() => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 }, colors: ['#FFB7C5', '#FF85A1'] });
  }, 500);
});
