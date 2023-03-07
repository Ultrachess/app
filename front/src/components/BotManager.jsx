/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Spacer } from "@nextui-org/react";
import BotListView from "./list/BotList";
import { useAllBots } from "../state/game/hooks";
import { useLpNfts } from "../state/game/hooks";
import { Text } from "./ui/Text";
import { styled } from "@stitches/react";
import ModalCreateBot from "./modals/ModalCreateBot";
import ModalMintStables from "./modals/ModalMintStables";
import ModalMintLpNft from "./modals/ModalMintLpNft";
import ModalDepositLpNft from "./modals/ModalDepositLpNft";
import LpNftListView from "./list/LpNftList";
import Separator from "./ui/Separator";
import { StitchesLogoIcon } from "@radix-ui/react-icons";
import { violet } from "@radix-ui/colors";
import Button from "./ui/Button";
import { setDeployBotModal } from "../state/ui/reducer";
import { useDispatch } from "react-redux";
import { setDepositModal } from "../state/ui/reducer";
import BotList from "./list/BotList";
import { Spacer } from "@nextui-org/react";

export default () => {
  const bots = useAllBots();
  const dispatch = useDispatch();
  const lpNfts = useLpNfts();

  return (
    <div class="min-h-full">
      <header aria-label="Page Header" class="mt-10 bg-white-50">
        <div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <div class="text-left sm:text-left">
              <h1 class="text-5xl items-center font-bold text-gray-900 sm:text-6xl">
                Bots
              </h1>
              <p class="mt-1 text-xl text-gray-500">
                Check out the bots that are currently deployed on Ultrachess
              </p>
            </div>

            <div class="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              {/* <button
                class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => {
                  dispatch(setDepositModal(true));
                }}
              >
                <span class="text-sm font-medium"> Deposit Funds </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ml-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button> */}

              <button
                class="block rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => {
                  dispatch(setDeployBotModal(true));
                }}
              >
                Deploy bot
              </button>
            </div>
            <Separator />
            <BotListView bots={bots} />
            <Separator />
            <div className="contentHeader">
              <Label>LP NFTs</Label>
              <RightSlot>
                <ModalMintStables
                  triggerElement={
                    <Button shadow>
                      <Text>Mint stables</Text>
                    </Button>
                  }
                />
                <Spacer x={1} />
                <ModalMintLpNft
                  triggerElement={
                    <Button shadow>
                      <Text>Mint LP NFT</Text>
                    </Button>
                  }
                />
                <Spacer x={1} />
                <ModalDepositLpNft
                  triggerElement={
                    <Button shadow>
                      <Text>Deposit LP NFT</Text>
                    </Button>
                  }
                />
              </RightSlot>
            </div>
            <Separator />
            <LpNftListView lpNfts={lpNfts} />
          </div>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div class="my-5">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Bots
              </h1>
              <RightSlot>
                <Spacer x={1} />
              </RightSlot>
            </div>
            <BotList bots={bots} showRank={false} />
          </div>
        </div>
      </main>
    </div>
  );
};

const Label = styled("label", {
  fontSize: 23,
  lineHeight: 1,
  fontWeight: 500,
  marginBottom: 20,
  color: violet.violet12,
  display: "block",
});

const LeftSlot = styled("div", {
  marginRight: "auto",
  paddingRight: 0,
  display: "flex",
  color: violet.violet11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: violet.violet4 },
});

const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 0,
  display: "flex",
  "[data-highlighted] > &": { color: "white" },
});
