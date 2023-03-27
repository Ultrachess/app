/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  modal: {
    showCreateChallengeModal: boolean;
    showDeployBotModal: boolean;
    showCreateGameModal: boolean;
    showCreateOfferModal: boolean;
    showCreateTournamentModal: boolean;
    showDepositModal: boolean;
    showManageBotsModal: boolean;
    showPlaceBetModal: boolean;
  };
}

export const initialState: UiState = {
  modal: {
    showCreateChallengeModal: false,
    showDeployBotModal: false,
    showCreateGameModal: false,
    showCreateOfferModal: false,
    showCreateTournamentModal: false,
    showDepositModal: false,
    showManageBotsModal: false,
    showPlaceBetModal: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCreateChallengeModal(state, { payload }: { payload: boolean }) {
      state.modal.showCreateChallengeModal = payload;
    },
    setDeployBotModal(state, { payload }: { payload: boolean }) {
      state.modal.showDeployBotModal = payload;
    },
    setCreateGameModal(state, { payload }: { payload: boolean }) {
      state.modal.showCreateGameModal = payload;
    },
    setCreateOfferModal(state, { payload }: { payload: boolean }) {
      state.modal.showCreateOfferModal = payload;
    },
    setCreateTournamentModal(state, { payload }: { payload: boolean }) {
      state.modal.showCreateTournamentModal = payload;
    },
    setDepositModal(state, { payload }: { payload: boolean }) {
      state.modal.showDepositModal = payload;
    },
    setManageBotsModal(state, { payload }: { payload: boolean }) {
      state.modal.showManageBotsModal = payload;
    },
    setPlaceBetModal(state, { payload }: { payload: boolean }) {
      state.modal.showPlaceBetModal = payload;
    },
  },
});

export const {
  setCreateChallengeModal,
  setDeployBotModal,
  setCreateGameModal,
  setCreateOfferModal,
  setCreateTournamentModal,
  setDepositModal,
  setManageBotsModal,
  setPlaceBetModal,
} = uiSlice.actions;
export default uiSlice.reducer;
