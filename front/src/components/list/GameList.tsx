/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { DotIcon } from "@radix-ui/react-icons";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";

import { Game } from "../../state/game/types";
import { useTime } from "../ActionView";
import Address from "../Address";
import AddressGame from "../AddressGame";
import AssetDisplay from "../AssetDisplay";
import Badge from "../ui/Badge";
import DateDisplay from "../ui/Date";
import List from "../ui/List";
import Table from "../ui/Table";
import { Text } from "../ui/Text";
import GameListItem from "./GameListItem";

const columns = [
  "Id",
  "Status",
  "Players",
  "",
  "Wager Amount",
  "Betting",
  "Created",
  "",
];

export default ({ games }: { games: Game[] }) => {
  const current = useTime(1000);
  const { account } = useWeb3React();
  // const gameItems =
  //   games.length > 0
  //     ? games.map((game) => <GameListItem game={game} />)
  //     : [<Text key={0}>No games found</Text>];
  //turn list of games into array of arrays of strings
  const gameItems = games.map((game) => {
    const id = game.id;
    const p1 = game.players[0] ?? undefined;
    const p2 = game.players[1] ?? undefined;
    const eloDiffP1 = game.eloChange[p1] ?? undefined;
    const eloDiffP2 = game.eloChange[p2] ?? undefined;
    const score1 = game.scores[p1] ?? undefined;
    const score2 = game.scores[p2] ?? undefined;
    const wager = game.wagerAmount / 10 ** 18;
    const token = game.token;
    const time = game.timestamp;
    const bettingOpenTime = game?.wagering?.openTime ?? -1;
    const bettingClosesAt = bettingOpenTime + game?.bettingDuration;
    const isWaitingForAPlayer = p2 === undefined || p1 === undefined;
    const isInGame =
      (p1?.toLowerCase() ?? "") === account?.toLowerCase() ||
      (p2?.toLowerCase() ?? "") === account?.toLowerCase();

    const bettingHasStarted = bettingOpenTime > 0;
    const bettingHasStartedBeforeCurrent = bettingOpenTime < current;
    const bettingIsOpen =
      bettingHasStarted &&
      bettingHasStartedBeforeCurrent &&
      bettingClosesAt > current / 1000;
    const bettingIsClosed = !bettingIsOpen;
    const canBet = bettingIsOpen && !isWaitingForAPlayer;

    const completed = game.isEnd;
    const joinable =
      game?.players?.length < 2 &&
      !game.isEnd &&
      !game.players.includes(account);
    const draw = score1 === score2;
    return [
      <AddressGame id={id} />,
      <>
        {completed
          ? draw
            ? "draw"
            : score1 > score2
            ? "p1 wins"
            : "p2 wins"
          : bettingIsClosed
          ? isWaitingForAPlayer
            ? "waiting on player"
            : "playing"
          : "betting phase. Closes in" + (current - bettingClosesAt)}
      </>,
      <>
        <Address hoverable={true} value={game.players[0]} />{" "}
        {eloDiffP1 && 
          <Badge
            color={eloDiffP1 > 0 ? "green" : eloDiffP1 < 0 ? "red" : "gray"}
            value={eloDiffP1 > 0 ? `+${eloDiffP1}` : eloDiffP1 < 0 ? `- ${eloDiffP1}` : "0"}
          />
        }
        <Badge
          color={score1 > score2 ? "green" : score1 < score2 ? "red" : "gray"}
          value={<AssetDisplay balance={wager} tokenAddress={token} />}
        />
      </>,
      p2 ? (
        <>
          <Address hoverable={true} value={p2} />{" "}
          {eloDiffP2 && 
            <Badge
              color={eloDiffP2 > 0 ? "green" : eloDiffP2 < 0 ? "red" : "gray"}
              value={eloDiffP2 > 0 ? `+${eloDiffP2}` : eloDiffP2 < 0 ? `- ${eloDiffP2}` : "0"}
            />
          }
          <Badge
            color={score2 > score1 ? "green" : score2 < score1 ? "red" : "gray"}
            value={<AssetDisplay balance={wager} tokenAddress={token} />}
          />
        </>
      ) : isInGame ? (
        "Waiting for opponent"
      ) : (
        <Link to={`/game/${id}`}>Join</Link>
      ),
      <AssetDisplay balance={wager} tokenAddress={token} />,
      <span>{canBet ? "Bet" : "Betting Closed"}</span>,
      <DateDisplay current={time * 1000} />,
    ];
  });

  return <Table columns={columns} rows={gameItems} />;
};
