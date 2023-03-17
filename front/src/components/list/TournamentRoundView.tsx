/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { TournamentMatch } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import TournamentMatchListItem from "./TournamentMatchListItem";

export default ({ matches }: { matches: TournamentMatch[] }) => {
  const matchItems =
    matches.length > 0
      ? matches.map((match) => <TournamentMatchListItem match={match} />)
      : [<Text key={0}>No matches established</Text>];

  return <List items={matchItems} />;
};
