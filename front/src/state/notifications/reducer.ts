import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "./notifications";

export interface NotificationState {
    [notificationId: string]: Notification
}

export const initialState: NotificationState = {}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, { payload }: { payload: Notification }) {
            state[payload.id.toString()] = payload
        },
        setNotification(state, { payload }: { payload: Notification }) {
            if(state[payload.id.toString()])
                state[payload.id.toString()] = payload
        },

    }
})

export const { addNotification } 
    = notificationSlice.actions

export default notificationSlice.reducer