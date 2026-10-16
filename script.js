const navToggle = document.querySelector('.nav-toggle');
const navMenuWrap = document.querySelector('.nav-menu-wrap');
const navLinks = document.querySelectorAll('.nav-menu a');
const form = document.getElementById('booking-form');
const formStatus = document.getElementById('form-status');
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (navToggle && navMenuWrap) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenuWrap.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenuWrap.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');

if (!('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const setActiveLink = () => {
  const sections = document.querySelectorAll('main section[id]');
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 160 && rect.bottom >= 160) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === '#' + currentId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

document.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = {
      name: document.getElementById('name'),
      phone: document.getElementById('phone'),
      service: document.getElementById('service'),
      date: document.getElementById('date'),
      time: document.getElementById('time')
    };

    let isValid = true;

    Object.entries(fields).forEach(([key, field]) => {
      const value = field ? field.value.trim() : '';
      let isFieldValid = true;

      if (!value) {
        isFieldValid = false;
        isValid = false;
      }

      if (key === 'phone' && value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
          isFieldValid = false;
          isValid = false;
        }
      }

      if (field) {
        field.setAttribute('aria-invalid', String(!isFieldValid));
        field.style.borderColor = isFieldValid ? 'rgba(255, 255, 255, 0.08)' : 'rgba(247, 177, 166, 0.8)';
      }
    });

    if (!isValid) {
      formStatus.textContent = 'Please complete all fields with valid details before submitting.';
      formStatus.classList.add('error');
      return;
    }

    formStatus.textContent = 'This is a demo request only. No real backend is connected yet, so the appointment is not being sent anywhere.';
    formStatus.classList.remove('error');
    form.reset();
  });
}
