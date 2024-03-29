/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Table, Text } from "@nextui-org/react";

import { useAppSelector } from "../state/hooks";
import Address from "./Address";

export default ({ users }) => {
  const allElos = useAppSelector((state) => state.game.elo);
  const columns = [
    {
      key: "id",
      label: "PLAYER ID",
    },
    {
      key: "gamesPlayed",
      label: "GAMES PLAYED",
    },
    {
      key: "elo",
      label: "ELO",
    },
  ];

  const rows = Object?.values(users).map((user: any, index) => {
    //console.log(user)
    const id = <Address value={user} />;
    return {
      key: index,
      id: id,
      gamesPlayed: (
        <Text
          css={{ textGradient: "45deg, $blue600 -20%, $pink600 50%" }}
          weight="bold"
        >
          Not defined
        </Text>
      ),
      elo: allElos[user],
    };
  });

  return (
    <div className="gameListItem">
      <Table
        aria-label="Example table with dynamic content"
        css={{
          height: "auto",
          minWidth: "100%",
          overflow: "hidden",
        }}
        shadow={false}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.key}>{column.label}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => (
            <Table.Row key={item.key}>
              {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};
