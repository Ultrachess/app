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

  switch (type) {
    case NotificationType.GAME_JOINED:
      title = `Someone joined your game`
      description = <>
        Player <Address value={notification.playerId} hoverable={true}  /> has joined your game <AddressGame id={notification.gameId} />
      </>;
      break;
    case NotificationType.GAME_MOVE:
      title = 'Someone made a move';
      description = <>
        <Address value={notification.playerId} hoverable={true}  /> has made a move in your game <AddressGame id={notification.gameId} />
      </>
      break;
    case NotificationType.GAME_COMPLETED:
      title = 'Game Completed';
      description = <>
        Game <AddressGame id={notification.gameId} /> has completed with <Address value={notification.playerId1} /> scoring {notification.score1} and <Address value={notification.playerId2} /> scoring {notification.score2}
        <Address value={notification.winningId} /> has won <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> and a pot of <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> has been rewarded to {notification.winningIdBettorCount} bettors on <Address value={notification.winningId} /> 
      </>
      break;
    case NotificationType.GAME_WAGER:
      title = 'Game Wager';
      let { wager, token } = notification;
      description = <>
        <Address value={notification.playerId} hoverable={true}  /> has wagered <AssetDisplay tokenAddress={token} balance={wager} isL2={true}/> in game <AddressGame id={notification.gameId} />
      </>;
      break;
    case NotificationType.GAME_BETTING_CLOSED:
      title = 'Game Betting Closed';
      description = <>
        Betting has closed in game <AddressGame id={notification.gameId} />
        </>;
      break;
    case NotificationType.CHALLENGE_ACCEPTED:
      title = 'Challenge accepted';
      description = <>
        Player <Address value={notification.recipient} hoverable={true}  /> has accepted your challenge. Join the game <AddressGame id={notification.gameId} />
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
        Player <Address value={notification.sender} /> has challenged you to a game wagering <AssetDisplay tokenAddress={notification.token} balance={notification.wager} isL2={true}/> <ChallengeAction challengeId={notification.challengeId} accept={true} /> or <ChallengeAction challengeId={notification.challengeId} accept={false} />
      </>
      break;
    case NotificationType.TOURNAMENT_JOINED:
      title = 'Tournament Joined';
      description = <>
        Player <Address value={notification.playerId} /> has joined tournament <AddressTournament id={notification.tournamentId} />
      </>
      break;
    case NotificationType.TOURNAMENT_COMPLETED:
      title = 'Tournament Completed';
      description = <>
        Tournament <AddressTournament id={notification.tournamentId} /> has completed
      </>
      break;
    case NotificationType.TOURNAMENT_MATCH_CREATED:
      title = 'Tournament Match Created';
      description = <>
        A match has been created in tournament <AddressTournament id={notification.tournamentId} /> between <Address value={notification.player1Id} /> and <Address value={notification.player2Id} />
      </>
      break;
    case NotificationType.TOURNAMENT_MATCH_COMPLETED:
      title = 'Tournament Match Completed';
      description = <>
        Player <Address value={notification.playerId1} /> has scored {notification.score1} and player <Address value={notification.playerId2} /> has scored {notification.score2} in tournament <AddressTournament id={notification.tournamentId} />
      </>
      break;
    case NotificationType.TOURNAMENT_ROUND_COMPLETED:
      title = 'Tournament Round Completed';
      description = <>
        Round {notification.roundNumber} has completed in tournament <AddressTournament id={notification.tournamentId} />
      </>
      break;
    case NotificationType.BOT_GAME_CREATED:
      title = 'Bot Game Created';
      description = <>
        Bot <Address value={notification.playerId1}/> is playing against bot <Address value={notification.playerId2}/> in game <AddressGame id={notification.gameId} /> for <AssetDisplay tokenAddress={notification.token} balance={notification.wager} isL2={true}/>
      </>
      break;
    case NotificationType.BOT_GAME_COMPLETED:
      title = 'Bot Game Completed';
      description = <>
        Bot game <AddressGame id={notification.gameId} /> has completed with <Address value={notification.playerId1} /> scoring {notification.score1} and <Address value={notification.playerId2} /> scoring {notification.score2}
        <Address value={notification.winningId} /> has won <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> and a pot of <AssetDisplay tokenAddress={notification.token} balance={notification.pot} isL2={true}/> has been rewarded to {notification.winningIdBettorCount} bettors on <Address value={notification.winningId} /> 
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
      <>
        <ToastTitle>id#{id} {title} at {timestamp}</ToastTitle>
        <ToastDescription asChild>
            {description}
        </ToastDescription>
        
      </>

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

  
  
  
  