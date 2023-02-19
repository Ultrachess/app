//React component that takes in BotProfile and renders it with multiple Flex components

import Flex from "../ui/Flex";
import DateDisplay from "../ui/Date";
import AssetDisplay from "../AssetDisplay";
import Address from "../Address";
import { Text } from "../ui/Text";
import { BotProfile } from "../../state/game/types";

//function that converts country string to flag emoji
//return flag emoji
const getFlag = (country: string) => {
    const code = country.toUpperCase();
    const emoji = code
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    return emoji;
}

export default ({bot, rank = 0}: {bot: BotProfile, rank: number}) => {
    const { 
        id,
        name,
        avatar,
        elo,
        games,
        nationality,
        challenges,
        owner,
        offers,
        autoBattleEnabled,
        autoMaxWagerAmount,
        autoWagerTokenAddress,
        timestamp
    } = bot



    return (
        <Flex css={{gap: 5, justifyContent:'space-between'}}>
            {rank !== 0 && <Flex css={{gap: 2, flexDirection:'column'}}>
                <Text faded>rank</Text>
                <Text>{rank}</Text>
            </Flex>}
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>id</Text>
                <Address value={id} hoverable={true} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>name</Text>
                <Text>{name}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>elo</Text>
                <Text>{elo}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>From</Text>
                <Text>{getFlag(nationality)}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>games played</Text>
                <Text>{games.length}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>challenges</Text>
                <Text>{challenges.length}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>offers</Text>
                <Text>{offers.length}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>owner</Text>
                <Address value={owner} hoverable={true} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>auto battle</Text>
                <Text>{autoBattleEnabled ? "enabled" : "disabled"}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>auto max wager</Text>
                <Text><AssetDisplay balance={autoMaxWagerAmount} tokenAddress={autoWagerTokenAddress} isL2={true}/></Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>created at</Text>
                <DateDisplay current={timestamp} />
            </Flex>

        </Flex>
    )

}

    


