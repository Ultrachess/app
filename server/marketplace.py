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


def CreateBotOffer(sender, offerId, timestamp, botId, price, token, owner):
    return {
        "offerId": offerId,
        "timestamp": timestamp,
        "sender": sender,
        "botId": botId,
        "price": price,
        "token": token,
        "owner": owner,
    }

def CreateListing(sender, botId, price, token, timestamp):
    return {
        "sender": sender,
        "botId": botId,
        "price": price,
        "token": token,
        "timestamp": timestamp,
    }


class BotMarketPlaceManager:
    def __init__(self):
        self.offers = {}
        self.prices = {}

    #lists a bot for sale
    def create_price(self, sender, timestamp, options):
        if "botId" not in options or "price" not in options or "token" not in options:
            return False

        botId = options["botId"]
        price = options["price"]
        token = options["token"]

        #make sure bot exists in bot factory
        if "0x" in botId or deps.botFactory.getBot(botId) == None:
            logger.info("failed to create price, bot does not exist")
            return False

        owner = deps.botFactory.getOwner(botId)

        #make sure sender is the owner
        if sender.lower() != owner.lower():
            logger.info("failed to create price, sender is not owner")
            return False
        
        #if price is 0 or less, remove price
        if price <= 0:
            if botId in self.prices:
                del self.prices[botId]
            return True
        
        self.prices[botId] = CreateListing(sender, botId, price, token, timestamp)
        return True


    def create_offer(self, sender, timestamp, options):
        if "botId" not in options or "price" not in options or "token" not in options:
            return False

        botId = options["botId"]
        price = options["price"]
        token = options["token"]
        owner = deps.botFactory.getOwner(botId)

        # make sure not sending offer to your own bot
        if sender.lower() == owner.lower():
            logger.info("failed to create offer")
            logger.info("sender " + sender)
            logger.info("owner " + owner)
            return False
        # make sure is botId valid and user has funds
        # make sure owner is valid
        hasFunds = deps.accountManager.getBalance(sender, token) >= price
        if "0x" in botId or not hasFunds or owner == None:
            logger.info("failed to create offer")
            logger.info("hasFunds " + hasFunds)
            logger.info("owner " + owner)
            return False

        offerId = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
        self.offers[offerId] = CreateBotOffer(
            sender, offerId, timestamp, botId, price, token, owner
        )
        notification.send_notification(
            notification.BotOfferCreatedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner=owner,
                bot_id=botId,
                type=notification.NotificationType.BOT_OFFER_CREATED,
            )
        )

        #if offer greater than or equal to price, auto accept offer
        if botId in self.prices:
            listing = self.prices[botId]
            if listing["price"] >= price:
                self.accept(owner, timestamp, offerId)
        return True

    def accept(self, acceptor, timestamp, offerId):
        if not offerId in self.offers:
            return False

        offer = self.offers[offerId]
        sender = offer["sender"]
        price = offer["price"]
        token = offer["token"]
        botId = offer["botId"]
        owner = deps.botFactory.getOwner(botId)

        # make sure acceptor is the owner
        if acceptor.lower() != owner.lower():
            return False

        # check if sender has funds to purchase
        hasFunds = deps.accountManager.getBalance(sender, token) >= price
        if not hasFunds:
            return False

        # transfer from sender to owner
        if not deps.accountManager.withdraw(sender, price, token):
            return False
        if not deps.accountManager.deposit(owner, price, token):
            return False

        deps.botFactory.bots[botId].owner = sender

        notification.send_notification(
            notification.BotOfferAcceptedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner=owner,
                bot_id=botId,
                type=notification.NotificationType.BOT_OFFER_ACCEPTED,
            )
        )
        del self.offers[offerId]
        return True

    def decline(self, decliner, timestamp, offerId):
        if not offerId in self.offers:
            return False

        offer = self.offers[offerId]
        sender = offer["sender"]
        price = offer["price"]
        token = offer["token"]
        botId = offer["botId"]
        owner = deps.botFactory.getOwner(botId)

        # make sure acceptor is the owner
        if decliner.lower() != owner.lower() and decliner.lower() != sender.lower():
            return False

        notification.send_notification(
            notification.BotOfferDeclinedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner=owner,
                bot_id=botId,
                type=notification.NotificationType.BOT_OFFER_DECLINED,
            )
        )

        del self.offers[offerId]
        return True

    def getStringState(self):
        return str(self.offers)

    def getState(self):
        return self.offers

    def getBotPrices(self):
        return self.prices
