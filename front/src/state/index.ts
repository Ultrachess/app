import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { load, save } from "redux-localstorage-simple"
import authSlice from "./auth/authSlice";
import gameSlice from "./game/gameSlice";
import transactions from "./transactions/reducer"
import actions from "./actions/reducer"

const PERSISTED_STATE: string[] = ['auth', 'game', 'transactions']

export const store = configureStore({
    reducer: {
        auth: authSlice,
        game: gameSlice,
        transactions: transactions,
        actions: actions
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({})
            .concat(save({ states: PERSISTED_STATE, debounce: 100})),
    preloadedState: load({
        states: PERSISTED_STATE,
        //disableWarnings: process.env.NODE_ENV === 'test',
    })
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
