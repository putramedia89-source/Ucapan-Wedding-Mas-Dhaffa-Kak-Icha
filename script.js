
/* =========================================
   WEDDING CINEMATIC ANIMATION
   Dhafa & Icha
========================================= */

const opening = document.getElementById("opening");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;
let animationFrame = null;
let heartInterval = null;

/* Pastikan elemen penting tersedia */
if (!opening || !openBtn || !music || !musicBtn) {
  console.error("Periksa ID opening, openBtn, weddingMusic, dan musicBtn di HTML.");
} else {

  /* =====================================
     1. PARTICLE CANVAS
  ===================================== */

  const canvas = document.createElement("canvas");
  canvas.id = "particles";
  opening.prepend(canvas);

  const ctx = canvas.getContext("2d");

  let particles = [];
  let canvasWidth = 0;
  let canvasHeight = 0;

  function resizeCanvas() {
    const rect = opening.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = rect.width;
    canvasHeight = rect.height;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.35 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.45 + 0.15
    }));
  }

  function animateParticles() {
    if (opening.classList.contains("hide")) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;

      if (p.y < -5) {
        p.y = canvasHeight + 5;
        p.x = Math.random() * canvasWidth;
      }

      if (p.x < -5) p.x = canvasWidth + 5;
      if (p.x > canvasWidth + 5) p.x = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.fill();
    });

    animationFrame = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();

  window.addEventListener("resize", resizeCanvas);


  /* =====================================
   2. FLOATING LOVE BUBBLES 💗
===================================== */

function createFloatingHeart() {
  if (opening.classList.contains("hide")) return;

  const heart = document.createElement("span");

  // Variasi bentuk love
  const symbols = ["♡", "♥", "💕", "୨୧", "ღ"];
  heart.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  // Variasi warna pastel
  const colors = [
    "#E8A9B8",
    "#F5C6D6",
    "#FFFFFF",
    "#FFB6C9",
    "#FFDDE7"
  ];

  const size = Math.random() * 24 + 12;
  const duration = Math.random() * 3 + 5;

  Object.assign(heart.style, {
    position: "absolute",
    left: `${Math.random() * 90 + 5}%`,
    bottom: "-40px",
    color: colors[Math.floor(Math.random() * colors.length)],
    fontSize: `${size}px`,
    pointerEvents: "none",
    zIndex: "2",
    opacity: "0",
    textShadow: "0 0 12px rgba(255,255,255,0.8)",
    transition: `transform ${duration}s linear, opacity ${duration}s ease`
  });

  opening.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.opacity = "0.9";
    heart.style.transform =
      `translate(${Math.random() * 180 - 90}px, -${window.innerHeight + 100}px) rotate(${Math.random() * 90 - 45}deg)`;
  });

  setTimeout(() => heart.remove(), 9000);
}

// Membuat 2 bubble setiap 300 milidetik
heartInterval = setInterval(() => {
  if (opening.classList.contains("hide")) {
    clearInterval(heartInterval);
    return;
  }

  for (let i = 0; i < 2; i++) {
    setTimeout(() => {
      createFloatingHeart();
    }, i * 120);
  }
}, 300);

  /* =====================================
     3. SCROLL REVEAL
  ===================================== */

  const animatedItems = document.querySelectorAll(
    ".hero-content > *, " +
    ".quote-content > *, " +
    ".message-content > *, " +
    ".closing-content > *, " +
    ".message-line"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedItems.forEach((element) => {
      element.classList.add("stagger-item");

      const siblings = Array.from(element.parentElement.children);
      const itemIndex = siblings.indexOf(element);

      element.style.transitionDelay =
        `${Math.max(0, itemIndex) * 0.08}s`;

      revealObserver.observe(element);
    });
  } else {
    /* Fallback untuk browser lama */
    animatedItems.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =====================================
     4. OPEN WEDDING
  ===================================== */

  openBtn.addEventListener("click", async () => {
    if (document.body.classList.contains("opened")) return;

    document.body.classList.add("opened");
    opening.classList.add("hide");

    cancelAnimationFrame(animationFrame);
    clearInterval(heartInterval);

    musicBtn.style.display = "flex";

    try {
      await music.play();
      isPlaying = true;
      musicBtn.classList.add("playing");
      musicBtn.textContent = "♫";
    } catch (error) {
      isPlaying = false;
      musicBtn.classList.remove("playing");
      musicBtn.textContent = "♪";
      console.warn("Musik tidak dapat diputar otomatis.", error);
    }

    setTimeout(() => {
      const hero = document.getElementById("hero");

      if (hero) {
        hero.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 500);
  });


  /* =====================================
     5. MUSIC CONTROL
  ===================================== */

  musicBtn.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
      } catch (error) {
        console.warn("Musik belum dapat diputar.", error);
      }
    } else {
      music.pause();
    }
  });

  music.addEventListener("play", () => {
    isPlaying = true;
    musicBtn.textContent = "♫";
    musicBtn.classList.add("playing");
  });

  music.addEventListener("pause", () => {
    isPlaying = false;
    musicBtn.textContent = "♪";
    musicBtn.classList.remove("playing");
  });

}
