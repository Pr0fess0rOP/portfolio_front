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
