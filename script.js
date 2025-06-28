// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupPortfolioFilters();
    setupSkillsAnimation();
    setupContactForm();
    setupScrollAnimations();
    setupSmoothScrolling();
}

// Navigation Functions
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Portfolio Filter Functions
function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
}

// Skills Animation Functions
function setupSkillsAnimation() {
    const skillsSection = document.getElementById('habilidades');
    const progressBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;
        
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
        
        skillsAnimated = true;
    }

    // Intersection Observer for skills animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.5 });

    skillsObserver.observe(skillsSection);
}

// ---------------- CONFIG ----------------
const FORM_ENDPOINT = "https://formspree.io/f/meokvdza";
const FALLBACK_EMAIL = "maria.j.quiroga.09@gmail.com";      // mailto de respaldo
// ----------------------------------------

function setupContactForm() {
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1️⃣  Datos del formulario
    const formData = new FormData(this);
    const name    = formData.get("name");
    const email   = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // 2️⃣  Validaciones rápidas
    if (!name || !email || !subject || !message) {
      showNotification("Por favor, completa todos los campos.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showNotification("Por favor, ingresa un email válido.", "error");
      return;
    }

    // 3️⃣  Bloquea botón mientras enviamos
    const btn   = contactForm.querySelector('button[type="submit"]');
    const txt   = btn.textContent;
    btn.textContent = "Enviando…";
    btn.disabled    = true;

    try {
      // 4️⃣  ENVÍO PRO: fetch a Formspree
      const resp = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body:   formData,
        headers:{ Accept: "application/json" }
      });

      if (resp.ok) {
        showNotification("¡Mensaje enviado correctamente! 😊", "success");
        contactForm.reset();
      } else {
        throw new Error("Formspree rechazó el envío");
      }
    } catch (err) {
      console.warn("Formspree error:", err.message);

      // 5️⃣  PLAN B: abrir mailto si algo falla
      const body = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${email}\n\n${message}`
      );
      const mailto =
        `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;

      showNotification(
        "No se pudo enviar automáticamente. Abriendo tu cliente de correo…",
        "error"
      );
      window.location.href = mailto;
    } finally {
      // 6️⃣  Restaurar botón
      btn.textContent = txt;
      btn.disabled    = false;
    }
  });
}



// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        ${type === 'success' ? 'background: #10B981;' : 'background: #EF4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll Animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .about-text, .skill-item, .contact-info, .footer-section');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modalId);
            }
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function () {
    // Hover effect en portfolio
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Efecto máquina de escribir suave con span animado
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const part1 = 'Creando ';
        const part2 = 'experiencias visuales'; // dentro del span
        const part3 = ' que inspiran y conectan';

        heroTitle.innerHTML = '';

        const span = document.createElement('span');
        span.className = 'gradient-text';

        // Escribimos la parte 1 letra por letra
        let i = 0;
        function typePart1() {
            if (i < part1.length) {
                heroTitle.innerHTML += part1.charAt(i);
                i++;
                setTimeout(typePart1, 70);
            } else {
                heroTitle.appendChild(span);
                typeSpanPart();
            }
        }

        // Escribimos el texto del span
        let j = 0;
        function typeSpanPart() {
            if (j < part2.length) {
                span.textContent += part2.charAt(j);
                j++;
                setTimeout(typeSpanPart, 70);
            } else {
                typePart3();
            }
        }

        // Escribimos la parte final
        let k = 0;
        function typePart3() {
            function step() {
                if (k < part3.length) {
                    heroTitle.appendChild(document.createTextNode(part3.charAt(k)));
                    k++;
                    setTimeout(step, 70);
                }
            }
            setTimeout(step, 200); // Pausa sutil antes del cierre
        }

        // Iniciar animación
        setTimeout(typePart1, 500);
    }

    // Parallax efecto
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero && heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});


// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events here if needed
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);