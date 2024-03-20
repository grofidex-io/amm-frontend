import { Currency, WNATIVE } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import { PoolData } from 'views/V3Info/types'
import BnbWbnbNotice from './BnbWbnbNotice'
import PriceChart from './PriceChart'

type PriceChartContainerProps = {
  inputCurrencyId: string | undefined
  inputCurrency?: Currency
  outputCurrencyId: string | undefined
  outputCurrency?: Currency
  isChartExpanded: boolean
  setIsChartExpanded: React.Dispatch<React.SetStateAction<boolean>> | null
  isChartDisplayed: boolean
  currentSwapPrice: {
    [key: string]: number
  }
  isMobile?: boolean
  isFullWidthContainer?: boolean
  poolDatas?: Array<PoolData>
}

const PriceChartContainer: React.FC<React.PropsWithChildren<PriceChartContainerProps>> = ({
  inputCurrency,
  outputCurrency,
  isChartExpanded,
  setIsChartExpanded,
  isChartDisplayed,
  isMobile,
  isFullWidthContainer = true,
  currentSwapPrice,
  poolDatas,
}) => {
  const token0Address = inputCurrency?.wrapped.address?.toLowerCase()
  const token1Address = outputCurrency?.wrapped.address?.toLowerCase()
  const isPairReversed = false
  // const [isPairReversed, setIsPairReversed] = useState(false)
  // const togglePairReversed = useCallback(() => setIsPairReversed((prePairReversed) => !prePairReversed), [])

  const { isDark } = useTheme()

  if (!isChartDisplayed) {
    return null
  }

  const isWrap =
    inputCurrency &&
    outputCurrency &&
    WNATIVE[inputCurrency.chainId].equals(inputCurrency.wrapped) &&
    WNATIVE[outputCurrency.chainId].equals(outputCurrency.wrapped)

  if (isWrap) {
    return <BnbWbnbNotice isDark={isDark} isChartExpanded={isChartExpanded} />
  }

  return (
    <PriceChart
      poolDatas={poolDatas}
      token0Address={isPairReversed ? token1Address : token0Address}
      token1Address={isPairReversed ? token0Address : token1Address}
      inputCurrency={isPairReversed ? outputCurrency : inputCurrency}
      outputCurrency={isPairReversed ? inputCurrency : outputCurrency}
      isDark={isDark}
      isChartExpanded={isChartExpanded}
      setIsChartExpanded={setIsChartExpanded}
      isMobile={isMobile}
      isFullWidthContainer={isFullWidthContainer}
      currentSwapPrice={currentSwapPrice}
    />
  )
}

export default PriceChartContainer
