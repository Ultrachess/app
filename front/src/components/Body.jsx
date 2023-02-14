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
import Separator from "./ui/Separator";
import { useAllActiveAndCompletedGamesSeparated } from "../state/game/hooks";

export default () => {
    const { 
        activeGames, 
        completedGames 
    } = useAllActiveAndCompletedGamesSeparated()

    return (
        <div className="body">
            
            <div className="header">
                <div>
                    <Text bold black size={"max"} css = {{textAlign:"center", marginBottom:"10px"}}>Ultrachess.org</Text>
                    <Text bold
                        violet
                    >pre-alpha</Text> 
                </div>
                <LeftSlot><Label>Introduction</Label></LeftSlot>
                <Text black size={2} css={{width:"100%", textAlign:"left", lineHeight:"30px", marginBottom:"-80px"}}>
                    Immutable chess backed by blockchain technology. Play with more than just your elo at stake.
                    Start by fetching some testnet stable coins from the faucet within our discord (https://discord.gg/7WtTFvR3dN) 
                    Once recieved, deposit them into the portal and they will be ready for use within Ultrachess.
                    Check out our github for more technical information. Also check out our discord for more information and to chat with the team.
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
                    <div>
                        <div className="contentHeader">
                            <Label>Active games</Label>
                            <RightSlot>
                                <ModalNewCreateGame triggerElement={
                                    <Button shadow>
                                        <Text>Create Game</Text>
                                    </Button>
                                } />
                                <Spacer x={1}/>
                                <ModalNewDepositFunds triggerElement={
                                    <Button  iconRight={<FaCoins/>}>
                                    <Text>Deposit Funds</Text>
                                    </Button>
                                } />
                            </RightSlot>
                        </div>
                        <Separator/>
                        <GameList games={activeGames}/>
                    </div>
                    <div>
                        <div className="contentHeader">
                            <Label>Finished games</Label>
                        </div>
                        <Separator/>
                        <GameList games={completedGames}/>
                    </div>
                    
                    
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