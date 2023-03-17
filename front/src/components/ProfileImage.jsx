/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useMemo } from "react";
import { createIcon } from "@download/blockies";
import "./Address.css";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { styled } from "@stitches/react";
import { violet, blackA } from "@radix-ui/colors";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export default ({ address, diameter = 20 }) => {
  var dataUrlSrc = createIcon({
    // All options are optional
    seed: address, // seed used to generate icon data, default: random
    color: "#dfe", // to manually specify the icon color, default: random
    bgcolor: "#aaa", // choose a different background color, default: white
    size: 10, // width/height of the icon in blocks, default: 10
    scale: 3, // width/height of each block in pixels, default: 5
  }).toDataURL();
  const isBot = useMemo(() => !dataUrlSrc.includes("0x"));
  return (
    <AvatarRoot
      css={{
        width: diameter,
        height: diameter,
      }}
    >
      <Jazzicon
        diameter={diameter}
        seed={jsNumberForAddress(address ?? "0x")}
      />
    </AvatarRoot>
  );
};

const AvatarDemo = () => (
  <Flex css={{ gap: 20 }}>
    <AvatarRoot>
      <AvatarImage
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
        alt="Colm Tuite"
      />
      <AvatarFallback delayMs={600}>CT</AvatarFallback>
    </AvatarRoot>
    <AvatarRoot>
      <AvatarImage
        src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
        alt="Pedro Duarte"
      />
      <AvatarFallback delayMs={600}>JD</AvatarFallback>
    </AvatarRoot>
    <AvatarRoot>
      <AvatarFallback>PD</AvatarFallback>
    </AvatarRoot>
  </Flex>
);

const AvatarRoot = styled(AvatarPrimitive.Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: 20,
  height: 20,
  borderRadius: "100%",
  backgroundColor: blackA.blackA3,
});

const AvatarImage = styled(AvatarPrimitive.Image, {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});

const AvatarFallback = styled(AvatarPrimitive.Fallback, {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  color: violet.violet11,
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
});

const Flex = styled("div", { display: "flex" });
