import { TransactionInfo } from "../../common/types"

export interface TransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export interface Transaction {
  chainId: number,
  hash: string,
  receipt?: TransactionReceipt,
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string,
  info: TransactionInfo,
}


