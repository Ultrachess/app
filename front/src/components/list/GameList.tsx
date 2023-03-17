/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Game } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import GameListItem from "./GameListItem";

export default ({ games }: { games: Game[] }) => {
  const gameItems =
    games.length > 0
      ? games.map((game) => <GameListItem game={game} />)
      : [<Text key={0}>No games found</Text>];
  return <List items={gameItems} />;
};
