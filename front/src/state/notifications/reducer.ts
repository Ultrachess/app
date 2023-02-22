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
            if(!state[payload.id.toString()])
                state[payload.id.toString()] = payload
        },
        setNotification(state, { payload }: { payload: Notification }) {
            if(state[payload.id.toString()])
                state[payload.id.toString()] = payload
        },
        setNotifications(state, { payload }: { payload: Notification[] }) {
            console.log("setting notifications", payload)
            for (let index = 0; index < payload.length; index++) {
                const notification = payload[index];
                let rand_string_id = Math.random().toString(36).substring(7);
                state[rand_string_id] = notification
            }
        }

    }
})

export const { addNotification, setNotifications } 
    = notificationSlice.actions

export default notificationSlice.reducer