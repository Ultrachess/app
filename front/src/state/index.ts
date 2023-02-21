import { configureStore, getDefaultMiddleware, applyMiddleware, Middleware } from "@reduxjs/toolkit";
import { load, save } from "redux-localstorage-simple"
import authSlice from "./auth/authSlice";
import gameSlice from "./game/gameSlice";
import transactions from "./transactions/reducer"
import actions from "./actions/reducer"
import notifications from "./notifications/reducer"
import { ActionList } from "./game/types";

const PERSISTED_STATE: string[] = ['auth', 'game', 'transactions', 'actions', 'notifications']

// const onLoad = () => {
//     let state: any = load({states: PERSISTED_STATE}) ?? {}
//     let actions: ActionList = state.actions ?? {}

//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
        
//     }

// }



export const store = configureStore({
    reducer: {
        auth: authSlice,
        game: gameSlice,
        transactions: transactions,
        //actions: actions,
        notifications: notifications,
    },
    // middleware: (getDefaultMiddleware) => 
    //     getDefaultMiddleware({ serializableCheck: false })
    //         .concat(save({ states: PERSISTED_STATE, debounce: 100})),
    preloadedState: load({
        states: PERSISTED_STATE,
        //disableWarnings: process.env.NODE_ENV === 'test',
    })
})
console.log("preloaded state")
console.log(load({states: PERSISTED_STATE}))

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
