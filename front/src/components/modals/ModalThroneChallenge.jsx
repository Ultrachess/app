/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { styled, keyframes } from "@stitches/react";
import { violet, blackA, mauve, green } from "@radix-ui/colors";
import {
  ChevronDownIcon,
  Cross2Icon,
  ChevronUpIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import { Text } from "../ui/Text";
import { useToken, useTokenFromList } from "../../hooks/token";
import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { useWeb3React } from "@web3-react/core";
import {
  useActionCreator,
  useUserBotIds,
  useThrone,
} from "../../state/game/hooks";
import { TransactionType } from "../../common/types";
import Address from "../Address";
import * as Select from "@radix-ui/react-select";

export default ({ triggerElement }) => {
  const { chainId, account } = useWeb3React();
  const token = useToken(STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);
  const bots = useUserBotIds(account);
  const potentialChallengers = [...bots, account];
  const [challenger, setChallenger] = useState(potentialChallengers[0]);

  const addAction = useActionCreator();

  const { king, winnings, battles, price, gamesToWin, maxTrys } = useThrone();

  const handleChallenge = async () => {
    const [approvalActionId, wait] = await addAction({
      type: TransactionType.KING_THRONE_CHALLENGE,
      challenger: challenger,
    });
    await wait;
  };

  //console.log("123", playerId)
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            Challenge King <Address value={king} />
          </DialogTitle>
          <DialogDescription>
            <Text>
              Challenge the king to a duel. If you win, you will take the
              throne. and all users must pay a fee to challenge you. You must
              win {gamesToWin} games to take the throne. You have {maxTrys}{" "}
              tries to win the games.
            </Text>
          </DialogDescription>
          <Fieldset>
            <Label>Challenger</Label>
            <SelectMain
              options={potentialChallengers}
              value={challenger}
              onValueChange={setChallenger}
            />
          </Fieldset>
          <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button variant="green" onClick={handleChallenge}>
                Challenge
              </Button>
            </Dialog.Close>
          </Flex>
          <Dialog.Close asChild>
            <IconButton aria-label="Close">
              <Cross2Icon />
            </IconButton>
          </Dialog.Close>
        </DialogContent>
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

const SelectMain = ({ onValueChange, value, options, label }) => {
  return (
    <Select.Root
      value={value}
      onValueChange={async (value) => {
        onValueChange(value);
      }}
    >
      <SelectTrigger aria-label="Chain">
        <Select.Value>
          <Text>{value}</Text>
        </Select.Value>
        <SelectIcon>
          <ChevronDownIcon />
        </SelectIcon>
      </SelectTrigger>
      <Select.Portal>
        <SelectContent>
          <SelectScrollUpButton>
            <ChevronUpIcon />
          </SelectScrollUpButton>
          <SelectViewport>
            <Select.Group>
              <SelectLabel>{label}</SelectLabel>
              {options
                ? options.map((option) => (
                    <SelectItem value={option}>{option}</SelectItem>
                  ))
                : []}
            </Select.Group>
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectTrigger = styled(Select.SelectTrigger, {
  all: "unset",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  display: "flex",
  flexDirection: "row",
  gap: 5,
  backgroundColor: "white",
  color: violet.violet11,
  //boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: mauve.mauve3 },
  //'&:focus': { boxShadow: `0 0 0 2px black` },
  "&[data-placeholder]": { color: violet.violet9 },
});

const SelectIcon = styled(Select.SelectIcon, {
  color: violet.violet11,
});

const SelectContent = styled(Select.Content, {
  overflow: "hidden",
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const SelectViewport = styled(Select.Viewport, {
  padding: 5,
});

const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <StyledItem {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <StyledItemIndicator>
        <CheckIcon />
      </StyledItemIndicator>
    </StyledItem>
  );
});

const SelectValue = styled(Select.Value, {
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
});

const StyledItem = styled(Select.Item, {
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 35px 0 25px",
  position: "relative",
  userSelect: "none",

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    outline: "none",
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
});

const SelectLabel = styled(Select.Label, {
  padding: "0 25px",
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11,
});

const SelectSeparator = styled(Select.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(Select.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

const SelectScrollUpButton = styled(Select.ScrollUpButton, scrollButtonStyles);

const SelectScrollDownButton = styled(
  Select.ScrollDownButton,
  scrollButtonStyles
);
