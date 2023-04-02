/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useState } from "react";

import {
  AcceptChallengeTransactionsInfo,
  DeclineChallengeTransactionsInfo,
  TransactionType,
} from "../common/types";
import { useActionCreator } from "../state/game/hooks";
import { Text } from "./ui/Text";

export default ({
  challengeId,
  accept,
}: {
  challengeId: string;
  accept: boolean;
}) => {
  const addAction = useActionCreator();
  const [waiting, setWaiting] = useState(false);
  const onClick = async () => {
    if (waiting) return;
    setWaiting(true);
    const transactionInfo:
      | AcceptChallengeTransactionsInfo
      | DeclineChallengeTransactionsInfo = {
      type: accept
        ? TransactionType.ACCEPT_CHALLENGE
        : TransactionType.DECLINE_CHALLENGE,
      challengeId,
    };
    console.log("challenge id: ", challengeId);
    const [actionId, wait] = await addAction(transactionInfo);
    await wait;
    setWaiting(false);
  };
  return (
    <Text
      onClick={onClick}
      color={waiting ? "faded" : accept ? "green" : "red"}
      underline
    >
      {accept ? "accept" : "decline"}
      {waiting && "ing"}
    </Text>
  );
};
