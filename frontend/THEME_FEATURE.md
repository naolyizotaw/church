# 🌓 Light/Dark Mode Theme Feature

## Overview
A fully functional theme toggle has been added to the Kerabu Full Gospel Church website, allowing users to switch between light and dark modes seamlessly.

## Features Implemented

### ☀️ Light Mode (Default)
- Clean, bright interface with white backgrounds
- Primary cyan color (#19c3e6)
- Excellent readability in daylight
- Professional appearance

### 🌙 Dark Mode
- Dark background (#111e21)
- Reduced eye strain in low-light conditions
- Maintains brand colors with adjusted contrast
- Modern, sleek appearance

## User Interface

### Desktop
- **Sun/Moon Icon Button** in the header (top right)
  - Sun icon (☀️) when in dark mode - click to switch to light
  - Moon icon (🌙) when in light mode - click to switch to dark
  - Positioned next to the language switcher
  - Smooth hover effects

### Mobile
- Theme toggle in the hamburger menu
- Shows current theme with icon
- Easy one-tap switching
- Clearly labeled "Theme" section

## Technical Implementation

### How It Works

1. **State Management**
   ```jsx
   const [darkMode, setDarkMode] = useState(false);
   ```

2. **localStorage Persistence**
   - User preference is saved automatically
   - Preference persists across browser sessions
   - Theme is restored on page reload

3. **System Preference Detection**
   - Respects user's OS theme preference
   - Falls back to system dark mode if no saved preference
   - Seamless integration with device settings

4. **Smooth Transitions**
   - 200ms CSS transitions for all color changes
   - Smooth fade between themes
   - No jarring switches

### Code Location
- **Main Implementation:** `frontend/src/pages/Home.jsx`
  - Theme state management
  - Toggle function
  - localStorage integration
  
- **Styles:** `frontend/src/index.css`
  - Smooth transition animations
  - Global theme styling

### Key Functions

**Toggle Theme:**
```javascript
const toggleTheme = () => {
  setDarkMode(!darkMode);
  if (!darkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};
```

**Initialize Theme:**
```javascript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setDarkMode(true);
    document.documentElement.classList.add('dark');
  } else {
    setDarkMode(false);
    document.documentElement.classList.remove('dark');
  }
}, []);
```

## Color Schemes

### Light Mode Colors
- **Background:** `#ffffff` (white)
- **Background Alt:** `#f6f8f8` (light gray)
- **Text:** `#111718` (almost black)
- **Text Muted:** `#638288` (gray)
- **Primary:** `#19c3e6` (cyan)
- **Borders:** `#e8eded` (light gray)

### Dark Mode Colors
- **Background:** `#111e21` (dark blue-gray)
- **Background Alt:** `#1a2c32` (slightly lighter)
- **Text:** `#ffffff` (white)
- **Text Muted:** `#9ca3af` (light gray)
- **Primary:** `#19c3e6` (cyan - unchanged)
- **Borders:** `#374151` (dark gray)

## Tailwind Dark Mode Classes

All components use Tailwind's dark mode variant:
```jsx
className="bg-white dark:bg-background-dark"
className="text-text-main dark:text-white"
className="border-gray-200 dark:border-gray-800"
```

## Browser Support
- ✅ Chrome/Edge (localStorage + CSS transitions)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

### ARIA Labels
```jsx
aria-label="Toggle theme"
title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
```

### Keyboard Support
- Theme toggle button is fully keyboard accessible
- Tab navigation supported
- Enter/Space to activate

### Visual Indicators
- Clear sun/moon icons
- Tooltip on hover (desktop)
- Current theme shown in mobile menu

## User Benefits

1. **Reduced Eye Strain**
   - Dark mode for evening/night reading
   - Light mode for daytime use

2. **Battery Savings**
   - Dark mode can save battery on OLED screens
   - Especially beneficial for mobile users

3. **Personal Preference**
   - Respects user's system settings
   - Remembers individual choice
   - Quick and easy switching

4. **Professional Experience**
   - Smooth, modern transitions
   - Consistent across entire site
   - No jarring color changes

## Testing the Feature

### Desktop
1. Open the website
2. Look for the Sun/Moon icon in the top right
3. Click to toggle between modes
4. Refresh the page - preference is saved!

### Mobile
1. Open the hamburger menu
2. Scroll to the "Theme" section
3. Tap to toggle
4. Close menu and see the change applied

### System Preference
1. Clear localStorage (or use incognito)
2. Change your OS theme settings
3. Reload the page
4. Site matches your OS preference!

## Future Enhancements

- [ ] Animated theme transition effect
- [ ] More granular color customization
- [ ] Auto-switch based on time of day
- [ ] Custom accent color picker
- [ ] Theme preview before applying

## Maintenance

### Adding New Components
When adding new components, use Tailwind dark mode classes:
```jsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-300">Text</p>
</div>
```

### Testing Both Modes
Always test new features in both light and dark modes to ensure:
- Text is readable
- Contrast is sufficient
- Colors make sense
- UI elements are visible

---

**Enjoy your new theme toggle! 🎨**

*The website now adapts to your viewing preferences perfectly!*

