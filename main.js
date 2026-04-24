import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initCinematicScroll();
  initRoleReveal();
  initMagneticElements();
  initProjectExpansion();
  initContactForm();
});

window.addEventListener('load', () => {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.add('hidden');
    // Start hero stagger shortly after loader starts fading
    setTimeout(initHeroStagger, 300);
  } else {
    initHeroStagger();
  }
});

function initCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (!cursorDot || !cursorOutline || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  const animate = () => {
    const ease = 0.15;
    outlineX += (mouseX - outlineX) * ease;
    outlineY += (mouseY - outlineY) * ease;
    cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  };
  animate();

  // Scroll Animation for Cursor
  let scrollTimeout;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY) {
      cursorDot.classList.add('scroll-down');
      cursorDot.classList.remove('scroll-up');
    } else if (currentScrollY < lastScrollY) {
      cursorDot.classList.add('scroll-up');
      cursorDot.classList.remove('scroll-down');
    }
    
    lastScrollY = currentScrollY;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      cursorDot.classList.remove('scroll-down', 'scroll-up');
    }, 150);
  });

  document.querySelectorAll('a, button, input, textarea, .magnetic-hover, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorOutline.style.borderColor = 'var(--accent-primary)';
      cursorOutline.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1.5)`;
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.borderColor = 'var(--accent-glow-strong)';
      cursorOutline.style.backgroundColor = 'transparent';
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
    });
  });
}

function initHeroStagger() {
  const nav = document.getElementById('hero-nav');
  const card = document.getElementById('hero-card');
  const imgWrapper = document.getElementById('hero-img-wrapper');
  const name = document.getElementById('hero-name');
  const des = document.getElementById('hero-designation');
  const about = document.getElementById('hero-about');
  const actions = document.getElementById('hero-actions');
  const socials = document.getElementById('hero-socials');

  const applyAnim = (el, transform, delay) => {
    if(!el) return;
    setTimeout(() => {
      el.style.transition = 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1), opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
      el.style.transform = transform;
      el.style.opacity = '1';
      el.style.filter = 'blur(0px)';
    }, delay);
  };

  // Sequence according to user request
  applyAnim(nav, 'translateY(0)', 50);          // Navbar fades in first
  applyAnim(card, 'translateY(0)', 150);        // Container fades in + upward
  applyAnim(imgWrapper, 'translateY(0)', 300);  // Image rises from bottom + blur -> sharp
  
  // Text stagger
  applyAnim(name, 'translateX(0)', 450);
  applyAnim(des, 'translateX(0)', 550);
  applyAnim(about, 'translateY(0)', 650);
  applyAnim(actions, 'translateY(0)', 750);
  applyAnim(socials, 'translateY(0)', 850);
}

function initCinematicScroll() {
  const sections = document.querySelectorAll('.cinematic-section');
  let lastScrollY = window.scrollY;

  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px',
    threshold: 0.15 
  };

  // Keep track of which section is currently active to simulate "pages" 
  const observer = new IntersectionObserver((entries) => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Entering screen
        entry.target.classList.remove('leave-up');
        entry.target.classList.add('active');
        
        // Stagger reveal items
        const revealItems = entry.target.querySelectorAll('.reveal-item:not(.animate-in)');
        revealItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate-in');
          }, index * 100); // 100ms stagger
        });
      } else {
        // Leaving screen
        // Remove classes so it animates again when re-entering
        entry.target.querySelectorAll('.reveal-item').forEach(item => item.classList.remove('animate-in'));

        if(isScrollingDown) {
          // If scrolling down, the section sliding away goes UP
          entry.target.classList.remove('active');
          entry.target.classList.add('leave-up');
        } else {
          // Scrolling up, it just resets to default state (slider down)
          entry.target.classList.remove('active');
          entry.target.classList.remove('leave-up');
        }
      }
    });

    lastScrollY = currentScrollY;
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

function initRoleReveal() {
  const roles = document.querySelectorAll('.role-card');
  const roleModal = document.getElementById('role-modal');
  const overlay = document.getElementById('expansion-overlay');
  const mTitle = document.getElementById('role-modal-title');
  const mDesc = document.getElementById('role-modal-desc');
  const mSkills = document.getElementById('role-modal-skills');
  const closeBtn = document.getElementById('close-role-modal');

  roles.forEach(role => {
    role.addEventListener('click', () => {
      // Extract data
      const title = role.querySelector('h3').innerText;
      const desc = role.querySelector('p').innerText;
      const skillsRaw = role.querySelector('.role-skills').innerText;
      
      // Populate Modal
      mTitle.innerText = title;
      mDesc.innerText = desc;
      mSkills.innerHTML = skillsRaw.split(',').map(s => `<li>${s.trim()}</li>`).join('');
      
      // Open Modal
      overlay.classList.add('active');
      roleModal.classList.add('active');
    });
  });

  if (closeBtn) {
    const closeModal = () => {
      roleModal.classList.remove('active');
      overlay.classList.remove('active');
    };
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
  }
}

function initProjectExpansion() {
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const overlay = document.getElementById('expansion-overlay');
  const closeBtn = document.getElementById('close-modal');
  
  if(!modal) return; // fail safe
  
  // Modal Elements
  const mBg = modal.querySelector('.modal-gradient-bg');
  const mTitle = document.getElementById('modal-title');
  const mSub = document.getElementById('modal-subtitle');
  const mIntro = document.getElementById('modal-intro');
  const mDocs = document.getElementById('modal-docs');
  const viewDocBtn = document.getElementById('view-doc-btn');
  
  // Doc Elements
  const dOverview = document.getElementById('doc-overview');
  const dFeatures = document.getElementById('doc-features');
  const dTech = document.getElementById('doc-tech');

  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      // 1. Read Data
      const dataNode = this.querySelector('.project-data');
      if(!dataNode) return;
      
      const theme = dataNode.querySelector('.data-theme').innerText;
      const title = dataNode.querySelector('.data-title').innerText;
      const subtitle = dataNode.querySelector('.data-subtitle').innerText;
      const short = dataNode.querySelector('.data-short').innerText;
      const desc = dataNode.querySelector('.data-description').innerText;
      const features = dataNode.querySelector('.data-features').innerText.split('|');
      const tech = dataNode.querySelector('.data-tech').innerText.split('|');
      
      // 2. Populate Modal Top
      mBg.style.background = theme;
      mTitle.innerText = title;
      mSub.innerText = subtitle;
      mIntro.innerText = short;
      
      // 3. Populate Docs
      dOverview.innerText = desc;
      dFeatures.innerHTML = features.map(f => `<li>${f}</li>`).join('');
      dTech.innerHTML = tech.map(t => `<li>${t}</li>`).join('');
      
      // 4. Reset Doc State (Hide Docs)
      mDocs.classList.remove('active', 'visible');
      viewDocBtn.style.display = 'inline-flex';
      
      // 5. Open Modal
      overlay.classList.add('active');
      modal.classList.add('active');
      modal.querySelector('.modal-scroll-container').scrollTop = 0; // reset scroll
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Docs Button Logic
  viewDocBtn.addEventListener('click', () => {
    viewDocBtn.style.display = 'none';
    mDocs.classList.add('active');
    
    // Need reflow to transition opacity/transform
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mDocs.classList.add('visible');
        // Scroll down slightly
        const scrollContainer = modal.querySelector('.modal-scroll-container');
        const scrollTo = mDocs.offsetTop - 50;
        scrollContainer.scrollTo({ top: scrollTo, behavior: 'smooth' });
      });
    });
  });
}

function initMagneticElements() {
  const magnets = document.querySelectorAll('.magnetic');
  if (window.innerWidth < 768) return;

  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3; 
      
      this.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    });

    magnet.addEventListener('mouseleave', function() {
      this.style.transform = `translate3d(0px, 0px, 0px)`;
      this.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => {
        this.style.transition = '';
      }, 500);
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const subject = encodeURIComponent(`New Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:mukundganeshkumarg@hotmail.com?subject=${subject}&body=${body}`;
  });
}
