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


class BotMarketPlaceManager:
    def __init__(self):
        self.offers = {}

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
