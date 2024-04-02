import { u2uNebulasTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  // {
  //   pid: 3,
  //   lpAddress: '0xb7ff2cd12acfb9d175407d05066661b7b95dba51',
  //   token0: u2uNebulasTokens.cake,
  //   token1: u2uNebulasTokens.usdc,
  //   feeAmount: FeeAmount.LOW,
  // },
  {
    pid: 1,
    lpAddress: '0xeaf3feabf19db01e11f36f5e9eeae1d41ee482c1',
    token0: u2uNebulasTokens.wu2u,
    token1: u2uNebulasTokens.usdt,
    feeAmount: FeeAmount.LOW,
  },
  // {
  //   pid: 2,
  //   lpAddress: '0x0d71d040dccc62ad8faf1a66c13ac5526eae35ac',
  //   token0: u2uNebulasTokens.wu2u,
  //   token1: u2uNebulasTokens.cake,
  //   feeAmount: FeeAmount.LOW,
  // },
])
