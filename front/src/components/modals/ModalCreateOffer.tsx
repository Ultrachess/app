/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { blackA, green, mauve, violet } from "@radix-ui/colors";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import { keyframes, styled } from "@stitches/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { Fragment, useRef } from "react";
import { useDispatch } from "react-redux";

import { TransactionType } from "../../common/types";
import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import {
  useToken,
  useTokenFromList,
  useTokenPortalBalance,
} from "../../hooks/token";
import { useActionCreator } from "../../state/game/hooks";
import { useAppSelector } from "../../state/hooks";
import {
  setCreateChallengeModalAddress,
  setCreateGameModal,
  setCreateOfferModal,
  setDepositModal,
} from "../../state/ui/reducer";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import { Text } from "../ui/Text";

export default () => {
  const { chainId, account } = useWeb3React();
  const [amount, setAmount] = useState<any>(0);
  const max = 100;
  const token = useToken(STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);
  const portalBalance = useTokenPortalBalance(token, account);

  const addAction = useActionCreator();
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);

  const showCreateOfferModal = useAppSelector(
    (state) => state.ui.modal.showCreateOfferModal
  );
  const createOfferModalAddress = useAppSelector(
    (state) => state.ui.modal.createOfferAddress
  );
  const createOfferModalAmount = useAppSelector(
    (state) => state.ui.modal.createOfferAmount
  );

  //const bot: BotProfile = useProfile(botId)

  const handleOffer = async () => {
    console.log("amountMain", amount);
    const [approvalActionId, wait] = await addAction({
      type: TransactionType.CREATE_OFFER,
      botId: createOfferModalAddress,
      tokenAddress: token.address,
      price: createOfferModalAmount * 10 ** token.decimals,
    });
    await wait;
  };

  //console.log("amount", amount)
  return (
    <Transition.Root show={showCreateOfferModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setDepositModal}
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
                        Offer to buy <Address value={createOfferModalAddress} />
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Set your offer price for this bot. If you offer higher
                          than or equal to its listing price, ownership will
                          automatically be transferred to you. Otherwise, you
                          will have to wait for your offer to be accepted by the
                          owner.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-xs font-medium text-gray-700">
                      Amount
                    </label>

                    <input
                      id="amount"
                      value={amount}
                      defaultValue={0}
                      onChange={(event) => {
                        //console.log("event.value", event.target.value)
                        dispatch(
                          setCreateChallengeModalAddress(event.target.value)
                        );
                      }}
                      className="mt-2 p-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <div className="rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 ">
                        {token ? token.symbol : "..."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      handleOffer();
                      dispatch(setCreateOfferModal(false));
                    }}
                  >
                    Offer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      dispatch(setCreateOfferModal(false));
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
    //       <DialogTitle>
    //         Create offer for <Address value={botId} />
    //       </DialogTitle>
    //       <DialogDescription>
    //         You are offering to buy this bot for{" "}
    //         <AssetDisplay
    //           tokenAddress={token?.address}
    //           balance={amount}
    //           isL2={true}
    //         />
    //         . Make sure to deposit funds to the portal first if you have not
    //         done so.
    //       </DialogDescription>

    //       <Fieldset>
    //         <Label>Price</Label>
    //         <RightSlot>
    //           <Text>Balance if offer accepted:</Text>
    //           <AssetDisplay
    //             tokenAddress={token?.address}
    //             balance={portalBalance + amount}
    //             isL2={true}
    //           />
    //         </RightSlot>
    //       </Fieldset>
    //       <Fieldset>
    //         <Input
    //           id="amount"
    //           value={amount}
    //           defaultValue={0}
    //           onChange={(event) => {
    //             setAmount(event.target.value);
    //           }}
    //         ></Input>
    //         <RightSlot onClick={() => setAmount(max)}>MAX</RightSlot>
    //       </Fieldset>
    //       <Fieldset>
    //         <SliderMain
    //           value={amount}
    //           max={100}
    //           onChangeFunction={([value]) => {
    //             setAmount(value);
    //           }}
    //         />
    //       </Fieldset>
    //       <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
    //         <Dialog.Close asChild>
    //           <Button variant="green" onClick={handleOffer}>
    //             Make offer
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
