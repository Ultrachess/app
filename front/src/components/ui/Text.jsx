/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { styled } from "@stitches/react";
import { violet, mauve, blueA, blackA, greenA } from "@radix-ui/colors";

export const Text = styled("div", {
  margin: 0,
  color: mauve.mauve11,
  fontSize: 13,
  lineHeight: 1.5,
  textAlign: "left",
  variants: {
    underline: {
      true: {
        textDecoration: "underline",
        //get the mouse pointer to change to a hand when hovering over the text
        cursor: "pointer",
      },
    },
    faded: {
      true: { color: mauve.mauve10 },
    },
    bold: {
      true: { fontWeight: 900 },
    },
    superBold: {
      true: {
        fontWeight: 1000,
        fontSpacing: 1.5,
      },
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
    green: {
      true: { color: greenA.greenA10 },
    },
    blue: {
      true: { color: blueA.blueA10 },
    },
    link: {
      true: {
        color: blackA.blackA12,
        fontWeight: 300,
        fontSize: 14,
      },
    },
    size: {
      1: { fontSize: 9 },
      2: { fontSize: 15 },
      3: { fontSize: 17 },
      4: { fontSize: 17 },
      5: { fontSize: 19 },
      max: { fontSize: 71 },
    },
  },
});
