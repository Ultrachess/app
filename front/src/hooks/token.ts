/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import ULTRACHESS_LIST from "../utils/lists/ultrachess.tokenlists.json";
import { useContractCallResult, useErc20Contract } from "./contract";

export interface Token {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoUri?: string;
}

export function useTokenList(): Token[] {
  const { chainId } = useWeb3React();
  const [tokenList, setTokenList] = useState<Token[]>([]);

  useEffect(() => {
    const callFetch = async () => {
      // const result = await fetchTokenList(
      //     ULTRACHESS_LIST,
      //     (ensName: string) => {
      //         return {} as Promise<string>
      //     }
      // )
      const _chainId = chainId ?? 31337;
      //console.log("chainId from token: ", _chainId)
      const tokens = ULTRACHESS_LIST.filter(
        (token) => token.chainId == _chainId
      );
      setTokenList(tokens);
    };

    callFetch().catch(console.error);
  }, [chainId]);

  return tokenList;
}

export function useTokenFromList(address: string): Token {
  const tokenList = useTokenList();

  return useMemo(() => {
    try {
      //console.log("abc tokenlist", address, tokenList)
      return tokenList.find(
        (val) => val.address.toLowerCase() == address.toLowerCase()
      );
    } catch (e) {
      return {
        name: "blank",
        address: "blank",
        symbol: "blank",
        chainId: 0,
        decimals: 0,
      };
    }
  }, [tokenList, address]);
}

export function useTokenFromNetwork(
  address: string | null | undefined
): Token | null | undefined {
  const { chainId, account } = useWeb3React();

  const contract = useErc20Contract(address);
  const name = useContractCallResult(contract, "name");
  const symbol = useContractCallResult(contract, "symbol");
  const decimals = useContractCallResult(contract, "decimals");
  const balance = useContractCallResult(contract, "balanceOf", [account]);

  return useMemo(() => {
    return {
      address,
      chainId,
      name,
      symbol: "USD",
      decimals,
    } as Token;
  }, [address, chainId, name, symbol, decimals]);
}

export function useTokenBalance(
  token: Token,
  address: string | null | undefined
): number | string {
  const contract = useErc20Contract(token?.address);
  const balance = useContractCallResult(contract, "balanceOf", [address]);
  //console.log("balance ctsi: ", balance)
  return balance;
}

export function useTokenPortalBalance(token: Token, address: string): number {
  const balances = {};
  //console.log("balances: ", balances)
  const accountBalances = balances?.[address] ?? {};
  const balance = accountBalances?.[token?.address] ?? 0.0;

  return balance;
}

export function useToken(address?: string | null): Token | null | undefined {
  //const tokens = useTokenList()

  //const tokenFromList = useTokenFromList(tokens, address)
  const tokenFromNetwork = useTokenFromNetwork(address);

  tokenFromNetwork.symbol = "USD";
  return tokenFromNetwork;
}
