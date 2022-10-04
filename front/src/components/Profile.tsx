import * as React from "react";
import { Text, Divider, Card, Col, Row } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import BotListView from "./BotListView";
import { useSelector } from "react-redux";
import { useAppSelector } from "../state/hooks";
import GameList from "./GameList";
export default () => {
    let { userId } = useParams()
    const allBots = useAppSelector(state => state.game.bots)
    const allGames = useAppSelector(state => state.game.games)
    const userBots = React.useMemo(()=> 
        Object.values(allBots)
            .filter(val => val.owner == userId),
            [allBots])
    const userGames = React.useMemo(()=> 
        Object.values(allGames)
            .filter(val => val.players.includes(userId.toLowerCase())),
            [allBots])

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
                        Games played
                    </Card.Header>
                    <Divider/>
                    <Card.Body>
                        <GameList games={userGames}/>
                    </Card.Body>
                </Card>
            </Row>
        </Col>
        </div>
    );
}