/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import "./Address.css";

import { violet } from "@radix-ui/colors";
import { StitchesLogoIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";

import { useAllBots, useAllProfiles, useAllUsers } from "../state/game/hooks";
import ProfileList from "./list/ProfileList";
import ModalCreateBot from "./modals/ModalCreateBot";
import Button from "./ui/Button";
import Separator from "./ui/Separator";
import { Text } from "./ui/Text";
import { Spacer } from "@nextui-org/react";
import { useAppDispatch } from "../state/hooks";
import BotList from "./list/BotList";

export default () => {
  const bots: any = useAllBots(true);
  const humans: any = useAllUsers(true);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-full">
      <header aria-label="Page Header" className="mt-10 bg-white-50">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-left sm:text-left">
              <h1 className="text-5xl items-center font-bold text-gray-900 sm:text-6xl">
                Rankings
              </h1>
              <p className="mt-1 text-xl text-gray-500">
                Check the top players and bots. Where do you stand?
              </p>
            </div>

            {/* <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => {
                }}
              >
                <span className="text-sm font-medium"> Deposit Funds </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1.5 h-4 w-4"
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
              </button>

              <button
                className="block rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => {
                }}
              >
                Create Game
              </button>
            </div> */}
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="my-5">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Humans
              </h1>
              <RightSlot>
                <Spacer x={1} />
              </RightSlot>
            </div>
            <ProfileList profiles={humans} showRank={true} />
          </div>

        </div>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Bots
              </h1>
              <RightSlot>
                <Spacer x={1} />
              </RightSlot>
            </div>
            <BotList bots={bots} showRank={true} />
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
