# TaskFlow Landing Page - Quick Start Guide

## 🚀 Quick Start

```bash
cd main
npm install
npm run dev
```

Visit: http://localhost:3000

## 📂 File Structure

```
main/src/
├── app/
│   ├── page.tsx              # Main page - composes all sections
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles + animations
├── components/landing/
│   ├── Navbar.tsx            # Sticky nav with glassmorphism
│   ├── HeroSection.tsx       # Hero with split layout
│   ├── FeatureGrid.tsx       # 9 feature cards
│   ├── PricingSection.tsx    # $0 pricing display
│   ├── Footer.tsx            # Multi-column footer
│   └── index.ts              # Exports all components
└── hooks/
    └── useGSAP.ts            # GSAP CDN loader
```

## 🎨 Component Overview

### Navbar
- **Location**: Top of page, sticky
- **Features**: Logo, links, CTA, mobile menu
- **State**: `isMenuOpen` for mobile menu

### HeroSection  
- **Layout**: Split (content left, mockup right)
- **Animations**: Entrance staggers, floating elements
- **Content**: Title, subtitle, CTAs, trust indicators

### FeatureGrid
- **Layout**: 3-column responsive grid
- **Cards**: 9 features with icons
- **Animations**: Scroll-triggered stagger

### PricingSection
- **Focus**: $0 pricing emphasis
- **Content**: Feature list, trust badges
- **Animations**: Scale-in effect

### Footer
- **Layout**: Multi-column
- **Sections**: Links, contact, newsletter, social

## 🎭 Animations

### GSAP Hook Usage
```tsx
import { useGSAP } from '@/hooks/useGSAP';

const gsapInstance = useGSAP();

useEffect(() => {
  if (!gsapInstance) return;
  
  const { gsap, ScrollTrigger } = gsapInstance;
  
  // Your animations here
  gsap.from('.element', {
    opacity: 0,
    y: 50,
    duration: 1
  });
}, [gsapInstance]);
```

## 🎨 Styling Guide

### Colors
```tsx
// Backgrounds
bg-slate-950        // Main background
bg-slate-900        // Card backgrounds
bg-slate-800        // Lighter cards

// Accents
text-cyan-400       // Primary accent text
text-cyan-500       // Primary accent
text-blue-600       // Secondary accent

// Gradients
bg-gradient-to-r from-cyan-500 to-blue-600
```

### Common Patterns
```tsx
// Glassmorphism Card
className="bg-slate-900/50 backdrop-blur-sm border border-white/5"

// Hover Effect
className="hover:border-cyan-500/30 transition-all duration-300"

// Button
className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 
           text-white rounded-lg hover:shadow-xl 
           hover:shadow-cyan-500/50 transition-all"
```

## 📝 Editing Content

### Hero Text
**File**: `src/components/landing/HeroSection.tsx`
```tsx
<h1>
  <span className="...">Your Title</span>
  <span className="...">Your Subtitle</span>
</h1>
<p>Your description...</p>
```

### Features
**File**: `src/components/landing/FeatureGrid.tsx`
```tsx
const features: Feature[] = [
  {
    icon: <YourIcon />,
    title: 'Feature Title',
    description: 'Short description',
    details: ['Detail 1', 'Detail 2', ...]
  },
  // Add more features...
];
```

### Pricing
**File**: `src/components/landing/PricingSection.tsx`
```tsx
const features = [
  'Feature 1',
  'Feature 2',
  // Add more features...
];
```

### Footer Links
**File**: `src/components/landing/Footer.tsx`
```tsx
const footerLinks = {
  product: [
    { label: 'Link', href: '#link' },
    // Add more links...
  ],
  // Add more sections...
};
```

## 🔧 Common Tasks

### Add New Section
1. Create `src/components/landing/NewSection.tsx`
2. Add export to `src/components/landing/index.ts`
3. Import in `src/app/page.tsx`
4. Add `<NewSection />` to page

### Change Colors
Find and replace Tailwind classes:
- `cyan-500` → `purple-500`
- `blue-600` → `indigo-600`

### Modify Animations
Edit GSAP configs in component `useEffect`:
```tsx
gsap.from('.element', {
  opacity: 0,      // Start opacity
  y: 50,           // Start position
  duration: 1,     // Animation duration
  delay: 0.2,      // Delay before start
  ease: 'power3.out' // Easing function
});
```

### Add Icons
1. Import from lucide-react:
```tsx
import { IconName } from 'lucide-react';
```
2. Use in JSX:
```tsx
<IconName className="text-cyan-400" size={24} />
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px` - Single column
- **Tablet**: `640px - 1024px` - 2 columns
- **Desktop**: `> 1024px` - 3 columns

### Responsive Classes
```tsx
// Mobile first approach
className="text-base sm:text-lg md:text-xl lg:text-2xl"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="hidden lg:block" // Show only on desktop
```

## 🐛 Troubleshooting

### Animations not working
1. Check browser console for GSAP errors
2. Verify internet connection (CDN)
3. Ensure `useGSAP` hook is called
4. Check element class names match GSAP selectors

### Styles not applying
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Check Tailwind class spelling
4. Verify imports in `globals.css`

### Build errors
1. Check TypeScript errors: `npm run build`
2. Verify all imports are correct
3. Check for missing dependencies

## 📦 Dependencies

### Required
- next: ^16.1.4
- react: ^19.2.3
- tailwindcss: ^4
- lucide-react: ^0.563.0

### GSAP (CDN)
- Loaded dynamically via `useGSAP` hook
- No npm installation needed

## 🎯 Best Practices

### Component Structure
```tsx
'use client'; // If using hooks/state

import { useEffect, useRef } from 'react';
import { Icon } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';

export function ComponentName() {
  const ref = useRef<HTMLDivElement>(null);
  const gsapInstance = useGSAP();

  useEffect(() => {
    // Animations
  }, [gsapInstance]);

  return (
    <section ref={ref} className="...">
      {/* Content */}
    </section>
  );
}
```

### Performance
- Use `useRef` for DOM references
- Cleanup animations in `useEffect` return
- Optimize images with Next.js Image
- Minimize custom CSS

### Accessibility
- Use semantic HTML (`<nav>`, `<section>`, `<footer>`)
- Add `aria-label` to icon buttons
- Ensure keyboard navigation works
- Test with screen readers

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [GSAP Docs](https://greensock.com/docs/)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Need Help?

1. Check `LANDING_PAGE_README.md` for detailed docs
2. Review `COMPONENT_ARCHITECTURE.md` for structure
3. Inspect component files for inline comments
4. Test in browser DevTools

---

Happy coding! 🚀
