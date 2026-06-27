import { css } from '@styled-system/css';
import React from 'react';

export function StyleSmokeTest(): React.JSX.Element | null {
  if (!import.meta.env.DEV) return null;

  return (
    <div
      className={css({
        position: 'fixed',
        insetInlineEnd: '3',
        bottom: '3',
        zIndex: 'max',
        px: '3',
        py: '2',
        border: '3px solid #04130a',
        borderRadius: 'md',
        bg: '#18f26a',
        color: '#04130a',
        fontSize: 'xs',
        fontWeight: 'bold',
        boxShadow: 'lg',
      })}
    >
      CSS OK
    </div>
  );
}
