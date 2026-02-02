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
});

