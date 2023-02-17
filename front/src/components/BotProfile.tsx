import * as React from "react";
import { Text, Divider, Card, Col, Row, Button } from "@nextui-org/react";
import { useMatch, useParams } from "react-router-dom";
import BotListView from "./BotList";
import { useAppSelector } from "../state/hooks";
import GameList from "./GameList";
import ModalManageBot from "./ModalManageBot";
import Address from "./Address";
export default () => {
    let { botId } = useParams()
    const [manageBotModalVisible, setManageBotModalVisible] = React.useState(false)
    const [selectedBot, setSelectedBot] = React.useState()
    const allBots = useAppSelector(state => state.game.bots)
    const allGames = useAppSelector(state => state.game.games)
    const allElos = useAppSelector(state => state.game.elo)
    const bot = React.useMemo(()=> allBots[botId], [allBots])
    const elo = React.useMemo(()=> allElos[botId], [allElos])
    const botGames = React.useMemo(()=> 
        Object.values(allGames)
            .filter((val: any) => val.players.includes(botId.toLowerCase())),
            [allGames])

    console.log(botGames)

    const handleManage = (botId) => {
        setSelectedBot(botId)
        setManageBotModalVisible(true)
    }
    const handleCloseManageModal = () => {setManageBotModalVisible(false)}

    return (
        <div className="body">
            <ModalManageBot
                visible={manageBotModalVisible}
                botId = {selectedBot}
                closeHandler = {handleCloseManageModal}
            />
            <Col>
                <Text h2>Bot <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{botId}</Text></Text>
                <Row justify="center">
                    <Card css={{ margin:"20px",  width: "1000px"}}>
                        <Card.Header>
                            <Text h5>Games played</Text>
                        </Card.Header>
                        <Divider/>
                        <Card.Body>
                            <GameList games={botGames}/>
                        </Card.Body>
                    </Card>
                    <Card css={{ margin:"20px",  width: "500px"}}>
                        <Card.Header>
                            <Text h5>Stats</Text>
                        </Card.Header>
                        <Divider/>
                        <Card.Body>
                            <Col>
                                <div>
                                    <Text>Elo: <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{elo ?? "Unranked"}</Text></Text>
                                </div>
                                <div>
                                    <Text>Owner:</Text>
                                    <Address value={bot.owner}/>
                                </div>
                                <div>
                                    <Text>Auto battle enabled:</Text>
                                    <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{bot.autoBattleEnabled ?? "not defined yet"}</Text>
                                </div>

                                <div>
                                    <Text>Auto battle wager amount:</Text>
                                    <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{bot.autoMaxWagerAmount ?? "not defined yet"}</Text>
                                </div>
                                <div>
                                    <Text>Auto battle token address:</Text>
                                    <Text css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}weight="bold" >{bot.autoWagerTokenAddress ?? "not defined yet"}</Text>
                                </div>
                                <div>
                                    <Button onClick={()=>handleManage(botId)}>manage</Button>
                                </div>
                            </Col>
                            
                        </Card.Body>
                    </Card>
                </Row>
            </Col>
        </div>
    );
}