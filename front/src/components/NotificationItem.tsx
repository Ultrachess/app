import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, slate, green } from '@radix-ui/colors';
import { Notification, NotificationType } from '../state/notifications/notifications';
import { useWeb3React } from '@web3-react/core';
import Address from './Address';
import AddressGame from './AddressGame';
import AssetDisplay from './AssetDisplay';
import ChallengeAction from './ChallengeAction';
import AddressTournament from './AddressTournament';

export default ({ notification }: {notification: Notification}) => {
  const { id, timestamp, type } = notification;
  const { account } = useWeb3React();
  let title = '';
  let description = <></>;

  switch (type) {
    case NotificationType.GAME_JOINED:
      title = `Someone joined your game`
      description = <>
        Player <Address value={notification.playerId} /> has joined your game <AddressGame id={notification.gameId} />
      </>;
      break;
    case NotificationType.GAME_MOVE:
      title = 'Someone made a move';
      description = <>
        Player <Address value={notification.playerId} /> has made a move in your game <AddressGame id={notification.gameId} />
      </>
      break;
    case NotificationType.GAME_COMPLETED:
      title = 'Game Completed';
      let score = notification.score;
      description = <>
        {score > 0.5 ? 'You won' : score < 0.5 ? 'You lost' : 'You had a draw'} in game <AddressGame id={notification.gameId} /> against <Address value={notification.opponentId} />
      </>
      break;
    case NotificationType.GAME_WAGER:
      title = 'Game Wager';
      let { wager, token } = notification;
      description = <>
        <Address value={notification.playerId} /> has wagered <AssetDisplay tokenAddress={token} balance={wager} isL2={true}/> in game <AddressGame id={notification.gameId} />
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
        Player <Address value={notification.playerId} /> has accepted your challenge. Join the game <AddressGame id={notification.gameId} />
      </>
      break;
    case NotificationType.CHALLENGE_DECLINED:
      title = 'Challenge declined';
      description = <>
        Player <Address value={notification.playerId} /> has declined your challenge. Too bad bro!
      </>
      break;
    case NotificationType.CHALLENGE_RECIEVED:
      title = 'Challenge Recieved';
      description = <>
        Player <Address value={notification.playerId} /> has challenged you to a game wagering <AssetDisplay tokenAddress={notification.token} balance={notification.wager} isL2={true}/> <ChallengeAction accept={true} /> or <ChallengeAction accept={false} />
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
        Player <Address value={notification.player1Id} /> has scored {notification.player1Score} and player <Address value={notification.player2Id} /> has scored {notification.player2Score} in tournament <AddressTournament id={notification.tournamentId} />
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
      description = 'A bot game has been created';
      break;
    case NotificationType.BOT_GAME_COMPLETED:
      title = 'Bot Game Completed';
      description = 'A bot game has been completed';
      break;
    case NotificationType.BOT_JOINED_TOURNAMENT:
      title = 'Bot Joined Tournament';
      description = 'A bot has joined a tournament';
      break;
    case NotificationType.BOT_TOURNAMENT_MATCH_COMPLETED:
      title = 'Bot Tournament Match Completed';
      description = 'A bot has completed a tournament match';
      break;
    case NotificationType.BOT_TOURNAMENT_ROUND_COMPLETED:
      title = 'Bot Tournament Round Completed';
      description = 'A bot has completed a tournament round';
      break;
    case NotificationType.BOT_TOURNAMENT_COMPLETED:
      title = 'Bot Tournament Completed';
      description = 'A bot has completed a tournament';
      break;
    case NotificationType.BOT_OFFER_RECEIVED:
      title = 'Bot Offer Received';
      description = 'A bot has sent you an offer';
      break;
    case NotificationType.BOT_OFFER_ACCEPTED:
      title = 'Bot Offer Accepted';
      description = 'A bot has accepted your offer';
      break;
    case NotificationType.BOT_OFFER_DECLINED:
      title = 'Bot Offer Declined';
      description = 'Owner declined your offer to purchase bot # $botId';
      break;
  }

  return (
      <>
        <ToastTitle>id#{id} {title}</ToastTitle>
        <ToastDescription asChild>
            {description} at {timestamp}
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

  
  
  
  