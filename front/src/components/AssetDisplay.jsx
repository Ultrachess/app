/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useSelector } from "react-redux";
import { useToken, useTokenFromList } from "../hooks/token";
import { useWeb3React } from "@web3-react/core";
import { Text } from "./ui/Text";
import TokenIcon from "./TokenIcon";
import {
  STABLECOIN_ADDRESS_ON_NETWORKS,
  DEFAULT_TOKEN_URI,
} from "../ether/chains";
import Flex from "./ui/Flex";

export default ({
  tokenAddress,
  balance,
  isL2 = false,
  green = false,
  blue = false,
  grey = false,
  red = false,
  isMedium = false,
}) => {
  const { account, chainId } = useWeb3React();
  const _tokenAddress = tokenAddress ?? STABLECOIN_ADDRESS_ON_NETWORKS[chainId];
  const token = useToken(_tokenAddress);
  //get account balance of token
  const balances = useSelector((state) => state.game.balances);
  const accountBalances = balances?.[account] ?? undefined;
  const _balance = balance ?? accountBalances?.[tokenAddress] ?? "0.0";

  //console.log("abc tokenAddress", tokenAddress)
  console.log("abc token", token)

  return (
    <Flex css={{ alignItems: "center", gap: "2" }}>
        {_balance ?? "0.0"}
        {" "}
        {token?.symbol}
      
    </Flex>
  );
};
