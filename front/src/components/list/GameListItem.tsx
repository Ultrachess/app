import * as React from "react";
import { Game } from "../../state/game/types";
import { useTime } from "../ActionView";
import { useWeb3React } from "@web3-react/core";
import Address from "../Address";
import ModalPlaceBet from "../ModalPlaceBet";
import Button from "../ui/Button";
import { Text } from "../ui/Text";
import AddressGame from "../AddressGame";
import { DotIcon, LockClosedIcon } from '@radix-ui/react-icons';
import Flex from "../ui/Flex";
import DateDisplay from "../ui/Date";
import AssetDisplay from "../AssetDisplay";



export default ({game}: {game:Game}) => {
    const current = useTime(1000)
    const { account } = useWeb3React()

    if (game === undefined ){
        return <></>
    }

    const id = game.id
    const p1 = game.players[0] ?? undefined
    const p2 = game.players[1] ?? undefined
    const score1 = game.scores[p1] ?? undefined
    const score2 = game.scores[p2] ?? undefined
    const wager = game.wagerAmount / 10 ** 18
    const token = game.token
    const time = game.timestamp
    const bettingOpenTime = game?.wagering?.openTime ?? -1
    const bettingClosesAt = bettingOpenTime + game?.bettingDuration
    const isWaitingForAPlayer = p2 === undefined || p1===undefined
    const isInGame = (p1?.toLowerCase() ?? "") === account.toLowerCase() || (p2?.toLowerCase() ?? "") === account.toLowerCase()
    
    const bettingHasStarted = bettingOpenTime > 0
    const bettingHasStartedBeforeCurrent = bettingOpenTime < current
    const bettingIsOpen = bettingHasStarted && bettingHasStartedBeforeCurrent && bettingClosesAt > (current/1000)
    const bettingIsClosed = !bettingIsOpen
    const canBet = bettingIsOpen && !isWaitingForAPlayer
    console.log("abc is betting closed: ", bettingIsClosed)

    const completed = game.isEnd
    const joinable = game?.players?.length < 2 && !game.isEnd && !game.players.includes(account)
    const draw = score1 === score2

    return (
        <Flex css={{gap: 50}}>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text bold>id</Text>
                <AddressGame id={id} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text bold>created at</Text>
                <DateDisplay current={time*1000} />
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text bold>player 1</Text>
                <Flex css={{gap: 1}}>
                    <Address value={p1} hoverable={true} />
                    <Text faded>{score1 ?? ""}</Text>
                    {completed ? <Text green>{score1 > score2 && <>+<AssetDisplay balance={wager} tokenAddress={token} isL2={true}/></>}</Text> : <></>}
                </Flex>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text bold>player 2</Text>
                <Flex css={{gap: 1}}>
                    {p2 ? <Address value={p2} hoverable={true} /> : <Text faded>waiting for player</Text>}
                    <Text faded>{score2 ?? ""}</Text>
                    {completed ? <Text green>{score2 > score1 && <>+<AssetDisplay balance={wager} tokenAddress={token} isL2={true}/></>}</Text> : <></>}
            
                </Flex>
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text bold>wager</Text>
                <div>
                    <AssetDisplay balance={wager} tokenAddress={token} isL2={true}/>
                </div>
                
            </Flex>
            <Flex css={{ flexDirection: 'column', gap: 2 }}>
                <Text bold>status</Text>
                <Flex css={{gap: 1}}>
                    <Text green>{completed ? "completed" : bettingIsClosed ? isWaitingForAPlayer ? "waiting on player" : "playing" : "betting phase. Closes in"+((bettingClosesAt-(current/1000))).toFixed(0)+"secs"}</Text>
                    <DotIcon color={completed ? "blue" : bettingIsClosed ? "green" : "red"} />
                </Flex>
            </Flex>
            <ModalPlaceBet triggerElement={<Button disabled={!canBet}>Bet&nbsp;&nbsp; {!canBet && <LockClosedIcon/>}</Button>} gameId={id}/>
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
