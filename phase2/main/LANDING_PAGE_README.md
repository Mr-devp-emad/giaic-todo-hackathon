# TaskFlow Landing Page

A premium, high-converting dark-themed landing page built with Next.js, React, TypeScript, and Tailwind CSS.

## 🎨 Features

- **Dark Theme**: Deep Slate-950 background with vibrant Cyan-500 and Azure-Blue accents
- **Glassmorphism**: Modern glass-effect UI elements with backdrop blur
- **GSAP Animations**: Professional entrance staggers, floating elements, and scroll-triggered effects
- **Responsive Design**: Fully responsive and touch-friendly across all devices
- **Modular Architecture**: Clean, reusable component structure

## 📁 Project Structure

```
main/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main homepage composing all sections
│   │   └── globals.css          # Global styles and animations
│   ├── components/
│   │   └── landing/
│   │       ├── Navbar.tsx       # Sticky navigation with glassmorphism
│   │       ├── HeroSection.tsx  # Hero with split layout and mockup
│   │       ├── FeatureGrid.tsx  # Feature cards with icons
│   │       ├── PricingSection.tsx # Zero-cost value proposition
│   │       ├── Footer.tsx       # Multi-column footer
│   │       └── index.ts         # Component exports
│   ├── hooks/
│   │   └── useGSAP.ts          # Custom hook for GSAP CDN loading
│   └── lib/
│       └── utils.ts             # Utility functions
```

## 🧩 Modular Components

### 1. **Navbar** (`components/landing/Navbar.tsx`)
- Sticky positioning with scroll effects
- Glassmorphism background with backdrop blur
- Responsive mobile menu
- Prominent CTA button

### 2. **HeroSection** (`components/landing/HeroSection.tsx`)
- Split layout design
- Left: Bold typography with cyan gradient
- Right: Interactive dashboard mockup with 3D perspective
- GSAP entrance animations
- Floating task badges
- Trust indicators and user avatar stack

### 3. **FeatureGrid** (`components/landing/FeatureGrid.tsx`)
- 3-column responsive grid
- 9 feature cards with Lucide icons
- Hover effects and transitions
- Scroll-triggered stagger animations
- Detailed feature descriptions

### 4. **PricingSection** (`components/landing/PricingSection.tsx`)
- Zero-cost value proposition
- Prominent $0 pricing display
- Comprehensive feature list
- Trust indicators
- Glow effects and animations

### 5. **Footer** (`components/landing/Footer.tsx`)
- Multi-column layout
- Product, Company, Resources, and Legal links
- Contact information
- Newsletter signup
- Social media links
- Trust badges (SOC 2, GDPR)

## 🎭 Animations

### GSAP Integration
The `useGSAP` hook dynamically loads GSAP and ScrollTrigger from CDN:
- Prevents SSR issues
- Ensures compatibility
- Registers ScrollTrigger plugin automatically

### Animation Types
1. **Entrance Animations**: Fade in with Y-axis movement
2. **Stagger Effects**: Sequential animation of multiple elements
3. **Floating Elements**: Continuous oscillating motion
4. **Scroll Triggers**: Animations triggered on scroll position
5. **Hover Effects**: Smooth transitions on user interaction

## 🎨 Design System

### Colors
- **Background**: Slate-950 (`#020617`)
- **Primary Accent**: Cyan-500 (`#06b6d4`)
- **Secondary Accent**: Blue-600 (`#2563eb`)
- **Text**: White and Gray-400

### Typography
- **Font**: Montserrat (400, 500, 600, 700)
- **Headings**: Bold with gradient effects
- **Body**: Gray-400 for readability

### Effects
- **Glassmorphism**: `backdrop-blur` with semi-transparent backgrounds
- **Gradients**: Linear gradients from cyan to blue
- **Shadows**: Colored shadows with cyan/blue tints
- **Borders**: Subtle borders with low opacity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the main directory
cd main

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Build for Production

```bash
npm run build
npm start
```

## 📦 Dependencies

### Core
- **Next.js 16.1.4**: React framework
- **React 19.2.3**: UI library
- **TypeScript 5**: Type safety

### Styling
- **Tailwind CSS 4**: Utility-first CSS
- **tw-animate-css**: Animation utilities
- **lucide-react**: Icon library

### Utilities
- **clsx**: Conditional classnames
- **tailwind-merge**: Merge Tailwind classes
- **class-variance-authority**: Component variants

### Animations
- **GSAP 3.12.5**: Loaded via CDN
- **ScrollTrigger**: Scroll-based animations

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interactions
- Collapsible mobile menu

### Performance
- Dynamic script loading for GSAP
- Optimized images and assets
- Lazy loading where applicable
- Minimal bundle size

### Accessibility
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states for all interactive elements

## 🔧 Customization

### Changing Colors
Update Tailwind classes in components:
```tsx
// From cyan-500 to purple-500
className="text-cyan-500" → className="text-purple-500"
```

### Adding Sections
1. Create new component in `components/landing/`
2. Export from `components/landing/index.ts`
3. Import and add to `app/page.tsx`

### Modifying Animations
Edit GSAP configurations in component `useEffect` hooks:
```tsx
gsap.from('.element', {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: 'power3.out',
});
```

## 📝 Content Management

All content is defined within components for easy editing:
- **Hero text**: `HeroSection.tsx`
- **Features**: `FeatureGrid.tsx` (features array)
- **Pricing**: `PricingSection.tsx` (features array)
- **Footer links**: `Footer.tsx` (footerLinks object)

## 🐛 Troubleshooting

### GSAP not loading
- Check browser console for CDN errors
- Ensure internet connection
- Verify CDN URLs in `useGSAP.ts`

### Animations not working
- Ensure GSAP hook is called in components
- Check that elements have correct class names
- Verify ScrollTrigger is registered

### Styling issues
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind configuration

## 📄 License

This project is part of the TaskFlow application.

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

Built with ❤️ using Next.js, React, and Tailwind CSS
