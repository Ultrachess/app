import React from 'react';
import { styled } from '@stitches/react';
import { violet, mauve, blueA} from '@radix-ui/colors';

export const Text = styled('div', {
    margin: 0,
    color: mauve.mauve11,
    fontSize: 13,
    lineHeight: 1.5,
    textAlign: 'inline',
    display: 'flex',
    variants: {
        faded: {
            true: { color: mauve.mauve10 },
        },
        bold: {
            true: { fontWeight: 500 },
        },
        violet: {
            true: { color: violet.violet11 },
        },
        yellow: {
            true: { color: blueA.blueA10 },
        },
        size : {
            1: { fontSize: 9 },
            2: { fontSize: 13 },
            3: { fontSize: 15 },
            4: { fontSize: 17 },
            5: { fontSize: 19 },
        }
    },
});