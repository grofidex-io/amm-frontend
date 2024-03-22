import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WBNB, WETH9, WNATIVE } from '@pancakeswap/sdk'

import { USDT_U2U } from './common'

export const u2uNebulasTokens = {
  wu2u: WNATIVE[ChainId.U2U_NEBULAS],
  usdt: USDT_U2U,
  weth: WETH9[ChainId.U2U_NEBULAS],
  wbtc: new ERC20Token(
    ChainId.U2U_NEBULAS,
    '0x9a599da01fd5193ca5060d7eae650889b18e5e64',
    18,
    'WBTC',
    'Wrapped BTC',
    '',
  ),
  wbnb: WBNB[ChainId.U2U_NEBULAS],
  wtrx: new ERC20Token(ChainId.U2U_NEBULAS, '0x7915b1b149c6f12b6de001bdf4da36a1276e376a', 18, 'WTRX', 'Wrapped TRX'),
}
