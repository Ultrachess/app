import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { Fragment, useEffect, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { CHAINS, DEFAULT_NETWORK_URI } from "../../ether/chains";
import { metaMask } from "../../ether/connectors/metaMask";
import { toHex } from "../../ether/utils";
import { truncateAddress } from "../../ether/utils";

const switchEthereumChain = async (chainId) => {
  const chain = CHAINS[chainId];
  //console.log(chain)
  //console.log(chainId)
  //console.log(toHex(chainId))
  const ethWindow = window.ethereum as any;
  try {
    await ethWindow.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(chainId) }],
    });
  } catch (e) {
    if (e.code === 4902) {
      try {
        await ethWindow.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: toHex(chainId),
              chainName: chain.name,
              nativeCurrency: {
                name: chain.nativeCurrency.name,
                symbol: chain.nativeCurrency.symbol, // 2-6 characters long
                decimals: chain.nativeCurrency.decimals,
              },
              blockExplorerUrls: chain.blockExplorerUrls,
              rpcUrls: chain.urls,
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    // console.error(e)
  }
};

interface NavProfileProps {
  connected: boolean;
  chainId: number;
}

const NavNetwork = ({ connected = true, chainId = 5 }: NavProfileProps) => {
  return (
    connected && (
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="ml-2 flex items-center space-x-2 md:space-x-4">
            <button
              type="button"
              className="group flex shrink-0 items-center rounded-lg transition"
            >
              <span className="sr-only">Menu</span>
              <img
                alt="Man"
                src={CHAINS[chainId].networkIMG ?? DEFAULT_NETWORK_URI}
                className="h-8 w-8 rounded-full object-cover"
              />

              <p className="ml-2 hidden text-left text-sm text-left md:block">
                <strong className="block font-medium text-black-600">
                  {CHAINS[chainId].name}
                </strong>
              </p>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 md:block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
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
            {Object?.values(CHAINS).map((chain) => (
              <Menu.Item key={chain.name}>
                {({ active }) => (
                  <a
                    onClick={async () => {
                      const handleSwitch = async () => {
                        try {
                          await switchEthereumChain(chain.id);
                          await new Promise((resolve) =>
                            setTimeout(resolve, 500)
                          ); // Add a delay to allow the network switch to complete
                          await metaMask.activate();
                        } catch (error) {
                          console.error("Error switching network:", error);
                        }
                      };
                      handleSwitch();
                    }}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    {chain.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    )
  );
};

export default React.memo(NavNetwork);
