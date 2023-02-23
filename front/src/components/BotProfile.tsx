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
import { BotProfile } from "../state/game/types";
import List from "./ui/List";
import { useWeb3React } from "@web3-react/core";
import Flex from "./ui/Flex";
import {Text} from "./ui/Text";
import Date from "./ui/Date";
import OffersList from "./OffersList";
import ChallengesList from "./list/ChallengesList";
import { USDC_ADDRESS_ON_NETWORKS } from "../ether/chains";
import ModalCreateChallenge from "./ModalCreateChallenge";
import ModalCreateOffer from "./ModalCreateOffer";

export default () => {
    let { botId } = useParams()
    let { chainId } = useWeb3React()
    const { account } = useWeb3React()
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
    }: any = useProfile(botId)

    const activeGames = games ? games.filter((game) => game.isEnd === false) : []
    const pastGames = games ? games.filter((game) => game.isEnd === true) : []

    //get highest offer price
    let highestOffer = 0
    if ( offers && offers.length > 0) {
        highestOffer = offers?.reduce((prev, current) => (prev.price > current.price) ? prev : current)
    }
    const token = USDC_ADDRESS_ON_NETWORKS[chainId]
    const isOwner = account.toLowerCase() === owner.toLowerCase()
    return (
        <div className="body">
            <Flex css={{  gap: 50, justifyContent: 'center' }}>
                <Flex css={{
                     gap: 5, flexDirection:'column' }}>
                    <Address value={id} isImageBig={true} />
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>name</Text>
                        <Text>{name}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>owner</Text>
                        {isOwner ? <Text bold>Yours</Text> : <Address value={owner} />}
                    </Flex>
                    <Flex css={{ gap: 2,  flexDirection:'column'}}>
                        <Text faded>elo</Text>
                        <Text>{elo}</Text>
                    </Flex>
                    <Flex css={{ gap: 2 , flexDirection:'column'}}>
                        <Text faded>From</Text>
                        <Text>🇦🇱</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>Current Price</Text>
                        {highestOffer === undefined ? <Text>0</Text> : <AssetDisplay balance={highestOffer} tokenAddress={token} isL2={true}/>}
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>created at</Text>
                        <Date current={timestamp} />
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>total games played</Text>
                        <Text>{games.length}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>total challenges recieved</Text>
                        <Text>{challenges.length}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>total offers recieved</Text>
                        <Text>{offers.length}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>auto battle enabled</Text>
                        <Text>{autoBattleEnabled ? 'yes' : 'no'}</Text>
                    </Flex>
                    <Flex css={{ gap: 2, flexDirection:'column' }}>
                        <Text faded>auto max wager amount</Text>
                        <AssetDisplay balance={autoMaxWagerAmount} tokenAddress={autoWagerTokenAddress} isL2={true}/>
                    </Flex>
                    <Flex css={{ gap: 1, flexDirection:'row' }}>
                        {isOwner && <ModalManageBot botId={botId} triggerElement={<Button>Manage</Button>} />}
                        {!isOwner && <ModalCreateChallenge playerId={botId} triggerElement={<Button>Challenge</Button>} />}
                        {!isOwner && <ModalCreateOffer botId={botId} triggerElement={<Button>Offer</Button>} />}
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
                        <Text faded>challenges</Text>
                        <ChallengesList account={account} challenges={challenges} />
                    </Flex>
                    <Flex css={{ gap: 1, flexDirection:'column' }}>
                        <Text faded>offers</Text>
                        <OffersList account={account} offers={offers} />
                    </Flex>
                    
                </Flex>
            </Flex>
        </div>
    );
}