/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { styled, keyframes } from "@stitches/react";
import { violet, blackA, mauve, green } from "@radix-ui/colors";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import { useToken, useTokenFromList } from "../../hooks/token";
import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { useWeb3React } from "@web3-react/core";
import { useActionCreator } from "../../state/game/hooks";
import { TransactionType } from "../../common/types";
import { useThrone } from "../../state/game/hooks";

export default ({ triggerElement }) => {
  const { king, numberOfTrys, numberOfWins, price } = useThrone();

  const { chainId, account } = useWeb3React();
  const [updatedNumberOfTrys, setUpdatedNumberOfTrys] = useState(numberOfTrys);
  const [updatedNumberOfWins, setUpdatedNumberOfWins] = useState(numberOfWins);
  const [updatedPrice, setUpdatedPrice] = useState(price / 10 ** 18);

  const token = useToken(STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);

  const addAction = useActionCreator();

  console.log("token", token);

  const handleUpdated = async () => {
    //console.log("amount", amount)
    const tx = {
      type: TransactionType.KING_THRONE_UPDATE,
      numberOfTrys: 0,
      numberOfWins: 0,
      price: updatedPrice * 10 ** token.decimals,
      token: token ? token.address : "",
    };
    await addAction(tx);
  };

  const isKing = king && king?.toLowerCase() === account?.toLowerCase();

  //console.log("amount", amount)
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        {isKing && (
          <DialogContent>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              Update your throne. Set the price it takes to challenge you. Set
              the number of wins and tries a challenger has to beat you.
            </DialogDescription>

            <Fieldset>
              <Label>Price to challenge in {token?.symbol ?? "USDC"}</Label>
            </Fieldset>
            <Fieldset>
              <Input
                id="amount"
                value={updatedPrice}
                defaultValue={0}
                onChange={(event) => {
                  setUpdatedPrice(event.target.value);
                }}
              ></Input>
            </Fieldset>

            {/* <Fieldset><Label>Number of wins</Label></Fieldset>
                    <Fieldset><Input id="bettingDuration" value={updatedNumberOfWins} onChange={(event)=>{ setUpdatedNumberOfWins(event.target.value)}}></Input></Fieldset>

                    <Fieldset><Label>Number of tries</Label></Fieldset>
                    <Fieldset><Input id="bettingDuration" value={updatedNumberOfTrys} onChange={(event)=>{ setUpdatedNumberOfTrys(event.target.value)}}></Input></Fieldset>
                     */}
            <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
              <Dialog.Close asChild>
                <Button variant="green" onClick={handleUpdated}>
                  Updated
                </Button>
              </Dialog.Close>
            </Flex>
            <Dialog.Close asChild>
              <IconButton aria-label="Close">
                <Cross2Icon />
              </IconButton>
            </Dialog.Close>
          </DialogContent>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(Dialog.Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  "&:focus": { outline: "none" },
});

const DialogTitle = styled(Dialog.Title, {
  margin: 0,
  fontWeight: 500,
  color: mauve.mauve12,
  fontSize: 17,
});

const DialogDescription = styled(Dialog.Description, {
  margin: "10px 0 20px",
  color: mauve.mauve11,
  fontSize: 15,
  lineHeight: 1.5,
});

const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 0,
  display: "flex",
  color: violet.violet11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: violet.violet4 },
});

const LeftSlot = styled("div", {
  marginRight: "auto",
  paddingRight: 0,
  display: "flex",
  color: violet.violet11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: violet.violet4 },
});

const Flex = styled("div", { display: "flex" });

const Button = styled("button", {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      violet: {
        backgroundColor: "white",
        color: violet.violet11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        "&:hover": { backgroundColor: mauve.mauve3 },
        "&:focus": { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: green.green4,
        color: green.green11,
        "&:hover": { backgroundColor: green.green5 },
        "&:focus": { boxShadow: `0 0 0 2px ${green.green7}` },
      },
    },
  },

  defaultVariants: {
    variant: "violet",
  },
});

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  position: "absolute",
  top: 10,
  right: 10,

  "&:hover": { backgroundColor: violet.violet4 },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
});

const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 15,
});

const Label = styled("label", {
  fontSize: 13,
  lineHeight: 1,
  marginBottom: 10,
  color: violet.violet12,
  display: "block",
});

const Input = styled("input", {
  all: "unset",
  width: "100%",
  flex: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 10px",
  fontSize: 15,
  lineHeight: 1,
  color: violet.violet11,
  boxShadow: `0 0 0 1px ${violet.violet7}`,
  height: 35,

  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet8}` },
});

const SliderMain = ({ value, max, onChangeFunction }) => (
  <form>
    <SliderRoot
      min={0}
      value={[value]}
      max={max}
      step={0.1}
      onValueChange={(event) => onChangeFunction(event)}
      aria-label="Volume"
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </SliderRoot>
  </form>
);

const SliderRoot = styled(Slider.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  width: 200,

  '&[data-orientation="horizontal"]': {
    height: 20,
  },

  '&[data-orientation="vertical"]': {
    flexDirection: "column",
    width: 20,
    height: 100,
  },
});

const SliderTrack = styled(Slider.Track, {
  backgroundColor: blackA.blackA10,
  position: "relative",
  flexGrow: 1,
  borderRadius: "9999px",

  '&[data-orientation="horizontal"]': { height: 3 },
  '&[data-orientation="vertical"]': { width: 3 },
});

const SliderRange = styled(Slider.Range, {
  position: "absolute",
  backgroundColor: "white",
  borderRadius: "9999px",
  height: "100%",
});

const SliderThumb = styled(Slider.Thumb, {
  display: "block",
  width: 20,
  height: 20,
  backgroundColor: "white",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  borderRadius: 10,
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { outline: "none", boxShadow: `0 0 0 5px ${blackA.blackA8}` },
});
