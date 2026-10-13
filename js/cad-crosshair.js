/**
 * CAD CROSSHAIR & PRECISION GRID ENGINE
 * Inspired by Heron AI & SolidWorks CAD interfaces.
 * Features:
 * - Ultra-smooth Lerp physics for horizontal & vertical laser lines
 * - Live HUD Coordinate readout (X / Y in millimetric precision)
 * - Canvas ambient technical grid with responsive resizing
 * - Zero external dependencies.
 */

export class CadCrosshairEngine {
  constructor(options = {}) {
    this.options = {
      container: options.container || document.body,
      showCoordinates: options.showCoordinates ?? true,
      lerpFactor: options.lerpFactor ?? 0.18,
      gridStep: options.gridStep ?? 40,
      accentColor: options.accentColor || '#0ea5e9',
      ...options
    };

    this.mouse = { x: -100, y: -100, targetX: -100, targetY: -100 };
    this.isHovering = false;
    this.rafId = null;

    this.initDOM();
    this.initCanvasGrid();
    this.bindEvents();
    this.render();
  }

  initDOM() {
    // 1. Overlay container
    this.overlay = document.createElement('div');
    this.overlay.className = 'cad-viewport-overlay';

    // 2. Horizontal Laser (X)
    this.laserX = document.createElement('div');
    this.laserX.className = 'cad-laser-x';

    // 3. Vertical Laser (Y)
    this.laserY = document.createElement('div');
    this.laserY.className = 'cad-laser-y';

    // 4. Reticle Box
    this.reticle = document.createElement('div');
    this.reticle.className = 'cad-cursor-reticle';

    // 5. HUD Coordinates
    if (this.options.showCoordinates) {
      this.hud = document.createElement('div');
      this.hud.className = 'cad-hud-coordinates';
      this.hud.textContent = 'X: 000.00 | Y: 000.00';
      this.overlay.appendChild(this.hud);
    }

    this.overlay.appendChild(this.laserX);
    this.overlay.appendChild(this.laserY);
    this.overlay.appendChild(this.reticle);
    document.body.appendChild(this.overlay);
  }

  initCanvasGrid() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'cad-grid-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.overlay.prepend(this.canvas);
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.drawGrid();
  }

  drawGrid() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const step = this.options.gridStep;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;

    // Subtle grid dots or lines
    this.ctx.beginPath();
    for (let x = 0; x < this.width; x += step) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for (let y = 0; y < this.height; y += step) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }
    this.ctx.stroke();

    // Minor intersection dots
    this.ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
    for (let x = 0; x < this.width; x += step * 2) {
      for (let y = 0; y < this.height; y += step * 2) {
        this.ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.isHovering = true;
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.mouse.targetX = -100;
      this.mouse.targetY = -100;
    });

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    // Spotlight effect on .feature-card elements
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  render() {
    // Lerp Physics calculation: current = current + (target - current) * factor
    const factor = this.options.lerpFactor;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * factor;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * factor;

    const x = this.mouse.x;
    const y = this.mouse.y;

    // Update laser line transforms
    this.laserX.style.transform = `translate3d(0, ${y}px, 0)`;
    this.laserY.style.transform = `translate3d(${x}px, 0, 0)`;

    // Update reticle transform
    this.reticle.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // Update HUD Coordinates
    if (this.hud && this.isHovering) {
      this.hud.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      this.hud.textContent = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)}`;
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
