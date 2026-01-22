# Plan: Color Picker with Automatic Palette Generation

**Spec:** SPEC-001  
**Created:** 2026-01-22

---

## Architecture

### Component Structure

```
Demo1.tsx (existing)
├── Color Picker Section
│   └── <input type="color"> with label
├── Palette Display Section
│   └── Horizontal stack of 5 color swatches
│       ├── Color preview box
│       ├── Hex code text
│       └── Role label text
└── Feedback Section (existing)
    ├── Success message
    └── Error message
```

### State Model

**Component State:**
- `selectedColor: string` - Current base color (hex format, e.g., "#2196F3")
- `generatedPalette: ColorInfo[]` - Array of 5 generated colors
- `copiedColor: string | null` - Currently copied color (for success message)
- `copyError: string | null` - Error message if clipboard fails

**ColorInfo Interface:**
```typescript
interface ColorInfo {
  hex: string;
  name: string;
  role: string; // "Base", "Complementary", "Analogous 1", etc.
}
```

### Data Flow

1. User selects color in picker → `selectedColor` state updates
2. `useEffect` watches `selectedColor` → triggers palette generation
3. `generatePalette(baseColor)` function:
   - Converts hex to HSL
   - Applies color theory transformations (hue rotations)
   - Converts back to hex
   - Returns array of 5 ColorInfo objects
4. `generatedPalette` state updates → UI re-renders with new colors
5. User clicks swatch → clipboard copy → success/error message

---

## Color Theory Algorithm

### HSL Color Space

Use HSL (Hue, Saturation, Lightness) for color manipulations:
- **Hue:** 0-360° (color wheel position)
- **Saturation:** 0-100% (color intensity)
- **Lightness:** 0-100% (brightness)

### Palette Generation Rules

From base color, generate:

1. **Base Color** (0° shift)
   - Original selected color
   - Role: "Base"

2. **Complementary** (180° hue shift)
   - Opposite on color wheel
   - Creates maximum contrast
   - Role: "Complementary"

3. **Analogous 1** (+30° hue shift)
   - Adjacent color (clockwise)
   - Harmonious with base
   - Role: "Analogous 1"

4. **Analogous 2** (-30° hue shift)
   - Adjacent color (counter-clockwise)
   - Harmonious with base
   - Role: "Analogous 2"

5. **Triadic** (120° hue shift)
   - Evenly spaced on color wheel
   - Vibrant contrast
   - Role: "Triadic"

### Color Conversion Functions

**Required utility functions:**

```typescript
// Hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number }

// HSL to Hex
function hslToHex(h: number, s: number, l: number): string

// Normalize hue to 0-360 range
function normalizeHue(hue: number): number
```

**Implementation approach:**
1. Hex → RGB (parse hex string)
2. RGB → HSL (standard formula)
3. Manipulate hue value
4. HSL → RGB (inverse formula)
5. RGB → Hex (format as string)

---

## UI Layout

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│  Color Palette Generator                │
│  Select a base color to generate        │
│  a harmonious 5-color palette           │
├─────────────────────────────────────────┤
│  Base Color: [Color Picker Input]       │
├─────────────────────────────────────────┤
│  Generated Palette:                     │
│                                          │
│  [■]      [■]      [■]      [■]      [■] │
│  #2196F3  #FF9800  #00BCD4  #9C27B0  ... │
│  Base     Compl.   Analog 1  Analog 2 ... │
└─────────────────────────────────────────┘
```

### Spacing & Sizing

- Color picker input: 60px height, 200px width
- Swatch size: 80×80px
- Gap between swatches: 15px
- Vertical spacing: 20px between sections

---

## Error Handling

### Clipboard Errors

- Catch clipboard API failures
- Show user-friendly error message
- Maintain existing error handling pattern from current code

### Color Conversion Errors

- Validate hex input format
- Handle edge cases (invalid colors)
- Fallback to default color if conversion fails

---

## Performance Considerations

- Color conversion is pure calculation (no async operations)
- Debounce not needed (color picker onChange fires on final selection)
- Memoize generated palette to avoid recalculation on unrelated re-renders

---

## Testing Approach

### Manual Testing

1. **Color Selection**
   - Select various colors (red, blue, green, grayscale)
   - Verify palette updates immediately
   - Check all 5 colors are distinct and harmonious

2. **Clipboard Copy**
   - Click each swatch
   - Verify hex code copied correctly
   - Test keyboard navigation (Tab + Enter)

3. **Edge Cases**
   - Pure black (#000000)
   - Pure white (#FFFFFF)
   - Grayscale colors
   - Verify no crashes or visual glitches

### Automated Testing (Future)

- Unit tests for color conversion functions
- Component tests for palette generation
- E2E tests for user interactions

---

## Implementation Order

1. Create color conversion utility functions
2. Add color picker input to UI
3. Implement palette generation logic
4. Update UI to display generated palette
5. Wire up clipboard copy for new swatches
6. Test and refine

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Color conversion math errors | High | Test with known color values, verify against online converters |
| Browser color picker inconsistency | Low | Native input is well-supported, fallback not needed |
| Performance with rapid color changes | Low | Color calculation is fast (<1ms), no debounce needed |
| Clipboard API not supported | Medium | Already handled in existing code, reuse pattern |

---

## Open Questions

None - spec is clear and implementation is straightforward.
