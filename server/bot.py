# Copyright 2022-2023 Ultrachess team
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

import logging
import random
import string
import subprocess

import chess.engine

import deps
import notification

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

class Bot:
    def __init__(self, id, owner, binary, timestamp):
        self.id = id
        self.owner = owner
        self.timestamp = timestamp
        self.name = "bot" + id
        # create executable
        file = open(id, "wb")
        file.write(binary)
        file.close()
        subprocess.run("chmod u+x " + id, shell=True)
        # set process
        self.engine = chess.engine.SimpleEngine.popen_uci("./" + id)
        # self.engine.configure({"Threads": 2})
        self.autoMaxWagerAmount = 0
        self.autoWagerTokenAddress = ""
        self.autoBattleEnabled = False

        notification.send_notification(
            notification.BotCreatedNotification(
                timestamp=timestamp,
                creator_id=owner,
                bot_id=id,
                type=notification.NotificationType.BOT_CREATED,
            )
        )

    def run(self, board, timeStamp):
        # logger.info("bot: processing chess board: " + board.fen())
        time = (int(timeStamp) % 10) / 1000.0
        logger.info("running bot with time: " + str(time))
        botMoveStat = {}
        # get bot move statistics such as time, depth, nodes, score
        result = self.engine.play(board, chess.engine.Limit(time=time))
        logger.info("result.info: " + str(result.info))
        botMoveStat["depth"] = result.info["depth"] if "depth" in result.info else 0
        botMoveStat["seldepth"] = (
            result.info["seldepth"] if "seldepth" in result.info else 0
        )
        botMoveStat["time"] = result.info["time"] if "time" in result.info else 0
        botMoveStat["nodes"] = result.info["nodes"] if "nodes" in result.info else 0
        botMoveStat["pv"] = result.info["pv"] if "pv" in result.info else 0
        botMoveStat["score"] = result.info["score"] if "score" in result.info else 0
        botMoveStat["nps"] = result.info["nps"] if "nps" in result.info else 0
        botMoveStat["tbhits"] = result.info["tbhits"] if "tbhits" in result.info else 0
        botMoveStat["sbhits"] = result.info["sbhits"] if "sbhits" in result.info else 0
        botMoveStat["cpuload"] = (
            result.info["cpuload"] if "cpuload" in result.info else 0
        )

        move = result.move
        return (move.uci(), botMoveStat)

    def getState(self):
        return {
            "id": self.id,
            "name": self.name,
            "owner": self.owner,
            "timestamp": self.timestamp,
            "autoMaxWagerAmount": self.autoMaxWagerAmount,
            "autoWagerTokenAddress": self.autoWagerTokenAddress,
            "autoBattleEnabled": self.autoBattleEnabled,
        }


class BotFactory:
    def __init__(self):
        self.bots = {}

    def create(self, owner, binary, timestamp):
        id = str(
            "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
        ).lower()
        bot = Bot(id, owner, binary, timestamp)
        self.bots[id] = bot
        return True

    def getOwner(self, id):
        return self.bots[id].owner
    
    def getBot(self, id):
        if id not in self.bots:
            return None
        return self.bots[id]

    def getStringState(self):
        return str(self.bots)

    def getState(self):
        newBots = {}
        for key in self.bots:
            bot = self.bots[str(key)]
            botPartial = bot.getState()
            newBots[key] = botPartial
        return newBots


class BotManager:
    def __init__(self):
        self.last_challenged = {}
        self.pending_game_moves = []
        self.pending_games = []
        self.last_step_timestamp = 0
        self.time_allowed = 10.0 #seconds

    def start(self):
        self.time_allowed = 10.0

    def __fetchOpponent(self, botIdList, botId, factory):
        mainBot = factory.bots[botId]

        eligible_opponents = []

        for opponentId in botIdList:
            if opponentId == botId:
                continue

            opponent = factory.bots[opponentId]

            if (opponent.owner.lower() != mainBot.owner.lower() and
                opponent.autoWagerTokenAddress.lower() == mainBot.autoWagerTokenAddress.lower() and
                opponent.autoMaxWagerAmount <= mainBot.autoMaxWagerAmount):
                
                eligible_opponents.append(opponentId)

        if not eligible_opponents:
            return False

        if botId not in self.last_challenged:
            self.last_challenged[botId] = {'opponents': [], 'index': 0}

        last_opponents = self.last_challenged[botId]['opponents']
        last_index = self.last_challenged[botId]['index']

        if last_opponents != eligible_opponents:
            self.last_challenged[botId]['opponents'] = eligible_opponents
            last_index = 0
        else:
            last_index = (last_index + 1) % len(eligible_opponents)

        self.last_challenged[botId]['index'] = last_index

        return eligible_opponents[last_index]

    def runPendingGames(self, timestamp):
        num_games = len(self.pending_games)
        finished_games = []
        totalTimeSpent = 0

        if num_games == 0:
            return

        for gameId in list(self.pending_games):
            game = deps.matchMaker.games[gameId]
            (timeSpent, finished) = game.runFixed(timestamp, self.time_allowed / num_games)
            totalTimeSpent += timeSpent
            if finished:
                finished_games.append(gameId)
        
        self.time_allowed -= totalTimeSpent
        self.pending_games = [gameId for gameId in self.pending_games if gameId not in finished_games]


    def runPendingMoves(self, timestamp):
        logger.info("bot: attempting running pending moves")
        # run pending bot game moves
        while len(self.pending_game_moves) > 0:
            logger.info("bot: runing a moves")
            pending_move = self.pending_game_moves.pop()
            # get game and bot
            gameId = pending_move["gameId"]
            botId = pending_move["botId"]
            game = deps.matchMaker.games[gameId]
            bot = deps.botFactory.bots[botId]
            # process move
            board = game.state.board()
            (uci, botMoveStat) = bot.run(board, timestamp)
            game.move(botId, timestamp, uci, botMoveStat)

    def __matchMake(self, sender, timestamp, rand, factory, matchmaker):
        bots = factory.bots
        logger.info("factor: " + str(factory.bots))
        botIds = list(bots.keys())
        logger.info("bots.keys(): " + str(bots.keys()))
        logger.info("list(bots.keys()): " + str(list(bots.keys())))

        # run scheduled matches
        for botId in botIds:
            logger.info("bitIds: " + str(botIds))
            botId2 = self.__fetchOpponent(botIds, botId, factory)
            bot1 = bots[botId]
            if botId2:
                # create challenge
                # deps.challengeManager.create(botId, timestamp, {
                #     "challenger": botId,
                #     "recipient": botId2,
                #     "token": bot1.autoWagerTokenAddress,
                #     "wager": bot1.autoMaxWagerAmount,
                # })
                matchmaker.create(
                    sender,
                    timestamp,
                    {
                        "name": "auto triggered match",
                        "isBot": True,
                        "botId1": botId,
                        "botId2": botId2,
                        "token": bot1.autoWagerTokenAddress,
                        "wagerAmount": bot1.autoMaxWagerAmount,
                    },
                )

        self.runPendingMoves(timestamp)

    def step(self, sender, timestamp, rand, factory, matchmaker):
        #log random number
        logger.info("bot stepping with: random number: " + str(rand))
        # handle all autonomous matchmaking between bots
        self.__matchMake(sender, timestamp, rand, factory, matchmaker)
        self.last_step_timestamp = timestamp

    def manage(self, sender, options, factory):
        botId = options["botId"] if ("botId" in options) else False
        autoMaxWagerAmount = (
            options["autoMaxWagerAmount"] if ("autoMaxWagerAmount" in options) else 0
        )
        autoWagerTokenAddress = (
            options["autoWagerTokenAddress"]
            if ("autoWagerTokenAddress" in options)
            else ""
        )
        autoBattleEnabled = (
            options["autoBattleEnabled"] if ("autoBattleEnabled" in options) else False
        )
        name = options["name"] if ("name" in options) else ("bot" + str(botId) if botId else "")

        bot = factory.bots[botId]
        if sender.lower() == bot.owner.lower():
            bot.autoMaxWagerAmount = autoMaxWagerAmount
            bot.autoWagerTokenAddress = autoWagerTokenAddress
            bot.autoBattleEnabled = autoBattleEnabled
            bot.name = name
