/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { createSlice } from "@reduxjs/toolkit";

import { updateVersion } from "../global/actions";
import { Transaction } from "./types";

const now = () => new Date().getTime();

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: Transaction;
  };
}

export const initialState: TransactionState = {};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction(transactions, { payload: { chainId, from, hash, info } }) {
      if (transactions[chainId]?.[hash]) {
        throw Error("Attempted to add existing transaction.");
      }
      const txs = transactions[chainId] ?? {};
      txs[hash] = { chainId, hash, info, from, addedTime: now() };
      transactions[chainId] = txs;
    },
    clearAllTransactions(transactions, { payload: { chainId } }) {
      if (!transactions[chainId]) return;
      transactions[chainId] = {};
    },
    //call this action when a transaction's status has been checked
    checkedTransaction(
      transactions,
      { payload: { chainId, hash, blockNumber } }
    ) {
      const tx = transactions[chainId]?.[hash];
      if (!tx) {
        return;
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber;
      } else {
        tx.lastCheckedBlockNumber = Math.max(
          blockNumber,
          tx.lastCheckedBlockNumber
        );
      }
    },
    //on transaction confirmation
    finalizeTransaction(transactions, { payload: { hash, chainId, receipt } }) {
      const tx = transactions[chainId]?.[hash];
      if (!tx) {
        return;
      }
      tx.receipt = receipt;
      tx.confirmedTime = now();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateVersion, (transactions) => {
      // in case there are any transactions in the store with the old format, remove them
      Object.keys(transactions).forEach((chainId) => {
        const chainTransactions = transactions[chainId as unknown as number];
        Object.keys(chainTransactions).forEach((hash) => {
          if (!("info" in chainTransactions[hash])) {
            // clear old transactions that don't have the right format
            delete chainTransactions[hash];
          }
        });
      });
    });
  },
});

export const {
  addTransaction,
  clearAllTransactions,
  checkedTransaction,
  finalizeTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;
