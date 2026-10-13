/**
 * KINETIC SCROLL & TYPOGRAPHY ENGINE
 * Combines:
 * - Lenis 1.1.5 (Inertial Smooth Scrolling)
 * - GSAP 3.12.5 + ScrollTrigger
 * - Custom Lightweight SplitText implementation (Zero-license restriction, 100% production-ready)
 */

export class KineticScrollEngine {
  constructor(options = {}) {
    this.options = {
      lerp: 0.1,
      duration: 1.2,
      smoothTouch: false,
      ...options
    };

    this.lenis = null;
    this.initLenis();
    this.initKineticTypography();
    this.initScrollAnimations();
  }

  initLenis() {
    if (typeof window.Lenis === 'undefined') {
      console.warn('[KineticScroll] Lenis library not detected on window.');
      return;
    }

    this.lenis = new window.Lenis({
      duration: this.options.duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: this.options.smoothTouch
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /**
   * Splits text elements into nested masking lines for cinematic reveals.
   */
  splitElement(el) {
    if (!el || el.dataset.splitDone) return;
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    
    el.innerHTML = '';
    words.forEach((word) => {
      const lineSpan = document.createElement('span');
      lineSpan.className = 'split-line';
      lineSpan.style.display = 'inline-block';
      lineSpan.style.overflow = 'hidden';
      lineSpan.style.marginRight = '0.28em';

      const innerSpan = document.createElement('span');
      innerSpan.className = 'split-line-inner';
      innerSpan.textContent = word;
      innerSpan.style.display = 'inline-block';
      innerSpan.style.transform = 'translateY(115%)';
      innerSpan.style.opacity = '0';

      lineSpan.appendChild(innerSpan);
      el.appendChild(lineSpan);
    });

    el.dataset.splitDone = 'true';
  }

  initKineticTypography() {
    if (typeof gsap === 'undefined') return;

    // 1. Hero Title Reveal
    const heroTitles = document.querySelectorAll('[data-split-reveal]');
    heroTitles.forEach((title) => {
      this.splitElement(title);
      const inners = title.querySelectorAll('.split-line-inner');

      gsap.to(inners, {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.2
      });
    });

    // 2. Subtitle Fade
    const heroSubs = document.querySelectorAll('.hero-subtitle, .hero-cad-badge, .hero-action-group');
    if (heroSubs.length) {
      gsap.fromTo(heroSubs, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power2.out', delay: 0.5 }
      );
    }

    // 3. Workbench Mockup 3D Elevation
    const workbench = document.querySelector('.cad-workbench');
    if (workbench) {
      gsap.fromTo(workbench,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.6 }
      );
    }
  }

  initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Feature Cards Staggered ScrollTrigger
    const cards = document.querySelectorAll('.feature-card');
    if (cards.length) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }
}
