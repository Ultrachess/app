import { NOTIFICATION_TOAST_DURATION_MILLIS } from "../../utils/constants";
import { useAppSelector } from "../hooks";
import { Notification } from "./notifications";
import { NotificationState } from "./reducer";

//useNotifications hook is used to get total list of notifications from the store
export function useNotifications(): Notification[] {
  const notifications = useAppSelector((state) => state.notifications);
  //console.log("ui notifications", notifications)
  //arrange notifications by timestamp
  return Object?.values(notifications).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

//useNewNotifications hook is used to get list of new notifications happened less than 5 seconds ago
export function useNewNotifications(): Notification[] {
  const notifications = useAppSelector((state) => state.notifications);
  const now = Date.now();
  return Object?.values(notifications).filter(
    (notification) =>
      now - notification.timestamp < NOTIFICATION_TOAST_DURATION_MILLIS
  );
}
