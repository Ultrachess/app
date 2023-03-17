/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { User, Text } from "@nextui-org/react";
import { truncateAddress } from "../ether/utils";

export default (props) => {
  var { white } = props;
  var address = "0xD319edC71026080c2F4c320ab19A8Dc06e90623e";
  return (
    <>
      <User
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        name={truncateAddress(address)}
        size="xs"
      >
        {white ? <Text size={10}>black</Text> : <Text size={10}>white</Text>}
      </User>
    </>
  );
};
