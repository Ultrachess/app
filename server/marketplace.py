import deps
import random
import string
import notification

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

    def create_offer(self, sender, timestamp, options):
        if "botId" not in options or "price" not in options or "token" not in options or "0x" in sender:
            return False

        botId = options["botId"]
        price = options["price"]
        token = options["token"]
        owner = deps.botFactory.getOwner(sender)

        #make sure not sending offer to your own bot
        if sender == owner:
            return False
        #make sure is botId valid and user has funds
        #make sure owner is valid
        hasFunds = deps.accountManager.getBalance(sender, token) >= price
        if not "0x" in botId and not hasFunds and owner != None:
            return False
        
        offerId = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
        self.offers[offerId] = CreateBotOffer(sender, offerId, timestamp, botId, price, token)
        notification.send_notification(
            notification.BotOfferCreatedNotification(
                timestamp=timestamp,
                offer_id=offerId,
                sender=sender,
                price=price,
                token=token,
                owner = owner,
                bot_id=botId
            )
        )
        return True

        
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

        notification.send_notification(
            notification.BotOfferAcceptedNotification(
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
        return True


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


        notification.send_notification(
            notification.BotOfferDeclinedNotification(
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
        return True

    def getStringState(self):
        return str(self.offers)

    def getState(self):
        return self.offers

