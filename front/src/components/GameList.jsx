import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGames } from "../state/game/gameSlice";
import { Text, Grid, Button, Spacer, Card, Row, Pagination, Divider, Table} from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import { Link, NavLink } from "react-router-dom";
import GameListItem from "./GameListItem";
import { truncateAddress, formatDate, getTokenNameFromAddress } from "../ether/utils";
import { playerIsInGame, getGameById } from "../state/game/gameHelper";
import { ethers } from "ethers";
import Address from "./Address";
import ModalPlaceBet from "./ModalPlaceBet";


export default ({games}) => {
    const accounts = useSelector(state => state.auth.accounts);
    const [selectedGame, setSelectedGame] = React.useState()
    const [bettingModalVisibility, setBettingModalVisible] = React.useState()
    var address = Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : ""
    const dispatch = useDispatch()

    const columns = [
        {
          key: "id",
          label: "ID",
        },
        {
          key: "players",
          label: "PLAYERS",
        },
        {
            key: "wagerAmount",
            label: "WAGER"
        },
        {
          key: "mode",
          label: "MODE",
        },
        {
            key: "created",
            label: "CREATED",
        },
        {
            key:"bet",
            label: "BET"
        },
        {
            key: "join",
            label: "",
        }
    ];

    const rows = Object.values(games).map((game, index) => {
        var p1 = game.players[0] ?? "not joined"
        var p2 = game.players[1] ?? "not joined"
        var players = 
        <Row>
            <Address value={p1}/>
            <Text color="red">vs</Text>
            <Address value={p2}/>
        </Row>
        var date  = new Date(game.timestamp * 1000)
        var wagerAmount = game.wagerAmount.toString()
        return {
            key: index,
            id: game.id,
            pgn: game.pgn,
            players,
            wagerAmount: ethers.utils.formatUnits(ethers.BigNumber.from(wagerAmount)) + " " + getTokenNameFromAddress(game.token),
            mode: game.isBot ? "Bot": "Human",
            bet: game.id,
            created: formatDate(date)
        }
    })

    const joinButton = (gameId) => {
        const isAlreadyInGame = playerIsInGame(games, address, gameId)
        const isGameOver = getGameById(games, gameId)?.isEnd
        
        var buttonText = "join"
        if(isAlreadyInGame) buttonText = "back in game"
        if(isGameOver) buttonText = "view history"
        return <Link to={"game/" + gameId}>{buttonText}</Link>
    }

    const handleOpenBettingModal = (gameId) => {
        setSelectedGame(gameId)
        setBettingModalVisible(true)
    }

    const handleCloseBettingModal = () => { setBettingModalVisible(false)}

    const betButton = (gameId) => {
        const game = getGameById(games, gameId)
        const bettingDuration = game.bettingDuration
        const wagerInfo = game.wagering
        const bettingIsOpen = wagerInfo && wagerInfo.openTime
        return <Button
                    onClick={ () => {if(bettingIsOpen) handleOpenBettingModal(gameId)}}
                >{
                    bettingDuration == 0 ? 
                        "Betting not enabled":
                        bettingIsOpen ?
                            wagerInfo.openTime:
                            "Betting phase pending"
                    }
                </Button>
    }

    return (
        <div className="gameListItem">
            <ModalPlaceBet
                visible={bettingModalVisibility}
                gameId = {selectedGame}
                closeHandler = {handleCloseBettingModal}
            /> 
            <Table
                    aria-label="Example table with dynamic content"
                    css={{
                        height: "auto",
                        minWidth: "100%",
                        overflow: "hidden"
                    }}
                    shadow={false}
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column key={column.key}>{column.label}</Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={rows}>
                    {(item) => (
                        <Table.Row key={item.key}>
                            {(columnKey) => 
                                <Table.Cell>{
                                    columnKey == "join" ? 
                                            joinButton(item.id): 
                                            columnKey == "bet"?
                                                betButton(item.id):
                                        item[columnKey]}
                                </Table.Cell>
                            }
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        
        </div> 
    );
}