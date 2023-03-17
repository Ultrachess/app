/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import * as ERC20PortalFacetArbitrumGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/ERC20PortalFacet.json";
import * as ERC20PortalFacetOptimismGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/ERC20PortalFacet.json";
import * as ERC20PortalFacetPolygonMumbai from "@cartesi/rollups/deployments/arbitrum_goerli/ERC20PortalFacet.json";
import * as InputFacetArbitrumGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/InputFacet.json";
import * as InputFacetOptimismGoerli from "@cartesi/rollups/deployments/arbitrum_goerli/InputFacet.json";
import * as InputFacetPolygonMumbai from "@cartesi/rollups/deployments/arbitrum_goerli/InputFacet.json";
import * as ERC20PortalFacetGoerli from "@cartesi/rollups/deployments/goerli/ERC20PortalFacet.json";
import * as InputFacetGoerli from "@cartesi/rollups/deployments/goerli/InputFacet.json";
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
    ERC20PortalFacet: ERC20PortalFacetArbitrumGoerli,
    InputFacet: InputFacetArbitrumGoerli,
  },
  arbitrum_mainnet: {
    CartesiToken: CartesiTokenArbitrumMainnet,
  },
  goerli: {
    CartesiToken: CartesiTokenGoerli,
    ERC20PortalFacet: ERC20PortalFacetGoerli,
    InputFacet: InputFacetGoerli,
    SimpleFaucet: SimpleFaucetGoerli,
  },
  localhost: Object.assign({}, contractsLocalhost, ultrachessLocalhost),
  mainnet: {
    CartesiToken: CartesiTokenMainnet,
  },
  optimism_goerli: {
    CartesiToken: CartesiTokenOptimismGoerli,
    ERC20PortalFacet: ERC20PortalFacetOptimismGoerli,
    InputFacet: InputFacetOptimismGoerli,
  },
  optimism_mainnet: {
    CartesiToken: CartesiTokenOptimismMainnet,
  },
  polygon_mainnet: {
    CartesiToken: CartesiTokenPolygonMainnet,
    InputFacet: contractsLocalhost.InputFacet,
    ERC20PortalFacet: contractsLocalhost.ERC20PortalFacet,
  },
  polygon_mumbai: {
    CartesiToken: CartesiTokenPolygonMumbai,
    ERC20PortalFacet: ERC20PortalFacetPolygonMumbai,
    InputFacet: InputFacetPolygonMumbai,
  },
};
