# 💎 CAD Kinetic Engine (Heron AI Style Re-Engineered)

> **2026 Elite UI Master Template**: Heron AI saytidan REA (Reverse Engineer Anything) orqali tahlil qilingan va mustaqil modulli shablon sifatida noldan qayta yaratilgan frontend dvigateli.

---

## ⚡ Asosiy Modullar

1. **CAD Precision Crosshair & Laser Grid (`js/cad-crosshair.js`):**
   - Kursor orqasidan 0.18 Lerp inersiya bilan ergashuvchi gorizontal va vertikal lazer chiziqlari.
   - Reticle (kvadrat nishon) va dinamik HUD koordinatalari (`X: 1240.25 | Y: 480.12`).
   - Yengil Canvas texnik to'r fon.
   - Kartochkalar ustida harakatlanuvchi Spotlight effekti.

2. **Kinetic Scroll & Typography (`js/kinetic-scroll.js`):**
   - **Lenis 1.1.5**: Inersiyali ultra-silliq skroll (Apple/Linear darajasida).
   - **GSAP 3.12.5 + ScrollTrigger**: GSAP ticker bilan uzviy bog'langan.
   - **SplitText Effect**: Matnlarni satrma-satr va so'zma-so'z pastdan yuqoriga ochiluvchi kinemotografik animatsiya (pullik plaginsiz, toza DOM manipulyatsiyasi bilan).

3. **Barba.js Seamless Transitions (`js/transitions.js`):**
   - Sahifalar orasida o'tganda brauzer qayta yuklanmaydi (No page reload).
   - Qora parda (Curtain Wipe) o'tish effekti bilan sahifalar SPA kabi keshlanib ochiladi.

---

## 🚀 Qanday Ishga Tushirish Mumkin?

Lokal muhitda ko'rish uchun Python yoki har qanday lokal HTTP server orqali oching:

```bash
# cad-kinetic-engine papkasida:
py -3 -m http.server 3000
```

Brauzerda: `http://localhost:3000/`

---

## 🛠️ Yangi Loyihaga Qanday Ulash Mumkin?

O'zingizning istalgan SaaS, portfolio yoki veb-saytingizga quyidagicha ulab olasiz:

```javascript
import { CadCrosshairEngine } from './js/cad-crosshair.js';
import { KineticScrollEngine } from './js/kinetic-scroll.js';
import { TransitionOrchestrator } from './js/transitions.js';

// 1. Lazer va koordinatalar
new CadCrosshairEngine({ showCoordinates: true, lerpFactor: 0.18 });

// 2. Silliq skroll va animatsiyalar
new KineticScrollEngine();

// 3. Sahifalar o'tishi
new TransitionOrchestrator();
```

---

*Muallif: Javohirbek Asqarov (Jasper) & Antigravity Autonomous Architecture*
