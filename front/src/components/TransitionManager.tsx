/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import "./TransitionManager.css";

import { Loading, Text } from "@nextui-org/react";
import { useMemo } from "react";

import { TransactionType } from "../common/types";
import { useActionsNotProcessed } from "../state/game/hooks";

export default () => {
  const actionsNotProcessed = useActionsNotProcessed();
  const pendingGameCreates = useMemo(() => {
    if (actionsNotProcessed)
      return actionsNotProcessed.filter(
        ({ transactionInfo }) =>
          transactionInfo.type == TransactionType.CREATE_GAME_INPUT
      );
    return [];
  }, [actionsNotProcessed]);

  const pendingGameJoins = useMemo(() => {
    if (actionsNotProcessed)
      return actionsNotProcessed.filter(
        ({ transactionInfo }) =>
          transactionInfo.type == TransactionType.JOIN_GAME_INPUT
      );
    return [];
  }, [actionsNotProcessed]);

  return (
    <div
      id="overlay"
      className={
        pendingGameCreates.length > 0 || pendingGameJoins.length > 0
          ? "visible"
          : "invisible"
      }
    >
      <div className="center-transition">
        <Loading />
        {pendingGameCreates.length > 0 ? (
          <Text>Creating game</Text>
        ) : pendingGameJoins.length > 0 ? (
          <Text>Joining game</Text>
        ) : (
          <Text>Loading</Text>
        )}
      </div>
    </div>
  );
};
