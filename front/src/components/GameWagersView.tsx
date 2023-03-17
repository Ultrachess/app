//Takes in GameWagers interface type and renders a list of wagers use List component
//
import { truncateAddress } from "../ether/utils";
import { GameWagers } from "../state/game/types";
import Address from "./Address";
import AssetDisplay from "./AssetDisplay";
import ModalPlaceBet from "./modals/ModalPlaceBet";
import Button from "./ui/Button";
import Date from "./ui/Date";
import Flex from "./ui/Flex";
import List from "./ui/List";
import { Text } from "./ui/Text";

interface GameWagersViewProps {
  winningId: string | null;
  wagers: GameWagers;
  now: number;
  p1;
  p2: string;
  tokenAddress: string;
}

export default ({
  winningId,
  wagers,
  now,
  p1 = "undefined",
  p2 = "undefined",
  tokenAddress = "0x0000",
}: GameWagersViewProps) => {
  const { betsArray, totalPot, openTime, duration, gameId, pots } = wagers;
  const closed = now >= openTime + duration;
  const pots1 = pots ? pots[p1] / 10 ** 18 ?? 0 : 0;
  const pots2 = pots ? pots[p2] / 10 ** 18 ?? 0 : 0;
  const potsDraw = pots ? pots["draw"] ?? 0 : 0;
  const betItems = betsArray
    ? betsArray.map((bet, index) => {
        const { sender, timestamp, tokenAddress, amount, winningId } = bet;
        return (
          <Flex css={{ justifyContent: "flex-start" }} key={index}>
            <Address value={sender} /> &nbsp; placed &nbsp;{" "}
            <AssetDisplay
              balance={amount / 10 ** 18}
              tokenAddress={tokenAddress}
            />{" "}
            &nbsp; on &nbsp;
            <Address value={winningId} />
          </Flex>
        );
      })
    : [<Text key={0}>No bets found</Text>];

  return (
    <Flex css={{ flexDirection: "column", gap: 2 }}>
      {winningId && (
        <Text green>
          Winner: <Address value={winningId} />
        </Text>
      )}
      <Flex css={{ justifyContent: "space-between" }}>
        <Flex css={{ justifyContent: "space-between", gap: 50 }}>
          <Flex css={{ flexDirection: "column", gap: 1 }}>
            <Text bold>Total Pot</Text>
            <Text>{totalPot / 10 ** 18}</Text>
          </Flex>
          <Flex css={{ flexDirection: "column", gap: 1 }}>
            <Text bold>Pot on {truncateAddress(p1)}</Text>
            <Text>
              {<AssetDisplay balance={pots1} tokenAddress={tokenAddress} />}
            </Text>
          </Flex>
          <Flex css={{ flexDirection: "column", gap: 1 }}>
            <Text bold>Pot on {truncateAddress(p2)}</Text>
            <Text>
              {<AssetDisplay balance={pots2} tokenAddress={tokenAddress} />}
            </Text>
          </Flex>
          <Flex css={{ flexDirection: "column", gap: 1 }}>
            <Text bold>Pot on DRAW</Text>
            <Text>
              {<AssetDisplay balance={potsDraw} tokenAddress={tokenAddress} />}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex css={{ flexdirection: "column", gap: 5 }}>
        <Text bold>Bets placed</Text>
        <List items={betItems} />
      </Flex>
    </Flex>
  );
};
