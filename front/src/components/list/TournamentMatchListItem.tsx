import { TournamentMatch } from "../../state/game/types";
import Flex from "../ui/Flex";
import { Text } from "../ui/Text";
import Address from "../Address";
import AddressGame from "../AddressGame";

export default ({match}: {match: TournamentMatch}) => {

    const {
        games,
        matchCount,
        currentMatch,
        left,
        right,
        leftScore,
        rightScore,
    } = match

    const completed = matchCount === currentMatch

    return (
        <Flex css={{gap: 5, justifyContent:'space-between'}}>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Player 1</Text>
                {left ? <Address value={left} hoverable={true} />: <Text faded>Waiting on player</Text>}
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Score 1</Text>
                <Text>{leftScore}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Player 2</Text>
                {right ? <Address value={right} hoverable={true} />: <Text faded>Waiting on player</Text>}
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Score 2</Text>
                <Text>{rightScore}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Games</Text>
                <Flex css = {{ gap: 2}}>
                    {games.map((game) => <AddressGame id={game} />)}
                </Flex>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Status</Text>
                {completed ? <Text green>Completed</Text> : <Text blue>Ongoing</Text>}
            </Flex>
        </Flex>
    )
}