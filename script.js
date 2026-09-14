document.documentElement.classList.add('js');

const workData = {
  launch: {
    title: 'A site that starts with the right question.',
    description: 'For new businesses, offers, and chapters that need a confident first impression — with enough structure to keep growing after launch.',
    deliverables: ['Positioning', 'Page plan', 'Visual system'],
    label: 'BUILD / NEW',
    visualTitle: 'Start<br>with <em>signal.</em>',
    visualClass: ''
  },
  rebuild: {
    title: 'A clearer version of what is already true.',
    description: 'For businesses that have outgrown a website that feels generic, hard to use, or disconnected from the quality of the work.',
    deliverables: ['Content audit', 'UX reset', 'Rebuild'],
    label: 'REBUILD / SHARPEN',
    visualTitle: 'Make the<br>good stuff <em>clear.</em>',
    visualClass: 'work-panel__visual--rebuild'
  },
  system: {
    title: 'A web presence that keeps moving after launch.',
    description: 'For teams that need reusable pieces, a consistent visual language, and a site that can support the next campaign, offer, or location.',
    deliverables: ['Components', 'Handoff', 'Momentum'],
    label: 'SYSTEM / GROW',
    visualTitle: 'Build<br>to <em>move.</em>',
    visualClass: 'work-panel__visual--system'
  }
};

const workPanel = document.querySelector('#work-panel');
const workTabs = [...document.querySelectorAll('[data-work-tab]')];

function renderWork(key = 'launch') {
  if (!workPanel) return;
  const item = workData[key];
  workPanel.innerHTML = `
    <div class="work-panel__copy">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="work-panel__deliverables" aria-label="Included deliverables">
        ${item.deliverables.map((deliverable) => `<span>${deliverable}</span>`).join('')}
      </div>
    </div>
    <div class="work-panel__visual ${item.visualClass}">
      <span class="work-panel__visual__label">${item.label}</span>
      <strong class="work-panel__visual__title">${item.visualTitle}</strong>
    </div>
  `;
}

workTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    workTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    renderWork(tab.dataset.workTab);
  });
});

renderWork();

const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-menu-toggle]');
const primaryNav = document.querySelector('#primary-nav');

function setNav(open) {
  if (!navToggle || !primaryNav) return;
  navToggle.setAttribute('aria-expanded', String(open));
  primaryNav.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
}

navToggle?.addEventListener('click', () => {
  setNav(navToggle.getAttribute('aria-expanded') !== 'true');
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNav(false));
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const briefChips = [...document.querySelectorAll('[data-brief-chip]')];
const copyBriefButton = document.querySelector('[data-copy-brief]');
const contactStatus = document.querySelector('[data-contact-status]');
let selectedBrief = 'a new website';

briefChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    briefChips.forEach((item) => item.classList.remove('is-selected'));
    chip.classList.add('is-selected');
    selectedBrief = chip.dataset.briefChip;
    if (contactStatus) contactStatus.textContent = `Good starting point: ${selectedBrief}.`;
  });
});

copyBriefButton?.addEventListener('click', async () => {
  const brief = `Hi NexSite,\n\nI’m exploring ${selectedBrief}.\n\nWhat I need the website to help with:\n\nA little about the business:\n\nBest way to reach me:`;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(brief);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = brief;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    if (contactStatus) contactStatus.textContent = 'Brief copied. Paste it into your email when you’re ready.';
  } catch (error) {
    if (contactStatus) contactStatus.textContent = 'Select Email the studio to start the conversation.';
  }
});
