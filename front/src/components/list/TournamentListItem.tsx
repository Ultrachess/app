//This component takes in a Tournament object and renders it with multiple Flex components
//
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
import AddressTournament from "../AddressTournament";

export default ({tournament, rank = 0, row=true}: {tournament: Tournament, rank?: number, row?: boolean}) => {
    const { 
        id,
        type,
        rounds,
        amountOfWinners,
        participantCount,
        participants,
        owner,
        currentRound,
        matches,
        isOver,
        isRoundOver,
    } = tournament

    return (
        <Flex css={{
            gap: 5,
            justifyContent:'space-between',
            flexDirection: row ? "row" : "column"
        }}>
            {rank !== 0 && <Flex css={{gap: 2}}>
                <Text faded>rank</Text>
                <Text>{rank}</Text>
            </Flex>}
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>id</Text>
                <AddressTournament id={id} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>type</Text>
                <Text>{type}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>owner</Text>
                <Address value={owner} hoverable={true} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Round</Text>
                <Text>{currentRound}/{rounds}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>matches</Text>
                <Text>{matches.length}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>participants</Text>
                <Text>{participants ? participants.length : 0}/{participantCount}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Status</Text>
                {isOver ? 
                    <Text blue>Ongoing <DotIcon color="green"/></Text> : 
                    <Text green>Complete <DotIcon color="green"/></Text>
                }
            </Flex>
        </Flex>
    )
}

