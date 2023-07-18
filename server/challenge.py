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

import deps
import notification

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)


def CreateChallenge(
    sender, challengeId, timestamp, recipient, wager, token, challenger
):
    return {
        "challengeId": challengeId,
        "timestamp": timestamp,
        "sender": sender,
        "challenger": challenger,
        "recipient": recipient,
        "wager": wager,
        "token": token,
    }


# Create challenge manager class
class ChallengeManager:
    def __init__(self):
        self.challenges = {}

    def create(self, sender, timestamp, options):
        # make sure all options are present
        logger.info("Creating challenge", options)
        if (
            "recipient" not in options
            or "wager" not in options
            or "token" not in options
            or "challenger" not in options
        ):
            logger.info("missing options")
            return False

        # make sure sender has enough funds
        challenger = options["challenger"]
        # check if challenger is a bot, if so, get owner
        person_with_funds = (
            challenger if "0x" in challenger else deps.botFactory.getOwner(challenger)
        )
        is_person_with_funds_sender = person_with_funds.lower() == sender.lower()
        hasFunds = (
            deps.accountManager.getBalance(person_with_funds, options["token"])
            >= options["wager"]
        )
        logger.info("hasFunds" + str(hasFunds))
        logger.info("sender" + sender)
        logger.info("person_with_funds" + person_with_funds)
        challenger_is_bot = "0x" not in challenger
        challenger_is_sender = challenger.lower() == sender.lower()
        canChallenge = (
            challenger_is_sender if challenger_is_bot else is_person_with_funds_sender
        )
        if not hasFunds and not canChallenge:
            logger.info("not enough funds")
            return False
        # make sure not challenging yourself
        logger.info("sender " + sender)
        logger.info("recipient " + options["recipient"])
        if sender == options["recipient"]:
            logger.info("cannot challenge yourself")
            return False

        # create challenge
        recipient = options["recipient"]
        wager = options["wager"]
        token = options["token"]
        challengeId = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=10)
        )
        challenge = CreateChallenge(
            challenger, challengeId, timestamp, recipient, wager, token, challenger
        )
        self.challenges[challengeId] = challenge
        notification.send_notification(
            notification.ChallengeCreatedNotification(
                timestamp=timestamp,
                challenge_id=challengeId,
                sender=sender,
                challenger=challenger,
                recipient=recipient,
                wager=wager,
                token=token,
                type=notification.NotificationType.CHALLENGE_CREATED,
            )
        )

        # if bot check if can auto accept challenge
        if challenger_is_bot:
            bot = deps.BotFactory.getBot(challenger)
            token_is_valid = token.lower() == bot.autoWagerTokenAddress.lower()
            wager_is_valid = wager <= bot.autoMaxWagerAmount

            if token_is_valid and wager_is_valid:
                self.accept(bot.id, timestamp, challengeId)      

        return True

    def accept(self, sender, timestamp, challengeId):
        # make sure challenge exists
        if not challengeId in self.challenges:
            logger.info("challenge does not exist")
            return False

        # make sure sender has enough funds
        challenge = self.challenges[challengeId]
        acceptor = sender
        owner_sender = (
            acceptor if "0x" in acceptor else deps.botFactory.getOwner(acceptor)
        )
        hasFunds = (
            deps.accountManager.getBalance(owner_sender, challenge["token"])
            >= challenge["wager"]
        )
        acceptor_is_bot = "0x" not in acceptor
        sender_is_bot = "0x" not in challenge["sender"]
        recipient_is_bot = "0x" not in challenge["recipient"]
        valid_acceptor = (
            challenge["recipient"]
            if not recipient_is_bot
            else deps.botFactory.getOwner(challenge["recipient"])
        )
        if not hasFunds or valid_acceptor != acceptor.lower():
            logger.info("not enough funds")
            return False

        # accept challenge if sender is recipient
        # then create game
        notification.send_notification(
            notification.ChallengeAcceptedNotification(
                timestamp=timestamp,
                challenge_id=challengeId,
                sender=challenge["sender"],
                recipient=challenge["recipient"],
                wager=challenge["wager"],
                token=challenge["token"],
                type=notification.NotificationType.CHALLENGE_ACCEPTED,
            )
        )
        # create game
        p1 = challenge["challenger"]
        p2 = challenge["recipient"]
        wager = challenge["wager"]
        token = challenge["token"]
        p1IsBot = "0x" not in p1
        p2IsBot = "0x" not in p2
        onlyBot = p1IsBot and p2IsBot
        if onlyBot:
            deps.matchMaker.create(
                sender,
                timestamp,
                {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "botId2": p2,
                    "token": token,
                    "wagerAmount": wager,
                },
            )
        elif p1IsBot:
            deps.matchMaker.create(
                sender,
                timestamp,
                {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "playerId": p2,
                    "token": token,
                    "wagerAmount": wager,
                },
            )
        elif p2IsBot:
            deps.matchMaker.create(
                sender,
                timestamp,
                {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p2,
                    "playerId": p1,
                    "token": token,
                    "wagerAmount": wager,
                },
            )
        else:
            deps.matchMaker.create(
                sender,
                timestamp,
                {
                    "name": "auto triggered match",
                    "isBot": False,
                    "players": [p1, p2],
                    "token": token,
                    "wagerAmount": wager,
                },
            )
        del self.challenges[challengeId]
        return True

    def decline(self, sender, timestamp, challengeId):
        challenge = self.challenges[challengeId]
        if challenge["recipient"] == sender:
            notification.send_notification(
                notification.ChallengeDeclinedNotification(
                    timestamp=timestamp,
                    challenge_id=challengeId,
                    sender=challenge["sender"],
                    recipient=challenge["recipient"],
                    wager=challenge["wager"],
                    token=challenge["token"],
                    type=notification.NotificationType.CHALLENGE_DECLINED,
                )
            )
            del self.challenges[challengeId]
            return True

        logger.info("sender is not recipient")
        return False

    def getStringState(self):
        return str(self.offers)

    def getState(self):
        return self.challenges
