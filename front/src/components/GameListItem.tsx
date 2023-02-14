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



export default (game: Game) => {
    const current = useTime(1000)
    const { account } = useWeb3React()

    const id = game.id
    const p1 = game.players[0] ?? "Anonymous"
    const p2 = game.players[1] ?? "Anonymous"
    const score1 = game.scores[0] ?? undefined
    const score2 = game.scores[1] ?? undefined
    const wager = game.wagerAmount
    const token = game.token
    const time = game.timestamp

    const bettingIsClosed = React.useMemo(()=>time + game.bettingDuration > current,[current, time]) 
    const completed = game.isEnd
    const joinable = game?.players?.length < 2 && !game.isEnd && !game.players.includes(account)

    return (
        <div>
            <AddressGame id={id} />
            <ModalPlaceBet triggerElement={<Button disabled={bettingIsClosed || !joinable}>Join</Button>} gameId={id}/>
        </div>
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
