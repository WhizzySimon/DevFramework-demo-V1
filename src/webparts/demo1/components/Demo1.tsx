import * as React from 'react';
import styles from './Demo1.module.scss';
import type { IDemo1Props } from './IDemo1Props';
import { Stack, Text, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';

// Helper function to convert hex to HSL
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

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

// Helper function to convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number): string => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

// Generate harmonious 5-color palette from base color
const generatePalette = (baseHex: string): Array<{ hex: string; name: string }> => {
  const hsl = hexToHSL(baseHex);
  
  return [
    { hex: baseHex, name: 'Base Color' },
    { hex: hslToHex((hsl.h + 30) % 360, hsl.s, Math.min(hsl.l + 15, 90)), name: 'Analogous Light' },
    { hex: hslToHex((hsl.h - 30 + 360) % 360, hsl.s, Math.max(hsl.l - 15, 10)), name: 'Analogous Dark' },
    { hex: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), name: 'Triadic 1' },
    { hex: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l), name: 'Triadic 2' }
  ];
};

const Demo1: React.FC<IDemo1Props> = (props) => {
  const [baseColor, setBaseColor] = React.useState<string>('#2196F3');
  const [palette, setPalette] = React.useState<Array<{ hex: string; name: string }>>(generatePalette('#2196F3'));
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);
  const [copyError, setCopyError] = React.useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = React.useState<boolean>(false);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newColor = event.target.value;
    setBaseColor(newColor);
    setPalette(generatePalette(newColor));
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

      // Clear success message after 2 seconds
      setTimeout(() => {
        setCopiedColor(null);
      }, 2000);
    } catch {
      setCopyError('Clipboard access denied. Please allow clipboard access.');
      setCopiedColor(null);
    }
  };

  const handleSharePalette = async (): Promise<void> => {
    try {
      if (!navigator.clipboard) {
        setCopyError('Clipboard not supported in this browser');
        setShareSuccess(false);
        return;
      }

      const paletteText = `Color Palette (Base: ${baseColor.toUpperCase()})\n` +
        palette.map((color, index) => 
          `${index + 1}. ${color.name}: ${color.hex}`
        ).join('\n');

      await navigator.clipboard.writeText(paletteText);
      setShareSuccess(true);
      setCopyError(null);
      setCopiedColor(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setShareSuccess(false);
      }, 3000);
    } catch {
      setCopyError('Failed to share palette. Please allow clipboard access.');
      setShareSuccess(false);
    }
  };

  return (
    <section className={`${styles.demo1} ${props.hasTeamsContext ? styles.teams : ''}`}>
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack.Item>
          <Text variant="xxLarge" block>Color Palette Generator</Text>
          <Text variant="medium" block>Pick a base color to generate a harmonious 5-color palette</Text>
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 15 }} verticalAlign="center" wrap>
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                value={baseColor}
                onChange={handleColorChange}
                className={styles.colorPicker}
                aria-label="Select base color"
              />
            </div>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                {baseColor.toUpperCase()}
              </Text>
              <Text variant="small">Base Color</Text>
            </Stack>
            <PrimaryButton
              text="Share Palette"
              onClick={handleSharePalette}
              iconProps={{ iconName: 'Share' }}
              styles={{
                root: {
                  marginLeft: 'auto'
                }
              }}
            />
          </Stack>
        </Stack.Item>

        {shareSuccess && (
          <MessageBar messageBarType={MessageBarType.success}>
            Palette copied to clipboard! Share it with your colleagues.
          </MessageBar>
        )}

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
            </Stack>
          ))}
        </Stack>
      </Stack>
    </section>
  );
};

export default Demo1;
