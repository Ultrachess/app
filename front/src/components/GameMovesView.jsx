import * as React from "react";
import { Grid, Card, Divider } from "@nextui-org/react";
import {
  FaFastForward,
  FaFastBackward,
  FaForward,
  FaBackward,
} from "react-icons/fa";
import { ImLoop } from "react-icons/im";
import { Chess } from "chess.js";
import Separator from "./ui/Separator";
import List from "./ui/List";
import Flex from "./ui/Flex";
import { Text } from "./ui/Text";
import "./GameMovesView.css";

//import radix icons
import {
  LoopIcon,
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import GameBotMoveStatisticsHoverable from "./GameBotMoveStatisticsHoverable";

export default (props) => {
  const {
    pgn,
    firstMove,
    lastMove,
    nextMove,
    prevMove,
    highlightIndex,
    autoPlay,
    botMoveStats,
    jumpTo,
  } = props;
  var chess = new Chess();
  chess.load_pgn(pgn);
  var moves = chess.history();
  const getMoves = () => {
    let content = [];
    var flip = true;
    for (let index = 0; index < moves.length; index += 2) {
      const element = moves[index];
      const element2 = moves[index + 1] ?? "";
      content.push(
        <Flex
          key={index}
          css={{
            gap: 5,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "20px",
            padding: "0px 100px",
          }}
        >
          <GameBotMoveStatisticsHoverable
            botMoveStat={botMoveStats[index]}
            triggerElement={
              <Text
                size={"2"}
                underline={highlightIndex == index}
                key={index}
                onClick={() => jumpTo(index)}
              >
                {element}
              </Text>
            }
          />
          <Separator orientation="vertical" css={{ height: "100px" }} />
          <GameBotMoveStatisticsHoverable
            botMoveStat={botMoveStats[index + 1]}
            triggerElement={
              <Text
                size={"2"}
                underline={highlightIndex == index + 1}
                key={index + 1}
                onClick={() => jumpTo(index + 1)}
              >
                {element2}
              </Text>
            }
          />
        </Flex>
      );
      flip = !flip;
    }

    return content;
  };

  return (
    <Flex
      css={{
        gap: 2,
        flexDirection: "column",
        width: "500px",
        height: "300px",
      }}
    >
      <Flex css={{ justifyContent: "space-evenly" }}>
        <LoopIcon onClick={autoPlay} />
        <DoubleArrowLeftIcon onClick={firstMove} />
        <ArrowLeftIcon onClick={prevMove} />
        <ArrowRightIcon onClick={nextMove} />
        <DoubleArrowRightIcon onClick={lastMove} />
      </Flex>
      <List items={getMoves()} />
    </Flex>
  );
};
