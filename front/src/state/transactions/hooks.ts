/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { TransactionResponse } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";

import { TransactionInfo } from "../../common/types";
import { setBlockNumber } from "../game/gameSlice";
import { delay } from "../game/updater";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addTransaction } from "./reducer";
import { Transaction } from "./types";

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  info: TransactionInfo
) => void {
  const { chainId, account } = useWeb3React();
  const dispatch = useAppDispatch();

  return useCallback(
    (response: TransactionResponse, info: TransactionInfo) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error("No transaction hash found.");
      }
      dispatch(addTransaction({ hash, from: account, info, chainId }));
    },
    [account, chainId, dispatch]
  );
}

// returns all transaction on current chain
export function useAllTransactions(): { [txHash: string]: Transaction } {
  const { chainId } = useWeb3React();

  const transactions = useAppSelector((state) => state.transactions);

  return chainId ? transactions[chainId] : {};
}

//get the transaction value of a cetain hash
export function useTransaction(hash: string): Transaction | undefined {
  const transactions = useAllTransactions();

  if (!hash) {
    return undefined;
  }

  return transactions[hash];
}

//check if transaction is pending
export function useIsTransactionPending(hash: string): boolean {
  const transactions = useAllTransactions();

  if (!hash || !transactions[hash]) return false;

  return !transactions[hash].receipt;
}

//check if transaction is pending
export function useIsTransactionConfirmed(hash: string): boolean {
  const transactions = useAllTransactions();

  if (!hash || !transactions[hash]) return false;

  return Boolean(transactions[hash].receipt);
}

//get block number
export function useBlockNumber(): number | undefined {
  const { provider } = useWeb3React();
  const blockNumber = useAppSelector((state) => state.game.blockNumber);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getBlock = async () => {
      try {
        const result = await provider.getBlockNumber();
        dispatch(setBlockNumber(result));
        await delay(1000);
        await getBlock();
      } catch {}
    };

    getBlock().catch(console.error);
  }, [provider]);

  return blockNumber;
}

//get latest block number from chain
export function useLatestBlockNumber(): number | undefined {
  const { provider } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState<number | undefined>();
  useEffect(() => {
    const getBlock = async () => {
      try {
        const result = await provider.getBlockNumber();
        setBlockNumber(result);
        await delay(1000);
        await getBlock();
      } catch {}
    };

    getBlock().catch(console.error);
  }, [provider]);

  return blockNumber;
}

//use latest timestamp from chain
export function useLatestTimestamp(): number | undefined {
  const { provider } = useWeb3React();
  const [timestamp, setTimestamp] = useState<number | undefined>();
  useEffect(() => {
    const getBlock = async () => {
      try {
        const result = await provider.getBlock("latest");
        setTimestamp(result.timestamp);
        await delay(1000);
        await getBlock();
      } catch {}
    };

    getBlock().catch(console.error);
  }, [provider]);

  return timestamp;
}

//use latest timestamp and block number from chain
//returns a tuple of [timestamp, blockNumber]
export function useLatestTimestampAndBlockNumber(): [
  number | undefined,
  number | undefined
] {
  const { provider } = useWeb3React();
  const [timestamp, setTimestamp] = useState<number | undefined>();
  const [blockNumber, setBlockNumber] = useState<number | undefined>();
  useEffect(() => {
    const getBlock = async () => {
      try {
        const result = await provider.getBlock("latest");
        setTimestamp(result.timestamp);
        setBlockNumber(result.number);
        await delay(1000);
        await getBlock();
      } catch {}
    };

    getBlock().catch(console.error);
  }, [provider]);

  return [timestamp, blockNumber];
}
