/**
 * CAD KINETIC ENGINE — MASTER ENTRY POINT
 * Initialized on DOMContentLoaded.
 */

import { CadCrosshairEngine } from './cad-crosshair.js';
import { KineticScrollEngine } from './kinetic-scroll.js';
import { TransitionOrchestrator } from './transitions.js';

class App {
  constructor() {
    this.crosshair = null;
    this.kineticScroll = null;
    this.transitions = null;
    this.init();
  }

  init() {
    console.log('%c[CAD KINETIC ENGINE]%c v1.0.0 Initialized', 'color: #0ea5e9; font-weight: bold;', 'color: #94a3b8;');

    // 1. Initialize Crosshair & Precision Laser Grid
    this.crosshair = new CadCrosshairEngine({
      showCoordinates: true,
      lerpFactor: 0.18,
      gridStep: 45
    });

    // 2. Initialize Kinetic Scroll (Lenis + GSAP)
    this.initScrollAndAnimations();

    // 3. Initialize Barba.js Page Transitions
    this.transitions = new TransitionOrchestrator((namespace) => {
      console.log(`[Barba] Navigated to namespace: ${namespace}`);
      this.initScrollAndAnimations();
    });
  }

  initScrollAndAnimations() {
    if (this.kineticScroll) {
      this.kineticScroll.destroy();
    }
    this.kineticScroll = new KineticScrollEngine();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.__CAD_ENGINE__ = new App();
});
