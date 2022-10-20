import * as React from "react";
import { Row, Text, Grid, Button, Spacer, Card, Pagination, Divider, Table} from "@nextui-org/react";
import "./Body.css"
import { FaArrowDown, FaCoins, FaPlay } from 'react-icons/fa';
import GameList from "./GameList";
import { createGame } from "../state/game/gameSlice";
import { useDispatch } from "react-redux";
import FileUploader from "./BotUploader";
import ModalCreateGame from "./ModalCreateGame";
import ModalDepositToken from "./ModalDepositToken";
import { useAppSelector } from "../state/hooks";

export default () => {
    var dispatch = useDispatch()
    const games = useAppSelector(state => state.game.games);
    const [mainItems, setMainItems] = React.useState([]);
    const [createModalVisible, setCreateModalVisible] = React.useState(false)
    const [depositModalVisible, setDepositModalVisible] = React.useState(false)

    const handleShowCreateModal = () => {setCreateModalVisible(true)}
    const handleShowDepositModal = () => {setDepositModalVisible(true)}
    const handleCloseCreateModal = () => {setCreateModalVisible(false)}
    const handleCloseDepositModal = () => {setDepositModalVisible(false)}

    return (
        <div className="body">
            <ModalCreateGame 
                visible={createModalVisible} 
                closeHandler={handleCloseCreateModal}
            />
            <ModalDepositToken 
                visible={depositModalVisible} 
                closeHandler={handleCloseDepositModal}
            />
            <div className="header">
                <Row>
                    <Text h2 size={90}>Ultrachess.org</Text>
                    <Text 
                        css={{
                            textGradient: "45deg, $blue600 -20%, $pink600 50%",
                        }}
                        weight="bold" 
                        h5
                    >pre-alpha</Text> 
                </Row>
                <Text>Immutable chess backed by blockchain technology. Play with more than just your elo at stake</Text>
            </div>
            <div className="buttons">
                <Button color="gradient" onClick={handleShowCreateModal} shadow>
                    Create game
                </Button>
                <Spacer x={1}/>
                <Button iconRight={<FaCoins/>} light color="default" onClick={handleShowDepositModal}  shadow>
                    Deposit Token
                </Button>
            </div>
            <div className="content">
            <Card shadow={true} css={{ width:"1300px", height:"700px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                <Card.Header>
                    <Row justify="center">
                        <Text>Recent games</Text>
                    </Row>
                </Card.Header>
                <GameList games={games}/>
                </Card>
            </div>
        </div>    
    );
}