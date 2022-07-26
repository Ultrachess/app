import * as React from "react";
import { Text, Grid, Button, Spacer, Card, Pagination, Divider, Table} from "@nextui-org/react";
import "./Body.css"
import { FaArrowDown, FaCoins, FaPlay } from 'react-icons/fa';
import GameList from "./GameList";
import { createGame } from "../store/game/gameSlice";
import { useDispatch } from "react-redux";
import FileUploader from "./BotUploader";
import ModalCreateGame from "./ModalCreateGame";
import ModalDepositToken from "./ModalDepositToken";

export default () => {
    var dispatch = useDispatch()
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
                <Text h2 size={90}>Ultrachess.org</Text> 
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
                <GameList/>
            </div>
        </div>    
    );
}