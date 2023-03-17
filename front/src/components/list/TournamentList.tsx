/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

//renders list of tournaments.

// Path: front/src/components/list/TournamentList.tsx

// Compare this snippet from front/src/components/list/TournamentListItem.tsx:

// //This component takes in an array of Tournament objects and renders them within a list

import { Tournament } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import TournamentListItem from "./TournamentListItem";

export default ({ tournaments }: { tournaments: Tournament[] }) => {
  const tournamentItems =
    tournaments.length > 0 ? (
      tournaments.map((tournament) => (
        <TournamentListItem tournament={tournament} />
      ))
    ) : (
      <Text>There are no tournaments</Text>
    );

  return <List items={tournamentItems} />;
};
