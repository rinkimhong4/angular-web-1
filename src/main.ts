import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Initialize GSAP ScrollTrigger and ScrollReveal
declare var gsap: any;
declare var ScrollTrigger: any;
declare var ScrollReveal: any;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // GSAP ScrollTrigger animations
  gsap.from('.hero-section', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.discount-slider', {
    duration: 1.2,
    scale: 0.8,
    opacity: 0,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.discount-slider',
      start: 'top 85%',
      end: 'bottom 15%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.product-grid .col-md-3', {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.product-grid',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // Parallax effect for background images
  gsap.to('.banner', {
    backgroundPosition: '50% 100px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.banner',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

// Initialize ScrollReveal
if (typeof ScrollReveal !== 'undefined') {
  // Basic reveal animations
  ScrollReveal().reveal('.gsap-fade-in', {
    duration: 1000,
    distance: '50px',
    easing: 'ease-in-out',
    origin: 'bottom',
    reset: false,
    interval: 200,
  });

  ScrollReveal().reveal('.gsap-fade-up', {
    duration: 1000,
    distance: '50px',
    easing: 'ease-in-out',
    origin: 'bottom',
    reset: false,
    interval: 150,
  });

  ScrollReveal().reveal('.gsap-fade-down', {
    duration: 1000,
    distance: '50px',
    easing: 'ease-in-out',
    origin: 'top',
    reset: false,
    interval: 150,
  });

  ScrollReveal().reveal('.gsap-zoom-in', {
    duration: 1000,
    scale: 0.8,
    easing: 'ease-in-out',
    reset: false,
    interval: 200,
  });

  ScrollReveal().reveal('.gsap-slide-left', {
    duration: 1000,
    distance: '100px',
    easing: 'ease-in-out',
    origin: 'right',
    reset: false,
    interval: 200,
  });

  ScrollReveal().reveal('.gsap-slide-right', {
    duration: 1000,
    distance: '100px',
    easing: 'ease-in-out',
    origin: 'left',
    reset: false,
    interval: 200,
  });

  // Staggered animations for product cards
  ScrollReveal().reveal('.product-card', {
    duration: 800,
    distance: '30px',
    easing: 'ease-in-out',
    origin: 'bottom',
    reset: false,
    interval: 100,
    delay: 200,
  });

  // Special animations for discount slider
  ScrollReveal().reveal('.banner h1', {
    duration: 1200,
    distance: '50px',
    easing: 'ease-out',
    origin: 'left',
    reset: false,
    delay: 300,
  });

  ScrollReveal().reveal('.banner p', {
    duration: 1000,
    distance: '30px',
    easing: 'ease-out',
    origin: 'left',
    reset: false,
    delay: 500,
  });

  ScrollReveal().reveal('.banner .btn', {
    duration: 800,
    scale: 0.8,
    easing: 'ease-out',
    reset: false,
    delay: 700,
  });
}

// Initialize AOS
declare var AOS: any;
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
  });
}
