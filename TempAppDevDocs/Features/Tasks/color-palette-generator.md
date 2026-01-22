# color-palette-generator - Tasks

**ID:** `P-COLR-TASK-0001`  
**Phase:** P1  
**Created:** 2026-01-22  
**Last Updated:** 2026-01-22  
**Based on Spec:** `TempAppDevDocs/Features/Specs/color-palette-generator.md`  
**Based on Plan:** `TempAppDevDocs/Features/Plans/color-palette-generator.md`

## Task 0 - Baseline E2E Tests (MANDATORY)

**Run before starting any implementation work:**

```bash
gulp serve
# Then run Playwright tests in separate terminal
```

- Record which tests pass/fail as baseline
- If tests fail, note them — they are pre-existing issues, not caused by this feature
- This establishes regression baseline for Task N (final verification)

**Status:** ⏸️ Skipped (no existing E2E tests for Demo1 web part)

---

## Task 1 - Refactor Demo1 component structure

- **Before starting:** Read `DevFramework/JustInTimeAgentRules/_entrypoint-jit-rule-map.md`
- **Files:**
  - `src/webparts/demo1/components/Demo1.tsx`
  - `src/webparts/demo1/components/Demo1.module.scss`
- **Done when:**
  - Hello world content removed
  - COLORS constant array added with 5 blue shades
  - State hooks added (copiedColor, copyError)
  - Component compiles without errors
- **Verify:**
  - `gulp bundle` succeeds
  - No TypeScript errors
- **Guardrails:**
  - Must not change Demo1WebPart.ts (web part wrapper)
  - Must not change IDemo1Props interface
  - Must preserve React 17 compatibility
- **Parallel:**
- **Estimated:** 0.5h

**Status:** ⏳ Pending

---

## Task 2 - Implement color swatch rendering

- **Before starting:** Read `DevFramework/JustInTimeAgentRules/_entrypoint-jit-rule-map.md`
- **Files:**
  - `src/webparts/demo1/components/Demo1.tsx`
  - `src/webparts/demo1/components/Demo1.module.scss`
- **Done when:**
  - 5 color swatches render as clickable buttons
  - Each swatch shows color as background
  - Hex code displays below each swatch
  - Layout uses Fluent UI Stack component
  - Responsive layout (flexWrap for narrow viewports)
- **Verify:**
  - `gulp serve` shows 5 colored boxes in workbench
  - Hex codes visible below each box
  - Layout adapts to narrow viewport
- **Guardrails:**
  - Must use Fluent UI components (Stack, Text)
  - Must not use external CSS frameworks
  - Buttons must be accessible (proper ARIA labels)
- **Parallel:**
- **Estimated:** 1h

**Status:** ⏳ Pending

---

## Task 3 - Implement click-to-copy functionality

- **Before starting:** Read `DevFramework/JustInTimeAgentRules/_entrypoint-jit-rule-map.md`
- **Files:**
  - `src/webparts/demo1/components/Demo1.tsx`
- **Done when:**
  - Click handler calls navigator.clipboard.writeText()
  - Success: sets copiedColor state
  - Error: sets copyError state
  - 2-second timeout clears copiedColor
  - Try-catch handles clipboard API failures
- **Verify:**
  - Click swatch → paste in notepad shows correct hex code
  - Rapid clicking updates state correctly
  - Error handling works (test in HTTP context if possible)
- **Guardrails:**
  - Must handle clipboard API not available
  - Must handle permission denied
  - Must not block UI on clipboard operations
- **Parallel:**
- **Estimated:** 0.5h

**Status:** ⏳ Pending

---

## Task 4 - Add MessageBar feedback component

- **Before starting:** Read `DevFramework/JustInTimeAgentRules/_entrypoint-jit-rule-map.md`
- **Files:**
  - `src/webparts/demo1/components/Demo1.tsx`
- **Done when:**
  - MessageBar shows when copiedColor is set
  - Success message: "Copied: {hex}"
  - Error message shows when copyError is set
  - MessageBar uses appropriate type (success/error)
  - Message disappears after 2 seconds (success) or 5 seconds (error)
- **Verify:**
  - Click swatch → "Copied!" message appears
  - Message disappears after 2 seconds
  - Error scenarios show error message
- **Guardrails:**
  - Must use Fluent UI MessageBar component
  - Must not use custom toast/notification system
  - Message must be accessible (screen reader compatible)
- **Parallel:**
- **Estimated:** 0.5h

**Status:** ⏳ Pending

---

## Task 5 - Style and polish

- **Before starting:** Read `DevFramework/JustInTimeAgentRules/_entrypoint-jit-rule-map.md`
- **Files:**
  - `src/webparts/demo1/components/Demo1.tsx`
  - `src/webparts/demo1/components/Demo1.module.scss`
- **Done when:**
  - Color swatches have minimum 60x60px size
  - Hover effects on swatches (cursor pointer, subtle highlight)
  - Proper spacing between swatches
  - Hex code text is readable and properly sized
  - Component looks polished in SharePoint workbench
- **Verify:**
  - Visual inspection in workbench
  - Test hover states
  - Test in narrow and wide viewports
- **Guardrails:**
  - Must follow SharePoint design guidelines
  - Must use Fluent UI theming (no hardcoded colors except swatches)
  - Must be accessible (WCAG AA contrast for text)
- **Parallel:**
- **Estimated:** 0.5h

**Status:** ⏳ Pending

---

## Task N - Final Verification & Audit (MANDATORY)

**Run after all implementation tasks are complete:**

### 1. E2E Regression Tests

```bash
gulp serve
# Test manually via Playwright MCP or browser
```

- Verify all 5 swatches display correctly
- Test click-to-copy for each swatch
- Verify "Copied!" message appears and disappears
- Test responsive layout
- Compare to Task 0 baseline (if applicable)

### 2. Manual Testing Checklist

- [ ] All 5 colors display with correct hex codes
- [ ] Click each swatch → hex code copies to clipboard
- [ ] "Copied!" message appears immediately
- [ ] Message disappears after 2 seconds
- [ ] Rapid clicking updates message correctly
- [ ] Layout works in narrow viewport
- [ ] Layout works in wide viewport
- [ ] No console errors
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader announces actions

### 3. Audit Bundle

- Create Evidence Bundle: `FrameworkSelfImprovementLogs/AuditBundles/AUD-YYYY-MM-DD-XX.md`
- Run `/audit` workflow
- Verify **PASS** before marking feature complete

### 4. Mark Complete

- Update `IMPLEMENTATION_PROGRESS.md` — mark feature as COMPLETE
- Final commit and push

**Status:** ⏳ Pending
