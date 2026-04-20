# Hassaan Shah Portfolio - Cinematic Intro Animation

A stunning portfolio website featuring a cinematic intro animation with typewriter code effects and matrix-style digital rain.

## 🎬 Features

### Cinematic Intro Animation
- **Typewriter Code Effect**: Terminal-style typing animation with realistic pauses
- **Matrix Stream**: GPU-optimized digital rain effect with random character generation
- **Smooth Transitions**: Cinematic reveal of the landing page after 4-6 seconds
- **Modular Design**: Easily customizable animation parameters

### Technical Highlights
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **GPU-optimized rendering** for smooth performance
- **Responsive design** for all devices

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Animation Timing
```typescript
<CinematicIntro
  typewriterDuration={3000}  // Typewriter phase duration (ms)
  matrixDuration={4000}      // Matrix stream duration (ms)
  totalDuration={7000}       // Total animation duration (ms)
/>
```

### Typewriter Text
Modify the `typewriterLines` array in `CinematicIntro.tsx` to change the terminal commands.

### Colors & Styling
Update `tailwind.config.js` to customize the color scheme:
- `terminal-bg`: Background color
- `terminal-text`: Main text color
- `terminal-accent`: Accent color
- `matrix-green`: Matrix stream color

## 📱 Performance

- **GPU-optimized animations** using `will-change` and `transform3d`
- **Efficient canvas rendering** for matrix stream
- **Smooth 60fps animations** on desktop and mobile
- **Minimal bundle size** with tree-shaking

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Monospace font

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

