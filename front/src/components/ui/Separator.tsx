/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { mauve } from "@radix-ui/colors";
import * as Separator from "@radix-ui/react-separator";
import { styled } from "@stitches/react";

const SeparatorComponent = styled(Separator.Root, {
  backgroundColor: mauve.mauve5,
  "&[data-orientation=horizontal]": { height: 0.5, width: "100%" },
  "&[data-orientation=vertical]": { height: "100%", width: 1 },
  variants: {
    variant: {
      horizontal: { height: 0.5, width: "80%" },
      vertical: { height: "50%", width: 1 },
    },
  },
});

export default SeparatorComponent;
