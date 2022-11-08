import * as React from "react";
import { Text, Divider, Card, Col, Row } from "@nextui-org/react";
import { useMatch, useParams } from "react-router-dom";
import BotListView from "./BotListView";
import { useSelector } from "react-redux";
import { useAppSelector } from "../state/hooks";
import GameList from "./GameList";
export default () => {
    let { userId } = useParams()
    const allBots = useAppSelector(state => state.game.bots)
    const allGames = useAppSelector(state => state.game.games)
    const allElos = useAppSelector(state => state.game.elo)
    const elo = React.useMemo(()=> allElos[userId], [allElos])
    const userBots = React.useMemo(()=> 
        Object.values(allBots)
            .filter((val:any) => val.owner == userId),
            [allBots])
    const userGames = React.useMemo(()=> 
        Object.values(allGames)
            .filter((val:any)  => val.players.includes(userId.toLowerCase())),
            [allGames])

    console.log("user games")
    console.log(userGames)

    return (
        <div className="body">
        <Col>
            <Text h2>User <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{userId}</Text></Text>
            <Row justify="center">
                <Card css={{ margin:"20px", width: "500px"}}>
                    <Card.Header>
                        Bots
                    </Card.Header>
                    <Divider/>
                    <Card.Body>
                        <BotListView bots={userBots}/>
                    </Card.Body>
                </Card>
                <Card css={{ margin:"20px",  width: "500px"}}>
                    <Card.Header>
                        Stats
                    </Card.Header>
                    <Divider/>
                    <Card.Body>
                        <Col>
                            <div>
                                <Text>Elo <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{elo ?? "Unranked"}</Text></Text>
                            </div>
                            <div>
                                <Text>Games played</Text>
                                <GameList games={userGames.length}/>
                            </div>
                        </Col>
                        
                    </Card.Body>
                </Card>
            </Row>
        </Col>
        </div>
    );
}