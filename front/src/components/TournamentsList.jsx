import * as React from "react";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGames } from "../state/game/gameSlice";
import { Text, Grid, Button, Spacer, Card, Row, Pagination, Divider, Table, Col} from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import { Link, NavLink } from "react-router-dom";
import GameListItem from "./GameListItem";
import { truncateAddress, formatDate, getTokenNameFromAddress } from "../ether/utils";
import { playerIsInGame, getGameById } from "../state/game/gameHelper";
import { ethers } from "ethers";
import Address from "./Address";
import ModalPlaceBet from "./ModalPlaceBet";
import { useWeb3React } from "@web3-react/core";


export default ({tournaments}) => {
    const [selectedTournament, setSelectedTournament] = useState()
    var { account } = useWeb3React()
    console.log(tournaments)

    const columns = [
        {
          key: "id",
          label: "ID",
        },
        {
            key: "owner",
            label: "OWNER"
        },
        {
          key: "type",
          label: "TYPE",
        },
        {
          key: "participantCount",
          label: "NUM PLAYERS",
        },
        {
            key: "participants",
            label: "PLAYERS",
        },
        {
            key:"rounds",
            label: "NUM ROUNDS"
        },
        {
            key: "amountOfWinners",
            label: "WINNER AMOUNT",
        },
        {
            key: "currentRound",
            label: "CURRENT ROUND",
        },
        {
            key: "view",
            label: "",
        }
    ];

    const rows = Object.values(tournaments?? []).map((tournament, index) => {
        const participants = tournament.participants ?? []
        const { 
            id,
            type, 
            owner,
            participantCount, 
            rounds, 
            amountOfWinners,
            currentRound,
            matches,
            isOver,
            isRoundOver,
        } = tournament
        var participantsFormatted = 
        <Col>
            {participants.map((participant) => {
                <Address value={participant}/>
            })}            
        </Col>
        return {
            key: index,
            id,
            owner,
            type,
            participantCount,
            participants: participantsFormatted,
            rounds,
            amountOfWinners,
            currentRound,
        }
    })

    const viewButton = (tournamentId) => {
        return <Link to={"/tournament/" + tournamentId}>view</Link>
    }

    return (
        <div className="gameListItem">
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
                                    columnKey == "view" ? 
                                            viewButton(item.id): 
                                            columnKey == "bet"?
                                                viewButton(item.id):
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