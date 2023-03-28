import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { Fragment } from "react";

import {
  Notification,
  NotificationType,
} from "../../state/notifications/notifications";
import NotificationItem from "../NotificationItem";

interface NavBellProps {
  connected: boolean;
  newNotification: boolean;
  notifications: Notification[];
}

const NavBell = ({
  connected = true,
  newNotification = true,
  notifications = [],
}: NavBellProps) => {
  return (
    connected && (
      <Menu as="div" className="">
        <div>
          <Menu.Button className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            {newNotification && (
              <span className="absolute top-3.5 right-1.5 h-2.5 w-2.5 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            )}
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-68 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {notifications.map((notification) => (
              <Menu.Item key={notification.id}>
                <NotificationItem
                  notification={notification}
                  shouldShowExit={false}
                />
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    )
  );
};

export default NavBell;
