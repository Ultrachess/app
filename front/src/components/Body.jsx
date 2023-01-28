import * as React from "react";
import { Row, Grid, Spacer, Card, Pagination, Divider, Table} from "@nextui-org/react";
import "./Body.css"
import { FaArrowDown, FaCoins, FaPlay } from 'react-icons/fa';
import GameList from "./GameList";
import { createGame } from "../state/game/gameSlice";
import { useDispatch } from "react-redux";
import FileUploader from "./BotUploader";
import ModalCreateGame from "./ModalCreateGame";
import ModalDepositToken from "./ModalDepositToken";
import { useAppSelector } from "../state/hooks";
import Button  from "./Button";
import { Text } from "./Text";
import ModalNewDepositFunds from "./ModalNewDepositFunds";
import {styled } from "@stitches/react";
import { violet } from "@radix-ui/colors";
import ModalNewCreateGame from "./ModalNewCreateGame";

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
            
            <div className="header">
                <div>
                    <Text bold black size={"max"} css = {{textAlign:"center", marginBottom:"30px"}}>Ultrachess.org</Text>
                    <Text bold
                        violet
                    >pre-alpha</Text> 
                </div>
                <LeftSlot><Label>Introduction</Label></LeftSlot>
                <Text black size={2} css={{width:"100%", textAlign:"left", lineHeight:"30px"}}>
                    Immutable chess backed by blockchain technology. Play with more than just your elo at stake.
                    Start by fetching some testnet stable coins from the faucet within our discord (https://discord.gg/7WtTFvR3dN) 
                    Once recieved, deposit them into the portal and they will be ready for use within Ultrachess.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    <br/>
                    <br/>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit.                    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit.

                    <br/>
                    <br/>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Text>
                
            </div>
            
            <div className="content">
                <div className="contentHolder">
                    <div className="contentHeader">
                        <Label>Active games</Label>
                        <RightSlot>
                            <ModalNewCreateGame triggerElement={
                                <Button variant={"outline"} onClick={handleShowCreateModal} shadow>
                                    create game
                                </Button>
                            } />
                            <Spacer x={1}/>
                            <ModalNewDepositFunds triggerElement={
                                <Button variant={"outline"} iconRight={<FaCoins/>} onClick={handleShowDepositModal} >
                                deposit Token
                                </Button>
                            } />
                        </RightSlot>
                    </div>
                
                <Card shadow={true} css={{ width:"100%", height:"700px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                    <Card.Header>
                        <Row justify="center">
                            <Text>Recent games</Text>
                        </Row>
                    </Card.Header>
                    <GameList games={games}/>
                </Card>
                </div>
            </div>
        </div>    
    );
}

const Label = styled('label', {
    fontSize: 23,
    lineHeight: 1,
    fontWeight: 500,
    marginBottom: 20,
    color: violet.violet12,
    display: 'block',
  });

  const LeftSlot = styled('div', {
    marginRight: 'auto',
    paddingRight: 0,
    display: 'flex',
    color: violet.violet11,
    '[data-highlighted] > &': { color: 'white' },
    '[data-disabled] &': { color: violet.violet4 },
  });

  const RightSlot = styled('div', {
    marginLeft: 'auto',
    paddingLeft: 0,
    display: 'flex',
    '[data-highlighted] > &': { color: 'white' },
  });