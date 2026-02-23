/**
 * Centralized Theme Configuration
 * 
 * Primary color configuration for light and dark modes.
 * Update the primary color values here and it will reflect throughout the app.
 * 
 * Color format: "hue saturation lightness" (HSL without %)
 * Example: "268 70% 32%" represents H:268° S:70% L:32%
 */

export const themeConfig = {
  colors: {
    // Primary color - Update these values to change the primary color globally
    light: {
      primary: '268 70% 32%', // Deep purple
      primaryForeground: '0 0% 100%', // White
      background: '0 0% 98%', // Off-white
      foreground: '268 34% 17%', // Dark purple text
    },
    dark: {
      primary: '268 70% 56%', // Lighter purple for dark mode
      primaryForeground: '0 0% 100%', // White
      background: '268 40% 10%', // Very dark purple
      foreground: '0 0% 95%', // Off-white text
    },
  },
}

/**
 * EASY COLOR CHANGE GUIDE
 * 
 * To change the primary color for your app:
 * 1. Replace the primary HSL values in the light and dark objects above
 * 2. All dependent colors (primary-foreground, etc.) are automatically adjusted
 * 3. The changes will apply to:
 *    - All buttons and interactive elements
 *    - Navbar and sidebar elements
 *    - Form inputs and focus states
 *    - All throughout the application
 * 
 * Example: Changing from purple to blue
 * Before:
 *   light: { primary: '268 70% 32%', ... }
 *   dark: { primary: '268 70% 56%', ... }
 * 
 * After:
 *   light: { primary: '217 100% 40%', ... }  // Blue
 *   dark: { primary: '217 100% 60%', ... }   // Light blue
 */
