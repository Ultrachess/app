/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import { TransactionType } from "../common/types";
import { useAction } from "../state/game/hooks";
import { ActionStates } from "../state/game/types";
import { useTransaction } from "../state/transactions/hooks";
import Address from "./Address";
import AddressGame from "./AddressGame";
import AssetDisplay from "./AssetDisplay";
import { Text } from "./ui/Text";

const statusToString = {
  [ActionStates.INITIALIZED]: "Initialized",
  [ActionStates.PENDING]: "Pending",
  [ActionStates.ERROR]: "Error",
  [ActionStates.CONFIRMED_WAITING_FOR_L2]: "Waiting on L2",
  [ActionStates.PROCESSED]: "Processed",
};

const statusToProgress = {
  [ActionStates.INITIALIZED]: 0,
  [ActionStates.PENDING]: 30,
  [ActionStates.ERROR]: 100,
  [ActionStates.CONFIRMED_WAITING_FOR_L2]: 60,
  [ActionStates.PROCESSED]: 100,
};

export const useTime = (refreshCycle = 100) => {
  // Returns the current time
  // and queues re-renders every `refreshCycle` milliseconds (default: 100ms)

  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    // Regularly set time in state
    // (this will cause your component to re-render frequently)
    const intervalId = setInterval(
      () => setNow(new Date().getTime() / 1000),
      refreshCycle
    );

    // Cleanup interval
    return () => clearInterval(intervalId);

    // Specify dependencies for useEffect
  }, [refreshCycle, setInterval, clearInterval, setNow]);

  return now;
};

export default ({ actionId }: { actionId: number }) => {
  const action = useAction(actionId);
  const transaction = useTransaction(action.transactionHash);
  let description = <Text>Creating input</Text>;
  let resultLambda = (result) => {
    return <Text>Action completed</Text>;
  };

  const txType = action.transactionInfo.type;
  switch (txType) {
    case TransactionType.SEND_MOVE_INPUT:
      description = (
        <Text>
          Sending move {action.transactionInfo.value} in{" "}
          <AddressGame id={action.transactionInfo.roomId} />
        </Text>
      );
      break;
    case TransactionType.CREATE_GAME_INPUT:
      description = (
        <Text css={{ display: "inline-block" }} size={4}>
          Creating game
        </Text>
      );
      resultLambda = (result) => {
        console.log("result: " + result);
        return (
          <Text>
            Created game with id: <AddressGame id={result} />
          </Text>
        );
      };
      break;
    case TransactionType.JOIN_GAME_INPUT:
      description = (
        <Text>
          Joining game <AddressGame id={action.transactionInfo.roomId} />
        </Text>
      );
      break;
    case TransactionType.RESIGN_GAME_INPUT:
      description = (
        <Text>
          Resigning from game <AddressGame id={action.transactionInfo.roomId} />
        </Text>
      );
      break;
    case TransactionType.DEPLOY_BOT_INPUT:
      description = <Text>Deploying bot</Text>;
      resultLambda = (result) => (
        <Text>
          Deployed bot with address: <Address value={result} />
        </Text>
      );
      break;
    case TransactionType.DEPOSIT_ERC20:
      description = (
        <Text>
          Depositing{" "}
          <AssetDisplay
            balance={action.transactionInfo.amount}
            tokenAddress={action.transactionInfo.tokenAddress}
          />{" "}
          to CTSI portal
        </Text>
      );
      break;
    case TransactionType.APPROVE_ERC20:
      description = (
        <Text>
          Approving{" "}
          <AssetDisplay
            balance={action.transactionInfo.amount}
            tokenAddress={action.transactionInfo.tokenAddress}
          />{" "}
          for CTSI portal
        </Text>
      );
      break;
    case TransactionType.MANAGER_BOT_INPUT:
      let toAdd;
      if (action.transactionInfo.name)
        toAdd += <Text>name: {action.transactionInfo.name}</Text>;
      if (action.transactionInfo.autoBattleEnabled)
        toAdd += (
          <Text>
            autoBattleEnabled: {action.transactionInfo.autoBattleEnabled}
          </Text>
        );
      if (action.transactionInfo.autoMaxWagerAmount)
        toAdd += (
          <Text>
            autoMaxWagerAmount: {action.transactionInfo.autoMaxWagerAmount}
          </Text>
        );
      description = <Text>Updating bot characteristics</Text>;
      break;
    case TransactionType.CREATE_CHALLENGE:
      description = (
        <Text>
          Challenging opponent{" "}
          <Address value={action.transactionInfo.recipient} />
        </Text>
      );
      resultLambda = (result) => (
        <Text>Challenge created, wait for opponent to accept</Text>
      );
      break;
    case TransactionType.ACCEPT_CHALLENGE:
      description = <Text>Accepting challenge</Text>;
      resultLambda = (result) => <Text>Challenge accepted, game started</Text>;
      break;
    case TransactionType.DECLINE_CHALLENGE:
      description = <Text>Declining challenge</Text>;
      break;
    case TransactionType.CREATE_OFFER:
      description = (
        <Text>
          Offering to buy bot <Address value={action.transactionInfo.botId} />{" "}
          for{" "}
          <AssetDisplay
            balance={action.transactionInfo.price}
            tokenAddress={action.transactionInfo.tokenAddress}
          />{" "}
        </Text>
      );
      resultLambda = (result) => <Text>Offer created</Text>;
      break;
    case TransactionType.ACCEPT_OFFER:
      description = <Text>You are accepting offer</Text>;
      resultLambda = (result) => (
        <Text>Offer accepted. Ownership of your bot has been transferred</Text>
      );
      break;
    case TransactionType.DECLINE_OFFER:
      description = <Text>Declining offer</Text>;
      break;
  }

  return (
    <>
      <div style={{ display: "inline-block" }}>
        {description}
        {action.result && resultLambda(action.result["value"])}
      </div>
      <div>
        {statusToString[action.status]}
        <ProgressBar
          now={statusToProgress[action.status]}
          label={`${statusToProgress[action.status]}%`}
        />
      </div>
    </>
  );
};
