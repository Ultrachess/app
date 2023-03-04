import { useWeb3React } from "@web3-react/core";
import ms from "ms";
import { useCallback, useEffect, useMemo } from "react";

import { retry, RetryableError } from "../../utils/retry";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useBlockNumber } from "./hooks";
import { checkedTransaction, finalizeTransaction } from "./reducer";
import { Transaction, TransactionReceipt } from "./types";

const DEFAULT_RETRY_OPTIONS = { n: 1, minWait: 0, maxWait: 0 };

export function shouldCheckTransaction(
  lastBlockNumber: number,
  tx: Transaction
) {
  // should not check if transaction is already confirms
  if (tx.receipt) return false;
  //should check since lastChecked block number is not added
  if (!tx.lastCheckedBlockNumber) return true;

  const blocksPassedSinceLastCheck =
    lastBlockNumber - tx.lastCheckedBlockNumber;
  // do not check if there is only a 1 block difference bettween latest block and last block
  if (blocksPassedSinceLastCheck < 1) return false;

  const minutesPassed = (new Date().getTime() - tx.addedTime) / ms(`1 m`);
  if (minutesPassed > 60) {
    // every 10 blocks if pending longer than an hour
    return blocksPassedSinceLastCheck > 9;
  } else if (minutesPassed > 5) {
    // every 3 blocks if pending longer than 5 minutes
    return blocksPassedSinceLastCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

// this function checks and updates all transaction state per block
export function TransactionUpdater() {
  const { chainId, provider } = useWeb3React();

  const lastBlockNumber = useBlockNumber();
  const transactions = useAppSelector((state) => state.transactions);
  const pendingTransactions = useMemo(
    () => (chainId ? transactions[chainId] ?? {} : {}),
    [chainId, transactions]
  );

  const dispatch = useAppDispatch();
  const onCheck = useCallback(
    ({
      chainId,
      hash,
      blockNumber,
    }: {
      chainId: number;
      hash: string;
      blockNumber: number;
    }) => dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch]
  );
  const onReceipt = useCallback(
    ({
      chainId,
      hash,
      receipt,
    }: {
      chainId: number;
      hash: string;
      receipt: TransactionReceipt;
    }) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: {
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            contractAddress: receipt.contractAddress,
            from: receipt.from,
            status: receipt.status,
            to: receipt.to,
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
          },
        })
      );
      const tx = transactions[chainId]?.[hash];
    },
    [dispatch, transactions]
  );

  const getReceipt = useCallback(
    (hash: string) => {
      if (!provider || !chainId) throw new Error("No provider or chainId");
      const retryOptions = DEFAULT_RETRY_OPTIONS;
      return retry(
        () =>
          provider.getTransactionReceipt(hash).then((receipt) => {
            if (receipt === null) {
              console.debug(`Retrying tranasaction receipt for ${hash}`);
              throw new RetryableError();
            }
            return receipt;
          }),
        retryOptions
      );
    },
    [chainId, provider]
  );

  useEffect(() => {
    if (!chainId || !provider || !lastBlockNumber) return;

    const cancels = Object.keys(pendingTransactions)
      .filter((hash) =>
        shouldCheckTransaction(lastBlockNumber, pendingTransactions[hash])
      )
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash);
        promise
          .then((receipt) => {
            if (receipt) {
              onReceipt({ chainId, hash, receipt });
            } else {
              onCheck({ chainId, hash, blockNumber: lastBlockNumber });
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) {
              console.warn(
                `Failed to get transaction receipt for ${hash}`,
                error
              );
            }
          });
        return cancel;
      });

    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [
    chainId,
    provider,
    lastBlockNumber,
    getReceipt,
    onReceipt,
    onCheck,
    pendingTransactions,
  ]);

  return null;
}
