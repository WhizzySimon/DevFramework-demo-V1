# Spec: Color Picker with Automatic Palette Generation

**ID:** SPEC-001  
**Status:** Draft  
**Created:** 2026-01-22

---

## Overview

Add an interactive color picker at the top of the Demo1 web part that allows users to visually select a base color. When a color is selected, automatically generate and display a harmonious 5-color palette using complementary color theory principles.

---

## User Story

As a user, I want to select a base color using a visual color picker, so that I can automatically generate a harmonious color palette without manual color theory calculations.

---

## Requirements

### Functional Requirements

1. **Color Picker Input**
   - Display a native HTML5 color input (`<input type="color">`) at the top of the web part
   - Default color: `#2196F3` (current primary blue)
   - Color picker must be keyboard accessible
   - Selected color updates immediately on change

2. **Palette Generation**
   - Generate exactly 5 colors from the selected base color
   - Use complementary color theory algorithm:
     - Base color (selected)
     - Complementary color (180° hue rotation)
     - Analogous color 1 (30° hue shift)
     - Analogous color 2 (-30° hue shift)
     - Triadic color (120° hue rotation)
   - All generated colors maintain readable contrast
   - Generation happens automatically on color selection (no button click required)

3. **Palette Display**
   - Display 5 color swatches in a horizontal row below the picker
   - Each swatch shows:
     - Color preview (80×80px square)
     - Hex code below the swatch
     - Color name/role (e.g., "Base", "Complementary", "Analogous 1")
   - Clicking a swatch copies its hex code to clipboard
   - Visual feedback on hover and click
   - Keyboard accessible (Tab + Enter/Space to copy)

### Non-Functional Requirements

1. **Performance**
   - Palette generation must complete in <50ms
   - No visible lag when changing colors

2. **Accessibility**
   - Color picker has proper label
   - All swatches are keyboard navigable
   - Swatches have aria-labels describing their purpose
   - Success/error messages announced to screen readers

3. **Visual Design**
   - Follows Fluent UI design patterns
   - Consistent spacing and alignment
   - Smooth transitions on hover
   - Clear visual hierarchy (picker → palette)

---

## Acceptance Criteria

1. ✓ Color picker displays at top of web part with label
2. ✓ Selecting a color immediately generates 5-color palette
3. ✓ Palette displays below picker with color swatches and hex codes
4. ✓ Clicking any swatch copies hex code to clipboard
5. ✓ Success message shows which color was copied
6. ✓ All interactions work with keyboard (Tab, Enter, Space)
7. ✓ Color generation uses correct complementary color theory formulas
8. ✓ No console errors or warnings

---

## Out of Scope

- Custom color picker UI (using native HTML5 input)
- Saving/persisting selected colors
- Exporting palette to file formats
- Color accessibility contrast checking
- Multiple palette generation algorithms
- Palette history/undo

---

## Technical Constraints

- Must work within SPFx 1.21.1 + React 17 environment
- Must use Fluent UI React components where applicable
- Must maintain existing web part structure
- No external color manipulation libraries (implement color theory in pure TypeScript)

---

## Dependencies

- Existing Demo1 web part structure
- Fluent UI React components (Stack, Text, MessageBar)
- Browser clipboard API support

---

## Notes

- Color theory algorithm will convert hex → HSL → manipulate hue → convert back to hex
- Native color picker provides good UX and accessibility out of the box
- Existing clipboard copy functionality can be reused from current implementation
