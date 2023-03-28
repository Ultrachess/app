/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import "./Address.css";

import { Link } from "react-router-dom";

import { Text } from "./ui/Text";

export default ({ id }: { id: string }) => {
  return (
    <Link to={"/game/" + id}>
      {id}
    </Link>
  );
};
