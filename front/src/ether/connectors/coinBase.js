/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";

import { URLS } from "../chains";

export const [coinbaseWallet, hooks] = initializeConnector(
  (actions) =>
    new CoinbaseWallet(actions, {
      url: URLS[1][0],
      appName: "web3-react",
    })
);
