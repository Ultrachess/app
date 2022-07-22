import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import gameSlice from "./game/gameSlice";

export default configureStore({
    reducer: {
        auth: authSlice,
        game: gameSlice
    }
})
