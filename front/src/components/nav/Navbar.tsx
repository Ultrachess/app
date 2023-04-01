import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useWeb3React } from "@web3-react/core";
import { Fragment, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

//get link to ../assets/horse.png
import logo from "../../assets/horse.png";
import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { hooks, metaMask } from "../../ether/connectors/metaMask";
import { truncateAddress } from "../../ether/utils";
import { useToken } from "../../hooks/token";
import { useBalance } from "../../state/game/hooks";
import { useNotifications } from "../../state/notifications/hooks";
import {
  Notification,
  NotificationType,
} from "../../state/notifications/notifications";
import ModalCreateBot from "../modals/ModalCreateBot";
import ModalCreateChallenge from "../modals/ModalCreateChallenge";
import ModalCreateOffer from "../modals/ModalCreateOffer";
import ModalNewCreateGame from "../modals/ModalNewCreateGame";
import ModalNewDepositFunds from "../modals/ModalNewDepositFunds";
import NotificationBell from "./NavBell";
import NavNetwork from "./NavNetwork";
import NavProfile from "./NavProfile";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Rankings", href: "/rankings", current: false },
  { name: "Bots", href: "/bots", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const dummyNotifications: Notification[] = [
  {
    id: 1,
    timestamp: 1620000000000,
    type: NotificationType.GAME_CREATED,
    creatorId: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    gameId: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    wager: 100,
    token: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  {
    id: 2,
    timestamp: 1620000000000,
    type: NotificationType.GAME_CREATED,
    creatorId: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    gameId: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    wager: 100,
    token: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  {
    id: 3,
    timestamp: 1620000000000,
    type: NotificationType.ACTION,
    actionId: 1,
  },
];

export default function Navbar() {
  const { chainId, account, provider, isActivating, isActive } = useWeb3React();
  const balance = useBalance(account, STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);
  const token = useToken(STABLECOIN_ADDRESS_ON_NETWORKS[chainId]);
  console.log("token abc", token);

  const dispatch = useDispatch();
  const location = useLocation();

  //get index in navigation array of current page
  //by comparing href to window.location.pathname
  const currentIndex = useMemo(() => {
    console.log("location.pathname", location.pathname);
    return navigation.findIndex((item) => item.href == location.pathname);
  }, [location.pathname]);

  console.log("currentIndex", currentIndex);
  console.log("connected", isActive);
  console.log("account", account);

  const notifications = useNotifications();
  console.log("notifications", notifications);

  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-9 w-auto lg:hidden"
                    src={logo}
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-9 w-auto lg:block"
                    src={logo}
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item, index) => (
                      //create underline effect when item.current is true
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          index == currentIndex
                            ? "text-sm font-semibold leading-6 text-gray-900"
                            : "text-sm font-semibold leading-6 text-gray-900",
                          "rounded-md mx-4 py-2 text-sm font-medium",
                          "relative before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-indigo-600 before:transition hover:before:scale-x-100",
                          index == currentIndex
                            ? "before:scale-x-100"
                            : "hover:before:scale-x-100"
                        )}
                        //class="relative font-medium text-indigo-600 before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-indigo-600 before:transition hover:before:scale-x-100"

                        aria-current={
                          index == currentIndex ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <NotificationBell
                  connected={isActive}
                  newNotification={false}
                  notifications={notifications}
                />
                <NavNetwork connected={isActive} chainId={chainId} />
                <NavProfile
                  connected={isActive}
                  address={account}
                  avatar={""}
                  balance={balance}
                  tokenSymbol={token?.symbol}
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    "block rounded-md mx-4 py-2 text-sm font-medium",
                    "relative before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-indigo-600 before:transition hover:before:scale-x-100 before:left-1/2 before:transform before:-translate-x-1/2",
                    index == currentIndex
                      ? "before:scale-x-100"
                      : "hover:before:scale-x-100"
                  )}
                  aria-current={index == currentIndex ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
          <ModalNewCreateGame />
          <ModalNewDepositFunds />
          <ModalCreateBot />
          <ModalCreateChallenge />
          <ModalCreateOffer />
        </>
      )}
    </Disclosure>
  );
}
