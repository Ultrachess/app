import { NotificationState } from "./reducer";
import { Notification } from "./notifications";
import { useAppSelector } from "../hooks";
import { NOTIFICATION_TOAST_DURATION_MILLIS } from "../../utils/constants";

//useNotifications hook is used to get total list of notifications from the store
export function useNotifications(): Notification[] {
    const notifications = useAppSelector(state => state.notifications)
    return Object.values(notifications);
}

//useNewNotifications hook is used to get list of new notifications happened less than 5 seconds ago
export function useNewNotifications(): Notification[] {
    const notifications = useAppSelector(state => state.notifications)
    const now = Date.now();
    return Object.values(notifications).filter(notification => now - notification.timestamp < NOTIFICATION_TOAST_DURATION_MILLIS);
}



