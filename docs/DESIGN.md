---
name: KUDO VoiceBot
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424754'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#006b2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873b'
  on-tertiary-container: '#f7fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 16px
---

## Brand & Style

The design system is engineered for **KUDO VoiceBot**, focusing on a high-utility, low-friction interface for robotic control. The brand personality is "Human-Centric Precision"—balancing the technical nature of robotics with an approachable, calm, and dependable interface.

The design style is **Modern Minimalism**, heavily influenced by **Material Design 3 (M3)** and the reductive aesthetics of Nothing OS. It prioritizes clarity through expansive whitespace, intentional information density, and soft tactile surfaces. The experience should feel responsive and lightweight, evoking a sense of effortless command over complex hardware.

## Colors

The palette is anchored by a vibrant **Electric Blue** primary, symbolizing intelligence and connectivity. 

- **Backgrounds:** Use the neutral Slate (#F8FAFC) for the main application canvas to reduce glare and differentiate from elevated surfaces.
- **Surfaces:** Cards and sheets utilize pure White (#FFFFFF) to create a clear "stacked" hierarchy.
- **Typography:** Deep Slate (#0F172A) provides high-contrast legibility for primary data, while muted Blue-Grey (#64748B) is reserved for metadata and inactive states.
- **Semantic Colors:** Green, Amber, and Red are used strictly for robotic status updates (Ready, Obstructed, Error) and critical destructive actions.

## Typography

The design system utilizes **Inter** exclusively to ensure a clean, systematic look that remains legible during movement. 

- **Scale:** Headings use a bold weight with slightly tighter letter spacing for a modern, editorial feel. 
- **Readability:** Body text utilizes standard weight with generous line height to ensure control instructions are easily digestible at a glance.
- **Functional:** Labels and small captions use medium weights to maintain visual hierarchy even at small scales on mobile displays.

## Layout & Spacing

This system follows a **fluid grid** model optimized for mobile-first interaction. 

- **Grid:** A 4-column grid for mobile with 20px outer margins and 16px gutters.
- **Rhythm:** An 8dp linear scale (4px increments) governs all spatial relationships. 
- **Touch Targets:** Minimum touch targets are 48x48dp, even if the visual element is smaller, to ensure reliable robot control.
- **Safe Areas:** Adhere strictly to system bars (Status/Navigation) with a minimum 16px clearance for interactive elements.

## Elevation & Depth

In alignment with Material 3, depth is communicated through **Tonal Layers** and **Soft Shadows**:

- **Level 0 (Background):** #F8FAFC (Flat).
- **Level 1 (Cards/Surfaces):** White background with a 1px subtle stroke (#E2E8F0) and a soft, diffused shadow (0px 4px 20px rgba(15, 23, 42, 0.05)).
- **Level 2 (Active/Floating):** Increased shadow spread (0px 8px 30px rgba(15, 23, 42, 0.08)) to indicate interactivity or pick-up states.
- **Interaction:** Buttons use a very subtle inner shadow when pressed to simulate physical depression (Tactile / Neomorphic influence).

## Shapes

The shape language is defined by large, friendly radii that evoke a sense of safety and modern hardware design. 

- **Standard Elements:** Buttons and small containers use a 16px radius.
- **Primary Containers:** Cards and bottom sheets use a **20px radius** to create a distinct, nested appearance.
- **Pill States:** Selection indicators (like bottom nav active states) are fully rounded (pill-shaped) to provide a soft contrast to the rectangular cards.

## Components

### Bottom Navigation
A clean bar with four destinations. Active states are indicated by a **Blue (#3B82F6) Pill** container behind the icon, with the icon transitioning to White. Labels appear only on the active state or remain visible in a small, medium-weight font.

### Microphone Button
The primary action for VoiceBot. A large circular FAB (Floating Action Button). 
- **Idle:** Primary Blue with a white icon.
- **Active (Listening):** Pulses with a semi-transparent blue ring expansion (ripple effect) and a subtle 2px stroke glow.

### Cards
White surfaces with a 20px corner radius. Use for robot status (Battery, Connection, Task) or individual history items. Content inside cards should have 16px internal padding.

### Buttons
- **Primary:** Filled Blue, White text, 16px radius. High emphasis.
- **Secondary:** Tonal Blue (10% opacity blue background), Blue text. Medium emphasis.
- **Danger:** Ghost style with Red text or filled Red for irreversible robot commands (Emergency Stop).

### Inputs & Lists
Inputs use the M3 "Filled" style with a bottom-only border or a fully enclosed "Outlined" style with a 12px radius. Lists are "clean," using 72dp height for items with avatars/icons and 16px horizontal padding.