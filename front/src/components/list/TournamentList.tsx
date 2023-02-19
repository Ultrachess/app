//renders list of tournaments.

// Path: front/src/components/list/TournamentList.tsx

// Compare this snippet from front/src/components/list/TournamentListItem.tsx:

// //This component takes in an array of Tournament objects and renders them within a list


import Flex from "../ui/Flex";
import DateDisplay from "../ui/Date";
import AssetDisplay from "../AssetDisplay";
import { useWeb3React } from "@web3-react/core";
import Address from "../Address";
import { Text } from "../ui/Text";
import { DotIcon } from '@radix-ui/react-icons';
import {
    TournamentType,
    Tournament,
    TournamentMatch,
    TournamentRound
} from "../../state/game/types";
import List from "../ui/List";
import TournamentListItem from "./TournamentListItem";

export default ({ tournaments }: { tournaments: Tournament[] }) => {
    const tournamentItems = tournaments.length > 0 ?
        tournaments.map((tournament) => 
            <TournamentListItem tournament={tournament} />):
        <Text>There are no tournaments</Text>

    return <List items={tournamentItems} />

}

