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
import { useAppSelector } from "../state/hooks";


export default ({users}) => {
    const allElos = useAppSelector(state => state.game.elo)
    const columns = [
        {
          key: "id",
          label: "PLAYER ID",
        },
        {
          key: "gamesPlayed",
          label: "GAMES PLAYED",
        },
        {
            key: "elo",
            label: "ELO"
        }
    ];

    const rows = Object?.values(users).map((user: any, index) => {
        console.log(user)
        var id = <Address value={user}/>
        return {
            key: index,
            id: id,
            gamesPlayed: <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >Not defined</Text>,
            elo: allElos[user]
        }
    })


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
                                <Table.Cell>
                                    {item[columnKey]}
                                </Table.Cell>
                            }
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        
        </div> 
    );
}