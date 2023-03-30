import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { Fragment } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { metaMask } from "../../ether/connectors/metaMask";
import { truncateAddress } from "../../ether/utils";
import {
  setCreateGameModal,
  setDeployBotModal,
  setDepositModal,
} from "../../state/ui/reducer";

interface NavProfileProps {
  connected: boolean;
  avatar: string;
  address: string;
  balance: number;
  tokenSymbol: string;
}

const NavProfile = ({
  connected = true,
  avatar = "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  balance = 2988,
  tokenSymbol = "USD",
}: NavProfileProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ProfileDropdownItems = [
    {
      name: "Your Profile",
      href: "#",
      icon: "user",
      onclick: () => navigate(`/users/${address}`),
    },
    {
      name: "Deposit",
      href: "#",
      icon: "cog",
      onclick: () => dispatch(setDepositModal(true)),
    },
    {
      name: "Withdraw",
      href: "#",
      icon: "logout",
      onclick: () => console.log("Sign out"),
    },
    {
      name: "Create Game",
      href: "#",
      icon: "logout",
      onclick: () => dispatch(setCreateGameModal(true)),
    },
    {
      name: "Deploy Bot",
      href: "#",
      icon: "logout",
      onclick: () => dispatch(setDeployBotModal(true)),
    },
  ];
  return connected ? (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="ml-2 flex items-center space-x-2 md:space-x-4">
          <button
            type="button"
            className="group flex shrink-0 items-center rounded-lg transition"
          >
            <span className="sr-only">Menu</span>
            <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />

            <p className="ml-2 hidden text-left text-sm text-left md:block">
              <strong className="block font-medium">
                {truncateAddress(address)}
              </strong>

              <span className="text-blue-500 font-medium">
                {balance} {tokenSymbol}
              </span>
            </p>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 md:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <div className="md:hidden px-4 py-2 text-sm text-gray-700">
              <strong className="block font-medium">
                {truncateAddress(address)}
              </strong>
              <span className="text-blue-500 underline">
                {balance} {tokenSymbol}
              </span>
            </div>
          </Menu.Item>
          {ProfileDropdownItems.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <a
                  onClick={item.onclick}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  ) : (
    <a
      className="inline-block rounded border border-blue-600 bg-blue-600 ml-4 px-6 py-2 text-sm font-medium hover:text-black focus:outline-none text-white"
      onClick={() => {
        metaMask.activate();
      }}
    >
      Connect
    </a>
  );
};

export default NavProfile;
