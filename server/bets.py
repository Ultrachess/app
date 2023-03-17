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

import deps
import notification

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)


def CreateBetPhase(gameId, openTime, duration, tokenAddress):
    return {
        "gameId": gameId,
        "openTime": openTime,
        "duration": duration,
        "pots": {},
        "totalPot": 0,
        "bets": {},
        "betsArray": [],
        "tokenAddress": tokenAddress,
    }


def CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId):
    return {
        "sender": sender,
        "timeStamp": timeStamp,
        "gameId": gameId,
        "tokenAddress": tokenAddress,
        "amount": amount,
        "winningId": winningId,
    }


class BetManager:
    def __init__(self):
        self.games = {}

    def isBettingPhaseOpen(self, gameId, currentTime):
        if not gameId in self.games:
            return False
        game = self.games[gameId]
        return currentTime < (game["openTime"] + game["duration"])

    def open(self, id, timeStamp, duration, tokenAddress):
        self.games[id] = CreateBetPhase(id, timeStamp, duration, tokenAddress)

    def getPot(self, gameId):
        if not gameId in self.games:
            return 0
        return self.games[gameId]["totalPot"]

    def bet(self, sender, timeStamp, value):
        gameId = value["gameId"]
        game = self.games[gameId]
        tokenAddress = (
            value["tokenAddress"] if "tokenAddress" in value else game["tokenAddress"]
        )
        amount = value["amount"]
        winningId = value["winningId"].lower()

        # check if token matches the game token
        if tokenAddress.lower() != game["tokenAddress"].lower():
            return False
        # return if bet is being sent by a match participant
        # if sender in deps.matchMaker.games[gameId].players:
        #     return False
        # make sure this submission is not passed the betting phase
        if timeStamp > (game["openTime"] + game["duration"]):
            return False

        if not deps.accountManager.withdraw(sender, amount, tokenAddress):
            return False
        if winningId.lower() not in self.games[gameId]["bets"]:
            self.games[gameId]["bets"][winningId.lower()] = {}
        self.games[gameId]["bets"][winningId][sender] = CreateBet(
            sender, timeStamp, gameId, tokenAddress, amount, winningId
        )
        self.games[gameId]["betsArray"].append(
            CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId)
        )
        if winningId.lower() not in self.games[gameId]["pots"]:
            self.games[gameId]["pots"][winningId] = 0
        self.games[gameId]["pots"][winningId] += amount
        self.games[gameId]["totalPot"] += amount

        # send notification
        notification.send_notification(
            notification.GameWagerNotification(
                timestamp=timeStamp,
                game_id=gameId,
                player_id=sender,
                expected_winner_id=winningId,
                wager=amount,
                token=tokenAddress,
                type=notification.NotificationType.GAME_WAGER,
            )
        )
        return True

    def end(self, id, winningId):
        if not id in self.games:
            return False
        if not winningId in self.games[id]["bets"]:
            return False

        game = self.games[id]
        numOfWinningIdsBettedOn = len(game["bets"].keys())
        bets = game["bets"][winningId]
        totalPot = game["totalPot"]
        winningPot = game["pots"][winningId]
        numWinners = len(list(bets.values()))

        # check if there are opposing bets
        # if all bets return funds to players
        if numOfWinningIdsBettedOn < 2:
            for bet in game["betsArray"]:
                logger.info("returning funds to players")
                logger.info(str(bet))
                deps.accountManager.deposit(
                    bet["sender"], bet["amount"], bet["tokenAddress"]
                )
            return True

        for senderId in bets:
            bet = bets[senderId]
            amount = bet["amount"]
            tokenAddress = bet["tokenAddress"]
            percentageOfPot = amount / winningPot
            amountRecieved = totalPot * percentageOfPot
            address = (
                senderId if "0x" in senderId else deps.botFactory.getOwner(senderId)
            )
            logger.info("sending winnings to players")
            logger.info("address: " + address)
            logger.info("amount: " + str(amountRecieved))
            logger.info("token: " + tokenAddress)
            deps.accountManager.deposit(address, amountRecieved, tokenAddress)
