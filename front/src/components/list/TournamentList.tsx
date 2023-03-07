//renders list of tournaments.

// Path: front/src/components/list/TournamentList.tsx

// Compare this snippet from front/src/components/list/TournamentListItem.tsx:

// //This component takes in an array of Tournament objects and renders them within a list

import { DotIcon } from "@radix-ui/react-icons";
import { useWeb3React } from "@web3-react/core";

import {
  Tournament,
  TournamentMatch,
  TournamentRound,
  TournamentType,
} from "../../state/game/types";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import DateDisplay from "../ui/Date";
import Flex from "../ui/Flex";
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
