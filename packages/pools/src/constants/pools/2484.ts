import { u2uNebulasTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 0,
    stakingToken: u2uNebulasTokens.wu2u,
    earningToken: u2uNebulasTokens.cake,
    contractAddress: '0xf6B427A2Df6E24600e3e3c62634B7c478826619D',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.01',
    isFinished: false,
  },
].map((p) => ({
  ...p,
  contractAddress: getAddress(p.contractAddress, 97),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
