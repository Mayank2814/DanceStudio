# 💃 DanceStudio - Premium Dance Platform

A modern, elegant dance studio management platform with a stunning dark theme featuring purple, pink, and gold accents. Built with React, Tailwind CSS, and Framer Motion.

## ✨ Design Features

### 🎨 Visual Theme
- **Dark Mode First**: Charcoal black background (#0F0F0F) with dark cards (#1A1A1A)
- **Gradient Accents**: Deep purple (#6B21A8) to neon pink (#EC4899) with gold highlights (#F59E0B)
- **Glassmorphism**: Frosted glass cards with backdrop blur effects
- **Smooth Animations**: Powered by Framer Motion for fluid motion-inspired interactions

### 🎭 Key UI Components

#### Navbar
- Sticky animated navbar with glassmorphism effect
- Smooth scroll-triggered backdrop blur
- Rotating logo animation on hover
- Gradient brand name with tagline

#### Hero Section
- Full-screen hero with animated gradient background
- Floating emoji animations (💃🕺🩰🎭)
- Large gradient text headlines
- Smooth scroll indicator

#### Cards & Components
- Glass-morphic cards with soft shadows
- Hover animations (lift, scale, glow effects)
- Rounded corners (rounded-xl, rounded-2xl)
- Border gradients and glow effects

#### Buttons
- Primary: Gradient background (purple → pink)
- Outline: Border with hover fill animation
- All buttons have scale and shadow animations
- Active states with scale-down effect

### 📱 Pages

1. **Home Page**
   - Animated hero with floating elements
   - Features grid with emoji icons
   - Dance styles showcase (6 styles)
   - Stats section with counters
   - CTA sections

2. **Classes Page**
   - Advanced filtering (search, style, level)
   - Grid layout with hover effects
   - Class cards with gradient headers
   - Price badges (free vs paid)

3. **Class Detail Page**
   - Large hero card with emoji
   - Detailed information grid
   - Sticky sidebar with enrollment
   - Razorpay payment integration
   - Benefits list

4. **Authentication Pages**
   - Glassmorphic forms
   - Animated backgrounds
   - Role selection (Student/Instructor)
   - Demo credentials display

5. **Dashboard Pages**
   - Stats cards with icons
   - User: Enrolled classes grid
   - Admin: Full class management table
   - Modal forms with glassmorphism

## 🚀 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Framer Motion 10.16** - Animation library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Razorpay** - Payment gateway

## 🎯 Custom Animations

```css
- float: Elements floating up and down (6s loop)
- glow: Pulsing glow effect for buttons
- slide-up: Entry animation from bottom
- fade-in: Smooth opacity transition
- rotate: 360° rotation on hover
- scale: Hover and tap scale effects
```

## 🎨 Color Palette

```javascript
Primary Colors:
- Deep Purple: #6B21A8
- Purple Dark: #581C87
- Purple Light: #7C3AED

Accent Colors:
- Neon Pink: #EC4899
- Gold: #F59E0B
- Accent Purple: #A855F7

Background:
- Dark: #0F0F0F
- Card: #1A1A1A
- Lighter: #262626

Gradients:
- Primary: purple → pink
- Accent: pink → gold
- Background: dark → darker
```

## 📦 Installation

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## 🌐 Running the Application

**Backend:** http://localhost:5001  
**Frontend:** http://localhost:5173

Make sure MongoDB is running and backend is started before launching frontend.

## 💡 Key Features

✅ **Authentication** - JWT-based with role management  
✅ **Class Management** - Full CRUD for instructors  
✅ **Enrollment System** - Students can enroll/unenroll  
✅ **Payment Integration** - Razorpay for paid classes  
✅ **Responsive Design** - Mobile-first approach  
✅ **Smooth Animations** - Every interaction is animated  
✅ **Dark Theme** - Eye-friendly dark mode  
✅ **Glassmorphism** - Modern frosted glass effects  

## 🎭 Dance Styles Supported

- 🩰 Ballet
- 🎤 Hip Hop
- 💫 Contemporary
- 🔥 Salsa
- 🎷 Jazz

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Custom Tailwind Classes

```css
.glass-card - Glassmorphic card effect
.gradient-text - Text with gradient fill
.btn-primary - Primary gradient button
.btn-outline - Outline button with hover fill
.input-field - Styled input with focus effects
.card-hover - Smooth hover animations
```

---

**Built with ❤️ for dancers worldwide**
