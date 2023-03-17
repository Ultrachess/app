import { Button, Card, Col, Divider, Row } from "@nextui-org/react";
import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { useMatch, useParams } from "react-router-dom";

import { USDC_ADDRESS_ON_NETWORKS } from "../ether/chains";
import { useProfile } from "../state/game/hooks";
import { UserProfile } from "../state/game/types";
import { useAppSelector } from "../state/hooks";
import GameList from "./list/GameList";
import ModalManageBot from "./modals/ModalManageBot";
import Address from "./Address";
import AssetDisplay from "./AssetDisplay";
import BotListView from "./list/BotList";
import ChallengesList from "./list/ChallengesList";
import ModalCreateChallenge from "./modals/ModalCreateChallenge";
import OffersList from "./OffersList";
import Date from "./ui/Date";
import Flex from "./ui/Flex";
import List from "./ui/List";
import { Text } from "./ui/Text";

export default () => {
  const { userId } = useParams();
  //console.log(userId)
  const { account, chainId } = useWeb3React();
  const {
    id,
    name,
    avatar,
    elo,
    games,
    nationality,
    challenges,
    bots,
    balances,
  }: any = useProfile(userId);

  const activeGames = games ? games.filter((game) => game.isEnd === false) : [];
  const pastGames = games ? games.filter((game) => game.isEnd === true) : [];

  const isYou =
    account?.toLowerCase() === id?.toLowerCase() ||
    account?.toLowerCase() === name?.toLowerCase();

  const balance = balances.length > 0 ? balances[0].amount : 0;
  const tokenAddress =
    balances.length > 0 ? balances[0].token : USDC_ADDRESS_ON_NETWORKS[chainId];
  return (
    <div className="body">
      <Flex
        css={{
          width: "100%",
          padding: "0 20%",
          gap: 50,
          justifyContent: "space-between",
        }}
      >
        <Flex css={{ gap: 20, width: "20%", flexDirection: "column', alignItems:'start" }}>
          <Address value={id} isImageBig={true} />
          <Flex css={{ gap: 2, flexDirection: "column" }}>
            {isYou && <Text bold>Your profile</Text>}
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column', alignItems:'start" }}>
            <Text size={"2"} bold>Elo</Text>
            <Text>{elo}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column', alignItems:'start" }}>
            <Text size={"2"} bold>From</Text>
            <Text>🇦🇺🇱🇸 USA</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems:'start'}}>
            <Text size={"2"} bold >Balance</Text>
            <AssetDisplay balance={balance} tokenAddress={tokenAddress} />
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column" , alignItems:'start'}}>
            <Text size={"2"} bold>Bots owned </Text>
            <Text>{bots.length}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column" , alignItems:'start'}}>
            <Text size={"2"} bold >Games played</Text>
            <Text>{games.length}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems:'start'}}>
            <Text size={"2"} bold >Open challenges</Text>
            <Text>{challenges.length}</Text>
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "row" }}>
            {!isYou && (
              <ModalCreateChallenge
                playerId={id}
                triggerElement={<Button>Challenge</Button>}
              />
            )}
          </Flex>
        </Flex>
        <Flex css={{ gap: 20, width: "75%", flexDirection: "column" }}>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text size={"4"} bold black>
              Active games
            </Text>
            <GameList games={activeGames} />
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text size={"4"} bold black>
              Past games
            </Text>
            <GameList games={pastGames} />
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text size={"4"} bold black>
              Open Challenges
            </Text>
            <ChallengesList account={account} challenges={challenges} />
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text size={"4"} bold black>
              Owned bots
            </Text>
            <BotListView bots={bots} />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
