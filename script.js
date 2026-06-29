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



// GitHub repo last updated dates
(() => {
  const repoBadges = document.querySelectorAll(".repository-tag");
  if (!repoBadges.length) return;

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  repoBadges.forEach((badge) => {
    const repo = badge.dataset.repo;
    if (!repo) return;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API failed");
        return res.json();
      })
      .then((data) => {
        badge.textContent = `Last Updated ${formatDate(data.pushed_at)}`;
      })
      .catch(() => {
        badge.textContent = "Updated recently";
      });
  });
})();

// Simple portfolio visit counter
(() => {
  const counter = document.querySelector("#visit-count");
  if (!counter) return;

  fetch("https://portfolio-visit-counter.pathikcodes.workers.dev")
    .then((res) => res.json())
    .then((data) => {
      console.log("Counter response:", data);

      const value =
        data?.data?.count ??
        data?.data?.value ??
        data?.data?.up_count ??
        data?.count ??
        data?.value;

      const numberValue = Number(value);

      counter.textContent = Number.isFinite(numberValue)
        ? numberValue.toLocaleString()
        : "—";
    })
    .catch((err) => {
      console.error("Visit counter failed:", err);
      counter.textContent = "—";
    });
})();

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


// Ask Pathik AI — local portfolio assistant (no internet, no API key)
(() => {
  const knowledge = Array.isArray(window.PORTFOLIO_KNOWLEDGE) ? window.PORTFOLIO_KNOWLEDGE : [];
  const toggle = document.querySelector(".portfolio-ai-toggle");
  const panel = document.querySelector(".portfolio-ai-panel");
  const closeButton = document.querySelector(".portfolio-ai-close");
  const form = document.querySelector(".portfolio-ai-form");
  const input = document.querySelector(".portfolio-ai-input");
  const messages = document.querySelector(".portfolio-ai-messages");
  const suggestions = document.querySelector(".portfolio-ai-suggestions");
  const suggestionButtons = document.querySelectorAll(".portfolio-ai-suggestions button");

  if (!toggle || !panel || !form || !input || !messages || !knowledge.length) return;

  const stopWords = new Set([
    "what", "which", "did", "does", "do", "the", "and", "for", "with", "about", "pathik",
    "his", "him", "he", "in", "on", "of", "to", "a", "an", "is", "are", "was", "were",
    "show", "shows", "tell", "me", "explain", "exactly", "project", "projects", "work",
    "experience", "skills", "skill", "use", "uses", "using", "strongest"
  ]);

  const aliasMap = {
    "rag": ["retrieval", "agentic", "langchain", "langgraph", "faiss"],
    "backend": ["api", "apis", "django", "fastapi", "node", "express", "postgresql", "dynamodb"],
    "api": ["backend", "fastapi", "django", "openapi", "rest"],
    "data": ["pipeline", "pipelines", "databricks", "snowflake", "azure", "lakehouse", "power", "sql"],
    "ai": ["ml", "machine", "learning", "rag", "model", "classification", "deep", "opencv", "bert"],
    "ml": ["ai", "machine", "learning", "model", "classification", "lstm", "bert", "xgboost"],
    "cloud": ["aws", "azure", "gcp", "s3", "vercel"],
    "mobile": ["android", "kotlin", "flutter", "app"],
    "website": ["web", "frontend", "react", "next", "saas"],
    "reverse": ["image", "search", "clip", "resnet", "opencv"],
    "vibesea": ["anti", "cheat", "proctoring", "backend"],
    "orail": ["face", "recognition", "reverse", "image", "mern"],
    "imd": ["weather", "climate", "forecasting", "satellite", "isro"],
    "certification": ["certificate", "hackerrank", "google", "skills"],
    "certifications": ["certificate", "hackerrank", "google", "skills"]
  };

  const normalize = (text) =>
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9+#.]+/g, " ")
      .trim();

  const getItemText = (item) => {
    return normalize([
      item.type,
      item.title,
      item.date,
      item.summary,
      ...(item.details || []),
      ...(item.skills || []),
      item.source
    ].join(" "));
  };

  const tokenize = (question) => {
    const baseTokens = normalize(question)
      .split(/\s+/)
      .filter((token) => token && token.length > 1 && !stopWords.has(token));

    const expanded = new Set(baseTokens);
    baseTokens.forEach((token) => {
      (aliasMap[token] || []).forEach((alias) => expanded.add(alias));
    });

    return [...expanded];
  };

  const scoreItem = (item, tokens, rawQuestion) => {
    const text = getItemText(item);
    const title = normalize(item.title);
    const source = normalize(item.source);
    let score = 0;

    tokens.forEach((token) => {
      if (title.includes(token)) score += 8;
      if (source.includes(token)) score += 3;
      if (text.includes(token)) score += 2;
      (item.skills || []).forEach((skill) => {
        if (normalize(skill).includes(token)) score += 4;
      });
    });

    const q = normalize(rawQuestion);
    if (q.includes(title) || title.split(" ").some((word) => word.length > 5 && q.includes(word))) {
      score += 12;
    }

    if (q.includes("backend") && item.skills?.some((skill) => /api|django|fastapi|node|express|postgres|dynamo/i.test(skill))) score += 7;
    if ((q.includes("data") || q.includes("pipeline")) && item.skills?.some((skill) => /data|sql|azure|databricks|snowflake|pipeline|power bi|spark/i.test(skill))) score += 7;
    if ((q.includes("ai") || q.includes("ml") || q.includes("machine learning")) && item.skills?.some((skill) => /ai|ml|bert|lstm|rag|opencv|tensorflow|pytorch|xgboost|classification|learning/i.test(skill))) score += 7;
    if ((q.includes("web") || q.includes("website") || q.includes("frontend")) && item.skills?.some((skill) => /react|next|tailwind|web|frontend|saas/i.test(skill))) score += 7;
    if ((q.includes("app") || q.includes("mobile") || q.includes("android")) && item.skills?.some((skill) => /android|kotlin|flutter|app/i.test(skill))) score += 7;

    return score;
  };

  const retrieve = (question, limit = 4) => {
    const tokens = tokenize(question);
    return knowledge
      .map((item) => ({ item, score: scoreItem(item, tokens, question) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.item);
  };

  const escapeHTML = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatItemAnswer = (item, detailed = true) => {
    const details = (item.details || []).slice(0, detailed ? 3 : 2);
    const skills = (item.skills || []).slice(0, 8).join(" · ");

    return `
      <p><strong>${escapeHTML(item.title)}</strong>${item.date ? ` <span class="ai-date">(${escapeHTML(item.date)})</span>` : ""}</p>
      <p>${escapeHTML(item.summary)}</p>
      ${details.length ? `<ul>${details.map((detail) => `<li>${escapeHTML(detail)}</li>`).join("")}</ul>` : ""}
      ${skills ? `<p><strong>Stack / skills:</strong> ${escapeHTML(skills)}</p>` : ""}
    `;
  };

  const makeAnswer = (question) => {
    const q = normalize(question);
    const matches = retrieve(question, q.includes("which") || q.includes("show") ? 5 : 3);

    if (!matches.length) {
      return {
        html: `<p>I don’t have that information in Pathik’s local portfolio context. Try asking about a listed project, experience, skill, certification, or education item.</p>`,
        sources: []
      };
    }

    let html = "";

    if (q.includes("strongest") && (q.includes("ai") || q.includes("ml"))) {
      const preferred = matches.filter((item) => /rag|reverse image|video sentiment|imd|orail/i.test(item.title));
      const selected = preferred.length ? preferred.slice(0, 3) : matches.slice(0, 3);
      html = `<p>Based on the portfolio context, these are strong AI/ML examples:</p>` +
        selected.map((item) => formatItemAnswer(item, false)).join("");
      return { html, sources: selected };
    }

    if (q.includes("which") || q.includes("show") || q.includes("list")) {
      html = `<p>Here are the most relevant portfolio items I found:</p>` +
        matches.map((item) => formatItemAnswer(item, false)).join("");
      return { html, sources: matches };
    }

    const primary = matches[0];
    html = formatItemAnswer(primary, true);

    if (matches.length > 1 && !q.includes(normalize(primary.title))) {
      html += `<p>Related context also appears in ${matches.slice(1).map((item) => `<strong>${escapeHTML(item.title)}</strong>`).join(", ")}.</p>`;
    }

    return { html, sources: matches };
  };

  const addMessage = (html, sender = "assistant", sources = []) => {
    const message = document.createElement("div");
    message.className = `ai-message ${sender === "user" ? "user-message" : "assistant-message"}`;
    message.innerHTML = html;

    if (sender === "assistant" && sources.length) {
      const sourceList = document.createElement("div");
      sourceList.className = "ai-source-list";
      sources.slice(0, 4).forEach((item) => {
        const chip = document.createElement("span");
        chip.className = "ai-source-chip";
        chip.textContent = item.source || item.title;
        sourceList.appendChild(chip);
      });
      message.appendChild(sourceList);
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const hideSuggestions = () => {
    suggestions?.classList.add("suggestions-hidden");
  };

  const askQuestion = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    hideSuggestions();
    addMessage(`<p>${escapeHTML(cleanQuestion)}</p>`, "user");
    input.value = "";

    const typing = document.createElement("div");
    typing.className = "ai-message assistant-message ai-thinking";
    typing.innerHTML = "<p>Searching local portfolio context...</p>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(() => {
      typing.remove();
      const answer = makeAnswer(cleanQuestion);
      addMessage(answer.html, "assistant", answer.sources);
    }, 260);
  };

  const openPanel = () => {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    window.setTimeout(() => input.focus(), 80);
  };

  const closePanel = () => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    panel.classList.contains("open") ? closePanel() : openPanel();
  });

  closeButton?.addEventListener("click", closePanel);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    askQuestion(input.value);
  });

  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPanel();
      askQuestion(button.textContent || "");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("open")) closePanel();
  });
})();


// Contact copy email action
(() => {
  const copyButtons = document.querySelectorAll("[data-copy-email]");
  if (!copyButtons.length) return;

  copyButtons.forEach((button) => {
    const label = button.querySelector("span:last-child");
    const originalText = label?.textContent || "Copy Email";

    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail || "pathikcodes@gmail.com";

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement("input");
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          tempInput.remove();
        }

        button.classList.add("copied");
        if (label) label.textContent = "Copied!";
        window.setTimeout(() => {
          button.classList.remove("copied");
          if (label) label.textContent = originalText;
        }, 1600);
      } catch (error) {
        if (label) label.textContent = "Copy failed";
        window.setTimeout(() => {
          if (label) label.textContent = originalText;
        }, 1600);
      }
    });
  });
})();


// Scroll-reactive 3D background
(() => {
  const background = document.querySelector(".scroll-3d-background");
  if (!background) return;

  const sections = [
    { id: "home", key: "home" },
    { id: "skills", key: "skills" },
    { id: "experience", key: "experience" },
    { id: "projects", key: "projects" },
    { id: "contact", key: "contact" }
  ];

  let ticking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateScene = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = clamp(window.scrollY / maxScroll, 0, 1);

    background.style.setProperty("--scroll-progress", progress.toFixed(4));
    background.style.setProperty("--scroll-shift", `${(progress * 260).toFixed(2)}vh`);
    background.style.setProperty("--scroll-rotate", `${((progress - 0.5) * 7).toFixed(2)}deg`);
    background.style.setProperty("--scroll-depth", `${(progress * 70).toFixed(2)}px`);

    const probe = window.scrollY + window.innerHeight * 0.42;
    let active = "home";

    sections.forEach(({ id, key }) => {
      const section = document.getElementById(id);
      if (!section) return;
      if (section.offsetTop <= probe) active = key;
    });

    background.dataset.activeSection = active;
    ticking = false;
  };

  const requestSceneUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScene);
    }
  };

  window.addEventListener("scroll", requestSceneUpdate, { passive: true });
  window.addEventListener("resize", requestSceneUpdate);
  requestSceneUpdate();

  window.addEventListener("pointermove", (event) => {
    background.style.setProperty("--cursor-x", `${(event.clientX / window.innerWidth) * 100}%`);
    background.style.setProperty("--cursor-y", `${(event.clientY / window.innerHeight) * 100}%`);
  }, { passive: true });
})();

// Keep Ask Pathik AI messages auto-scrolled inside the fixed chat box
(() => {
  const messages = document.querySelector(".portfolio-ai-messages");
  if (!messages) return;

  const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const observer = new MutationObserver(scrollToBottom);
  observer.observe(messages, { childList: true, subtree: true });

  scrollToBottom();
})();