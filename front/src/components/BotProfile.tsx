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
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../ether/chains";
import { truncateAddress } from "../ether/utils";
import { useAllBots } from "../state/game/hooks";
import { setCreateChallengeModal, setCreateChallengeModalAddress, setCreateOfferAddress, setCreateOfferAmount, setCreateOfferModal } from "../state/ui/reducer";
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

  const dispatch = useDispatch();

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
    <div className="min-h-full">
      <header aria-label="Page Header" className="mt-10 bg-white-50">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-left sm:text-left">
              <h1 className="text-5xl items-center font-bold text-gray-900 sm:text-6xl">
                <Address value={id} isImageBig={true} />
              </h1>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                      clip-rule="evenodd"
                    />
                    <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                  </svg>
                   {isOwner ? "You" : truncateAddress(owner)
                   } &nbsp; Owner
                </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                      clip-rule="evenodd"
                    />
                    <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                  </svg>
                  {elo} Elo
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {nationality} Nationality
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {autoBattleEnabled ? 'Enabled' : 'Disabled'}
                  &nbsp; Auto Battle
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                    <AssetDisplay balance={autoMaxWagerAmount} tokenAddress={token} />
                  &nbsp; Auto Wager Amount
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {games.length} Games
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              {isOwner && (
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                  type="button"
                  onClick={() => {
                  }}
                >
                  <span className="text-sm font-medium"> Manage Bot </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1.5 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              )}

              

              {isOwner && (
                <button
                  className="block rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring"
                  type="button"
                  onClick={() => {
                  }}
                >
                  Sell
                </button>
              )}

              {!isOwner && (
                <button
                  className="block rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring"
                  type="button"
                  onClick={() => {
                    dispatch(setCreateOfferAddress(botId))
                    dispatch(setCreateOfferAmount(0))
                    dispatch(setCreateOfferModal(true))
                  }}
                >
                  Offer
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="my-5">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Offers
              </h1>
            </div>
            <OffersList offers={offers} account={account} />
          </div>
          <div className="my-5">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Active games
              </h1>
            </div>
            <GameList games={activeGames} />
          </div>
          <div className="my-20">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Finished games
              </h1>
            </div>
            <GameList games={pastGames} />
          </div>
          <div className="my-20">
            <div className="contentHeader">
              <h1 className="text-xl items-center font-bold text-gray-900 sm:text-2xl">
                Challenges
              </h1>
            </div>
            <ChallengesList challenges={challenges} account={account} />
          </div>
        </div>
      </main>
    </div>
    // <div className="body">
    //   <Flex
    //     css={{
    //       width: "100%",
    //       padding: "0 20%",
    //       gap: 50,
    //       justifyContent: "space-between",
    //     }}
    //   >
    //     <Flex css={{ width: "20%", gap: 10, flexDirection: "column" }}>
    //       <Address value={id} isImageBig={true} />
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Name</Text>
    //         <Text>{name}</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Owner</Text>
    //         {isOwner ? <Text bold>Yours</Text> : <Address value={owner} />}
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Elo</Text>
    //         <Text>{elo}</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>From</Text>
    //         <Text>🇺🇸 USA</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Current Price</Text>
    //         {highestOffer === undefined ? (
    //           <Text>0</Text>
    //         ) : (
    //           <AssetDisplay
    //             balance={highestOffer / 10 ** 18}
    //             tokenAddress={token}
    //             isL2={true}
    //           />
    //         )}
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Created at</Text>
    //         <Date current={timestamp * 1000} />
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Games played</Text>
    //         <Text>{games.length}</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Challenges recieved</Text>
    //         <Text>{challenges.length}</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Offers recieved</Text>
    //         <Text>{offers.length}</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Auto battle enabled</Text>
    //         <Text>{autoBattleEnabled ? "yes" : "no"}</Text>
    //       </Flex>
    //       <Flex css={{ gap: 2, flexDirection: "column", alignItems: "start" }}>
    //         <Text bold>Auto max wager amount</Text>
    //         <AssetDisplay
    //           balance={autoMaxWagerAmount / 10 ** 18}
    //           tokenAddress={autoWagerTokenAddress}
    //           isL2={true}
    //         />
    //       </Flex>
    //     </Flex>
    //     <Flex css={{ width: "75%", gap: 20, flexDirection: "column" }}>
    //       <Flex css={{ gap: 5, flexDirection: "row", justifyContent: "right" }}>
    //         {isOwner && (
    //           <ModalManageBot
    //             botId={botId}
    //             triggerElement={<Button>Manage</Button>}
    //           />
    //         )}
    //         {!isOwner && (
    //           <ModalCreateChallenge
    //             playerId={botId}
    //             triggerElement={<Button>Challenge</Button>}
    //           />
    //         )}
    //         {!isOwner && (
    //           <ModalCreateOffer
    //             botId={botId}
    //             triggerElement={<Button>Offer</Button>}
    //           />
    //         )}
    //       </Flex>
    //       <Flex css={{ gap: 1, flexDirection: "column" }}>
    //         <Text bold size={"4"}>
    //           Active games
    //         </Text>
    //         <GameList games={activeGames} />
    //       </Flex>
    //       <Flex css={{ gap: 1, flexDirection: "column" }}>
    //         <Text bold size={"4"}>
    //           Past games
    //         </Text>
    //         <GameList games={pastGames} />
    //       </Flex>
    //       <Flex css={{ gap: 1, flexDirection: "column" }}>
    //         <Text bold size={"4"}>
    //           Challenges
    //         </Text>
    //         <ChallengesList account={account} challenges={challenges} />
    //       </Flex>
    //       <Flex css={{ gap: 1, flexDirection: "column" }}>
    //         <Text bold size={"4"}>
    //           Offers
    //         </Text>
    //         <OffersList account={account} offers={offers} />
    //       </Flex>
    //     </Flex>
    //   </Flex>
    // </div>
  );
};
