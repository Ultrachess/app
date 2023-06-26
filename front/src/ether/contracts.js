/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import * as ERC20PortalArbitrumGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/ERC20Portal.json";
import * as ERC20PortalOptimismGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/ERC20Portal.json";
import * as ERC20PortalPolygonMumbai from "@cartesi/rollups/deployments/arbitrum_goerli/ERC20Portal.json";
import * as InputBoxArbitrumGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/InputBox.json";
import * as InputBoxOptimismGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/InputBox.json";
import * as InputBoxPolygonMumbai from "@cartesi/rollups/deployments/arbitrum_goerli/InputBox.json";
import * as ERC20PortalGoerli from "@cartesi/rollups/deployments/goerli/ERC20Portal.json";
import * as InputBoxGoerli from "@cartesi/rollups/deployments/goerli/InputBox.json";
import * as CartesiTokenArbitrumGoerli from "@cartesi/token/deployments/arbitrum_goerli/CartesiToken.json";
import * as CartesiTokenArbitrumMainnet from "@cartesi/token/deployments/arbitrum_mainnet/CartesiToken.json";
import * as CartesiTokenGoerli from "@cartesi/token/deployments/goerli/CartesiToken.json";
import * as SimpleFaucetGoerli from "@cartesi/token/deployments/goerli/SimpleFaucet.json";
import * as CartesiTokenMainnet from "@cartesi/token/deployments/mainnet/CartesiToken.json";
import * as CartesiTokenOptimismGoerli from "@cartesi/token/deployments/optimism_goerli/CartesiToken.json";
import * as CartesiTokenOptimismMainnet from "@cartesi/token/deployments/optimism_mainnet/CartesiToken.json";
import * as CartesiTokenPolygonMainnet from "@cartesi/token/deployments/polygon_mainnet/CartesiToken.json";
import * as CartesiTokenPolygonMumbai from "@cartesi/token/deployments/polygon_mumbai/CartesiToken.json";

import { contracts as ultrachessLocalhost } from "../../../export/localhost-ultrachess.json";
import { contracts as contractsLocalhost } from "../abis/localhost.json";

export const CONTRACTS = {
  arbitrum_goerli: {
    CartesiToken: CartesiTokenArbitrumGoerli,
    ERC20Portal: ERC20PortalArbitrumGoerli,
    InputBox: InputBoxArbitrumGoerli,
  },
  arbitrum_mainnet: {
    CartesiToken: CartesiTokenArbitrumMainnet,
  },
  goerli: {
    CartesiToken: CartesiTokenGoerli,
    ERC20Portal: ERC20PortalGoerli,
    InputBox: InputBoxGoerli,
    SimpleFaucet: SimpleFaucetGoerli,
  },
  localhost: Object.assign({}, contractsLocalhost, ultrachessLocalhost),
  mainnet: {
    CartesiToken: CartesiTokenMainnet,
  },
  optimism_goerli: {
    CartesiToken: CartesiTokenOptimismGoerli,
    ERC20Portal: ERC20PortalOptimismGoerli,
    InputBox: InputBoxOptimismGoerli,
  },
  optimism_mainnet: {
    CartesiToken: CartesiTokenOptimismMainnet,
  },
  polygon_mainnet: {
    CartesiToken: CartesiTokenPolygonMainnet,
    InputBox: contractsLocalhost.InputBox,
    ERC20Portal: contractsLocalhost.ERC20Portal,
  },
  polygon_mumbai: {
    CartesiToken: CartesiTokenPolygonMumbai,
    ERC20Portal: ERC20PortalPolygonMumbai,
    InputBox: InputBoxPolygonMumbai,
  },
};
