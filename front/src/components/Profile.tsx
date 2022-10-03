import * as React from "react";
import { Text, Divider, Card, Col, Row } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import BotListView from "./BotListView";
import { useSelector } from "react-redux";
import { useAppSelector } from "../state/hooks";
export default () => {
    let { userId } = useParams()
    const allBots = useAppSelector(state => state.game.bots)
    const userBots = React.useMemo(()=> 
        Object.values(allBots)
            .filter(val => val.owner == userId),
            [allBots])
    return (
        <Col>
            <Text>Profile {userId}</Text>
            <Row>
                <Card>
                    <Card.Header>
                        Bots
                    </Card.Header>
                    <Divider/>
                    <Card.Body>
                        <BotListView bots={userBots}/>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>
                        Games played
                    </Card.Header>
                    <Divider/>
                    <Card.Body>
                        
                    </Card.Body>
                </Card>
            </Row>
        </Col>
    );
}