const ETH = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}


function isExtendedChainInformation(
  chainInformation
) {
  return !!(chainInformation).nativeCurrency
}

export function getAddChainParameters(chainId) {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

const infuraKey = typeof process !== 'undefined' ? process.env.VITE_INFURA_KEY : import.meta.env.VITE_INFURA_KEY;
const alchemyKey = typeof process !== 'undefined' ? process.env.VITE_ALCHEMY_KEY : import.meta.env.VITE_ALCHEMY_KEY;

export const CHAINS = {
  1: {
    urls: [
      infuraKey ? `https://mainnet.infura.io/v3/${infuraKey}` : undefined,
      alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}` : undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => url !== undefined),
    name: 'Mainnet',
    networkName: 'mainnet',
  },
  3: {
    urls: [infuraKey ? `https://ropsten.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined
    ),
    name: 'Ropsten',
    networkName: 'ropsten',
  },
  4: {
    urls: [infuraKey ? `https://rinkeby.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined
    ),
    name: 'Rinkeby',
    networkName: 'rinkeby',
  },
  5: {
    urls: [infuraKey ? `https://goerli.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined
    ),
    name: 'Görli',
    networkName: 'goerli',
  },
  42: {
    urls: [infuraKey ? `https://kovan.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined
    ),
    name: 'Kovan',
    networkName: 'kovan',
  },
  // Optimism
  10: {
    urls: [
      infuraKey ? `https://optimism-mainnet.infura.io/v3/${infuraKey}` : undefined,
      'https://mainnet.optimism.io',
    ].filter((url) => url !== undefined),
    name: 'Optimism',
    networkName: 'optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  69: {
    urls: [
      infuraKey ? `https://optimism-kovan.infura.io/v3/${infuraKey}` : undefined,
      'https://kovan.optimism.io',
    ].filter((url) => url !== undefined),
    name: 'Optimism Kovan',
    networkName: 'optimism_kovan',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
  },
  420: {
    urls: [
      infuraKey ? `https://optimism-goerli.infura.io/v3/${infuraKey}` : undefined,
      'https://goerli.optimism.io',
    ].filter((url) => url !== undefined),
    name: 'Optimism Görli',
    networkName: 'optimism_goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-optimistic.etherscan.io'],
  },
  // Arbitrum
  42161: {
    urls: [
      infuraKey ? `https://arbitrum-mainnet.infura.io/v3/${infuraKey}` : undefined,
      'https://arb1.arbitrum.io/rpc',
    ].filter((url) => url !== undefined),
    name: 'Arbitrum One',
    networkName: 'arbitrum_one',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  421611: {
    urls: [
      infuraKey ? `https://arbitrum-rinkeby.infura.io/v3/${infuraKey}` : undefined,
      'https://rinkeby.arbitrum.io/rpc',
    ].filter((url) => url !== undefined),
    name: 'Arbitrum Testnet',
    networkName: 'arbitrum_rinkeby',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  421613: {
    urls: [
      infuraKey ? `https://arbitrum-goerli.infura.io/v3/${infuraKey}` : undefined,
      'https://goerli-rollup.arbitrum.io/rpc',
    ].filter((url) => url !== undefined),
    name: 'Arbitrum Görli',
    networkName: 'arbitrum_goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-rollup-explorer.arbitrum.io'],
  },
  // Polygon
  137: {
    urls: [
      infuraKey ? `https://polygon-mainnet.infura.io/v3/${infuraKey}` : undefined,
      'https://polygon-rpc.com',
    ].filter((url) => url !== undefined),
    name: 'Polygon Mainnet',
    networkName: 'polygon_mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  80001: {
    urls: [infuraKey ? `https://polygon-mumbai.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined
    ),
    name: 'Polygon Mumbai',
    networkName: 'polygon_mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
}

export const URLS = {}