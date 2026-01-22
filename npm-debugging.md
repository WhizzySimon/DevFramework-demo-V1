# npm Debugging Guide

## Using pnpm as Alternative Package Manager

### What is pnpm?

pnpm is a fast, disk-efficient package manager that's compatible with npm. It uses hard links and symlinks to save disk space and often handles large dependency trees (like SPFx projects) more reliably than npm.

### Installation

```powershell
npm install -g pnpm
```

### Basic Usage

pnpm uses the same commands as npm:

```powershell
# Install dependencies
pnpm install

# Add a package
pnpm add <package-name>

# Add dev dependency
pnpm add -D <package-name>

# Run scripts
pnpm run build
pnpm test

# Remove a package
pnpm remove <package-name>
```

### Key Differences from npm

- **Faster installs** - Uses content-addressable storage
- **Saves disk space** - Packages stored once globally, linked into projects
- **Stricter** - Enforces proper peer dependencies
- **Compatible** - Works with package.json, no migration needed

## Debugging npm Install Issues

### Common npm Hanging/Timeout Issues

If `npm install` hangs or times out:

#### 1. Clear npm cache
```powershell
npm cache clean --force
npm install
```

#### 2. Increase timeout settings
```powershell
npm config set fetch-timeout 600000
npm install
```

#### 3. Try with different flags
```powershell
# Skip peer dependency checks
npm install --legacy-peer-deps

# Prefer cached packages
npm install --prefer-offline

# Skip audit (faster)
npm install --no-audit
```

#### 4. Check npm registry status
- Visit: https://status.npmjs.org/
- If registry is down, wait or use alternative

#### 5. Use alternative registry (temporary)
```powershell
# Chinese mirror (faster in Asia/Europe sometimes)
npm config set registry https://registry.npmmirror.com
npm install

# Switch back to official registry
npm config set registry https://registry.npmjs.org/
```

#### 6. Switch to pnpm (recommended for SPFx)
```powershell
npm install -g pnpm
pnpm install
```

### Network Diagnostics

Check if npm registry is reachable:
```powershell
# Test connection
curl https://registry.npmjs.org/

# Check current registry
npm config get registry

# Verify npm configuration
npm config list
```

### When to Use pnpm vs npm

**Use pnpm when:**
- npm install hangs repeatedly
- Working with large projects (SPFx, monorepos)
- Want faster installs and less disk usage
- Need stricter dependency management

**Use npm when:**
- Standard projects with no issues
- Team uses npm exclusively
- CI/CD pipelines configured for npm

### This Project

This project was set up with pnpm due to npm registry network issues during initial setup. You can continue using pnpm or switch back to npm - both work fine.

**Current setup:**
- Package manager: pnpm
- Node version: 22.20.0
- Dependencies: Installed and working
