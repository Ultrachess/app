/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Chess } from "chess.js";
import Separator from "./ui/Separator";
import List from "./ui/List";
import Flex from "./ui/Flex";
import { Text } from "./ui/Text";

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

  try {
    chess.loadPgn(pgn);
  } catch (error) {
    console.log("Error loading PGN:", error);
  }

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
            alignItems: "center",
            width: "100%",
            height: "20px",
          }}
          className="lg:w-1/2 md:w-full w-full"
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
        flexDirection: "column",
        height: "300px",
      }}
      className="w-full"
    >
      <Flex css={{ justifyContent: "space-between" }}>
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
