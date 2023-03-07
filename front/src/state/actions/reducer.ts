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
