import deps
import random
import string
import logging
import time
from notification import send_notification, ChallengeCreatedNotification, ChallengeAcceptedNotification, ChallengeDeclinedNotification

def CreateChallenge(sender, challengeId, timestamp, recipient, wager, token):
    return {
        "challengeId": challengeId,
        "timestamp": timestamp,
        "sender": sender,
        "recipient": recipient,
        "wager": wager,
        "token": token,
    }

#Create challenge manager class
class ChallengeManager:
    def __init__(self, db):
        self.challenges = {}

    def create(self, sender, timestamp, options):
        if "recipient" not in options or "wager" not in options or "token" not in options:
            return False

        owner_sender = sender if "0x" in sender else deps.botFactory.getOwner(sender)
        hasFunds = deps.accountManager.getBalance(owner_sender, options["token"]) >= options["wager"]
        if not hasFunds:
            return False
        
        recipient = options["recipient"]
        wager = options["wager"]
        token = options["token"]
        challengeId = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
        challenge = CreateChallenge(sender, challengeId, timestamp, recipient, wager, token)
        self.challenges[challengeId] = challenge
        send_notification(
            ChallengeCreatedNotification(
                timestamp=timestamp,
                challenge_id=challengeId,
                sender=sender,
                recipient=recipient,
                wager=wager,
                token=token,
            )
        )
        return True

    def accept(self, sender, timestamp, challengeId):
        challenge = self.challenges[challengeId]
        owner_sender = challenge["sender"] if "0x" in challenge["sender"] else deps.botFactory.getOwner(sender)
        hasFunds = deps.accountManager.getBalance(owner_sender, challenge["token"]) >= challenge["wager"]
        if not hasFunds or challenge["recipient"] != sender:
            return False

        if challenge["recipient"] == sender:
            send_notification(
                ChallengeAcceptedNotification(
                    timestamp=timestamp,
                    challenge_id=challengeId,
                    sender=challenge["sender"],
                    recipient=challenge["recipient"],
                    wager=challenge["wager"],
                    token=challenge["token"],
                )
            )
            #create game
            p1 = challenge["sender"]
            p2 = challenge["recipient"]
            wager = challenge["wager"]
            token = challenge["token"]
            p1IsBot = "0x" in p1
            p2IsBot = "0x" in p2
            onlyBot = p1IsBot and p2IsBot
            if onlyBot:
                deps.matchmaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "botId2": p2,
                    "token": token,
                    "wagerAmount": wager,
                })
            elif p1IsBot:
                deps.matchmaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "playerId": p2,
                    "token": token,
                    "wagerAmount": wager,
                })
            elif p2IsBot:
                deps.matchmaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p2,
                    "playerId": p1,
                    "token": token,
                    "wagerAmount": wager,
                })
            else:
                deps.matchmaker.create(sender, timestamp, {
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
            send_notification(
                ChallengeDeclinedNotification(
                    timestamp=timestamp,
                    challenge_id=challengeId,
                    sender=challenge["sender"],
                    recipient=challenge["recipient"],
                    wager=challenge["wager"],
                    token=challenge["token"],
                )
            )
            return True
        del self.challenges[challengeId]
        return False

    def getStringState(self):
        return str(self.offers)

    def getState(self):
        return self.offers

