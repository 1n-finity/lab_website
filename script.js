// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initContactForm();
    initScrollAnimations();
    initScrollToTop();
    setActiveNavigation();
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (mobileToggle && navLinks) {
        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu on window resize (when switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle escape key to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('mobile-active')) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Set active navigation based on current page
function setActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Navigation functionality for multi-page site
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add smooth hover effects
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Handle any anchor links within pages (if needed)
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Contact form functionality (enhanced for multi-page)
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                affiliation: document.getElementById('affiliation') ? document.getElementById('affiliation').value : '',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (validateContactForm(formData)) {
                handleFormSubmission(formData);
            }
        });
    }
}

// Enhanced form validation
function validateContactForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.name.trim()) {
        errors.push('Name is required');
    } else if (data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Subject validation
    if (!data.subject.trim()) {
        errors.push('Subject is required');
    }
    
    // Message validation
    if (!data.message.trim()) {
        errors.push('Message is required');
    } else if (data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Enhanced form submission handling
function handleFormSubmission(data) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in real implementation, this would be an API call)
    setTimeout(() => {
        // Create enhanced email content
        const subjectLine = `[Website Contact] ${data.subject}`;
        const emailBody = `
Name: ${data.name}
Email: ${data.email}
${data.affiliation ? `Institution/Affiliation: ${data.affiliation}` : ''}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent through the contact form on your website.
Sent on: ${new Date().toLocaleString()}
        `.trim();
        
        const mailtoLink = `mailto:muthu.p@jainuniversity.ac.in?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showNotification('Thank you for your message! Your email client should now open with the pre-filled message. I typically respond within 1-2 business days.', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        removeNotification(notification);
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add enhanced styles for notification
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 450px;
                border-radius: 10px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
                font-family: 'Inter', sans-serif;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                padding: 20px;
                gap: 15px;
            }
            
            .notification-icon {
                font-size: 20px;
                margin-top: 2px;
            }
            
            .notification-message {
                flex: 1;
                line-height: 1.5;
                white-space: pre-line;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background-color 0.2s;
                margin-top: -5px;
                margin-right: -5px;
            }
            
            .notification-close:hover {
                background-color: rgba(0,0,0,0.1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-hide after delay
    const hideDelay = type === 'error' ? 8000 : type === 'success' ? 6000 : 5000;
    setTimeout(() => {
        removeNotification(notification);
    }, hideDelay);
}

// Remove notification with animation
function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Enhanced scroll animations
function initScrollAnimations() {
    // Only proceed if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple elements
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.research-card, .update-item, .timeline-item, .metric-card, .project-item, ' +
        '.method-category, .impact-item, .contribution-item, .achievement-item, ' +
        '.position-type, .requirement-category, .training-item, .contact-option'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Enhanced scroll to top functionality
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.setAttribute('title', 'Back to top');
    
    // Add enhanced styles
    if (!document.getElementById('scroll-top-styles')) {
        const style = document.createElement('style');
        style.id = 'scroll-top-styles';
        style.textContent = `
            .scroll-top-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 55px;
                height: 55px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
                color: white;
                font-size: 18px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(42, 82, 152, 0.4);
            }
            
            .scroll-top-btn:hover {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(42, 82, 152, 0.6);
            }
            
            .scroll-top-btn.visible {
                opacity: 1;
                visibility: visible;
            }
            
            @media (max-width: 768px) {
                .scroll-top-btn {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide based on scroll position
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        // Clear existing timer
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        // Debounce scroll events
        scrollTimer = setTimeout(() => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, 10);
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle external link security
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="https://"], a[href^="http://"]')) {
        if (!e.target.getAttribute('target')) {
            e.target.setAttribute('target', '_blank');
            e.target.setAttribute('rel', 'noopener noreferrer');
        }
    }
});

// Enhanced page loading effects
window.addEventListener('load', function() {
    // Fade in page content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Small delay for smooth appearance
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
});

// Improved performance with passive event listeners
if (typeof window.addEventListener === 'function') {
    window.addEventListener('scroll', function() {
        // Scroll performance optimization handled in scroll-to-top
    }, { passive: true });
}

// Handle page visibility change (for potential analytics or user experience improvements)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden (user switched tabs, etc.)
        // Could pause animations or other resource-intensive operations
    } else {
        // Page is visible again
        // Could resume animations or refresh data
    }
});

// Utility functions for potential future use
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (validateContactForm(formData)) {
                handleFormSubmission(formData);
            }
        });
    }
}

// Form validation
function validateContactForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.name.trim()) {
        errors.push('Name is required');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Subject validation
    if (!data.subject.trim()) {
        errors.push('Subject is required');
    }
    
    // Message validation
    if (!data.message.trim()) {
        errors.push('Message is required');
    }
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Handle form submission
function handleFormSubmission(data) {
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in real implementation, this would be an API call)
    setTimeout(() => {
        // Create email link
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Subject: ${data.subject}\n\n` +
            `Message:\n${data.message}`
        );
        
        const mailtoLink = `mailto:muthu.p@jainuniversity.ac.in?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showNotification('Thank you for your message! Your email client should now open with the pre-filled message.', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        
        .notification-error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        
        .notification-info {
            background: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .notification-message {
            flex: 1;
            margin-right: 10px;
            white-space: pre-line;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            opacity: 0.7;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-hide after 5 seconds for success/info, 8 seconds for error
    const hideDelay = type === 'error' ? 8000 : 5000;
    setTimeout(() => {
        removeNotification(notification);
    }, hideDelay);
}

// Remove notification with animation
function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.research-card, .update-item, .timeline-item, .metric-card'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #2a5298;
            color: white;
            font-size: 18px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(42, 82, 152, 0.3);
        }
        
        .scroll-top-btn:hover {
            background: #1e3c72;
            transform: translateY(-2px);
        }
        
        .scroll-top-btn.visible {
            opacity: 1;
            visibility: visible;
        }
        
        @media (max-width: 768px) {
            .scroll-top-btn {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility function to debounce scroll events
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

// Add scroll event listener with debounce
window.addEventListener('scroll', debounce(function() {
    // Handle scroll-related functionality here if needed
}, 10));

// Handle external link clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="https://"], a[href^="http://"]')) {
        if (!e.target.getAttribute('target')) {
            e.target.setAttribute('target', '_blank');
            e.target.setAttribute('rel', 'noopener noreferrer');
        }
    }
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality (if needed)
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Dr. P. Muthu Austeria - Computational Chemistry Research',
            text: 'Check out Dr. Muthu Austeria\'s computational chemistry research group',
            url: window.location.href
        });
    } else {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Website URL copied to clipboard!', 'success');
        });
    }
}

// Initialize performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Call performance optimizations
initPerformanceOptimizations();