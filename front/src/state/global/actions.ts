/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { createAction } from "@reduxjs/toolkit";

// fired before app renders
// allowing data to be loaded from localStorage
export const updateVersion = createAction<void>("global/updateVersion");
