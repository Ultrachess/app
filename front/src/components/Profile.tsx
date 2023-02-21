import * as React from "react";
import {Divider, Card, Col, Row, Button } from "@nextui-org/react";
import { useMatch, useParams } from "react-router-dom";
import BotListView from "./list/BotList";
import { useAppSelector } from "../state/hooks";
import GameList from "./list/GameList";
import ModalManageBot from "./ModalManageBot";
import Address from "./Address";
import AssetDisplay from "./AssetDisplay";
import { useProfile } from "../state/game/hooks";
import { UserProfile } from "../state/game/types";
import List from "./ui/List";
import { useWeb3React } from "@web3-react/core";
import Flex from "./ui/Flex";
import {Text} from "./ui/Text";
import Date from "./ui/Date";
import OffersList from "./OffersList";
import ChallengesList from "./list/ChallengesList";
import { USDC_ADDRESS_ON_NETWORKS } from "../ether/chains";


export default () => {
    let { userId } = useParams()
    console.log(userId)
    const { account, chainId } = useWeb3React()
    const {
        id,
        name,
        avatar,
        elo,
        games,
        nationality,
        challenges,
        bots,
        balances,
    }: UserProfile = useProfile(userId)

    const activeGames = games ? games.filter((game) => game.isEnd === false): []
    const pastGames = games ? games.filter((game) => game.isEnd === true) : []

    const isYou = account === id || account === name
    
    const balance = balances.length > 0 ? balances[0].amount : 0
    const tokenAddress = balances.length > 0 ? balances[0].token : USDC_ADDRESS_ON_NETWORKS[chainId] 
    return (
        <div className="body">
            <Flex css={{ gap: 50, justifyContent: 'center' }}>
                <Flex css={{ gap: 5, flexDirection:'column' }}>
                    <Address value={id} isImageBig={true} />
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        {isYou && <Text bold>Your profile</Text>}
                    </Flex>
                    <Flex css={{ gap: 2,  flexDirection:'column'}}>
                        <Text faded>Elo</Text>
                        <Text>{elo}</Text>
                    </Flex>
                    <Flex css={{ gap: 2 , flexDirection:'column'}}>
                        <Text faded>From</Text>
                        <Text>🇦🇱</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>Balance</Text>
                        <AssetDisplay balance={balance} tokenAddress={tokenAddress} />
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>Total bots owned </Text>
                        <Text>{bots.length}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>Total games played</Text>
                        <Text>{games.length}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>Current amount of open challenges</Text>
                        <Text>{challenges.length}</Text>
                    </Flex>

                </Flex>
                <Flex css={{ gap: 5, flexDirection:'column' }}>
                    <Flex css={{ gap: 1, flexDirection:'column' }}>
                        <Text faded>active games</Text>
                        <GameList games={activeGames} />
                    </Flex>
                    <Flex css={{ gap: 1, flexDirection:'column' }}>
                        <Text faded>past games</Text>
                        <GameList games={pastGames} />
                    </Flex>
                    <Flex css={{ gap: 1, flexDirection:'column' }}>
                        <Text faded>Open Challenges</Text>
                        <ChallengesList account={account} challenges={challenges} />
                    </Flex>
                    <Flex css={{ gap: 1, flexDirection:'column' }}>
                        <Text faded>Owned bots</Text>
                        <BotListView bots={bots} />
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
}