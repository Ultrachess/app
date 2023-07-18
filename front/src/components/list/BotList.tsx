/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { TransactionType } from "../../common/types";
import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { useToken } from "../../hooks/token";
import { useActionCreator } from "../../state/game/hooks";
import { BotProfile } from "../../state/game/types";
import {
  setCreateOfferAddress,
  setCreateOfferAmount,
  setCreateOfferModal,
} from "../../state/ui/reducer";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import DateDisplay from "../ui/Date";
import List from "../ui/List";
import Table from "../ui/Table";
import { Text } from "../ui/Text";
import BotListItem from "./BotListItem";

const columns = [
  "#",
  "id",
  "owner",
  "elo",
  "nationality",
  "autoBattle",
  "autoWagerAmount",
  "offers",
  "price",
  "created",
];

const getHighestOffer = (offers) => {
  if (offers.length === 0) return 0;
  const highestOffer = offers.map((offer) => offer.price).reduce((a, b) => Math.max(a, b));
  return highestOffer;
};

const BotList = ({ bots, showRank }) => {
  const { chainId, account } = useWeb3React();
  const token = useToken(STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);
  const addAction = useActionCreator();
  const dispatch = useDispatch();
  const [isBuying, setIsBuying] = useState(false);
  const botItems = bots.map((bot, index) => {
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
      price,
    } = bot;
    const isOwner = account?.toLowerCase() === owner?.toLowerCase();
    

    const handleBuyNow = async () => {
      try {
        setIsBuying(true);
        const [approvalActionId, wait] = await addAction({
          type: TransactionType.CREATE_OFFER,
          botId: id,
          tokenAddress: token.address,
          price: price * 10 ** token.decimals,
        });
        if (!approvalActionId) {
          setIsBuying(false);
          return;
        }
        await wait;
      } catch (error) {
        console.error("Error occurred while buying:", error);
      } finally {
        setIsBuying(false);
      }
    };

    const buyNowText = isBuying ? "Buying..." : "Buy Now";
    //const highestOffer = getHighestOffer(offers);

    return [
      index + 1,
      <Address value={id} toShow={name} hoverable={true} />,
      <Address value={owner} hoverable={true} />,
      elo,
      nationality,
      autoBattleEnabled ? "yes" : "no",
      <AssetDisplay
        balance={autoMaxWagerAmount/10**token.decimals}
        tokenAddress={token.address}
      />,
      <>
        {!isOwner ? (
          <button
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring gap-2"
          type="button"
            onClick={() => {
              dispatch(setCreateOfferAddress(id));
              dispatch(setCreateOfferAmount(0));
              dispatch(setCreateOfferModal(true));
            }}
          >
            <span>Make Offer</span>
            <span className="text-underline"
            >{offers.length}</span>
          </button>
        ) : (
          <>{offers.length}</>
        )}
      </>,
      <>
        {price > 0 && !isOwner ? (
          <button
            className="flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring gap-2"
            type="button"
            onClick={handleBuyNow}
            disabled={isBuying}
          >
            <div>{buyNowText}</div>
            <div className="border-bottom"><AssetDisplay balance={price} tokenAddress={token.address} /></div>
          </button>
        ) : (
          <Badge color={"blue"} value={price > 0 ? <AssetDisplay balance={price} tokenAddress={token.address} /> : "Not for sale"} />
        )}
      </>,
      <DateDisplay current={timestamp * 1000} />,
    ].slice(showRank ? 0 : 1);
    });

return (
<Table columns={showRank ? columns : columns.slice(1)} rows={botItems} />
);
};

export default BotList;


    
