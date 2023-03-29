/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Text } from "./Text";
//current must be in seconds

const DateDisplay = ({ current }: { current: number }) => {
  const date = new Date(current);
  const options: any = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return <Text faded>{date.toLocaleDateString("en-US", options)}</Text>;
};

export default DateDisplay;
