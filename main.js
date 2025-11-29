

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1500);
});

const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 100);
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});

document.querySelectorAll('.cta-button').forEach(button => {
  if (button.textContent.includes('Explore')) {
    button.addEventListener('click', () => {
      document.getElementById('models').scrollIntoView({ behavior: 'smooth' });
    });
  } else if (button.textContent.includes('Test Drive')) {
    button.addEventListener('click', () => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }
});

const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.model-card, .feature-card, .gallery-item').forEach(el => {
  observer.observe(el);
});

let currentFeatureIndex = 0;
const featureNavBtns = document.querySelectorAll('.feature-nav-btn');

featureNavBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    currentFeatureIndex = index;
    updateFeatureNav();
  });
});

function updateFeatureNav() {
  featureNavBtns.forEach((btn, index) => {
    if (index === currentFeatureIndex) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

const specsData = {
  'apex-r': {
    horsepower: 850,
    acceleration: 2.1,
    range: 520,
    topSpeed: 215
  },
  'apex-gt': {
    horsepower: 680,
    acceleration: 3.2,
    range: 480,
    topSpeed: 195
  },
  'apex-x': {
    horsepower: 520,
    acceleration: 4.1,
    range: 450,
    topSpeed: 175
  }
};

const specTabs = document.querySelectorAll('.spec-tab');
let currentModel = 'apex-r';

specTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    specTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentModel = tab.dataset.tab;
    updateStats();
  });
});

function updateStats() {
  const data = specsData[currentModel];
  const statItems = document.querySelectorAll('.stat-item');

  statItems.forEach((item, index) => {
    const statValue = item.querySelector('.stat-value');
    const statCircle = item.querySelector('.stat-circle');
    const progressCircle = item.querySelector('.stat-ring-progress');

    let targetValue, displayValue;
    switch(index) {
      case 0:
        targetValue = data.horsepower;
        displayValue = targetValue;
        break;
      case 1:
        targetValue = data.acceleration;
        displayValue = targetValue.toFixed(1);
        break;
      case 2:
        targetValue = data.range;
        displayValue = targetValue;
        break;
      case 3:
        targetValue = data.topSpeed;
        displayValue = targetValue;
        break;
    }

    statValue.setAttribute('data-target', displayValue);

    const percentage = statCircle.dataset.value;
    const circumference = 283;
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;

    animateCounter(statValue, displayValue);
  });
}

function animateCounter(element, target) {
  target = Number(target); // <-- FIX

  const duration = 1500;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent =
        target % 1 === 0 ? Math.round(target) : target.toFixed(1);
      clearInterval(timer);
    } else {
      element.textContent =
        current % 1 === 0 ? Math.round(current) : current.toFixed(1);
    }
  }, 16);
}


const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      updateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.specs-content');
if (statsSection) {
  statsObserver.observe(statsSection);
}

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hide');
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.classList.add('hide');
        }, 300);
      }
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
let currentImageIndex = 0;
let visibleImages = [];

function updateVisibleImages() {
  visibleImages = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
}

galleryItems.forEach((item, index) => {
  const zoomBtn = item.querySelector('.gallery-zoom');
  zoomBtn.addEventListener('click', () => {
    updateVisibleImages();
    currentImageIndex = visibleImages.indexOf(item);
    const img = item.querySelector('img');
    lightboxImage.src = img.src.replace('w=600', 'w=1200');
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelector('.lightbox-nav.prev').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
  const img = visibleImages[currentImageIndex].querySelector('img');
  lightboxImage.src = img.src.replace('w=600', 'w=1200');
});

document.querySelector('.lightbox-nav.next').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
  const img = visibleImages[currentImageIndex].querySelector('img');
  lightboxImage.src = img.src.replace('w=600', 'w=1200');
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    document.querySelector('.lightbox-nav.prev').click();
  } else if (e.key === 'ArrowRight') {
    document.querySelector('.lightbox-nav.next').click();
  }
});

let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialTrack = document.getElementById('testimonialsTrack');

function updateTestimonials() {
  testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

  testimonialCards.forEach((card, index) => {
    if (index === currentTestimonial) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

document.querySelector('.testimonial-nav-btn.prev').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  updateTestimonials();
});

document.querySelector('.testimonial-nav-btn.next').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  updateTestimonials();
});

setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  updateTestimonials();
}, 6000);

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = contactForm.querySelector('.submit-button');
  submitButton.classList.add('loading');
  submitButton.disabled = true;

  await new Promise(resolve => setTimeout(resolve, 2000));

  submitButton.classList.remove('loading');
  submitButton.disabled = false;

  contactForm.style.display = 'none';
  formSuccess.classList.add('show');

  createConfetti();
});

function createConfetti() {
  const colors = ['#00d4ff', '#7b2ff7', '#ffffff'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.zIndex = '10001';
    confetti.style.pointerEvents = 'none';

    document.body.appendChild(confetti);

    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    const xMovement = (Math.random() - 0.5) * 200;

    confetti.animate([
      { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(100vh) translateX(${xMovement}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  const email = input.value;

  if (email) {
    input.value = '';

    const successMsg = document.createElement('div');
    successMsg.textContent = 'Thanks for subscribing!';
    successMsg.style.color = '#00d4ff';
    successMsg.style.fontSize = '0.9rem';
    successMsg.style.marginTop = '0.5rem';
    newsletterForm.appendChild(successMsg);

    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.style.position = 'absolute';
svg.style.width = '0';
svg.style.height = '0';
svg.innerHTML = `
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7b2ff7;stop-opacity:1" />
    </linearGradient>
  </defs>
`;
document.body.appendChild(svg);

const parallaxElements = document.querySelectorAll('.hero-background');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  parallaxElements.forEach(el => {
    const speed = 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

console.log('%c APEX Motors ', 'background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%); color: white; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c Experience the Future of Luxury Automotive ', 'color: #00d4ff; font-size: 14px;');