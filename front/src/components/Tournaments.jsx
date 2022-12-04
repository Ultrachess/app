import * as React from "react";
import { Row, Text, Button, Spacer, Card} from "@nextui-org/react";
import "./Body.css"
import { useAppSelector } from "../state/hooks";
import TournamentsList from "./TournamentsList";
import ModalCreateTournament from "./ModalCreateTournament";

export default () => {
    const tournaments = useAppSelector(state => state.game.tournaments);
    console.log(tournaments)
    const [createModalVisible, setCreateModalVisible] = React.useState(false)

    const handleShowCreateModal = () => {setCreateModalVisible(true)}
    const handleCloseCreateModal = () => {setCreateModalVisible(false)}

    return (
        <div className="body">
            <ModalCreateTournament 
                visible={createModalVisible} 
                closeHandler={handleCloseCreateModal}
            />
            <div className="header">
                <Row>
                    <Text>Tournaments</Text>
                </Row>
            </div>
            <div className="buttons">
                <Button color="gradient" onClick={handleShowCreateModal} shadow>
                    Create tournament
                </Button>
                <Spacer x={1}/>
            </div>
            <div className="content">
            <Card shadow={true} css={{ width:"1300px", height:"700px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                <Card.Header>
                    <Row justify="center">
                        <Text>Tournament list</Text>
                    </Row>
                </Card.Header>
                <TournamentsList tournaments={tournaments}/>
                </Card>
            </div>
        </div>    
    );
}