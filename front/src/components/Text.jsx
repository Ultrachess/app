import React from 'react';
import { styled } from '@stitches/react';
import { violet, mauve, blueA, blackA} from '@radix-ui/colors';

export const Text = styled('div', {
    margin: 0,
    color: mauve.mauve11,
    fontSize: 13,
    lineHeight: 1.5,
    textAlign: 'center',
    display: 'flex',
    variants: {
        underline: {
            true: { textDecoration: 'underline' },
        },
        faded: {
            true: { color: mauve.mauve10 },
        },
        bold: {
            true: { fontWeight: 600 },
        },
        black: {
            true: { color: blackA.blackA12 },
        },
        violet: {
            true: { color: violet.violet11 },
        },
        yellow: {
            true: { color: blueA.blueA10 },
        },
        link: {
            true: { 
                color: blackA.blackA12, 
                fontWeight: 300,
                fontSize: 14,
            },
        },
        size : {
            1: { fontSize: 9 },
            2: { fontSize: 15 },
            3: { fontSize: 17 },
            4: { fontSize: 17 },
            5: { fontSize: 19 },
            "max": { fontSize: 51 },
        }
    },
});