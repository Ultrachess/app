import * as React from "react";
import { Text, Grid, Card, Divider } from "@nextui-org/react";
import { FaFastForward, FaFastBackward, FaForward, FaBackward } from "react-icons/fa";
import { ImLoop } from "react-icons/im"
import pgnParser from "pgn-parser";
import { Chess } from "chess.js";
import "./GameMovesView.css"

export default (props) => {
    const { pgn } = props
    var chess = new Chess()
    chess.load_pgn(pgn)
    var moves = chess.history()
    const getMoves = () => {
        let content = [];
        var flip = true
        for (let index = 0; index < moves.length; index +=2) {
            const element = moves[index];
            const element2 = moves[index+1] ?? ""
            content.push(
                <tr key={index}>
                    <td className = {flip ? 'highlight' : ''} key={index}>{element}</td>
                    <td className = {!flip ? 'highlight' : ''} key = {index+1}>{element2}</td>
                </tr>
            );
            flip = !flip
        }

        return content;
    };

    return (
        <div className="movesView">
            <Card 
                shadow={false} 
                bordered={true} 
                css={{ height:"300px", width: "500px"}}
            >
                <Card.Header>
                    <div className="movesHeader">
                        <ImLoop/>
                        <FaFastBackward/>
                        <FaBackward/>
                        <FaForward/>
                        <FaFastForward/>
                    </div>
                </Card.Header>
                <Divider/>
                <Card.Body>
                    <table css={{width:"100%"}}>
                        <tbody>
                            {getMoves()}
                        </tbody>
                    </table>
                </Card.Body>
                <Divider/>
                <Card.Footer>

                </Card.Footer>
            </Card>
            
        </div> 
    );
}