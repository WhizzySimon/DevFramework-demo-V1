# color-palette-generator - Plan

**ID:** `P-COLR-PLAN-0001`  
**Phase:** P1  
**Created:** 2026-01-22  
**Last Updated:** 2026-01-22  
**Based on Spec:** `TempAppDevDocs/Features/Specs/color-palette-generator.md`

---

## Architecture / modules

**Component Structure:**
- `Demo1.tsx` - Main component (refactor existing hello world)
  - Renders color palette grid
  - Manages copy feedback state
  - Handles clipboard operations

**Dependencies:**
- `@fluentui/react` - Stack, Text, MessageBar components (already in package.json)
- `react` - useState hook for state management
- Browser Clipboard API - navigator.clipboard.writeText

**Component Hierarchy:**
```
Demo1WebPart
└── Demo1 (functional component)
    ├── MessageBar (copy feedback)
    └── Stack (color swatches container)
        └── ColorSwatch × 5 (inline buttons)
```

## Data model

**Static Data:**
```typescript
const COLORS = [
  { hex: '#E3F2FD', name: 'Light Blue 50' },
  { hex: '#90CAF9', name: 'Light Blue 200' },
  { hex: '#2196F3', name: 'Blue 500' },
  { hex: '#1976D2', name: 'Blue 700' },
  { hex: '#0D47A1', name: 'Blue 900' }
];
```

**No persistent storage** - colors are hardcoded constants.

## UI state model

**State Variables:**
```typescript
const [copiedColor, setCopiedColor] = useState<string | null>(null);
const [copyError, setCopyError] = useState<string | null>(null);
```

**State Flow:**
1. Initial: `copiedColor = null`, `copyError = null`
2. User clicks swatch → `copiedColor = "#2196F3"`, `copyError = null`
3. After 2 seconds → `copiedColor = null`
4. On error → `copyError = "Clipboard not supported"`, `copiedColor = null`

**State Location:** Local component state (useState) - no Redux/context needed for this simple feature.

## Error handling

**Clipboard API Failures:**

| Error Scenario | Detection | User Feedback |
|----------------|-----------|---------------|
| API not available | `!navigator.clipboard` | MessageBar: "Clipboard not supported in this browser" |
| Permission denied | `catch` on writeText | MessageBar: "Clipboard access denied. Please allow clipboard access." |
| Write fails | `catch` on writeText | MessageBar: "Failed to copy color code" |

**Strategy:**
- Try-catch around `navigator.clipboard.writeText()`
- Show error in MessageBar (same component as success message)
- Error persists until next successful copy or 5 seconds timeout

## Testing strategy

**Unit Tests:** Not applicable for this simple component (would require mocking clipboard API, low ROI)

**Integration Tests:** Not applicable (no API integration)

**E2E Tests (Playwright):**
- Navigate to workbench
- Click each color swatch
- Verify "Copied!" message appears
- Verify message disappears after 2 seconds
- Test rapid clicking (message updates correctly)

**Manual Testing:**
- Test in SharePoint workbench (gulp serve)
- Verify clipboard paste contains correct hex code
- Test in narrow viewport (responsive layout)
- Test in different browsers (Edge, Chrome)

**Realistically Automatable:**
- Playwright can verify UI interactions and message display
- Clipboard verification requires manual paste test (Playwright clipboard API limited in workbench context)

## Risks / constraints

**Performance:**
- No concerns - static data, simple rendering
- 5 swatches render instantly

**UX Constraints:**
- 2-second message timeout is fixed (not configurable)
- No undo functionality (clipboard overwrite is permanent)
- No visual indication of which color was last copied (message only)

**Platform Limitations:**
- Clipboard API requires HTTPS (workbench uses https://localhost:4321 ✓)
- Clipboard API may not work in older SharePoint on-premises versions
- Some browsers require user gesture (click) for clipboard access ✓

**SPFx Constraints:**
- Must use React 17 (not React 18)
- Must use Fluent UI v8 (not v9)
- Web part property pane not needed for this feature

---

## Implementation Steps (High-Level)

1. **Refactor Demo1.tsx:**
   - Remove hello world content
   - Add COLORS constant array
   - Add state hooks (copiedColor, copyError)

2. **Implement ColorSwatch rendering:**
   - Map over COLORS array
   - Render button with inline styles for background color
   - Display hex code below each button

3. **Implement click handler:**
   - Try clipboard.writeText()
   - Set copiedColor on success
   - Set copyError on failure
   - Clear copiedColor after 2 seconds (setTimeout)

4. **Add MessageBar for feedback:**
   - Show when copiedColor or copyError is set
   - Success: "Copied: {hex}"
   - Error: {error message}

5. **Style with Fluent UI:**
   - Use Stack for layout
   - Use Text for hex labels
   - Use MessageBar for feedback
   - Add responsive styles (flexWrap for narrow viewports)

6. **Test in workbench:**
   - Verify all colors display correctly
   - Test click-to-copy functionality
   - Test error scenarios (if possible)
   - Test responsive layout
