# MedhaOne Design System

This file acts as the source of truth for MedhaOne's UI/UX. It establishes an **Editorial Minimalist** aesthetic, ensuring that the platform feels premium, high-contrast, and modern. 

## 1. Project Identity
- **Project Name:** MeiGen Gallery (PromptGram)
- **Vibe/Tone:** Clean, High-Contrast, Premium, Editorial, "Component-First"
- **Primary Use Case:** Browsing, discovering, and copying AI generative prompts

## 2. Typography & Icons
- **Primary Font:** Inter (Sans-serif)
- **Icons:** STRICTLY use `lucide-react` SVG icons. **Do not use emojis** for UI elements.
- **Font Weights:**
  - Regular (400) - Body text
  - Medium (500) - Secondary buttons, tabs
  - Semi-Bold (600) - Headers, primary buttons
  - Bold (700) - Branding, large titles

## 3. Design Tokens (Light Theme Default)
- **Background:** `#FFFFFF` (Pure White)
- **Surface:** `#F9FAFB` (Off-white for sidebars/cards)
- **Surface Hover:** `#F3F4F6`
- **Text Primary:** `#111827` (Near black)
- **Text Secondary:** `#6B7280` (Muted gray)
- **Accent/Brand:** `#121212` (Black buttons/accents for high contrast)
- **Border:** `#E5E7EB` (Subtle gray lines)

## 4. Spacing & Responsiveness
- **Base Unit:** 4px / 8px scale.
- **Desktop Sidebar:** 260px (Fixed left)
- **Mobile (<768px):** Hide Sidebar, use Bottom Navigation Bar. Add adequate padding (`16px`) to main content container to prevent horizontal scrolling.
- **Border Radius:** `8px` (Buttons), `16px` (Cards)

## 5. Micro-Interactions & Shadows
- **Shadows:** Use refined, modern shadows `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`. Avoid harsh or overly dark drop shadows.
- **Transitions:** `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
