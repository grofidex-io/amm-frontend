import { u2uNebulasTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 41,
    lpAddress: '0x35D85D531BE7159cB6f92E8B9CeaF04eC28c6ad9',
    token0: u2uNebulasTokens.wu2u,
    token1: u2uNebulasTokens.cake,
    feeAmount: FeeAmount.LOWEST,
  },
])
