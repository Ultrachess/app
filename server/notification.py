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

import json
import logging
import random
import string
from dataclasses import asdict, dataclass
from enum import Enum
from os import environ

import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]


# This class is used to define the type of notification based on notification.ts
class NotificationType(Enum):
    GAME_CREATED = (0,)  # when you create a game
    GAME_JOINED = (1,)  # when someone joins your game
    GAME_MOVE = (2,)  # when someone makes a move in your game
    GAME_COMPLETED = (3,)  # when a game you are in is completed
    GAME_WAGER = (
        4,
    )  # when someone wagers on your game or wagers in a game you wagered on
    GAME_BETTING_CLOSED = (
        14,
    )  # when betting is close on a game you are in or a game you wagered on

    CHALLENGE_CREATED = (5,)  # when you recieve a challenge or send a challenge
    CHALLENGE_ACCEPTED = (6,)  # when you challenge someone and they accept
    CHALLENGE_DECLINED = (7,)  # when you challenge someone and they decline
    CHALLENGE_RECIEVED = (8,)  # when someone challenges you

    TOURNAMENT_CREATED = (9,)  # when you create a tournament
    TOURNAMENT_JOINED = (10,)  # when someone joins your tournament
    TOURNAMENT_COMPLETED = (11,)  # when a tournament you are in is completed
    TOURNAMENT_MATCH_CREATED = (12,)  # when a tournament you are in creates a new match
    TOURNAMENT_MATCH_COMPLETED = (13,)  # when a tournament you are in completes a match
    TOURNAMENT_ROUND_COMPLETED = (15,)  # when a tournament you are in completes a round

    BOT_CREATED = (25,)  # when you create a bot
    BOT_UPDATED = (26,)  # when you update a bot
    BOT_GAME_CREATED = (16,)  # when a bot that you own creates a game
    BOT_GAME_COMPLETED = (17,)  # when a bot that you own completes a game
    BOT_OFFER_CREATED = (22,)  # when a bot that you own receives an offer
    BOT_OFFER_ACCEPTED = (23,)  # when a request to purchase another bot is accepted
    BOT_OFFER_DECLINED = (24,)  # when a request to purchase another bot is declined

    DEPOSIT_FUNDS = (27,)  # when you deposit funds
    WITHDRAW_FUNDS = (28,)  # when you withdraw funds

    KING_THRONED = (18,)  # when you become king
    KING_CHALLENGED = (19,)  # when you are challenged to be king
    KING_CHALLENGE_COMPLETE = (20,)  # when a challenge to be king ends


@dataclass
class BaseNotification:
    type: NotificationType
    timestamp: int


@dataclass
class GameCreatedNotification(BaseNotification):
    type = NotificationType.GAME_CREATED
    creator_id: str
    game_id: str
    wager: int
    token: str


@dataclass
class GameJoinedNotification(BaseNotification):
    type = NotificationType.GAME_JOINED
    player_id: str
    game_id: str
    wager: int
    token: str


@dataclass
class GameMoveNotification(BaseNotification):
    type = NotificationType.GAME_MOVE
    game_id: str
    player_id: str
    move: str


@dataclass
class GameCompletedNotification(BaseNotification):
    type = NotificationType.GAME_COMPLETED
    game_id: str
    player_id1: str
    player_id2: str
    score1: int
    score2: int
    token: str
    pot: int
    winningId: str
    winningIdBettorCount: int
    winnings1: int
    winnings2: int


@dataclass
class GameWagerNotification(BaseNotification):
    type = NotificationType.GAME_WAGER
    game_id: str
    player_id: str
    expected_winner_id: str
    wager: int
    token: str


@dataclass
class GameBettingClosedNotification(BaseNotification):
    type = NotificationType.GAME_BETTING_CLOSED
    game_id: str
    totalPot: int
    token: str


@dataclass
class ChallengeCreatedNotification(BaseNotification):
    type = NotificationType.CHALLENGE_CREATED
    challenge_id: str
    sender: str
    challenger: str
    recipient: str
    wager: int
    token: str


@dataclass
class ChallengeAcceptedNotification(BaseNotification):
    type = NotificationType.CHALLENGE_ACCEPTED
    challenge_id: str
    sender: str
    recipient: str
    wager: int
    token: str


@dataclass
class ChallengeDeclinedNotification(BaseNotification):
    type = NotificationType.CHALLENGE_DECLINED
    challenge_id: str
    sender: str
    recipient: str
    wager: int
    token: str


@dataclass
class ChallengeRecievedNotification(BaseNotification):
    type = NotificationType.CHALLENGE_RECIEVED
    challenge_id: str
    sender: str
    recipient: str
    wager: int
    token: str


@dataclass
class TournamentCreatedNotification(BaseNotification):
    type = NotificationType.TOURNAMENT_CREATED
    tournament_id: str
    creator_id: str


@dataclass
class TournamentJoinedNotification(BaseNotification):
    type = NotificationType.TOURNAMENT_JOINED
    tournament_id: str
    player_id: str


@dataclass
class TournamentCompletedNotification(BaseNotification):
    type = NotificationType.TOURNAMENT_COMPLETED
    tournament_id: str


@dataclass
class TournamentMatchCreatedNotification(BaseNotification):
    type = NotificationType.TOURNAMENT_MATCH_CREATED
    tournament_id: str
    match_id: str


@dataclass
class TournamentMatchCompletedNotification(BaseNotification):
    type = NotificationType.TOURNAMENT_MATCH_COMPLETED
    tournament_id: str
    match_id: str
    player_id1: str
    player_id2: str
    score1: int
    score2: int


@dataclass
class TournamentRoundCompletedNotification(BaseNotification):
    type = NotificationType.TOURNAMENT_ROUND_COMPLETED
    tournament_id: str
    roundNumber: int


@dataclass
class BotCreatedNotification(BaseNotification):
    type = NotificationType.BOT_CREATED
    bot_id: str
    creator_id: str


@dataclass
class BotUpdatedNotification(BaseNotification):
    type = NotificationType.BOT_UPDATED
    bot_id: str
    creator_id: str


@dataclass
class BotGameCreatedNotification(BaseNotification):
    type = NotificationType.BOT_GAME_CREATED
    bot_id: str
    game_id: str
    player_id1: str
    player_id2: str
    wager: int
    token: str


@dataclass
class BotGameCompletedNotification(BaseNotification):
    type = NotificationType.BOT_GAME_COMPLETED
    game_id: str
    player_id1: str
    player_id2: str
    score1: int
    score2: int
    token: str
    pot: int
    winningId: str
    winningIdBettorCount: int
    winnings1: int
    winnings2: int


@dataclass
class KingThronedNotification(BaseNotification):
    type = NotificationType.KING_THRONED
    prev: str
    current: str


@dataclass
class KingThroneChallengedNotification(BaseNotification):
    type = NotificationType.KING_CHALLENGED
    player: str
    price: int
    token: str


@dataclass
class KingThroneChallengeComplete(BaseNotification):
    type = NotificationType.KING_CHALLENGE_COMPLETE
    player: str
    price: int
    token: str


# @dataclass
# class BotJoinedTournamentNotification(BaseNotification):
#     type = NotificationType.BOT_JOINED_TOURNAMENT
#     bot_id: str
#     tournament_id: str

# @dataclass
# class BotTournamentMatchCompletedNotification(BaseNotification):
#     type = NotificationType.BOT_TOURNAMENT_MATCH_COMPLETED
#     bot_id: str
#     tournament_id: str
#     match_id: str
#     player_id1: str
#     player_id2: str
#     score1: int
#     score2: int
#     totalScore1: int
#     totalScore2: int

# @dataclass
# class BotTournamentRoundCompletedNotification(BaseNotification):
#     type = NotificationType.BOT_TOURNAMENT_ROUND_COMPLETED
#     tournament_id: str
#     roundNumber: int
#     bot_id: str

# @dataclass
# class BotTournamentCompletedNotification(BaseNotification):
#     type = NotificationType.BOT_TOURNAMENT_COMPLETED
#     tournament_id: str
#     bot_id: str
#     score: int


@dataclass
class BotOfferCreatedNotification(BaseNotification):
    type = NotificationType.BOT_OFFER_CREATED
    bot_id: str
    offer_id: str
    sender: str
    owner: str
    price: int
    token: str


@dataclass
class BotOfferAcceptedNotification(BaseNotification):
    type = NotificationType.BOT_OFFER_ACCEPTED
    bot_id: str
    offer_id: str
    sender: str
    owner: str
    price: int
    token: str


@dataclass
class BotOfferDeclinedNotification(BaseNotification):
    type = NotificationType.BOT_OFFER_DECLINED
    bot_id: str
    offer_id: str
    sender: str
    owner: str
    price: int
    token: str


@dataclass
class DepositFundsNotification(BaseNotification):
    type = NotificationType.DEPOSIT_FUNDS
    sender: str
    amount: int
    token: str


@dataclass
class WithdrawFundsNotification(BaseNotification):
    type = NotificationType.WITHDRAW_FUNDS
    sender: str
    amount: int
    token: str


Notification = (
    GameCreatedNotification
    | GameCompletedNotification
    | GameWagerNotification
    | GameBettingClosedNotification
    | ChallengeCreatedNotification
    | ChallengeAcceptedNotification
    | ChallengeDeclinedNotification
    | ChallengeRecievedNotification
    | TournamentCreatedNotification
    | TournamentJoinedNotification
    | TournamentCompletedNotification
    | TournamentMatchCreatedNotification
    | TournamentMatchCompletedNotification
    | TournamentRoundCompletedNotification
    | BotCreatedNotification
    | BotUpdatedNotification
    | BotGameCreatedNotification
    | BotGameCompletedNotification
    | BotOfferCreatedNotification
    | BotOfferAcceptedNotification
    | BotOfferDeclinedNotification
    | DepositFundsNotification
    | WithdrawFundsNotification
)


# write a function that takes in a notifcation
# runs a elif chain to determine which type of notification it is
# then return a json object of the notification
def convert_to_json(notification: Notification):
    attrs = asdict(notification)
    new_id = str(
        "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
    ).lower()
    attrs["id"] = new_id
    attrs["type"] = notification.type.value[0]
    attrs["timestamp"] = attrs["timestamp"] * 1000
    logger.info("attrs: " + str(attrs))
    return attrs


def convert_to_hex(s_input):
    return "0x" + str(s_input.encode("utf-8").hex())


def send_notification(notification: Notification):
    # turn notification into json
    logger.info("Attempting to send notice " + str(notification))
    logger.info("Attempting to send notice ")
    data_set = convert_to_json(notification)
    json_object = json.dumps(data_set)
    logger.info("Sending notice : " + json_object)
    hex_string = convert_to_hex(json_object)
    logger.info("rollup_server: " + rollup_server)
    response = requests.post(rollup_server + "/notice", json={"payload": hex_string})
    logger.info(
        f"Received notice status {response.status_code} body {response.content}"
    )
    # add action to ActionManager
    logger.info("New PayLoad Added: " + hex_string)
    logger.info("Adding notice")
