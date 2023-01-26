import React from 'react';
import { styled } from '@stitches/react';
import { violet, mauve, blackA } from '@radix-ui/colors';

export const Text = styled('div', {
    margin: 0,
    color: mauve.mauve11,
    fontSize: 13,
    lineHeight: 1.5,
    variants: {
      faded: {
        true: { color: mauve.mauve10 },
      },
      bold: {
        true: { fontWeight: 500 },
      },
      size : {
        1: { fontSize: 11 },
        2: { fontSize: 13 },
        3: { fontSize: 15 },
        4: { fontSize: 17 },
        5: { fontSize: 19 },
      }
    },
});