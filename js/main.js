document.addEventListener('DOMContentLoaded', () => {
  // --- Responsive Mobile Navigation ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // --- Dynamic Header Scroll Effect ---
  const header = document.getElementById('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial call on load
    handleScroll();
  }

  // --- Hero Slider Carousel ---
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    
    // Create pagination dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetTimer();
      });
      if (dotsContainer) dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    const goToSlide = (n) => {
      slides[currentSlide].classList.remove('active');
      if (dots.length > 0) dots[currentSlide].classList.remove('active');
      
      currentSlide = (n + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('active');
      if (dots.length > 0) dots[currentSlide].classList.add('active');
    };
    
    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };
    
    const prevSlide = () => {
      goToSlide(currentSlide - 1);
    };
    
    // Manual Navigation Listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
      });
    }
    
    // Automatic timer
    const startTimer = () => {
      slideInterval = setInterval(nextSlide, 6000);
    };
    
    const resetTimer = () => {
      clearInterval(slideInterval);
      startTimer();
    };
    
    startTimer();
  }

  // --- Scroll Reveal Animations ---
  const animateElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window && animateElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    animateElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback: immediately show all elements if observer is not supported
    animateElements.forEach(element => {
      element.classList.add('animate-fade-in');
    });
  }

  // --- Client-Side Form Validation & Modals ---
  const contactForm = document.getElementById('contact-form');
  const careersForm = document.getElementById('careers-form');
  const vendorForm = document.getElementById('vendor-form');
  
  const showFeedbackModal = (title, message) => {
    // Check if dialog already exists
    let dialog = document.getElementById('feedback-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'feedback-dialog';
      dialog.className = 'glass-card';
      dialog.style.position = 'fixed';
      dialog.style.top = '50%';
      dialog.style.left = '50%';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.border = '1px solid var(--accent-cyan)';
      dialog.style.zIndex = '2000';
      dialog.style.maxWidth = '450px';
      dialog.style.width = '90%';
      dialog.style.color = 'var(--text-primary)';
      dialog.style.padding = '2rem';
      
      const content = `
        <h3 id="dialog-title" style="color: var(--accent-cyan); margin-bottom: 1rem;"></h3>
        <p id="dialog-msg" style="margin-bottom: 1.5rem;"></p>
        <button id="close-dialog-btn" class="btn btn-primary" style="width: 100%;">Close</button>
      `;
      dialog.innerHTML = content;
      document.body.appendChild(dialog);
      
      const closeBtn = dialog.querySelector('#close-dialog-btn');
      closeBtn.addEventListener('click', () => {
        dialog.close();
      });
      
      // Close on clicking outside of bounds (light-dismiss)
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          dialog.close();
        }
      });
    }
    
    document.getElementById('dialog-title').innerText = title;
    document.getElementById('dialog-msg').innerText = message;
    dialog.showModal();
  };

  const validateForm = (form, successCallback) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
      });
      
      if (isValid) {
        successCallback();
        form.reset();
      } else {
        showFeedbackModal('Validation Error', 'Please fill in all required fields.');
      }
    });
  };

  if (contactForm) {
    validateForm(contactForm, () => {
      showFeedbackModal('Thank You!', 'Your message has been successfully sent. A Lothal Marine representative will get back to you shortly.');
    });
  }
  
  if (careersForm) {
    validateForm(careersForm, () => {
      showFeedbackModal('Application Submitted!', 'Thank you for applying to Lothal Marine. Our Human Resources team will review your application and contact you if your profile matches our requirements.');
    });
  }

  if (vendorForm) {
    validateForm(vendorForm, () => {
      showFeedbackModal('Registration Submitted!', 'Your vendor registration has been received. Our procurement team will review your documentation and connect with you.');
    });
  }
});
