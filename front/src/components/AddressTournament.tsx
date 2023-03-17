/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import "./Address.css";

import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Text } from "./ui/Text";

export default ({ id }: { id: string }) => {
  return (
    <div className="addressView">
      <Link to={"/tournament/" + id}>
        <Row>
          <Text bold>{id}</Text>
        </Row>
      </Link>
    </div>
  );
};
