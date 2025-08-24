// GrasasBio JavaScript - Vanilla JS Implementation

// Initialize Lucide icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize all functionality
    initMobileMenu();
    initCounterAnimations();
    initScrollAnimations();
    initSmoothScrolling();
    initFormHandlers();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    if (!mobileMenuBtn || !mobileNav || !menuIcon || !closeIcon) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            mobileNav.classList.remove('active');
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        } else {
            mobileNav.classList.add('active');
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        }
    });
    
    // Close mobile menu when clicking on nav links
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        });
    });
}

// Animated Counter Functionality
function initCounterAnimations() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(numberElement => {
                    const target = parseInt(numberElement.getAttribute('data-target'));
                    animateCounter(numberElement, target, 2500);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString('es-CO').replace(/,/g, '.');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('es-CO').replace(/,/g, '.');
        }
    }
    
    updateCounter();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-20px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add scroll animation to elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Handlers
function initFormHandlers() {
    // Collection Request Form Handler
    const collectionForms = document.querySelectorAll('.collection-form');
    collectionForms.forEach(form => {
        form.addEventListener('submit', handleCollectionForm);
    });
    
    // Contact Form Handler
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactForm);
    });
    
    // Newsletter Form Handler
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterForm);
    });
}

function handleCollectionForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    showFormLoading(e.target);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        hideFormLoading(e.target);
        showSuccess('Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.');
        e.target.reset();
    }, 2000);
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showFormLoading(e.target);
    
    setTimeout(() => {
        hideFormLoading(e.target);
        showSuccess('Mensaje enviado correctamente. Te responderemos lo antes posible.');
        e.target.reset();
    }, 2000);
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (!isValidEmail(email)) {
        showError('Por favor, introduce un email válido.');
        return;
    }
    
    showFormLoading(e.target);
    
    setTimeout(() => {
        hideFormLoading(e.target);
        showSuccess('Te has suscrito correctamente a nuestro boletín.');
        e.target.reset();
    }, 1500);
}

// Utility Functions
function showFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Enviando...';
        lucide.createIcons();
    }
}

function hideFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Enviar';
    }
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                min-width: 300px;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease-out;
            }
            .notification-success {
                background: hsl(135, 65%, 45%);
                color: white;
            }
            .notification-error {
                background: hsl(0, 75%, 55%);
                color: white;
            }
            .notification-info {
                background: hsl(210, 15%, 95%);
                color: hsl(210, 11%, 12%);
                border: 1px solid hsl(210, 15%, 88%);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                padding: 0.25rem;
                border-radius: 0.25rem;
                opacity: 0.8;
            }
            .notification-close:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Navigation Active State Management
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateActiveNavigation);

// WhatsApp Integration
function openWhatsApp(message = '') {
    const phoneNumber = '573005995277';
    const defaultMessage = 'Hola, me interesa conocer más sobre los servicios de GrasasBio.';
    const finalMessage = message || defaultMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Phone Call Integration
function makePhoneCall(number = '6017618796') {
    window.location.href = `tel:${number}`;
}

// Email Integration
function sendEmail(email = 'comercial@grasasbio.com', subject = '', body = '') {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Google Maps Integration (if needed)
function openGoogleMaps() {
    const address = 'Calle 9 #32a-83 Bogotá, Cundinamarca, Colombia';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
}

// Export functions for global use
window.GrasasBio = {
    openWhatsApp,
    makePhoneCall,
    sendEmail,
    openGoogleMaps,
    showSuccess,
    showError,
    showNotification
};