import * as React from 'react';
import styles from './Demo1.module.scss';
import type { IDemo1Props } from './IDemo1Props';
import { Stack, Text, MessageBar, MessageBarType, Label } from '@fluentui/react';

interface ColorPalette {
  hex: string;
  name: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
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
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

const generateHarmoniousPalette = (baseColor: string): ColorPalette[] => {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const palette: ColorPalette[] = [];

  palette.push({ hex: baseColor.toUpperCase(), name: 'Base Color' });

  const complementaryHue = (hsl.h + 180) % 360;
  const complementaryRgb = hslToRgb(complementaryHue, hsl.s, hsl.l);
  palette.push({ 
    hex: rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b), 
    name: 'Complementary' 
  });

  const analogous1Hue = (hsl.h + 30) % 360;
  const analogous1Rgb = hslToRgb(analogous1Hue, hsl.s, hsl.l);
  palette.push({ 
    hex: rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b), 
    name: 'Analogous +30°' 
  });

  const analogous2Hue = (hsl.h - 30 + 360) % 360;
  const analogous2Rgb = hslToRgb(analogous2Hue, hsl.s, hsl.l);
  palette.push({ 
    hex: rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b), 
    name: 'Analogous -30°' 
  });

  const triadicHue = (hsl.h + 120) % 360;
  const triadicRgb = hslToRgb(triadicHue, hsl.s, hsl.l);
  palette.push({ 
    hex: rgbToHex(triadicRgb.r, triadicRgb.g, triadicRgb.b), 
    name: 'Triadic' 
  });

  return palette;
};

const Demo1: React.FC<IDemo1Props> = (props) => {
  const [baseColor, setBaseColor] = React.useState<string>('#2196F3');
  const [palette, setPalette] = React.useState<ColorPalette[]>(generateHarmoniousPalette('#2196F3'));
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);
  const [copyError, setCopyError] = React.useState<string | null>(null);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newColor = event.target.value;
    setBaseColor(newColor);
    setPalette(generateHarmoniousPalette(newColor));
  };

  const handleColorClick = async (hex: string): Promise<void> => {
    try {
      if (!navigator.clipboard) {
        setCopyError('Clipboard not supported in this browser');
        setCopiedColor(null);
        return;
      }

      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setCopyError(null);

      setTimeout(() => {
        setCopiedColor(null);
      }, 2000);
    } catch {
      setCopyError('Clipboard access denied. Please allow clipboard access.');
      setCopiedColor(null);
    }
  };

  return (
    <section className={`${styles.demo1} ${props.hasTeamsContext ? styles.teams : ''}`}>
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack.Item>
          <Text variant="xxLarge" block>Color Palette Generator</Text>
          <Text variant="medium" block>Pick a base color to generate a harmonious 5-color palette</Text>
        </Stack.Item>

        <Stack.Item className={styles.colorPickerSection}>
          <Label>Choose Base Color</Label>
          <div className={styles.colorPickerWrapper}>
            <input
              type="color"
              value={baseColor}
              onChange={handleColorChange}
              className={styles.colorPicker}
              aria-label="Select base color"
            />
            <Text variant="medium" styles={{ root: { marginLeft: '12px', fontWeight: 600 } }}>
              {baseColor.toUpperCase()}
            </Text>
          </div>
        </Stack.Item>

        {copiedColor && (
          <MessageBar messageBarType={MessageBarType.success}>
            Copied: {copiedColor}
          </MessageBar>
        )}

        {copyError && (
          <MessageBar messageBarType={MessageBarType.error}>
            {copyError}
          </MessageBar>
        )}
        
        <Stack.Item>
          <Text variant="large" block styles={{ root: { marginBottom: '12px', fontWeight: 600 } }}>
            Generated Palette
          </Text>
          <Stack horizontal tokens={{ childrenGap: 15 }} wrap>
            {palette.map((color) => (
              <Stack
                key={color.hex}
                verticalAlign="center"
                horizontalAlign="center"
                tokens={{ childrenGap: 8 }}
                styles={{
                  root: {
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '4px',
                    transition: 'transform 0.2s',
                    ':hover': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
                onClick={() => handleColorClick(color.hex)}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: color.hex,
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Copy ${color.hex} to clipboard`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleColorClick(color.hex).catch(() => {
                        // Error already handled in handleColorClick
                      });
                    }
                  }}
                />
                <Text variant="small" styles={{ root: { fontWeight: 600 } }}>
                  {color.hex}
                </Text>
                <Text variant="tiny" styles={{ root: { color: '#666' } }}>
                  {color.name}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack.Item>
      </Stack>
    </section>
  );
};

export default Demo1;
