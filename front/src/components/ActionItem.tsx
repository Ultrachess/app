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

const statusToColor = {
  [ActionStates.INITIALIZED]: "yellow",
  [ActionStates.PENDING]: "yellow",
  [ActionStates.ERROR]: "0xff0000",
  [ActionStates.CONFIRMED_WAITING_FOR_L2]: "yello",
  [ActionStates.PROCESSED]: "blue",
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

export default ({
  actionId,
  shouldShowExit = false,
}: {
  actionId: number;
  shouldShowExit: boolean;
}) => {
  const action = useAction(actionId);
  const transaction = useTransaction(action?.transactionHash);
  let header = <>Creating input</>;
  let description = <>Creating input</>;
  let resultLambda = (result) => {
    return <>Action completed</>;
  };

  const txType =
    action?.transactionInfo?.type ?? TransactionType.SEND_MOVE_INPUT;
  switch (txType) {
    case TransactionType.SEND_MOVE_INPUT:
      description = (
        <>
          Sending move {action?.transactionInfo?.value ?? "e3"} in{" "}
          <AddressGame id={action?.transactionInfo?.roomId ?? "abdc"} />
        </>
      );
      break;
    case TransactionType.CREATE_GAME_INPUT:
      console.log("action.transactionInfo: ",action.transactionInfo)
      header = <>Creating game</>;
      description = (
        <>
          Creating game with wager amount of <AssetDisplay balance={action.transactionInfo.wagerAmount.toString()} tokenAddress={action.transactionInfo.wagerTokenAddress} />
          

        </>
      );
      resultLambda = (result) => {
        console.log("result: " + result);
        return (
          <>
            Created game with id: <AddressGame id={result} />
          </>
        );
      };
      break;
    case TransactionType.JOIN_GAME_INPUT:
      description = (
        <>
          Joining game <AddressGame id={action.transactionInfo.roomId} />
        </>
      );
      break;
    case TransactionType.RESIGN_GAME_INPUT:
      description = (
        <>
          Resigning from game <AddressGame id={action.transactionInfo.roomId} />
        </>
      );
      break;
    case TransactionType.DEPLOY_BOT_INPUT:
      description = <>Deploying bot</>;
      resultLambda = (result) => (
        <>
          Deployed bot with address: <Address value={result} />
        </>
      );
      break;
    case TransactionType.DEPOSIT_ERC20:
      description = (
        <>
          Depositing{" "}
          <AssetDisplay
            balance={action.transactionInfo.amount}
            tokenAddress={action.transactionInfo.tokenAddress}
          />{" "}
          to CTSI portal
        </>
      );
      break;
    case TransactionType.APPROVE_ERC20:
      description = (
        <>
          Approving{" "}
          <AssetDisplay
            balance={action.transactionInfo.amount}
            tokenAddress={action.transactionInfo.tokenAddress}
          />{" "}
          for CTSI portal
        </>
      );
      break;
    case TransactionType.MANAGER_BOT_INPUT:
      let toAdd;
      if (action.transactionInfo.name)
        toAdd += <>name: {action.transactionInfo.name}</>;
      if (action.transactionInfo.autoBattleEnabled)
        toAdd += (
          <>
            autoBattleEnabled: {action.transactionInfo.autoBattleEnabled}
          </>
        );
      if (action.transactionInfo.autoMaxWagerAmount)
        toAdd += (
          <>
            autoMaxWagerAmount: {action.transactionInfo.autoMaxWagerAmount}
          </>
        );
      description = <>Updating bot characteristics</>;
      break;
    case TransactionType.CREATE_CHALLENGE:
      description = (
        <>
          Challenging opponent{" "}
          <Address value={action.transactionInfo.recipient} />
        </>
      );
      resultLambda = (result) => (
        <>Challenge created, wait for opponent to accept</>
      );
      break;
    case TransactionType.ACCEPT_CHALLENGE:
      description = <>Accepting challenge</>;
      resultLambda = (result) => <>Challenge accepted, game started</>;
      break;
    case TransactionType.DECLINE_CHALLENGE:
      description = <>Declining challenge</>;
      break;
    case TransactionType.CREATE_OFFER:
      description = (
        <>
          Offering to buy bot <Address value={action.transactionInfo.botId} />{" "}
          for{" "}
          <AssetDisplay
            balance={action.transactionInfo.price}
            tokenAddress={action.transactionInfo.tokenAddress}
          />{" "}
        </>
      );
      resultLambda = (result) => <>Offer created</>;
      break;
    case TransactionType.ACCEPT_OFFER:
      description = <>You are accepting offer</>;
      resultLambda = (result) => (
        <>Offer accepted. Ownership of your bot has been transferred</>
      );
      break;
    case TransactionType.DECLINE_OFFER:
      description = <>Declining offer</>;
      break;
  }

  const isError = (action?.status ?? ActionStates.ERROR) == ActionStates.ERROR;

  return (
    <div role="alert" className="relative border-bottom border-gray-100 p-4">
      <div className="flex items-start gap-4">
        {!isError ? (
          <span className="text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        ) : (
          <span className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        )}

        <div className="flex-1">
          <strong className="block font-medium text-gray-900">
            {" "}
            {header}{" "}
          </strong>

          <p className="mt-1 text-sm text-gray-700">
            {description}
          </p>
          <p className="block mt-1 text-sm text-green-700">
            {resultLambda ? resultLambda(action.result) : null}
          </p>
          
        </div>
        
        {shouldShowExit ? (
          <button className="text-gray-500 transition hover:text-gray-600">
            <span className="sr-only">Dismiss popup</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0">
          <ProgressBar
            className="w-full"
            now={statusToProgress[action?.status ?? ActionStates.ERROR]}
            color={statusToColor[action?.status ?? ActionStates.ERROR]}
          />
        </div>
    </div>
    // <>
    //   <div style={{ display: "inline-block" }}>
    //     {description}
    //     {action?.result && resultLambda(action.result["value"])}
    //   </div>
    //   <div>
    //     {statusToString[action?.status ?? ActionStates.ERROR]}
    //     <ProgressBar
    //       now={statusToProgress[action?.status ?? ActionStates.ERROR]}
    //     />
    //   </div>
    // </>
  );
};
