import * as React from 'react';
import styles from './Demo1.module.scss';
import type { IDemo1Props } from './IDemo1Props';
import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';

const COLORS = [
  { hex: '#E3F2FD', name: 'Light Blue 50' },
  { hex: '#90CAF9', name: 'Light Blue 200' },
  { hex: '#2196F3', name: 'Blue 500' },
  { hex: '#1976D2', name: 'Blue 700' },
  { hex: '#0D47A1', name: 'Blue 900' }
];

const Demo1: React.FC<IDemo1Props> = (props) => {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);
  const [copyError, setCopyError] = React.useState<string | null>(null);

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
          <Text variant="medium" block>Click any color to copy its hex code to clipboard</Text>
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
          {COLORS.map((color) => (
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
