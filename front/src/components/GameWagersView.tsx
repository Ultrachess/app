//Takes in GameWagers interface type and renders a list of wagers use List component
//
import { GameWagers } from '../state/game/types';
import { Text } from './ui/Text';
import Button from './ui/Button';
import Address from './Address';
import ModalPlaceBet from './ModalPlaceBet';
import List from './ui/List';
import Flex from './ui/Flex';
import Date from './ui/Date';
import AssetDisplay from './AssetDisplay';

interface GameWagersViewProps {
    winningId: string|null;
    wagers: GameWagers;
    now: number;
}

export default ({ winningId, wagers, now }: GameWagersViewProps) => {
    const { betsArray, totalPot, openTime, duration, gameId } = wagers;
    const closed = now >= openTime + duration;

    const betItems = betsArray.map((bet, index) => {
        const { sender, timestamp, tokenAddress, amount, winningId} = bet;
        return <Text key={index}><Address value={sender}/> placed <AssetDisplay balance={amount} tokenAddress={tokenAddress}/> on <Address value={winningId}/> at <Date current={timestamp} /></Text>
    })

    return (
        <Flex css={{ flexDirection: 'column', gap: 2 }}>
            {winningId && <Text green>Winner: <Address value={winningId} /></Text>}
            <Flex css={{ justifyContent: 'space-between' }}>
                <Flex css={{ flexDirection: 'column', gap: 1 }}>
                    <Text faded>Total Pot</Text>
                    <Text>{totalPot}</Text>
                </Flex>
                <Flex css={{ flexDirection: 'column', gap: 1 }}>
                    {closed ? <Text faded>Wagering Closed</Text> : <Text faded>Wagering closes on <Date current={openTime + duration} /></Text>}
                    <ModalPlaceBet
                        gameId={gameId}
                        triggerElement={
                            <Button disabled={closed}>Place Bet</Button>
                        } 
                    />
                </Flex>
                
            </Flex>
            <List
                items={betItems}
                emptyMessage="No bets placed yet"
            />
        </Flex>

    )
}
