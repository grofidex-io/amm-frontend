import { ChainId } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import {} from 'state/farms/hooks'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'

const useIsRenderUserBanner = () => {
  const { chainId, account } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const cakePriceBusd = useCakePrice()
  const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(cakePriceBusd).isZero()

  return useMemo(() => {
    return { shouldRender: Boolean(account) && chainId === ChainId.BSC, isEarningsBusdZero }
  }, [account, chainId, isEarningsBusdZero])
}

export default useIsRenderUserBanner
