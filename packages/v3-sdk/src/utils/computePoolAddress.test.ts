import { Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { describe, it, expect } from 'vitest'
import { DEPLOYER_ADDRESSES, FeeAmount } from '../constants'
import { computePoolAddress } from './computePoolAddress'

describe('#computePoolAddress', () => {
  const deployerAddress = '0x8EE28fbAa9Bf578AA4298b78A1770DE381175bf5'
  it('should correctly compute the pool address', () => {
    const tokenA = new Token(1, '0x9a0359e8432C856e1EEfc6F2E242b5dfEd41B3ec', 18, 'USDC', 'USD Coin')
    const tokenB = new Token(1, '0x4B9F8077856d81c5E97948dbeC8960024D4908C1', 18, 'DAI', 'DAI Stablecoin')
    const result = computePoolAddress({
      deployerAddress,
      fee: FeeAmount.LOW,
      tokenA,
      tokenB,
      initCodeHashManualOverride: '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
    })

    expect(result).toEqual('0x993B1e86fFEf6609e47416212C17B0df746fa985')
  })
})
