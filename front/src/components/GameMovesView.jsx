import * as React from "react";
import { Grid, Card, Divider } from "@nextui-org/react";
import { FaFastForward, FaFastBackward, FaForward, FaBackward } from "react-icons/fa";
import { ImLoop } from "react-icons/im"
import { Chess } from "chess.js";
import Separator from "./ui/Separator";
import List from "./List";
import Flex from "./ui/Flex";
import "./GameMovesView.css"

export default (props) => {
    const { pgn, firstMove, lastMove, nextMove, prevMove, highlightIndex } = props
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
                <Flex key={index} css={{gap: 5}} >
                    <Text underline = {highlightIndex == index} key={index}>{element}</Text>
                    <Separator key={index+0.5} vertical={true} />
                    <Text underline = {highlightIndex == index+1} key = {index+1}>{element2}</Text>
                </Flex>
            );
            flip = !flip
        }

        return content;
    };

    return (
        <Flex css={{gap:2, flexDirection:'column'}}>

                    <div className="movesHeader">
                        <ImLoop/>
                        <FaFastBackward onClick={firstMove}/>
                        <FaBackward onClick={prevMove}/>
                        <FaForward onClick={nextMove}/>
                        <FaFastForward onClick={lastMove}/>
                    </div>
                    <List items={getMoves()} />
        </Flex> 
    );
}