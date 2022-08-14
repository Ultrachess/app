import { Token } from "../../hooks/token"
import { contenthashToUri, parseENSAddress, uriToHttp } from ".."
export const UNI_LIST = 'https://tokens.uniswap.org'
export const UNI_EXTENDED_LIST = 'https://gateway.pinata.cloud/ipfs/QmaQvV3pWKKaWJcHvSBuvQMrpckV3KKtGJ6p3HZjakwFtX'
const AAVE_LIST = 'tokenlist.aave.eth'
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
const CMC_ALL_LIST = 'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json'
export const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'
export const DEFAULT_TOKEN_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  UNI_LIST,
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  KLEROS_LIST,
  GEMINI_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ROLL_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  CELO_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST, GEMINI_LIST]

const listCache = new Map<string, Token[]>()

/** Fetches and validates a token list. */
export async function fetchTokenList(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>
): Promise<Token[]> {
  const cached = listCache?.get(listUrl) // avoid spurious re-fetches
  if (cached) {
    return cached
  }

  let urls: string[]
  const parsedENS = parseENSAddress(listUrl)
  if (parsedENS) {
    let contentHashUri
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName)
    } catch (error) {
      const message = `failed to resolve ENS name: ${parsedENS.ensName}`
      console.debug(message, error)
      throw new Error(message)
    }
    let translatedUri
    try {
      translatedUri = contenthashToUri(contentHashUri)
    } catch (error) {
      const message = `failed to translate contenthash to URI: ${contentHashUri}`
      console.debug(message, error)
      throw new Error(message)
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`)
  } else {
    urls = uriToHttp(listUrl)
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url, { credentials: 'omit' })
    } catch (error) {
      const message = `failed to fetch list: ${listUrl}`
      console.debug(message, error)
      if (isLast) throw new Error(message)
      continue
    }

    if (!response.ok) {
      const message = `failed to fetch list: ${listUrl}`
      console.debug(message, response.statusText)
      if (isLast) throw new Error(message)
      continue
    }

    const list = await response.json()
    listCache?.set(listUrl, list)
    return list
  }

  throw new Error('Unrecognized list URL protocol.')
}

