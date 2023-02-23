import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import ERC20_ABI from '../abis/erc20.json'

export const DEFAULT_GRAPHQL_URL = import.meta.env.PROD?
  "https://ultrachess.org/api/graphql":
  `http://localhost:4000/graphql`;

export const DEFAULT_GRAPHQL_POLL_TIME = 100000000000

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}

export function getErc20Contract(address: string, provider: JsonRpcProvider, account?: string): Contract {
  return getContract(address, ERC20_ABI, provider, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// export function isTokenOnList(chainTokenMap: ChainTokenMap, token?: Token): boolean {
//   return Boolean(token?.isToken && chainTokenMap[token.chainId]?.[token.address])
// }

// export function formattedFeeAmount(feeAmount: FeeAmount): number {
//   return feeAmount / 10000
// }


export function hexToUint8Array(hex: string): Uint8Array {
    hex = hex.startsWith('0x') ? hex.substr(2) : hex
    if (hex.length % 2 !== 0) throw new Error('hex must have length that is multiple of 2')
    const arr = new Uint8Array(hex.length / 2)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = parseInt(hex.substr(i * 2, 2), 16)
    }
    return arr
}

const UTF_8_DECODER = new TextDecoder('utf-8')

/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
// export function contenthashToUri(contenthash: string): string {
//     const data = hexToUint8Array(contenthash)
//     const codec = getNameFromData(data)
//     switch (codec) {
//         case 'ipfs-ns': {
//             const unprefixedData = rmPrefix(data)
//             const cid = new CID(unprefixedData)
//             //return `ipfs://${toB58String(cid.multihash)}`
//         }
//         case 'ipns-ns': {
//             const unprefixedData = rmPrefix(data)
//             const cid = new CID(unprefixedData)
//             const multihash = decode(cid.multihash)
//             if (multihash.name === 'identity') {
//                 return `ipns://${UTF_8_DECODER.decode(multihash.digest).trim()}`
//             } else {
//                 return `ipns://${toB58String(cid.multihash)}`
//             }
//         }
//         default:
//             throw new Error(`Unrecognized codec: ${codec}`)
//     }
// }

const ENS_NAME_REGEX = /^(([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+)eth(\/.*)?$/
export function parseENSAddress(
  ensAddress: string
): { ensName: string; ensPath: string | undefined } | undefined {
  const match = ensAddress.match(ENS_NAME_REGEX)
  if (!match) return undefined
  return { ensName: `${match[1].toLowerCase()}eth`, ensPath: match[4] }
}

export function uriToHttp(uri: string): string[] {
    const protocol = uri.split(':')[0].toLowerCase()
    switch (protocol) {
      case 'data':
        return [uri]
      case 'https':
        return [uri]
      case 'http':
        return ['https' + uri.substr(4), uri]
      case 'ipfs':
        const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]
        return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`]
      case 'ipns':
        const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]
        return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`]
      case 'ar':
        const tx = uri.match(/^ar:(\/\/)?(.*)$/i)?.[2]
        return [`https://arweave.net/${tx}`]
      default:
        return []
    }
  }

export function decimalToHexString(number) {
  if (number < 0){
    number = 0xFFFFFFFF + number + 1;
  }

  let str: string = number.toString(16).toUpperCase();
  //console.log(str.length)
  let numToAdd = 8 - str.length
  let zerosToAdd: string = new Array(numToAdd > 0 ? numToAdd + 1 : 0).join('0')
  //console.log(zerosToAdd.length)
  return zerosToAdd.concat(str);
}

const HEX_STRINGS = "0123456789abcdef";
const MAP_HEX = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
  7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13,
  e: 14, f: 15, A: 10, B: 11, C: 12, D: 13,
  E: 14, F: 15
};

// Fast Uint8Array to hex
export function toHex(bytes) {
  return Array.from(bytes || [])
    .map((b:any) => HEX_STRINGS[b >> 4] + HEX_STRINGS[b & 15])
    .join("");
}

export function fromHex(hexString: string) {
  const bytes = new Uint8Array(Math.floor((hexString || "").length / 2));
  let i;
  for (i = 0; i < bytes.length; i++) {
    const a = MAP_HEX[hexString[i * 2]];
    const b = MAP_HEX[hexString[i * 2 + 1]];
    if (a === undefined || b === undefined) {
      break;
    }
    bytes[i] = (a << 4) | b;
  }
  return i === bytes.length ? bytes : bytes.slice(0, i);
}

export function appendNumberToUInt8Array(number: number, arr: Uint8Array){
  var numberArray = fromHex(decimalToHexString(number))
  var mergedArray = new Uint8Array(numberArray.length + arr.length);
  mergedArray.set(numberArray);
  mergedArray.set(arr, numberArray.length);
  return mergedArray
}


