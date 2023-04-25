/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import React, { useMemo, useState } from "react";
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
import {
  useTokenFromList,
  useTokenPortalBalance,
  useTokenBalance,
  useToken,
} from "../../hooks/token";
import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { useWeb3React } from "@web3-react/core";
import { useActionCreator } from "../../state/game/hooks";
import { TransactionType } from "../../common/types";
import { useNavigate } from "react-router-dom";
import * as Select from "@radix-ui/react-select";

import { useDispatch } from "react-redux";
import {
  setManageBotModal,
  setManageBotName,
  setManageBotAutoBattleEnabled,
  setManageBotAutoMaxWagerAmount,
  setManageBotAddress,
} from "../../state/ui/reducer";
import { useAppSelector } from "../../state/hooks";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Address from "../Address";

export default () => {
  const { chainId, account } = useWeb3React();
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const [bettingDuration, setBettingDuration] = useState(0);
  const max = 100;
  const token = useToken(STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);
  const portalBalance = useTokenPortalBalance(token, account);
  const balance = useTokenBalance(token, account);
  const [price, setPrice] = useState(0);
  const [autoMaxWagerAmount, setAutoMaxWagerAmount] = useState(0);

  const addAction = useActionCreator();
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);

  const showSellBotModal = useAppSelector(
    (state) => state.ui.modal.showSellBotModal
  );
  const sellBotAddress = useAppSelector(
    (state) => state.ui.modal.sellBotAddress
  );

  const handleSell = async () => {
    //console.log("amount", amount)
    const tx = {
      type: TransactionType.CREATE_BOT_LISTING,
      botId: sellBotAddress,
      price: price,
      tokenAddress: token.address,
    };
    //console.log("tx", tx)
    const [approvalActionId, wait] = await addAction(tx);
    const roomId = await wait;
    //console.log(roomId)
    //console.log("jumping to" + roomId)
    //if(roomId) navigate(`game/${roomId}`, { replace: true })
  };

  //console.log("amount", amount)
  return (
    <Transition.Root show={showSellBotModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setManageBotModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        List your bot <Address value={sellBotAddress} /> for
                        sale
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Once listed, interested parties will be able to
                          purchase your bot.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      for="UserEmail"
                      class="block text-xs font-medium text-gray-700"
                    >
                      Set listing
                    </label>

                    <input
                      id="name"
                      value={price}
                      onChange={(event) => {
                        //console.log("event.value", event.target.value)
                        setPrice(event.target.value);
                      }}
                      class="mt-2 p-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      handleSell();
                      dispatch(setManageBotModal(false));
                    }}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      dispatch(setManageBotModal(false));
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    // <Dialog.Root>
    //   <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
    //   <Dialog.Portal>
    //     <DialogOverlay />
    //     <DialogContent>
    //       <DialogTitle>Update Bot</DialogTitle>
    //       <DialogDescription>
    //         Create a new game. Invite friends to join and start playing. Or wait
    //         for random players to join.
    //       </DialogDescription>

    //       <Fieldset>
    //         <Label>Auto battle Enable?</Label>
    //         <SelectMain
    //           options={["True", "False"]}
    //           value={autoBattleEnabled}
    //           onValueChange={setAutoBattleEnabled}
    //         />
    //       </Fieldset>

    //       <Fieldset>
    //         <Label>Auto Wager amount</Label>
    //       </Fieldset>
    //       <Fieldset>
    //         <Input
    //           id="amount"
    //           value={autoMaxWagerAmount}
    //           defaultValue={0}
    //           onChange={(event) => {
    //             //console.log("event.value", event.target.value)
    //             setAutoMaxWagerAmount(event.target.value);
    //           }}
    //         ></Input>
    //       </Fieldset>
    //       <Fieldset>
    //         <Label>Bot name</Label>
    //       </Fieldset>
    //       <Fieldset>
    //         <Input
    //           id="bettingDuration"
    //           value={name}
    //           onChange={(event) => {
    //             setName(event.target.value);
    //           }}
    //         ></Input>
    //       </Fieldset>

    //       <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
    //         <Dialog.Close asChild>
    //           <Button variant="green" onClick={handleCreate}>
    //             Create
    //           </Button>
    //         </Dialog.Close>
    //       </Flex>
    //       <Dialog.Close asChild>
    //         <IconButton aria-label="Close">
    //           <Cross2Icon />
    //         </IconButton>
    //       </Dialog.Close>
    //     </DialogContent>
    //   </Dialog.Portal>
    // </Dialog.Root>
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
