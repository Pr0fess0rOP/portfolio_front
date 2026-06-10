const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

toggle?.addEventListener('click', () => links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => links.classList.remove('open'));
});
year.textContent = new Date().getFullYear();

// Smooth reveal on scroll
const revealItems = document.querySelectorAll('.section-heading, .about-grid, .skill-card, .timeline-item, .project-card, .education-card, .contact-section, .hero-copy, .hero-card');
revealItems.forEach(item => item.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));

// Custom cursor animation for desktop devices
const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-item, .education-card, .hero-card, .quick-stats div');

if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Bubble reaction: bubbles gently move toward cursor for a playful feel
const bubbles = document.querySelectorAll('.background-bubbles span');
window.addEventListener('mousemove', (event) => {
  const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;
  bubbles.forEach((bubble, index) => {
    const strength = (index + 1) * 4;
    bubble.style.setProperty('--mx', `${xRatio * strength}px`);
    bubble.style.setProperty('--my', `${yRatio * strength}px`);
  });
});


// Cursor visibility fix: safely create and update the custom cursor.
(() => {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) return;

  let dot = document.querySelector(".cursor-dot");
  let outline = document.querySelector(".cursor-outline") || document.querySelector(".cursor-ring");

  if (!dot) {
    dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
  }

  if (!outline) {
    outline = document.createElement("div");
    outline.className = "cursor-outline";
    document.body.appendChild(outline);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateCursor = () => {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  const hoverTargets = "a, button, .project-card, .skill-card, .experience-card, .btn, .tag, .tags span";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => outline.classList.add("hover"));
    el.addEventListener("mouseleave", () => outline.classList.remove("hover"));
  });
})();


// Navbar cat purr interaction
(() => {
  const cat = document.querySelector(".nav-cat");
  if (!cat) return;

  let audioContext;

  const makePurr = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    audioContext = audioContext || new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();

    const now = audioContext.currentTime;
    const duration = 0.75;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, now);
    filter.Q.setValueAtTime(2.2, now);

    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    osc1.type = "sawtooth";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(54, now);
    osc2.frequency.setValueAtTime(68, now);

    // gentle purr pulse
    for (let i = 0; i < 7; i++) {
      const t = now + i * 0.105;
      gain.gain.setValueAtTime(0.035, t);
      gain.gain.linearRampToValueAtTime(0.085, t + 0.045);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.09);
    }

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  };

  cat.addEventListener("click", () => {
    cat.classList.add("is-purring");
    makePurr();
    window.setTimeout(() => cat.classList.remove("is-purring"), 900);
  });
})();


// Education card click messages
(() => {
  const educationCards = document.querySelectorAll(".education-clickable");

  educationCards.forEach((card) => {
    const message = card.dataset.eduMessage || "";
    const messageEl = card.querySelector(".education-pop-message");
    if (messageEl) messageEl.textContent = message;

    const showMessage = () => {
      educationCards.forEach((otherCard) => {
        if (otherCard !== card) otherCard.classList.remove("show-edu-message");
      });

      card.classList.add("show-edu-message");
      window.clearTimeout(card._eduMessageTimer);
      card._eduMessageTimer = window.setTimeout(() => {
        card.classList.remove("show-edu-message");
      }, 1800);
    };

    card.addEventListener("click", showMessage);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showMessage();
      }
    });
  });
})();


// Recent work cards open company websites when clicked outside text links
(() => {
  const workCards = document.querySelectorAll(".work-clickable");

  workCards.forEach((card) => {
    const openCompany = (event) => {
      if (event.target.closest("a")) return;
      const url = card.dataset.workUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    };

    card.addEventListener("click", openCompany);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const url = card.dataset.workUrl;
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }
    });
  });
})();


// Recent work bullet shine follows cursor
(() => {
  const workBullets = document.querySelectorAll(".work-clickable li");

  workBullets.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      item.style.setProperty("--shine-x", `${x}%`);
      item.style.setProperty("--shine-y", `${y}%`);
    });
  });
})();


// Profile photo dropdown and add-cat action
(() => {
  const menuWrap = document.querySelector(".profile-menu-wrap");
  const trigger = document.querySelector(".profile-menu-trigger");
  const dropdown = document.querySelector(".profile-dropdown");
  const addCatButton = document.querySelector(".add-cat-btn");
  const catPlayground = document.querySelector(".cat-playground");

  if (!menuWrap || !trigger || !dropdown) return;

  const setMenuOpen = (isOpen) => {
    menuWrap.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    dropdown.setAttribute("aria-hidden", String(!isOpen));
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!menuWrap.classList.contains("open"));
  });

  document.addEventListener("click", (event) => {
    if (!menuWrap.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  addCatButton?.addEventListener("click", () => {
    if (!catPlayground) return;

    catPlayground.classList.remove("cat-hidden");
    catPlayground.classList.add("cat-added");

    addCatButton.textContent = "Cat added to navbar ✓";
    addCatButton.classList.add("cat-added-label");

    setMenuOpen(false);
  });
})();


// Interactive About section: glow + What I build toggle
(() => {
  const aboutCopy = document.querySelector(".interactive-about-copy");
  const buildTabs = document.querySelectorAll(".build-tab");
  const buildPanel = document.querySelector(".build-panel");

  if (aboutCopy) {
    aboutCopy.addEventListener("mousemove", (event) => {
      const rect = aboutCopy.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      aboutCopy.style.setProperty("--about-glow-x", `${x}%`);
      aboutCopy.style.setProperty("--about-glow-y", `${y}%`);
    });
  }

  const buildContent = {
    ai: {
      icon: "🤖",
      text: "I build AI workflows that combine model reasoning, retrieval, prompt design, backend APIs, and practical guardrails."
    },
    data: {
      icon: "🛠️",
      text: "I build data pipelines that ingest, clean, transform, and organize messy data into reliable analytics-ready layers."
    },
    fullstack: {
      icon: "🚀",
      text: "I build full-stack applications with clean interfaces, scalable backend services, APIs, authentication, and cloud deployment."
    }
  };

  buildTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.build;
      const content = buildContent[key];
      if (!content || !buildPanel) return;

      buildTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      buildPanel.style.opacity = "0";
      buildPanel.style.transform = "translateY(6px)";

      window.setTimeout(() => {
        buildPanel.innerHTML = `<span class="build-icon">${content.icon}</span><p>${content.text}</p>`;
        buildPanel.style.opacity = "1";
        buildPanel.style.transform = "translateY(0)";
      }, 140);
    });
  });
})();


// Hero role rotator + subtle 3D tilt card
(() => {
  const roleText = document.querySelector(".role-text");
  const roles = [
    "Full-stack products",
    "AI-powered systems",
    "Data platforms",
    "Cloud-ready applications"
  ];

  if (roleText) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeSpeed = 54;
    const deleteSpeed = 34;
    const holdTime = 1250;

    const tick = () => {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex += 1;
        roleText.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
          deleting = true;
          window.setTimeout(tick, holdTime);
          return;
        }

        window.setTimeout(tick, typeSpeed);
      } else {
        charIndex -= 1;
        roleText.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(tick, 250);
          return;
        }

        window.setTimeout(tick, deleteSpeed);
      }
    };

    window.setTimeout(tick, 900);
  }

  const tiltCard = document.querySelector("[data-tilt-card]");
  if (tiltCard && window.matchMedia("(pointer: fine)").matches) {
    const maxTilt = 7;

    tiltCard.addEventListener("mousemove", (event) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = (-y * maxTilt).toFixed(2);
      const rotateY = (x * maxTilt).toFixed(2);

      tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }
})();
