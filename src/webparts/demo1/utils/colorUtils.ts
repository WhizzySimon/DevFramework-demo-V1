export interface ColorInfo {
  hex: string;
  name: string;
  role: string;
}

export function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

export function rgbToHSL(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}

export function hslToRGB(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function normalizeHue(hue: number): number {
  while (hue < 0) hue += 360;
  while (hue >= 360) hue -= 360;
  return hue;
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRGB(hex);
  return rgbToHSL(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRGB(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function generatePalette(baseColorHex: string): ColorInfo[] {
  const hsl = hexToHSL(baseColorHex);
  
  const palette: ColorInfo[] = [
    {
      hex: baseColorHex.toUpperCase(),
      name: 'Base Color',
      role: 'Base'
    },
    {
      hex: hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l),
      name: 'Complementary',
      role: 'Complementary'
    },
    {
      hex: hslToHex(normalizeHue(hsl.h + 30), hsl.s, hsl.l),
      name: 'Analogous 1',
      role: 'Analogous 1'
    },
    {
      hex: hslToHex(normalizeHue(hsl.h - 30), hsl.s, hsl.l),
      name: 'Analogous 2',
      role: 'Analogous 2'
    },
    {
      hex: hslToHex(normalizeHue(hsl.h + 120), hsl.s, hsl.l),
      name: 'Triadic',
      role: 'Triadic'
    }
  ];

  return palette;
}
