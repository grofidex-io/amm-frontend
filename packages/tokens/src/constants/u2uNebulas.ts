import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WNATIVE } from '@pancakeswap/sdk'

import { CAKE, USDC_U2U } from './common'

export const u2uNebulasTokens = {
  wu2u: WNATIVE[ChainId.U2U_NEBULAS],
  usdc: USDC_U2U,
  cake: CAKE[ChainId.U2U_NEBULAS],
  eth: new ERC20Token(
    ChainId.OPBNB,
    '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    18,
    'ETH',
    'Ethereum',
    'https://opbnb.bnbchain.org/en',
  ),
}
