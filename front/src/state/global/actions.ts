import { createAction } from "@reduxjs/toolkit";

// fired before app renders 
// allowing data to be loaded from localStorage
export const updateVersion = createAction<void>('global/updateVersion')