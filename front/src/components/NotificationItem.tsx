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

export default ({ notification }: { notification: Notification }) => {
  const { id, timestamp, type } = notification;
  const { account } = useWeb3React();

  let title = "";
  let description = <Text></Text>;

  //console.log("abc notification in item: ", notification.type)
  const newType = notification.type;
  switch (newType) {
    case NotificationType.GAME_CREATED:
      //console.log("abc game created", notification["creator_id"])
      title = "Game Created";
      description = (
        <Text>
          Player <Address value={notification["creator_id"]} /> has created a
          game <AddressGame id={notification["game_id"]} />
        </Text>
      );
      break;
    case NotificationType.GAME_JOINED:
      title = `Someone joined your game`;
      description = (
        <Text>
          Player <Address value={notification["player_id"]} /> has joined your
          game <AddressGame id={notification["game_id"]} />
        </Text>
      );
      break;
    case NotificationType.GAME_MOVE:
      title = "Someone made a move";
      description = (
        <Text>
          <Address value={notification["player_id"]} /> has made a move in your
          game <AddressGame id={notification["game_id"]} />
        </Text>
      );
      break;
    case NotificationType.GAME_COMPLETED:
      title = "Game Completed";
      description = (
        <Text>
          Game <AddressGame id={notification["game_id"]} /> has completed with{" "}
          <Address value={notification["player_id1"]} /> scoring{" "}
          {notification["score1"]} and{" "}
          <Address value={notification["player_id2"]} /> scoring{" "}
          {notification["score2"]}
          <Address value={notification["winningId"]} /> has won{" "}
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
          <Address value={notification["winningId"]} />
        </Text>
      );
      break;
    case NotificationType.GAME_WAGER:
      title = "Game Wager";
      const wager = notification["wager"];
      const token = notification["token"];
      description = (
        <Text>
          <Address value={notification["player_id"]} hoverable={true} /> has
          wagered{" "}
          <AssetDisplay tokenAddress={token} balance={wager} isL2={true} /> in
          game <AddressGame id={notification["game_id"]} />
        </Text>
      );
      break;
    case NotificationType.GAME_BETTING_CLOSED:
      title = "Game Betting Closed";
      description = (
        <Text>
          Betting has closed in game{" "}
          <AddressGame id={notification["game_id"]} />
        </Text>
      );
      break;
    case NotificationType.CHALLENGE_ACCEPTED:
      title = "Challenge accepted";
      description = (
        <Text>
          Player <Address value={notification["recipient"]} hoverable={true} />{" "}
          has accepted your challenge. Join the game{" "}
          <AddressGame id={notification["game_id"]} />
        </Text>
      );
      break;
    case NotificationType.CHALLENGE_DECLINED:
      title = "Challenge declined";
      description = (
        <Text>
          Player <Address value={notification["recipient"]} /> has declined your
          challenge id#{notification["challengeId"]}. Too bad bro!
        </Text>
      );
      break;
    case NotificationType.CHALLENGE_CREATED:
      title = "Challenge Recieved";
      description = (
        <Text>
          Player <Address value={notification["challenger"]} /> has challenged
          you to a game wagering{" "}
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
        </Text>
      );
      break;
    case NotificationType.TOURNAMENT_JOINED:
      title = "Tournament Joined";
      description = (
        <Text>
          Player <Address value={notification["player_id"]} /> has joined
          tournament <AddressTournament id={notification["tournament_id"]} />
        </Text>
      );
      break;
    case NotificationType.TOURNAMENT_COMPLETED:
      title = "Tournament Completed";
      description = (
        <Text>
          Tournament <AddressTournament id={notification["tournament_id"]} />{" "}
          has completed
        </Text>
      );
      break;
    case NotificationType.TOURNAMENT_MATCH_CREATED:
      title = "Tournament Match Created";
      description = (
        <Text>
          A match has been created in tournament{" "}
          <AddressTournament id={notification["tournament_id"]} /> between{" "}
          <Address value={notification["player_id1"]} /> and{" "}
          <Address value={notification["player_id2"]} />
        </Text>
      );
      break;
    case NotificationType.TOURNAMENT_MATCH_COMPLETED:
      title = "Tournament Match Completed";
      description = (
        <Text>
          Player <Address value={notification["player_id1"]} /> has scored{" "}
          {notification["score1"]} and player{" "}
          <Address value={notification["player_id2"]} /> has scored{" "}
          {notification["score2"]} in tournament{" "}
          <AddressTournament id={notification["tournament_id"]} />
        </Text>
      );
      break;
    case NotificationType.TOURNAMENT_ROUND_COMPLETED:
      title = "Tournament Round Completed";
      description = (
        <Text>
          Round {notification["tournament_id"]} has completed in tournament{" "}
          <AddressTournament id={notification["tournament_id"]} />
        </Text>
      );
      break;
    case NotificationType.BOT_GAME_CREATED:
      title = "Bot Game Created";
      description = (
        <Text>
          Bot <Address value={notification["player_id1"]} /> is playing against
          bot <Address value={notification["player_id2"]} /> in game{" "}
          <AddressGame id={notification["game_id"]} /> for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["wager"]}
            isL2={true}
          />
        </Text>
      );
      break;
    case NotificationType.BOT_GAME_COMPLETED:
      title = "Bot Game Completed";
      description = (
        <Text>
          Bot game <AddressGame id={notification["game_id"]} /> has completed
          with <Address value={notification["player_id1"]} /> scoring{" "}
          {notification["score1"]} and{" "}
          <Address value={notification["player_id2"]} /> scoring{" "}
          {notification["score2"]}
          <Address value={notification["winningId"]} /> has won{" "}
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
          <Address value={notification["winningId"]} />
        </Text>
      );
      break;
    case NotificationType.BOT_OFFER_CREATED:
      title = "Bot Offer Received";
      description = (
        <Text>
          Player <Address value={notification["sender"]} /> has offered to
          purchase your bot <Address value={notification["botId"]} /> for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["price"]}
            isL2={true}
          />
        </Text>
      );
      break;
    case NotificationType.BOT_OFFER_ACCEPTED:
      title = "Bot Offer Accepted";
      description = (
        <Text>
          Player <Address value={notification["owner"]} /> has accepted your
          offer to purchase bot <Address value={notification["botId"]} />
          for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["price"]}
            isL2={true}
          />
          Bot <Address value={notification["botId"]} /> has been transferred to{" "}
          <Address value={notification["sender"]} />
        </Text>
      );
      break;
    case NotificationType.BOT_OFFER_DECLINED:
      title = "Bot Offer Declined";
      description = (
        <Text>
          Player <Address value={notification["owner"]} /> has declined your
          offer to purchase bot <Address value={notification["botId"]} />
          for{" "}
          <AssetDisplay
            tokenAddress={notification["token"]}
            balance={notification["price"]}
            isL2={true}
          />
        </Text>
      );
      break;
    case NotificationType.BOT_CREATED:
      title = "Bot Created";
      description = (
        <Text>
          You created bot <Address value={notification["bot_id"]} />
        </Text>
      );
      break;
    case NotificationType.ACTION:
      title = "Action";
      description = <ActionItem actionId={notification["actionId"]} />;
      break;
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
      }}
    >
      <ToastTitle>
        <Text>
          id#{id} {title} at
        </Text>
        <DateDisplay current={timestamp} />
      </ToastTitle>
      <ToastDescription asChild>{description}</ToastDescription>
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
