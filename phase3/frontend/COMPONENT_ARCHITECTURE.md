# TaskFlow Landing Page - Component Architecture

## Component Hierarchy

```
Homepage (page.tsx)
│
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   ├── CTA Button
│   └── Mobile Menu
│
├── HeroSection
│   ├── Content (Left)
│   │   ├── Title with Gradient
│   │   ├── Subtitle
│   │   ├── CTA Buttons
│   │   ├── Trust Indicators
│   │   └── User Avatar Stack
│   │
│   └── Dashboard Mockup (Right)
│       ├── Glassmorphism Card
│       ├── Task Cards
│       ├── Progress Bar
│       └── Floating Badges
│
├── FeatureGrid
│   ├── Section Header
│   ├── Feature Cards (9x)
│   │   ├── Icon
│   │   ├── Title
│   │   ├── Description
│   │   └── Details List
│   │
│   └── Bottom CTA
│
├── PricingSection
│   ├── Section Header
│   ├── Pricing Card
│   │   ├── Premium Badge
│   │   ├── Price Display ($0)
│   │   ├── CTA Button
│   │   ├── Features List
│   │   └── Trust Indicators
│   │
│   └── FAQ Link
│
└── Footer
    ├── Brand Column
    │   ├── Logo
    │   ├── Description
    │   └── Contact Info
    │
    ├── Link Columns (4x)
    │   ├── Product Links
    │   ├── Company Links
    │   ├── Resources Links
    │   └── Legal Links
    │
    ├── Newsletter Signup
    │
    └── Bottom Bar
        ├── Copyright
        ├── Social Links
        └── Trust Badges
```

## Data Flow

```
useGSAP Hook (hooks/useGSAP.ts)
    ↓
    Loads GSAP & ScrollTrigger from CDN
    ↓
    Returns { gsap, ScrollTrigger }
    ↓
    Used by Components
    ├── HeroSection
    ├── FeatureGrid
    └── PricingSection
```

## Animation Timeline

```
Page Load
    ↓
1. Navbar appears (instant)
    ↓
2. Hero Title fades in (0s)
    ↓
3. Hero Subtitle fades in (0.2s)
    ↓
4. Hero CTA fades in (0.4s)
    ↓
5. Hero Stats stagger in (0.6s)
    ↓
6. Dashboard Mockup slides in (0.3s)
    ↓
7. Floating animation starts (continuous)
    ↓
On Scroll
    ↓
8. Feature Grid title appears
    ↓
9. Feature cards stagger in
    ↓
10. Pricing section appears
    ↓
11. Pricing card scales in
```

## Styling Architecture

```
globals.css
    ├── Tailwind Base Imports
    ├── Theme Variables
    ├── Custom Animations
    │   ├── @keyframes float
    │   └── @keyframes float-delayed
    │
    └── Utility Classes
        ├── .animate-float
        ├── .animate-float-delayed
        ├── .nav-scrolled
        ├── .glass
        └── .glass-dark

Components
    └── Inline Tailwind Classes
        ├── Layout (flex, grid)
        ├── Spacing (p-, m-, gap-)
        ├── Colors (bg-, text-, border-)
        ├── Effects (backdrop-blur, shadow)
        └── Responsive (sm:, md:, lg:)
```

## Responsive Breakpoints

```
Mobile (< 640px)
    ├── Single column layout
    ├── Stacked hero sections
    ├── Mobile menu
    └── Simplified animations

Tablet (640px - 1024px)
    ├── 2-column grids
    ├── Visible navigation
    └── Full animations

Desktop (> 1024px)
    ├── 3-column grids
    ├── Split hero layout
    ├── Dashboard mockup visible
    └── All effects enabled
```

## State Management

```
Navbar Component
    └── useState: isMenuOpen (boolean)
        ├── Controls mobile menu visibility
        └── Toggles on menu button click

useGSAP Hook
    └── useState: gsapInstance (object | null)
        ├── null: GSAP not loaded
        └── object: { gsap, ScrollTrigger }

Components with GSAP
    └── useEffect: Animation setup
        ├── Depends on gsapInstance
        ├── Runs when GSAP loads
        └── Cleans up on unmount
```

## File Dependencies

```
page.tsx
    ↓ imports
components/landing/index.ts
    ↓ exports
components/landing/*.tsx
    ↓ imports
hooks/useGSAP.ts
    ↓ loads
GSAP CDN Scripts
```

## Performance Optimization

```
1. Dynamic GSAP Loading
   └── Loads only when needed
   └── Prevents SSR issues

2. Component Lazy Loading
   └── Next.js automatic code splitting
   └── Each component in separate chunk

3. Image Optimization
   └── Next.js Image component (when used)
   └── Automatic format selection

4. CSS Optimization
   └── Tailwind purges unused styles
   └── Minimal custom CSS

5. Animation Performance
   └── GPU-accelerated transforms
   └── RequestAnimationFrame via GSAP
```

## Modular Benefits

✅ **Reusability**: Each component is self-contained
✅ **Maintainability**: Easy to update individual sections
✅ **Testability**: Components can be tested in isolation
✅ **Scalability**: Easy to add new sections
✅ **Collaboration**: Multiple developers can work on different components
✅ **Code Organization**: Clear structure and separation of concerns

## Adding New Components

```
1. Create Component File
   └── src/components/landing/NewSection.tsx

2. Export from Index
   └── src/components/landing/index.ts
   └── export { NewSection } from './NewSection';

3. Import in Page
   └── src/app/page.tsx
   └── import { NewSection } from '@/components/landing';

4. Add to Page
   └── <NewSection />

5. (Optional) Add Animations
   └── Use useGSAP hook
   └── Define GSAP animations in useEffect
```
