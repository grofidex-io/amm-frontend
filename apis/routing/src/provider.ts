import { ChainId, getV3Subgraphs } from '@pancakeswap/chains'
import { OnChainProvider, SubgraphProvider } from '@pancakeswap/smart-router/evm'
import { GraphQLClient } from 'graphql-request'
import { createPublicClient, http } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains'

import { defineChain } from 'viem/utils'
import { SupportedChainId } from './constants'

const u2uNebulas = defineChain({
  id: 2484,
  name: 'U2U Nebulas',
  network: 'u2u-nebulas',
  nativeCurrency: {
    decimals: 18,
    name: 'U2U',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: { http: ['https://rpc-nebulas-testnet.uniultra.xyz/'] },
    public: { http: ['https://rpc-nebulas-testnet.uniultra.xyz/'] },
  },
  blockExplorers: {
    etherscan: { name: 'U2U Scan', url: 'https://testnet.u2uscan.xyz/' },
    default: { name: 'U2U Scan', url: 'https://testnet.u2uscan.xyz/' },
  },
  contracts: {
    multicall3: {
      address: '0xc50C2b173bD9E07c7e6E19FE4c85F98f5Ea7e75b',
      blockCreated: 19541237,
    },
  },
})
const requireCheck = [ETH_NODE, GOERLI_NODE, BSC_NODE, BSC_TESTNET_NODE, NODE_REAL_SUBGRAPH_API_KEY]
requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

const V3_SUBGRAPHS = getV3Subgraphs({
  noderealApiKey: NODE_REAL_SUBGRAPH_API_KEY,
})

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_NODE),
})

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
})

const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
})


export const u2uNebulasClient = createPublicClient({
  chain: u2uNebulas,
  transport: http(),
})

// @ts-ignore
export const viemProviders: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    case ChainId.U2U_NEBULAS:
      return u2uNebulasClient
    default:
      return bscClient
  }
}

export const v3SubgraphClients: Record<SupportedChainId, GraphQLClient> = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ETHEREUM], { fetch }),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(V3_SUBGRAPHS[ChainId.POLYGON_ZKEVM], { fetch }),
  [ChainId.ZKSYNC]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ZKSYNC], { fetch }),
  [ChainId.LINEA_TESTNET]: new GraphQLClient(V3_SUBGRAPHS[ChainId.LINEA_TESTNET], { fetch }),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPHS[ChainId.GOERLI], { fetch }),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BSC], { fetch }),
  [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BSC_TESTNET], { fetch }),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ARBITRUM_ONE], { fetch }),
  [ChainId.LINEA]: new GraphQLClient(V3_SUBGRAPHS[ChainId.LINEA], { fetch }),
  [ChainId.SCROLL_SEPOLIA]: new GraphQLClient(V3_SUBGRAPHS[ChainId.SCROLL_SEPOLIA], { fetch }),
  [ChainId.BASE_TESTNET]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BASE_TESTNET], { fetch }),
  [ChainId.BASE]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BASE], { fetch }),
  [ChainId.OPBNB]: new GraphQLClient(V3_SUBGRAPHS[ChainId.OPBNB], { fetch }),
  [ChainId.U2U_NEBULAS]: new GraphQLClient(V3_SUBGRAPHS[ChainId.U2U_NEBULAS], { fetch }),
} as const

export const v3SubgraphProvider: SubgraphProvider = ({ chainId = ChainId.BSC }: { chainId?: ChainId }) => {
  return v3SubgraphClients[chainId as SupportedChainId] || v3SubgraphClients[ChainId.BSC]
}
