/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { slate } from "@radix-ui/colors";
import * as Toast from "@radix-ui/react-toast";
import { styled } from "@stitches/react";
import { useWeb3React } from "@web3-react/core";

import {
  Notification,
  NotificationType,
} from "../state/notifications/notifications";
import ActionItem from "./ActionItem";
import Address from "./Address";
import AddressGame from "./AddressGame";
import AddressTournament from "./AddressTournament";
import AssetDisplay from "./AssetDisplay";
import ChallengeAction from "./HandleChallenge";
import DateDisplay from "./ui/Date";
import { Text } from "./ui/Text";

export default ({
  notification,
  shouldShowExit = false,
}: {
  notification: Notification;
  shouldShowExit: boolean;
}) => {
  const { id, timestamp, type } = notification;
  const { account } = useWeb3React();

  let title = "";
  let description = <></>;

  //console.log("abc notification in item: ", notification.type)
  const newType = notification.type;
  switch (newType) {
    case NotificationType.GAME_CREATED:
      //console.log("abc game created", notification["creator_id"])
      title = "Game Created";
      description = (
        <>
          Player{" "}
          <Address showProfile={false} value={notification["creator_id"]} /> has
          created a game{" "}
          <AddressGame id={notification["game_id"]} />
        </>
      );
      break;
    case NotificationType.GAME_JOINED:
      title = `Someone joined your game`;
      description = (
        <>
          Player{" "}
          <Address showProfile={false} value={notification["player_id"]} /> has
          joined your game{" "}
          <AddressGame id={notification["game_id"]} />
        </>
      );
      break;
    case NotificationType.GAME_MOVE:
      title = "Someone made a move";
      description = (
        <>
          <Address showProfile={false} value={notification["player_id"]} /> has
          made a move in your game{" "}
          <AddressGame id={notification["game_id"]} />
        </>
      );
      break;
    case NotificationType.GAME_COMPLETED:
      title = "Game Completed";
      description = (
        <>
          Game <AddressGame id={notification["game_id"]} />{" "}
          has completed with{" "}
          <Address showProfile={false} value={notification["player_id1"]} />{" "}
          scoring {notification["score1"]} and{" "}
          <Address showProfile={false} value={notification["player_id2"]} />{" "}
          scoring {notification["score2"]}
          <Address showProfile={false} value={notification["winningId"]} /> has
          won{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["pot"]}
            isL2={true}
          />{" "}
          and a pot of{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["pot"]}
            isL2={true}
          />{" "}
          has been rewarded to {notification["winningIdBettorCount"]} bettors on{" "}
          <Address showProfile={false} value={notification["winningId"]} />
        </>
      );
      break;
    case NotificationType.GAME_WAGER:
      title = "Game Wager";
      const wager = notification["wager"];
      const token = notification["token"];
      description = (
        <>
          <Address
            showProfile={false}
            value={notification["player_id"]}
            hoverable={true}
          />{" "}
          has wagered{" "}
          <AssetDisplay tokenAddress={token} balance={wager} isL2={true} /> in
          game <AddressGame id={notification["game_id"]} />
        </>
      );
      break;
    case NotificationType.GAME_BETTING_CLOSED:
      title = "Game Betting Closed";
      description = (
        <>
          Betting has closed in game{" "}
          <AddressGame id={notification["game_id"]} />
        </>
      );
      break;
    case NotificationType.CHALLENGE_ACCEPTED:
      title = "Your challenge accepted";
      description = (
        <>
          Player{" "}
          <Address
            showProfile={false}
            value={notification["recipient"]}
            hoverable={true}
          />{" "}
          has accepted your challenge for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["wager"]}
            isL2={true}
          />{" "}
          Join the game <AddressGame id={notification["game_id"]} />
        </>
      );
      break;
    case NotificationType.CHALLENGE_DECLINED:
      title = "Challenge declined";
      description = (
        <>
          Player{" "}
          <Address showProfile={false} value={notification["recipient"]} /> has
          declined your challenge id#{notification["challengeId"]}. Too bad bro!
        </>
      );
      break;
    case NotificationType.CHALLENGE_CREATED:
      title = "Challenge Recieved";
      description = (
        <>
          Player{" "}
          <Address showProfile={false} value={notification["challenger"]} /> has
          challenged you to a game wagering{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["wager"] / 10 ** 18}
            isL2={true}
          />{" "}
          <ChallengeAction
            challengeId={notification["challenge_id"]}
            accept={true}
          />{" "}
          or{" "}
          <ChallengeAction
            challengeId={notification["challenge_id"]}
            accept={false}
          />
        </>
      );
      break;
    case NotificationType.TOURNAMENT_JOINED:
      title = "Tournament Joined";
      description = (
        <>
          Player{" "}
          <Address showProfile={false} value={notification["player_id"]} /> has
          joined tournament{" "}
          <AddressTournament id={notification["tournament_id"]} />
        </>
      );
      break;
    case NotificationType.TOURNAMENT_COMPLETED:
      title = "Tournament Completed";
      description = (
        <>
          Tournament{" "}
          <Address
            showProfile={false}
            Tournament
            id={notification["tournament_id"]}
          />{" "}
          has completed
        </>
      );
      break;
    case NotificationType.TOURNAMENT_MATCH_CREATED:
      title = "Tournament Match Created";
      description = (
        <>
          A match has been created in tournament{" "}
          <Address
            showProfile={false}
            Tournament
            id={notification["tournament_id"]}
          />{" "}
          between{" "}
          <Address showProfile={false} value={notification["player_id1"]} /> and{" "}
          <Address showProfile={false} value={notification["player_id2"]} />
        </>
      );
      break;
    case NotificationType.TOURNAMENT_MATCH_COMPLETED:
      title = "Tournament Match Completed";
      description = (
        <>
          Player{" "}
          <Address showProfile={false} value={notification["player_id1"]} /> has
          scored {notification["score1"]} and player{" "}
          <Address showProfile={false} value={notification["player_id2"]} /> has
          scored {notification["score2"]} in tournament{" "}
          <Address
            showProfile={false}
            Tournament
            id={notification["tournament_id"]}
          />
        </>
      );
      break;
    case NotificationType.TOURNAMENT_ROUND_COMPLETED:
      title = "Tournament Round Completed";
      description = (
        <>
          Round {notification["tournament_id"]} has completed in tournament{" "}
          <Address
            showProfile={false}
            Tournament
            id={notification["tournament_id"]}
          />
        </>
      );
      break;
    case NotificationType.BOT_GAME_CREATED:
      title = "Bot Game Created";
      description = (
        <>
          Bot <Address showProfile={false} value={notification["player_id1"]} />{" "}
          is playing against bot{" "}
          <Address showProfile={false} value={notification["player_id2"]} /> in
          game <AddressGame id={notification["game_id"]} />{" "}
          for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["wager"]}
            isL2={true}
          />
        </>
      );
      break;
    case NotificationType.BOT_GAME_COMPLETED:
      title = "Bot Game Completed";
      description = (
        <>
          Bot game{" "}
          <AddressGame id={notification["game_id"]} /> has
          completed with{" "}
          <Address showProfile={false} value={notification["player_id1"]} />{" "}
          scoring {notification["score1"]} and{" "}
          <Address showProfile={false} value={notification["player_id2"]} />{" "}
          scoring {notification["score2"]}
          <Address showProfile={false} value={notification["winningId"]} /> has
          won{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["pot"]}
            isL2={true}
          />{" "}
          and a pot of{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["pot"]}
            isL2={true}
          />{" "}
          has been rewarded to {notification["winningIdBettorCount"]} bettors on{" "}
          <Address showProfile={false} value={notification["winningId"]} />
        </>
      );
      break;
    case NotificationType.BOT_OFFER_CREATED:
      title = "Bot Offer Received";
      description = (
        <>
          Player <Address showProfile={false} value={notification["sender"]} />{" "}
          has offered to purchase your bot{" "}
          <Address showProfile={false} value={notification["botId"]} /> for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["price"]}
            isL2={true}
          />
        </>
      );
      break;
    case NotificationType.BOT_OFFER_ACCEPTED:
      title = "Bot Offer Accepted";
      description = (
        <>
          Player <Address showProfile={false} value={notification["owner"]} />{" "}
          has accepted your offer to purchase bot{" "}
          <Address showProfile={false} value={notification["botId"]} />
          for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["price"]}
            isL2={true}
          />
          Bot <Address showProfile={false} value={notification["botId"]} /> has
          been transferred to{" "}
          <Address showProfile={false} value={notification["sender"]} />
        </>
      );
      break;
    case NotificationType.BOT_OFFER_DECLINED:
      title = "Bot Offer Declined";
      description = (
        <>
          Player <Address showProfile={false} value={notification["owner"]} />{" "}
          has declined your offer to purchase bot{" "}
          <Address showProfile={false} value={notification["botId"]} />
          for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["price"]}
            isL2={true}
          />
        </>
      );
      break;
    case NotificationType.BOT_CREATED:
      title = "Bot Created";
      description = (
        <>
          You created bot{" "}
          <Address showProfile={false} value={notification["bot_id"]} />
        </>
      );
      break;
    case NotificationType.ACTION:
      title = "Action";
      description = <ActionItem actionId={notification["actionId"]} />;
      break;
  }

  return type == NotificationType.ACTION ? (
    <ActionItem actionId={notification["actionId"]} />
  ) : (
    <div
      role="alert"
      className={shouldShowExit ? "p-4" : "border-bottom border-gray-100 p-4"}
    >
      <div className="flex items-start gap-4">
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

        <div className="flex-1">
          <strong className="block font-medium text-gray-900"> {title}</strong>

          <p className="mt-1 text-sm text-gray-700">{description}</p>
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
    </div>
  );
};

const ToastTitle = styled(Toast.Title, {
  gridArea: "title",
  marginBottom: 5,
  fontWeight: 500,
  color: slate.slate12,
  fontSize: 15,
  display: "flex",
});

const ToastDescription = styled(Toast.Description, {
  gridArea: "description",
  margin: 0,
  color: slate.slate11,
  fontSize: 13,
  lineHeight: 1.3,
});
