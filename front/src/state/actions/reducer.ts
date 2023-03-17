/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { createSlice } from "@reduxjs/toolkit";

import { Action } from "../game/types";

export interface ActionState {
  [actionId: string]: Action;
}

export const initialState: ActionState = {};

const actionsSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {
    addAction(state, { payload }: { payload: Action }) {
      state[payload.id.toString()] = payload;
    },
    setAction(state, { payload }: { payload: Action }) {
      if (state[payload.id.toString()]) state[payload.id.toString()] = payload;
    },
    setActionTransactionHash(
      state,
      { payload }: { payload: { id: number; transactionHash: string } }
    ) {
      if (state[payload.id.toString()]) {
        state[payload.id.toString()].transactionHash = payload.transactionHash;
      }
    },
  },
});

export const { addAction, setAction, setActionTransactionHash } =
  actionsSlice.actions;

export default actionsSlice.reducer;
