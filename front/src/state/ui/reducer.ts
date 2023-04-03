/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  notification: {
    hasNew: boolean;
  };
  modal: {
    showCreateChallengeModal: boolean;
    createChallengeModalAddress: string;
    showDeployBotModal: boolean;
    showCreateGameModal: boolean;
    createOfferAddress: string;
    createOfferAmount: number;
    showCreateOfferModal: boolean;
    showCreateTournamentModal: boolean;
    showDepositModal: boolean;
    manageBotAddress: string;
    manageBotName: string;
    manageBotAutoBattleEnabled: string;
    manageBotAutoMaxWagerAmount: number;
    showManageBotModal: boolean;
    showPlaceBetModal: boolean;
  };
}

export const initialState: UiState = {
  notification: {
    hasNew: false,
  },
  modal: {
    showCreateChallengeModal: false,
    createChallengeModalAddress: "0x",
    showDeployBotModal: false,
    showCreateGameModal: false,
    createOfferAddress: "0x",
    createOfferAmount: 0,
    showCreateOfferModal: false,
    showCreateTournamentModal: false,
    showDepositModal: false,
    showManageBotModal: false,
    manageBotAddress: "0x",
    manageBotName: "",
    manageBotAutoBattleEnabled: "False",
    manageBotAutoMaxWagerAmount: 0,
    showPlaceBetModal: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHasNewNotification(state, { payload }: { payload: boolean }) {
      state.notification.hasNew = payload;
    },
    setCreateChallengeModal(state, { payload }: { payload: boolean }) {
      state.modal.showCreateChallengeModal = payload;
    },
    setCreateChallengeModalAddress(state, { payload }: { payload: string }) {
      console.log("setCreateChallengeModalAddress", payload);
      state.modal.createChallengeModalAddress = payload;
    },
    setDeployBotModal(state, { payload }: { payload: boolean }) {
      state.modal.showDeployBotModal = payload;
    },
    setCreateGameModal(state, { payload }: { payload: boolean }) {
      state.modal.showCreateGameModal = payload;
    },
    setCreateOfferAddress(state, { payload }: { payload: string }) {
      state.modal.createOfferAddress = payload;
    },
    setCreateOfferAmount(state, { payload }: { payload: number }) {
      state.modal.createOfferAmount = payload;
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
    setManageBotModal(state, { payload }: { payload: boolean }) {
      state.modal.showManageBotModal = payload;
    },
    setManageBotAddress(state, { payload }: { payload: string }) {
      state.modal.manageBotAddress = payload;
    },
    setManageBotName(state, { payload }: { payload: string }) {
      state.modal.manageBotName = payload;
    },
    setManageBotAutoBattleEnabled(state, { payload }: { payload: string }) {
      state.modal.manageBotAutoBattleEnabled = payload;
    },
    setManageBotAutoMaxWagerAmount(state, { payload }: { payload: number }) {
      state.modal.manageBotAutoMaxWagerAmount = payload;
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
  setManageBotModal,
  setManageBotAddress,
  setManageBotName,
  setManageBotAutoBattleEnabled,
  setManageBotAutoMaxWagerAmount,

  setPlaceBetModal,
  setCreateChallengeModalAddress,
  setCreateOfferAddress,
  setCreateOfferAmount,
  setHasNewNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
