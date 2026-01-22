# ID Registry: DevFramework-demo-V1

**Scope Prefix:** `P-` (Project)

---

## Topics

| Topic | Description |
|-------|-------------|
| DEMO | Demo web part features |
| COLR | Color palette features |

---

## Types (Global - same across all projects)

### Tracking Types
| Type | Description | Used in |
|------|-------------|---------|
| PROB | Problem | PROBLEMS.md |
| BUGS | Bug (code defect) | PROBLEMS.md |
| FEAT | Feature request | Feature tracking |
| TASK | General task | Task tracking |
| FIXD | Documented fix | Fix documentation |

### Document Types
| Type | Description | Used in |
|------|-------------|---------|
| SPEC | Specification | Specs/ |
| PLAN | Implementation Plan | Plans/ |
| TEST | Test Plan | Tests/ |
| INFO | Information Doc | Research/ |

### Spec-Level Types
| Type | Description | Used in |
|------|-------------|---------|
| FREQ | Functional Requirement | Inside Specs |
| IMPL | Implementation Guarantee | Inside Specs |
| DECI | Design Decision | Inside Specs |

### Plan-Level Types
| Type | Description | Used in |
|------|-------------|---------|
| EDGE | Edge Case | Inside Plans |
| STEP | Implementation Step | Inside Plans |
| VERF | Verification Checklist | Inside Plans |
| TCAS | Test Case | Inside Test Plans |

---

## Next ID Counters

| Topic | PROB | BUGS | FEAT | TASK | FIXD | SPEC | PLAN | TEST | INFO |
|-------|------|------|------|------|------|------|------|------|------|
| DEMO  | 0001 | 0001 | 0001 | 0001 | 0001 | 0001 | 0001 | 0001 | 0001 |
| COLR  | 0001 | 0001 | 0001 | 0002 | 0001 | 0002 | 0002 | 0001 | 0001 |

---

## Usage

**Creating an ID:**
1. Find Topic row
2. Find Type column
3. Use current number
4. Increment counter by 1

**Example:** Creating a new DEMO spec
- Current: DEMO-SPEC = 0001
- Use: `P-DEMO-SPEC-0001: Description here`
- Update: DEMO-SPEC = 0002
