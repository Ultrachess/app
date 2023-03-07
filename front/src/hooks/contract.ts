import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import ERC20_ABI from "../abis/erc20.json";
import { getContract } from "../utils";

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    provider,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

//use erc20 contract
export function useErc20Contract(
  addressOrAddressMap: string,
  withSignerIfPossible = true
) {
  return useContract<Contract>(
    addressOrAddressMap,
    ERC20_ABI,
    withSignerIfPossible
  );
}

export function useContractCallResult(
  contract: Contract,
  func: string,
  ...params
): string | number | null | undefined {
  const [result, setResult] = useState(0);

  useEffect(() => {
    try {
      const callContract = async () => {
        if (contract) {
          const result = await contract.callStatic[func]();
          //console.log(result)
          setResult(result);
        }
      };

      callContract().catch(console.log);
    } catch (e) {}
  }, [contract, func]);

  return result;
}
