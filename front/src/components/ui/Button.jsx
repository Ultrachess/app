import React from 'react';
import { styled } from '@stitches/react';
import { violet, mauve, red, blackA, whiteA } from '@radix-ui/colors';
import { blue } from '@nextui-org/react';


const Button = styled('button', {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 15px',
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 300,
    height: 35,
    backgroundColor: mauve.mauve4,
    '&:hover': { backgroundColor: mauve.mauve5 },
    '&:focus': { boxShadow: `0 0 0 2px ${mauve.mauve7}` },
  
    variants: {
        violet: {
          true: {
            backgroundColor: 'white',
            color: violet.violet11,
            boxShadow: `0 2px 10px ${blackA.blackA7}`,
            '&:hover': { backgroundColor: mauve.mauve3 },
            //'&:focus': { boxShadow: `0 0 0 2px black` },
          },
          
        },
        red:{ 
            true: {
          backgroundColor: red.red4,
          color: red.red11,
          '&:hover': { backgroundColor: red.red5 },
          '&:focus': { boxShadow: `0 0 0 2px ${red.red7}` },
        }},
        blue:{
          true: {
          backgroundColor: blue.blue400,
          color: "White",
          '&:hover': { backgroundColor: blue.blue500 },
          '&:focus': { boxShadow: `0 0 0 2px ${blue.blue700}` },
        }},
        mauve: {
          true: {
          backgroundColor: mauve.mauve4,
          color: mauve.mauve11,
          '&:hover': { backgroundColor: mauve.mauve5 },
          '&:focus': { boxShadow: `0 0 0 2px ${mauve.mauve7}` },
        }},
        outline: {
          true: {
            backgroundColor: 'white',
            //color: 'rgb(0, 0, 0)',
            color: violet.violet11,
            border: `1px solid ${violet.violet11}`,
            '&:hover': { backgroundColor: mauve.mauve3 },
            '&:focus': { backgroundColor: whiteA.whiteA8 },
            borderRadius: 1,

        }},
    },
  
    defaultVariants: {
      variant: 'mauve',
    },
  });

export default Button;