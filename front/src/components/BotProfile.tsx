/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Button } from "@nextui-org/react";
import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { useParams } from "react-router-dom";

import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../ether/chains";
import { useAllBots } from "../state/game/hooks";
import Address from "./Address";
import AssetDisplay from "./AssetDisplay";
import ChallengesList from "./list/ChallengesList";
import GameList from "./list/GameList";
import ModalCreateChallenge from "./modals/ModalCreateChallenge";
import ModalCreateOffer from "./modals/ModalCreateOffer";
import ModalManageBot from "./modals/ModalManageBot";
import OffersList from "./OffersList";
import Date from "./ui/Date";
import Flex from "./ui/Flex";
import { Text } from "./ui/Text";

export default () => {
  const { botId } = useParams();
  const { chainId } = useWeb3React();
  const { account } = useWeb3React();

  const allBots = useAllBots();

  const profile = React.useMemo(() => {
    return (
      allBots.find((val) => val.id.toLowerCase() == botId.toLowerCase()) ?? {
        id: "",
        name: "",
        avatar: "",
        elo: 0,
        games: [],
        nationality: "",
        challenges: [],
        owner: "",
        offers: [],
        autoBattleEnabled: true,
        autoMaxWagerAmount: 0,
        autoWagerTokenAddress: "",
        timestamp: 0,
      }
    );
  }, [allBots]);

  const {
    id,
    name,
    avatar,
    elo,
    games,
    nationality,
    challenges,
    owner,
    offers,
    autoBattleEnabled,
    autoMaxWagerAmount,
    autoWagerTokenAddress,
    timestamp,
  } = profile;

  const activeGames = games ? games.filter((game) => game.isEnd === false) : [];
  const pastGames = games ? games.filter((game) => game.isEnd === true) : [];

  //get highest offer price
  const highestOffer = React.useMemo(() => {
    let highestOfferTemp = 0;
    //console.log("reducing offers")
    //console.log(offers)
    if (offers && offers.length > 0) {
      highestOfferTemp = offers?.reduce((prev, current) =>
        prev.price > current.price ? prev : current
      ).price;
    }
    return highestOfferTemp;
  }, [offers]);

  const token = STABLECOIN_ADDRESS_ON_NETWORKS[chainId];
  const isOwner = account?.toLowerCase() === owner?.toLowerCase();
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
        <Flex css={{ width: "20%", gap: 10, flexDirection: "column" }}>
          <Address value={id} isImageBig={true} />
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Name</Text>
            <Text>{name}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Owner</Text>
            {isOwner ? <Text bold>Yours</Text> : <Address value={owner} />}
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Elo</Text>
            <Text>{elo}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>From</Text>
            <Text>🇺🇸 USA</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Current Price</Text>
            {highestOffer === undefined ? (
              <Text>0</Text>
            ) : (
              <AssetDisplay
                balance={highestOffer / 10 ** 18}
                tokenAddress={token}
                isL2={true}
              />
            )}
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Created at</Text>
            <Date current={timestamp * 1000} />
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Games played</Text>
            <Text>{games.length}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Challenges recieved</Text>
            <Text>{challenges.length}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Offers recieved</Text>
            <Text>{offers.length}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Auto battle enabled</Text>
            <Text>{autoBattleEnabled ? "yes" : "no"}</Text>
          </Flex>
          <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
            <Text bold>Auto max wager amount</Text>
            <AssetDisplay
              balance={autoMaxWagerAmount / 10 ** 18}
              tokenAddress={autoWagerTokenAddress}
              isL2={true}
            />
          </Flex>
        </Flex>
        <Flex css={{ width: "75%", gap: 20, flexDirection: "column" }}>
          <Flex css={{ gap: 5, flexDirection: "row", justifyContent: "right" }}>
            {isOwner && (
              <ModalManageBot
                botId={botId}
                triggerElement={<Button>Manage</Button>}
              />
            )}
            {!isOwner && (
              <ModalCreateChallenge
                playerId={botId}
                triggerElement={<Button>Challenge</Button>}
              />
            )}
            {!isOwner && (
              <ModalCreateOffer
                botId={botId}
                triggerElement={<Button>Offer</Button>}
              />
            )}
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text bold size={"4"}>
              Active games
            </Text>
            <GameList games={activeGames} />
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text bold size={"4"}>
              Past games
            </Text>
            <GameList games={pastGames} />
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text bold size={"4"}>
              Challenges
            </Text>
            <ChallengesList account={account} challenges={challenges} />
          </Flex>
          <Flex css={{ gap: 1, flexDirection: "column" }}>
            <Text bold size={"4"}>
              Offers
            </Text>
            <OffersList account={account} offers={offers} />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
