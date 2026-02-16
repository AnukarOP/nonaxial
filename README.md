# nonaxial.com

**Static components feel dead. Make them alive.**

<a href="https://nonaxial.com">
  <img src="public/screenshots/hero.png" alt="nonaxial preview" width="100%" style="border-radius: 12px;" />
</a>

<br />

[![MIT License](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
[![Components](https://img.shields.io/badge/Components-200%2B-fuchsia.svg)](#components)
[![Made with](https://img.shields.io/badge/Made%20with-Motion-8B5CF6.svg)](https://motion.dev)

[Demo](https://nonaxial.com) · [Components](https://nonaxial.com/components) · [Report Bug](https://github.com/AnukarOP/nonaxial/issues)

---

## Why nonaxial?

Because your users deserve better than static divs.

- **200+ Components** — Buttons, cards, text effects, backgrounds, cursors, and more
- **Copy & Paste** — No npm install needed. Just grab the code
- **Motion-powered** — Smooth 60fps animations using Framer Motion
- **Dark mode ready** — All components support light/dark themes
- **shadcn/ui compatible** — Works seamlessly with your existing setup

---

## Quick Start

### Using CLI (Recommended)

```bash
npx shadcn@latest add https://nonaxial.com/r/[component].json
```

Replace `[component]` with any component name like `magnetic-button`, `glass-card`, etc.

### Manual Installation

1. Copy the component code from [nonaxial.com](https://nonaxial.com)
2. Paste into your `components/` folder
3. Import and use

```tsx
import { MagneticButton } from "@/components/magnetic-button";

export default function Page() {
  return <MagneticButton>Hover me</MagneticButton>;
}
```

---

## Components

### Buttons
`magnetic-button` · `glass-shimmer-button` · `neon-button` · `liquid-button` · `ripple-button` · `morphing-button` · `glitch-button` · `split-button` · `bounce-button` · `pulse-button` · `shake-button` · `confetti-button` · `3d-push-button` · `neumorphism-3d-button`

### Cards
`glass-card` · `flip-card` · `parallax-card` · `morphing-card` · `hover-lift-card` · `reveal-card` · `gradient-border-card` · `particle-card` · `blur-card` · `noise-card` · `fold-card` · `skewed-card` · `tilt-card` · `spotlight-card` · `squeeze-card` · `stack-card` · `led-card` · `liquid-glass` · `profile-card` · `pricing-card` · `testimonial-card`

### Text Effects
`gradient-text` · `glitch-text` · `neon-text` · `scramble-text` · `typewriter-text` · `bounce-text` · `float-text` · `outline-text` · `highlight-text` · `clip-text` · `3d-text` · `stroke-text` · `wave-text` · `split-text` · `sound-text` · `magnetic-scatter-text`

### Backgrounds
`particles-bg` · `aurora-bg` · `gradient-mesh` · `noise-bg` · `dots-bg` · `grid-bg` · `liquid-bg` · `blur-blob-bg` · `starfield-bg` · `waves-bg`

### Cursor Effects
`magnetic-cursor` · `blob-cursor` · `particle-cursor` · `ring-cursor` · `glow-cursor` · `emoji-cursor` · `inverse-cursor` · `trail-cursor` · `stretch-cursor` · `spotlight-cursor`

### Loaders
`bar-loader` · `bounce-loader` · `dots-loader` · `flip-loader` · `morph-loader` · `orbit-loader` · `pulse-loader` · `rotate-loader` · `skeleton-loader` · `wave-loader`

### Reveals
`fade-reveal` · `slide-reveal` · `scale-reveal` · `rotate-reveal` · `blur-reveal` · `clip-reveal` · `mask-reveal` · `perspective-reveal` · `split-reveal` · `stagger-reveal` · `underline-reveal`

### And more...
Layouts, interactions, navigation, counters, badges, forms, feedback, carousels — [see all →](https://nonaxial.com/components)

---

## Requirements

- React 18+
- Framer Motion
- Tailwind CSS

```bash
npm install framer-motion
```

---

## Local Development

```bash
git clone https://github.com/AnukarOP/nonaxial.git
cd nonaxial
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Contributing

Found a bug? Want to add a component? PRs welcome.

1. Fork the repo
2. Create your branch (`git checkout -b feat/cool-component`)
3. Commit changes (`git commit -m 'add: cool component'`)
4. Push (`git push origin feat/cool-component`)
5. Open a PR

---

## License

MIT © [Anukar](https://github.com/AnukarOP)

---

<div align="center">

**[nonaxial.com](https://nonaxial.com)**

Made with ❤️ by [Anukar](https://twitter.com/anukarop)

*yes, it's free. no cap 🧢*

</div>
