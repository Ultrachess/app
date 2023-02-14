import * as React from "react";
import { Grid, Card, Divider, Row } from "@nextui-org/react";
import UserItem from "./UserItem";
import { useGame } from "../state/game/hooks";
import { Game } from "../state/game/types";
import { useTime } from "./ActionView";
import { useWeb3React } from "@web3-react/core";
import Address from "./Address";
import ModalPlaceBet from "./ModalPlaceBet";
import Button from "./Button";
import { Text } from "./Text";
import AddressGame from "./AddressGame";
import { DotIcon } from '@radix-ui/react-icons';
import Flex from "./ui/Flex";
import DateDisplay from "./Date";
import AssetDisplay from "./AssetDisplay";



export default ({game}: {game:Game}) => {
    const current = useTime(1000)
    const { account } = useWeb3React()

    const id = game.id
    const p1 = game.players[0] ?? undefined
    const p2 = game.players[1] ?? undefined
    const score1 = game.scores[0] ?? undefined
    const score2 = game.scores[1] ?? undefined
    const wager = game.wagerAmount
    const token = game.token
    const time = game.timestamp

    const bettingIsClosed = React.useMemo(()=>time + game.bettingDuration > current,[current, time]) 
    const completed = game.isEnd
    const joinable = game?.players?.length < 2 && !game.isEnd && !game.players.includes(account)
    const draw = score1 === score2

    return (
        <Flex css={{gap: 5}}>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>id</Text>
                <AddressGame id={id} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>created at</Text>
                <DateDisplay current={time} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>player 1</Text>
                <Flex css={{gap: 1}}>
                    <Address value={p1} hoverable={true} />
                    <Text faded>{score1 ?? ""}</Text>
                    {completed ? <Text green>{score1 > score2 && <>+<AssetDisplay balance={wager} tokenAddress={token} isL2={true}/></>}</Text> : <></>}
                </Flex>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>player 2</Text>
                <Flex css={{gap: 1}}>
                    {p2 ? <Address value={p2} hoverable={true} /> : <Text faded>waiting for player</Text>}
                    <Text faded>{score2 ?? ""}</Text>
                    {completed ? <Text green>{score2 > score1 && <>+<AssetDisplay balance={wager} tokenAddress={token} isL2={true}/></>}</Text> : <></>}
            
                </Flex>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>wager</Text>
                <div>
                    <AssetDisplay balance={wager} tokenAddress={token} isL2={true}/>
                </div>
                
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text faded>status</Text>
                <Flex css={{gap: 1}}>
                    <Text green>{completed ? "completed" : bettingIsClosed ? "playing" : "betting phase"}</Text>
                    <DotIcon color={completed ? "blue" : bettingIsClosed ? "green" : "red"} />
                </Flex>
            </Flex>
            <ModalPlaceBet triggerElement={<Button disabled={bettingIsClosed}>Bet <Text faded>{bettingIsClosed? "closed" : "closes"} at {time + game.bettingDuration}</Text></Button>} gameId={id}/>
        </Flex>
    );
}

{/* <Table.Row key={item.id}>
<Table.Cell><Link to={"game/" + item.id}>{item.id}</Link></Table.Cell>
<Table.Cell>{item.players}</Table.Cell>
<Table.Cell>blitz</Table.Cell>
<Table.Cell>
    <Chessboard 
        id={item.id}
        position={item.fen}
        boardWidth={150}
    />
</Table.Cell>
</Table.Row> */}
