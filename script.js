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




// Corgi and parrot click reactions
(() => {
  document.querySelectorAll(".nav-dog, .nav-parrot").forEach((animal) => {
    animal.addEventListener("click", () => {
      animal.classList.add("is-talking");
      window.setTimeout(() => animal.classList.remove("is-talking"), 850);
    });
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


// Profile photo dropdown and animal navbar toggles
(() => {
  const menuWrap = document.querySelector(".profile-menu-wrap");
  const trigger = document.querySelector(".profile-menu-trigger");
  const dropdown = document.querySelector(".profile-dropdown");
  const animalButtons = document.querySelectorAll(".animal-toggle-btn");
  const animalPlayground = document.querySelector(".animal-playground");

  if (!menuWrap || !trigger || !dropdown) return;

  const animalLabels = {
    cat: { show: "Show cat in navbar 🐾", hide: "Hide cat from navbar ✓" },
    dog: { show: "Show corgi in navbar 🐶", hide: "Hide corgi from navbar ✓" },
    parrot: { show: "Show parrot in navbar 🦜", hide: "Hide parrot from navbar ✓" }
  };

  const setMenuOpen = (isOpen) => {
    menuWrap.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    dropdown.setAttribute("aria-hidden", String(!isOpen));
  };

  const updateAnimalControls = () => {
    if (!animalPlayground) return;
    const visibleAnimals = animalPlayground.querySelectorAll(".nav-animal:not(.animal-hidden)");
    animalPlayground.classList.toggle("cat-hidden", visibleAnimals.length === 0);
    animalPlayground.classList.toggle("cat-added", visibleAnimals.length > 0);
  };

  const animalMotion = new Map();
  const speedPresets = {
    cat: { vx: 0.72, vy: 0.18, tilt: 1.6 },
    dog: { vx: -0.86, vy: 0.16, tilt: -1.4 },
    parrot: { vx: 0.96, vy: -0.24, tilt: 2.1 }
  };

  const visibleAnimalNodes = () => {
    if (!animalPlayground) return [];
    return [...animalPlayground.querySelectorAll(".nav-animal:not(.animal-hidden)")];
  };

  const animalBounds = (node, playgroundRect) => {
    const width = node.offsetWidth || 60;
    const height = node.offsetHeight || 42;
    const maxX = Math.max(2, playgroundRect.width - width - 4);
    const maxY = Math.max(0, (playgroundRect.height - height) / 2);

    return { width, height, minX: 2, maxX, minY: -maxY, maxY };
  };

  const seedAnimalPosition = (node) => {
    if (!animalPlayground || animalMotion.has(node)) return;

    const animal = node.dataset.animal || "cat";
    const playgroundRect = animalPlayground.getBoundingClientRect();
    const bounds = animalBounds(node, playgroundRect);
    const visible = visibleAnimalNodes();
    const slotIndex = Math.max(0, visible.indexOf(node));
    const slotCount = Math.max(1, visible.length);
    const spread = bounds.maxX - bounds.minX;
    const x = bounds.minX + (spread * (slotIndex + 0.5)) / slotCount;
    const y = slotIndex % 2 === 0 ? bounds.minY : bounds.maxY;
    const preset = speedPresets[animal] || speedPresets.cat;

    animalMotion.set(node, {
      x,
      y,
      vx: preset.vx * (slotIndex % 2 === 0 ? 1 : -1),
      vy: preset.vy,
      tilt: preset.tilt
    });
  };

  const resetHiddenAnimals = () => {
    if (!animalPlayground) return;
    animalPlayground.querySelectorAll(".nav-animal.animal-hidden").forEach((node) => {
      animalMotion.delete(node);
      node.style.removeProperty("--animal-x");
      node.style.removeProperty("--animal-y");
      node.style.removeProperty("--animal-tilt");
    });
  };

  const keepAnimalsApart = (animals, playgroundRect) => {
    for (let i = 0; i < animals.length; i += 1) {
      for (let j = i + 1; j < animals.length; j += 1) {
        const first = animals[i];
        const second = animals[j];
        const a = animalMotion.get(first);
        const b = animalMotion.get(second);
        if (!a || !b) continue;

        const firstBounds = animalBounds(first, playgroundRect);
        const secondBounds = animalBounds(second, playgroundRect);
        const ax = a.x + firstBounds.width / 2;
        const ay = a.y;
        const bx = b.x + secondBounds.width / 2;
        const by = b.y;
        const dx = bx - ax;
        const dy = by - ay;
        const distance = Math.max(0.01, Math.hypot(dx, dy));
        const minDistance = Math.max(firstBounds.width, secondBounds.width) + 16;

        if (distance >= minDistance) continue;

        const normalX = dx / distance;
        const normalY = dy / distance;
        const push = (minDistance - distance) / 2;

        a.x -= normalX * push;
        a.y -= normalY * push;
        b.x += normalX * push;
        b.y += normalY * push;

        const aAlong = a.vx * normalX + a.vy * normalY;
        const bAlong = b.vx * normalX + b.vy * normalY;
        const impulse = bAlong - aAlong;

        a.vx += impulse * normalX;
        a.vy += impulse * normalY;
        b.vx -= impulse * normalX;
        b.vy -= impulse * normalY;
      }
    }
  };

  const animateNavbarAnimals = () => {
    if (animalPlayground) {
      const playgroundRect = animalPlayground.getBoundingClientRect();
      const animals = visibleAnimalNodes();

      animals.forEach(seedAnimalPosition);
      resetHiddenAnimals();

      animals.forEach((node) => {
        const motion = animalMotion.get(node);
        if (!motion) return;

        const bounds = animalBounds(node, playgroundRect);
        motion.x += motion.vx;
        motion.y += motion.vy;

        if (motion.x <= bounds.minX || motion.x >= bounds.maxX) {
          motion.x = Math.min(Math.max(motion.x, bounds.minX), bounds.maxX);
          motion.vx *= -1;
        }

        if (motion.y <= bounds.minY || motion.y >= bounds.maxY) {
          motion.y = Math.min(Math.max(motion.y, bounds.minY), bounds.maxY);
          motion.vy *= -1;
        }
      });

      keepAnimalsApart(animals, playgroundRect);

      animals.forEach((node) => {
        const motion = animalMotion.get(node);
        if (!motion) return;
        const bounds = animalBounds(node, playgroundRect);
        motion.x = Math.min(Math.max(motion.x, bounds.minX), bounds.maxX);
        motion.y = Math.min(Math.max(motion.y, bounds.minY), bounds.maxY);
        node.style.setProperty("--animal-x", `${motion.x}px`);
        node.style.setProperty("--animal-y", `${motion.y}px`);
        node.style.setProperty("--animal-tilt", `${motion.vx > 0 ? motion.tilt : -motion.tilt}deg`);
      });
    }

    window.requestAnimationFrame(animateNavbarAnimals);
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

  animalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const animal = button.dataset.animal;
      const target = animalPlayground?.querySelector(`.nav-animal[data-animal="${animal}"]`);
      if (!animal || !target) return;

      const isNowHidden = target.classList.toggle("animal-hidden");
      const animalIsVisible = !isNowHidden;
      button.textContent = animalIsVisible ? animalLabels[animal].hide : animalLabels[animal].show;
      button.classList.toggle("animal-added-label", animalIsVisible);
      button.setAttribute("aria-pressed", String(animalIsVisible));

      if (!animalIsVisible) animalMotion.delete(target);
      updateAnimalControls();
      setMenuOpen(false);
    });
  });

  window.requestAnimationFrame(animateNavbarAnimals);
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


// Project Lab filters + cursor-reactive card glow
(() => {
  const filterButtons = document.querySelectorAll(".project-filter");
  const projectCards = document.querySelectorAll(".project-card-lab");
  const projectCategories = document.querySelectorAll(".project-category[data-project-group]");

  if (!filterButtons.length || !projectCards.length) return;

  const setFilter = (filter) => {
    filterButtons.forEach((button) => {
      const active = button.dataset.projectFilter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    projectCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("project-card-filtered-out", !visible);
      card.setAttribute("aria-hidden", visible ? "false" : "true");
    });

    projectCategories.forEach((category) => {
      const group = category.dataset.projectGroup;
      const visible = filter === "all" || group === filter;
      category.classList.toggle("project-category-hidden", !visible);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.projectFilter));
  });

  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--project-x", `${x}%`);
      card.style.setProperty("--project-y", `${y}%`);
    });
  });
})();


// Contact capability cards jump to matching project filters
(() => {
  const capabilityCards = document.querySelectorAll("[data-contact-project-filter]");
  if (!capabilityCards.length) return;

  capabilityCards.forEach((card) => {
    card.addEventListener("click", () => {
      const filter = card.dataset.contactProjectFilter;
      const projectButton = document.querySelector(`.project-filter[data-project-filter="${filter}"]`);
      const projectsSection = document.querySelector("#projects");

      if (projectButton) {
        projectButton.click();
      }

      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
