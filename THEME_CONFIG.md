# Theme Configuration Guide

This application uses a centralized theme configuration system that allows you to easily update colors throughout the entire app.

## Quick Start: Change Primary Color

To change the primary color of your application:

1. Open `lib/theme-config.ts`
2. Update the primary color values in the `light` and `dark` sections:

```typescript
export const themeConfig = {
  colors: {
    light: {
      primary: '268 70% 32%', // Change this value
      // ... rest of colors
    },
    dark: {
      primary: '268 70% 56%', // Change this value
      // ... rest of colors
    },
  },
}
```

## Color Format

Colors are defined using HSL (Hue, Saturation, Lightness) format:
- **Hue** (0-360): Color value (0=red, 120=green, 240=blue, 268=purple)
- **Saturation** (0-100%): Color intensity
- **Lightness** (0-100%): Color brightness

## Default Colors

**Light Mode:**
- Primary: `268 70% 32%` (Deep Purple)
- Background: `0 0% 98%` (Off-white)
- Foreground: `268 34% 17%` (Dark text)

**Dark Mode:**
- Primary: `268 70% 56%` (Lighter Purple)
- Background: `268 40% 10%` (Very dark purple)
- Foreground: `0 0% 95%` (Off-white text)

## Examples

### Change to Blue
```typescript
// Light mode
primary: '217 100% 40%'

// Dark mode
primary: '217 100% 60%'
```

### Change to Red
```typescript
// Light mode
primary: '0 100% 40%'

// Dark mode
primary: '0 100% 60%'
```

### Change to Green
```typescript
// Light mode
primary: '142 72% 29%'

// Dark mode
primary: '142 72% 56%'
```

## Where Theme is Applied

The theme configuration is used throughout the app:
- All buttons and interactive elements
- Navbar and sidebar
- Form inputs and focus states
- Navigation elements
- All text and background colors

## Theme Switching

Users can toggle between light and dark modes using the sun/moon icon in the navbar. The preference is automatically saved to localStorage.

## How It Works

1. **Theme Config** (`lib/theme-config.ts`) - Central configuration file with all color values
2. **Theme Provider** (`components/theme-mode-provider.tsx`) - Handles dark/light mode switching
3. **Theme Toggle** (`components/theme-toggle.tsx`) - UI button for users to switch modes
4. **Global Styles** (`app/globals.css`) - CSS variables that reference the theme config

The application uses CSS custom properties (variables) that automatically update when the theme changes, applying the update instantly across the entire UI.

## CSS Variables

Theme colors are exposed as CSS variables you can use in your code:

```css
--primary
--primary-foreground
--background
--foreground
--secondary
--accent
--destructive
--border
--input
--ring
/* ... and more */
```

Use them in classes or custom CSS:
```css
.my-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```
