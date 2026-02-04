// StoryMap Workshop - Script.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("StoryMap Workshop Loaded. Ready to teach!");

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Header offset
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = document.querySelectorAll(
    ".feature-card, .step-item, .integration-card, .tour-text, .tour-visual, .timeline-item, .resource-card, .module-card, .tutorial-step, .lab-task, .idea-card, .requirement-card, .inspiration-card, .block-card, .immersive-card",
  );

  animatedElements.forEach((el) => {
    el.classList.add("fade-on-scroll");
    observer.observe(el);
  });

  // Header scroll effect
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // Progress indicator for tutorial pages
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  progressBar.innerHTML = '<div class="progress-fill"></div>';
  
  const tutorialContent = document.querySelector('.tutorial-content, .lab-content');
  if (tutorialContent) {
    document.body.appendChild(progressBar);
    
    const style = document.createElement('style');
    style.textContent = `
      .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 1001;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #38bdf8, #818cf8, #a855f7);
        width: 0%;
        transition: width 0.1s ease;
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      
      progressBar.querySelector('.progress-fill').style.width = `${progress}%`;
    });
  }

  // Lab checklist persistence
  const checklistItems = document.querySelectorAll('.checklist-item input');
  if (checklistItems.length > 0) {
    const storageKey = 'storymap-lab-progress';
    
    // Load saved progress
    const savedProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    checklistItems.forEach((checkbox, index) => {
      if (savedProgress[index]) {
        checkbox.checked = true;
      }
    });

    // Save progress on change
    checklistItems.forEach((checkbox, index) => {
      checkbox.addEventListener('change', () => {
        const progress = {};
        checklistItems.forEach((cb, i) => {
          if (cb.checked) progress[i] = true;
        });
        localStorage.setItem(storageKey, JSON.stringify(progress));
      });
    });
  }

  // Image Lightbox for Tutorial Screenshots
  const tutorialImages = document.querySelectorAll('.tutorial-screenshot, .step-visual img');
  
  if (tutorialImages.length > 0) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <img src="" alt="" class="lightbox-image">
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Add click handlers to images
    tutorialImages.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Inject lightbox styles
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
      .image-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      .image-lightbox.active {
        opacity: 1;
        visibility: visible;
      }
      .lightbox-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(8px);
      }
      .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }
      .image-lightbox.active .lightbox-content {
        transform: scale(1);
      }
      .lightbox-image {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }
      .lightbox-caption {
        margin-top: 1rem;
        color: #94a3b8;
        font-size: 0.9rem;
        text-align: center;
      }
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        line-height: 1;
      }
      .lightbox-close:hover {
        opacity: 1;
      }
      .tutorial-screenshot:hover,
      .step-visual img:hover {
        opacity: 0.9;
        transition: opacity 0.2s ease;
      }
    `;
    document.head.appendChild(lightboxStyles);
  }
});

