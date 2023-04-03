/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { BotOffer } from "../state/game/types";
import Address from "./Address";
import AssetDisplay from "./AssetDisplay";
import HandleOffer from "./HandleOffer";
import Date from "./ui/Date";
import List from "./ui/List";
import Table from "./ui/Table";
import { Text } from "./ui/Text";

const columns = ["id", "botId", "owner", "sender", "price", "timestamp"];

const BotOfferListItem = ({
  account,
  offer,
}: {
  account: string;
  offer: BotOffer;
}) => {
  const { offerId, botId, owner, sender, price, token, timestamp } = offer;
  //console.log("offer list item: ")
  //console.log(offer)

  const isOwner = account.toLowerCase() === owner.toLowerCase();

  return (
    <Text css={{ display: "flex", gap: "10px", alignItems: "end" }}>
      <span>
        <Address value={sender} hoverable={true} />
      </span>{" "}
      offered <AssetDisplay balance={price / 10 ** 18} tokenAddress={token} />{" "}
      for bot <Address value={botId} hoverable={true} /> at{" "}
      <Date current={timestamp} />
      {isOwner ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
          <HandleOffer offerId={offerId} accept={true} /> or{" "}
          <HandleOffer offerId={offerId} accept={false} />
        </div>
      ) : null}
    </Text>
  );
};

export default ({
  account,
  offers,
}: {
  account: string;
  offers: BotOffer[];
}) => {
  const offerItems =
    offers.length > 0
      ? offers.map((offer) => {
          const { offerId, botId, owner, sender, price, token, timestamp } =
            offer;
          const isOwner = account?.toLowerCase() === owner?.toLowerCase();
          return [
            offerId,
            <Address value={botId} hoverable={true} />,
            <Address value={owner} hoverable={true} />,
            <Address value={sender} hoverable={true} />,
            <AssetDisplay balance={price / 10 ** 18} tokenAddress={token} />,
            <Date current={timestamp} />,
            isOwner ? (
              <div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
                <HandleOffer offerId={offerId} accept={true} /> or{" "}
                <HandleOffer offerId={offerId} accept={false} />
              </div>
            ) : (
              ""
            ),
          ];
        })
      : [];

  return <Table columns={columns} rows={offerItems} />;
};
