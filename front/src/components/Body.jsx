import * as React from "react";
import { Text, Grid, Button, Spacer, Card, Pagination, Divider, Table} from "@nextui-org/react";
import "./Body.css"
import { FaPlay } from 'react-icons/fa';
import GameList from "./GameList";
import { createGame } from "../store/game/gameSlice";
import { useDispatch } from "react-redux";
import FileUploader from "./BotUploader";

export default () => {
    var dispatch = useDispatch()
    const [mainItems, setMainItems] = React.useState([]);

    function handleCreateGame(){
        dispatch(createGame())
    }
    return (
        <div className="body">
            <div className="header">
                <Text h2 size={90}>Ultrachess.org</Text> 
                <Text>Immutable chess backed by blockchain technology. Play with more than just your elo at stake</Text>
            </div>
            <div className="buttons">
                <Button color="gradient" shadow>
                    Quick play
                </Button>
                <Spacer x={1}/>
                <Button light color="default" onClick={handleCreateGame} shadow>
                    Create game
                </Button>
            </div>
            <div className="content">
                <GameList/>
            </div>
        </div>    
    );
}