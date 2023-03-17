/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";

import { URLS } from "../chains";

export const [walletConnect, hooks] = initializeConnector(
  (actions) =>
    new WalletConnect(actions, {
      rpc: URLS,
    }),
  Object.keys(URLS).map((chainId) => Number(chainId))
);
