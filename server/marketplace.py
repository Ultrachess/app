import deps
import random
import string
from notification import send_notification, BotOfferCreatedNotification, BotOfferDeclinedNotification, BotOfferAcceptedNotification


def CreateBotOffer(sender, offerId, timestamp, botId, price, token):
    return {
        "offerId": offerId,
        "timestamp": timestamp,
        "sender": sender,
        "botId": botId,
        "price": price,
        "token": token,
    }

class BotMarketPlaceManager:
    def __init__(self):
        self.offers = {}

    def create(self, sender, timestamp, options):
        if "botId" not in options or "price" not in options or "token" not in options or "0x" in sender:
            return {
                "value": "",
                "success": False
            }

        botId = options["botId"]
        price = options["price"]
        token = options["token"]
        owner = deps.botFactory.getOwner(sender)

        #make sure not sending offer to your own bot
        if sender == owner:
            return {
                "value": "",
                "success": False
            }

        #make sure is botId valid and user has funds
        #make sure owner is valid
        hasFunds = deps.accountManager.getBalance(sender, token) >= price
        if not "0x" in botId and not hasFunds and owner != None:
            return {
                "value": "",
                "success": False
            }
        
        offerId = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
        self.offers[offerId] = CreateBotOffer(sender, offerId, timestamp, botId, price, token)
        send_notification(
            BotOfferCreatedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner = owner,
                bot_id=botId
            )
        )
        return {
            "value": offerId,
            "success": True
        }

        
    def accept(self, acceptor, timestamp, offerId):
        if not offerId in self.offers:
            return False
        
        offer = self.offers[offerId]
        sender = offer["sender"]
        owner = deps.botFactory.getOwner(sender)
        price = offer["price"]
        token = offer["token"]
        botId = offer["botId"]

        #make sure acceptor is the owner
        if acceptor != owner:
            return False

        #check if sender has funds to purchase
        hasFunds = deps.accountManager.getBalance(sender, token) >= price
        if not hasFunds:
            return False
        
        #transfer from sender to owner
        if not deps.accountManager.withdraw(sender, price, token):
            return False
        if not deps.accountManager.deposit(owner, price, token):
            return False

        deps.botFactory.bots[botId].owner = sender

        send_notification(
            BotOfferAcceptedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner = owner,
                bot_id=botId
            )
        )
        del self.offers[offerId]


    def decline(self, decliner, timestamp, offerId):
        if not offerId in self.offers:
            return False
        
        offer = self.offers[offerId]
        sender = offer["sender"]
        owner = deps.botFactory.getOwner(sender)
        price = offer["price"]
        token = offer["token"]
        botId = offer["botId"]


        #make sure acceptor is the owner
        if decliner != owner and decliner != sender:
            return False


        send_notification(
            BotOfferDeclinedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner = owner,
                bot_id=botId
            )
        )

        del self.offers[offerId]

