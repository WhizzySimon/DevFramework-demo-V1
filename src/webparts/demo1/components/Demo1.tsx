import * as React from 'react';
import styles from './Demo1.module.scss';
import type { IDemo1Props } from './IDemo1Props';
import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';

interface ColorShade {
  hex: string;
  name: string;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const sanitizedHex = hex.replace('#', '');
  const red = parseInt(sanitizedHex.substring(0, 2), 16) / 255;
  const green = parseInt(sanitizedHex.substring(2, 4), 16) / 255;
  const blue = parseInt(sanitizedHex.substring(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6;
        break;
      case green:
        hue = ((blue - red) / delta + 2) / 6;
        break;
      case blue:
        hue = ((red - green) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100)
  };
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const lightnessDecimal = lightness / 100;
  const saturationDecimal = saturation / 100;
  const chroma = (1 - Math.abs(2 * lightnessDecimal - 1)) * saturationDecimal;
  const huePrime = hue / 60;
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const lightnessAdjustment = lightnessDecimal - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondComponent;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondComponent;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondComponent;
    blue = chroma;
  } else if (huePrime >= 5 && huePrime < 6) {
    red = chroma;
    blue = secondComponent;
  }

  const redValue = Math.round((red + lightnessAdjustment) * 255);
  const greenValue = Math.round((green + lightnessAdjustment) * 255);
  const blueValue = Math.round((blue + lightnessAdjustment) * 255);

  const redHex = ('0' + redValue.toString(16)).slice(-2);
  const greenHex = ('0' + greenValue.toString(16)).slice(-2);
  const blueHex = ('0' + blueValue.toString(16)).slice(-2);

  return `#${redHex}${greenHex}${blueHex}`.toUpperCase();
}

function generateColorShades(baseColorHex: string): ColorShade[] {
  const hsl = hexToHsl(baseColorHex);
  const lightnessValues = [90, 70, 50, 30, 10];
  const shadeNames = ['Very Light', 'Light', 'Base', 'Dark', 'Very Dark'];

  return lightnessValues.map((lightnessValue, index) => ({
    hex: hslToHex(hsl.h, hsl.s, lightnessValue),
    name: shadeNames[index]
  }));
}

const DEFAULT_BASE_COLOR = '#2196F3';

const Demo1: React.FC<IDemo1Props> = (props) => {
  const [baseColor, setBaseColor] = React.useState<string>(DEFAULT_BASE_COLOR);
  // @ts-ignore - setColorShades intentionally unused (bug demo)
  const [colorShades, setColorShades] = React.useState<ColorShade[]>(
    generateColorShades(DEFAULT_BASE_COLOR)
  );
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);
  const [copyError, setCopyError] = React.useState<string | null>(null);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newColor = event.target.value;
    setBaseColor(newColor);
    // BUG: Palette doesn't update when color changes
    // setColorShades(generateColorShades(newColor));
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

  return (
    <section className={`${styles.demo1} ${props.hasTeamsContext ? styles.teams : ''}`}>
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack.Item>
          <Text variant="xxLarge" block>Color Palette Generator</Text>
          <Text variant="medium" block>Pick a base color to generate 5 shades automatically</Text>
        </Stack.Item>

        <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
            <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
              Select Base Color:
            </Text>
            <input
              type="color"
              value={baseColor}
              onChange={handleColorChange}
              style={{
                width: '60px',
                height: '40px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              aria-label="Select base color"
            />
            <Text variant="small" styles={{ root: { color: '#666' } }}>
              {baseColor}
            </Text>
          </Stack>
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
        
        <Stack horizontal tokens={{ childrenGap: 15 }} wrap>
          {colorShades.map((colorShade) => (
            <Stack
              key={colorShade.hex}
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
              onClick={() => handleColorClick(colorShade.hex)}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: colorShade.hex,
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                role="button"
                tabIndex={0}
                aria-label={`Copy ${colorShade.hex} to clipboard`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleColorClick(colorShade.hex).catch(() => {
                      // Error already handled in handleColorClick
                    });
                  }
                }}
              />
              <Text variant="small" styles={{ root: { fontWeight: 600 } }}>
                {colorShade.hex}
              </Text>
              <Text variant="xSmall" styles={{ root: { color: '#666' } }}>
                {colorShade.name}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </section>
  );
};

export default Demo1;
