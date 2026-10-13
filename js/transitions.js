/**
 * BARBA.JS PAGE TRANSITION ORCHESTRATOR
 * Seamless SPA-like page transitions without browser page reloads.
 * Powered by Barba.js core + GSAP timelines.
 */

export class TransitionOrchestrator {
  constructor(onPageEnterCallback) {
    this.onPageEnter = onPageEnterCallback;
    this.initBarba();
  }

  initBarba() {
    if (typeof barba === 'undefined') {
      console.warn('[Transitions] Barba.js library not detected on window.');
      return;
    }

    const curtain = document.querySelector('.transition-curtain');

    barba.init({
      preventRunning: true,
      transitions: [
        {
          name: 'curtain-wipe-transition',
          
          async leave(data) {
            // 1. Curtain slides up to cover current screen
            const done = this.async();
            if (curtain) {
              await gsap.fromTo(curtain,
                { y: '100%' },
                { y: '0%', duration: 0.6, ease: 'power3.inOut' }
              );
            }
            done();
          },

          async enter(data) {
            // 2. New container inserted, scroll to top
            window.scrollTo(0, 0);

            // Re-trigger page animations
            if (typeof this.onPageEnter === 'function') {
              this.onPageEnter(data.next.namespace);
            }

            // 3. Curtain slides away upward
            if (curtain) {
              await gsap.to(curtain, {
                y: '-100%',
                duration: 0.6,
                ease: 'power3.inOut',
                delay: 0.1,
                onComplete: () => {
                  gsap.set(curtain, { y: '100%' });
                }
              });
            }
          },

          once(data) {
            if (typeof this.onPageEnter === 'function') {
              this.onPageEnter(data.next.namespace);
            }
          }
        }
      ]
    });
  }
}
