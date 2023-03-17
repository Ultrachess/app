import React, { useState } from "react";

import {
  AcceptBotOfferTransactionsInfo,
  AcceptChallengeTransactionsInfo,
  DeclineBotOfferTransactionsInfo,
  DeclineChallengeTransactionsInfo,
  TransactionType,
} from "../common/types";
import { useActionCreator } from "../state/game/hooks";
import { Text } from "./ui/Text";

export default ({ offerId, accept }: { offerId: string; accept: boolean }) => {
  const addAction = useActionCreator();
  const [waiting, setWaiting] = useState(false);
  const onClick = async () => {
    if (waiting) return;
    setWaiting(true);
    const transactionInfo:
      | AcceptBotOfferTransactionsInfo
      | DeclineBotOfferTransactionsInfo = {
      type: accept
        ? TransactionType.ACCEPT_OFFER
        : TransactionType.DECLINE_OFFER,
      offerId,
    };
    const [actionId, wait] = await addAction(transactionInfo);
    await wait;
    setWaiting(false);
  };
  return (
    <Text
      onClick={onClick}
      color={waiting ? "faded" : accept ? "green" : "red"}
      green={accept}
      violet={!accept}
      bold
      size={"4"}
      underline
    >
      {accept ? "accept" : "decline"}
      {waiting && "'ing"}
    </Text>
  );
};
