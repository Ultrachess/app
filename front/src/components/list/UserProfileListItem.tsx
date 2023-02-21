//React component that takes in BotProfile and renders it with multiple Flex components

import Flex from "../ui/Flex";
import DateDisplay from "../ui/Date";
import AssetDisplay from "../AssetDisplay";
import { useWeb3React } from "@web3-react/core";
import Address from "../Address";
import { Text } from "../ui/Text";
import { DotIcon } from '@radix-ui/react-icons';
import { Profile, ProfileType, UserProfile } from "../../state/game/types";
import { USDC_ADDRESS_ON_NETWORKS } from "../../ether/chains";


//function that converts country string to flag emoji
//return flag emoji
const getFlag = (country: string) => {
    const code = country.toUpperCase();
    const emoji = code
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    return emoji;
}

export default ({profile, rank = 0}: {profile: UserProfile, rank: number}) => {
    const { chainId } = useWeb3React()
    const type = profile.type
    const { 
        id,
        name,
        avatar,
        elo,
        games,
        nationality,
        challenges,
        balances,
        bots,
    } = profile

    const balance = balances.length > 0 ? balances[0].amount : 0
    const tokenAddress = balances.length > 0 ? balances[0].token : USDC_ADDRESS_ON_NETWORKS[chainId] 


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
                <Text faded>Amount of bots</Text>
                <Text>{bots.length}</Text>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>Balance</Text>
                <AssetDisplay balance={balance} tokenAddress={tokenAddress} />
            </Flex>

        </Flex>
    )

}

    


