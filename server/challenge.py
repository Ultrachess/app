import deps
import random
import string
import logging
import time
import notification

def CreateChallenge(sender, challengeId, timestamp, recipient, wager, token, challenger):
    return {
        "challengeId": challengeId,
        "timestamp": timestamp,
        "sender": sender,
        "challenger": challenger,
        "recipient": recipient,
        "wager": wager,
        "token": token,
    }

#Create challenge manager class
class ChallengeManager:
    def __init__(self):
        self.challenges = {}

    def create(self, sender, timestamp, options):
        #make sure all options are present
        if "recipient" not in options or "wager" not in options or "token" not in options or "challenger" not in options:
            return False

        #make sure sender has enough funds
        challenger = options["challenger"]
        #check if challenger is a bot, if so, get owner
        person_with_funds = challenger if "0x" in challenger else deps.botFactory.getOwner(challenger)
        is_person_with_funds_sender = person_with_funds == sender
        hasFunds = deps.accountManager.getBalance(person_with_funds, options["token"]) >= options["wager"]
        if not hasFunds or not is_person_with_funds_sender:
            return False
        #make sure not challenging yourself
        if sender == options["recipient"]:
            return False
        
        #create challenge
        recipient = options["recipient"]
        wager = options["wager"]
        token = options["token"]
        challengeId = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
        challenge = CreateChallenge(challenger, challengeId, timestamp, recipient, wager, token, challenger)
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
                type=notification.NotificationType.CHALLENGE_CREATED
            )
        )
        return True

    def accept(self, sender, timestamp, challengeId):
        #make sure challenge exists
        if not challengeId in self.challenges:
            return False
        
        #make sure sender has enough funds
        challenge = self.challenges[challengeId]
        acceptor = sender
        owner_sender = acceptor if "0x" in acceptor else deps.botFactory.getOwner(acceptor)
        hasFunds = deps.accountManager.getBalance(owner_sender, challenge["token"]) >= challenge["wager"]
        if not hasFunds or challenge["recipient"] != acceptor:
            return False

        #accept challenge if sender is recipient
        #then create game
        if challenge["recipient"] == sender:
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
            #create game
            p1 = challenge["challenger"]
            p2 = challenge["recipient"]
            wager = challenge["wager"]
            token = challenge["token"]
            p1IsBot = "0x" in p1
            p2IsBot = "0x" in p2
            onlyBot = p1IsBot and p2IsBot
            if onlyBot:
                deps.matchMaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "botId2": p2,
                    "token": token,
                    "wagerAmount": wager,
                })
            elif p1IsBot:
                deps.matchMaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "playerId": p2,
                    "token": token,
                    "wagerAmount": wager,
                })
            elif p2IsBot:
                deps.matchMaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p2,
                    "playerId": p1,
                    "token": token,
                    "wagerAmount": wager,
                })
            else:
                deps.matchMaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": False,
                    "players": [p1, p2],
                    "token": token,
                    "wagerAmount": wager,
                })
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
                    type=notification.NotificationType.CHALLENGE_DECLINED
                )
            )
            return True
        del self.challenges[challengeId]
        return False

    def getStringState(self):
        return str(self.offers)

    def getState(self):
        return self.challenges

