import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, slate, green } from '@radix-ui/colors';
import { Notification, NotificationType } from '../state/notifications/notifications';
import { useWeb3React } from '@web3-react/core';
import Address from './Address';
import AddressGame from './AddressGame';
import AssetDisplay from './AssetDisplay';
import ChallengeAction from './HandleChallenge';
import AddressTournament from './AddressTournament';
import ActionItem from './ActionItem';
import { useUserBotIds } from '../state/game/hooks';

export default ({ notification }: {notification: Notification}) => {
  const { id, timestamp, type } = notification;
  const { account } = useWeb3React();

  let title = '';
  let description = <></>;

  console.log("abc notification in item: ", notification.type)
  let newType = notification.type
  switch (newType ) {
    case NotificationType.GAME_CREATED:
      console.log("abc game created", notification["creator_id"])
      title = 'Game Created';
      description = <div>
        Player <Address value={notification["creator_id"]}  /> has created a game <AddressGame id={notification["game_id"]} />
      </div>
      break;
    case NotificationType.GAME_JOINED:
      title = `Someone joined your game`
      description = <>
        Player <Address value={notification["player_id"]}  /> has joined your game <AddressGame id={notification["game_id"]} />
      </>;
      break;
    case NotificationType.GAME_MOVE:
      title = 'Someone made a move';
      description = <>
        <Address value={notification["player_id"]}   /> has made a move in your game <AddressGame id={notification["game_id"]} />
      </>
      break;
    case NotificationType.GAME_COMPLETED:
      title = 'Game Completed';
      description = <>
        Game <AddressGame id={notification["game_id"]} /> has completed with <Address value={notification["player_id1"]} /> scoring {notification.score1} and <Address value={notification["player_id2"]} /> scoring {notification.score2}
        <Address value={notification.winningId} /> has won <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> and a pot of <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> has been rewarded to {notification.winningIdBettorCount} bettors on <Address value={notification.winningId} /> 
      </>
      break;
    case NotificationType.GAME_WAGER:
      title = 'Game Wager';
      let wager = notification["wager"]
      let token = notification["token"]
      description = <>
        <Address value={notification["player_id"]} hoverable={true}  /> has wagered <AssetDisplay tokenAddress={token} balance={wager} isL2={true}/> in game <AddressGame id={notification["game_id"]} />
      </>;
      break;
    case NotificationType.GAME_BETTING_CLOSED:
      title = 'Game Betting Closed';
      description = <>
        Betting has closed in game <AddressGame id={notification["game_id"]} />
        </>;
      break;
    case NotificationType.CHALLENGE_ACCEPTED:
      title = 'Challenge accepted';
      description = <>
        Player <Address value={notification.recipient} hoverable={true}  /> has accepted your challenge. Join the game <AddressGame id={notification["game_id"]} />
      </>
      break;
    case NotificationType.CHALLENGE_DECLINED:
      title = 'Challenge declined';
      description = <>
        Player <Address value={notification.recipient} /> has declined your challenge id#{notification.challengeId}. Too bad bro!
      </>
      break;
    case NotificationType.CHALLENGE_CREATED:
      title = 'Challenge Recieved';
      description = <>
        Player <Address value={notification.sender} /> has challenged you to a game wagering <AssetDisplay tokenAddress={notification.token} balance={notification.wager} isL2={true}/> <ChallengeAction challengeId={notification["challenge_id"]} accept={true} /> or <ChallengeAction challengeId={notification["challenge_id"]} accept={false} />
      </>
      break;
    case NotificationType.TOURNAMENT_JOINED:
      title = 'Tournament Joined';
      description = <>
        Player <Address value={notification["player_id"]} /> has joined tournament <AddressTournament id={notification["tournament_id"]} />
      </>
      break;
    case NotificationType.TOURNAMENT_COMPLETED:
      title = 'Tournament Completed';
      description = <>
        Tournament <AddressTournament id={notification["tournament_id"]} /> has completed
      </>
      break;
    case NotificationType.TOURNAMENT_MATCH_CREATED:
      title = 'Tournament Match Created';
      description = <>
        A match has been created in tournament <AddressTournament id={notification["tournament_id"]} /> between <Address value={notification["player_id1"]} /> and <Address value={notification["player_id2"]} />
      </>
      break;
    case NotificationType.TOURNAMENT_MATCH_COMPLETED:
      title = 'Tournament Match Completed';
      description = <>
        Player <Address value={notification["player_id1"]} /> has scored {notification.score1} and player <Address value={notification["player_id2"]} /> has scored {notification.score2} in tournament <AddressTournament id={notification["tournament_id"]} />
      </>
      break;
    case NotificationType.TOURNAMENT_ROUND_COMPLETED:
      title = 'Tournament Round Completed';
      description = <>
        Round {notification["tournament_id"]} has completed in tournament <AddressTournament id={notification["tournament_id"]} />
      </>
      break;
    case NotificationType.BOT_GAME_CREATED:
      title = 'Bot Game Created';
      description = <>
        Bot <Address value={notification["player_id1"]}/> is playing against bot <Address value={notification["player_id2"]}/> in game <AddressGame id={notification["game_id"]} /> for <AssetDisplay tokenAddress={notification.token} balance={notification.wager} isL2={true}/>
      </>
      break;
    case NotificationType.BOT_GAME_COMPLETED:
      title = 'Bot Game Completed';
      description = <>
        Bot game <AddressGame id={notification["game_id"]} /> has completed with <Address value={notification["player_id1"]} /> scoring {notification.score1} and <Address value={notification["player_id2"]} /> scoring {notification.score2}
        <Address value={notification["winningId"]} /> has won <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> and a pot of <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> has been rewarded to {notification.winningIdBettorCount} bettors on <Address value={notification.winningId} /> 
      </>
      break;
    case NotificationType.BOT_OFFER_CREATED:
      title = 'Bot Offer Received';
      description = <>
        Player <Address value={notification.sender} /> has offered to purchase your bot <Address value={notification.botId} /> for <AssetDisplay tokenAddress={notification.token} balance={notification.price} isL2={true}/>
      </>
      break;
    case NotificationType.BOT_OFFER_ACCEPTED:
      title = 'Bot Offer Accepted';
      description = <>
        Player <Address value={notification.owner} /> has accepted your offer to purchase bot <Address value={notification.botId} />
        for <AssetDisplay tokenAddress={notification.token} balance={notification.price} isL2={true}/>
        Bot <Address value={notification.botId} /> has been transferred to <Address value={notification.sender} />
      </>
      break;
    case NotificationType.BOT_OFFER_DECLINED:
      title = 'Bot Offer Declined';
      description = <>
        Player <Address value={notification.owner} /> has declined your offer to purchase bot <Address value={notification.botId} />
        for <AssetDisplay tokenAddress={notification.token} balance={notification.price} isL2={true}/>
      </>
      break;
    case NotificationType.ACTION:
      title = 'Action';
      description = <ActionItem actionId={notification.actionId} />
      break;


  }

  return (
      <div style={{
        border: '1px solid #ccc',
      }}>
        <ToastTitle>id#{id} {title} at {timestamp}</ToastTitle>
        <ToastDescription asChild>
            {description}
        </ToastDescription>
        
      </div>

  );
};


const ToastTitle = styled(Toast.Title, {
  gridArea: 'title',
  marginBottom: 5,
  fontWeight: 500,
  color: slate.slate12,
  fontSize: 15,
});

const ToastDescription = styled(Toast.Description, {
  gridArea: 'description',
  margin: 0,
  color: slate.slate11,
  fontSize: 13,
  lineHeight: 1.3,
});

  
  
  
  