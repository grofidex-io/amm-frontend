import { Currency, WNATIVE } from '@pancakeswap/sdk'
import { Flex, IconButton, SyncAltIcon, Text } from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
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
  onCurrencySelectClick?: () => void
}

const FlexPointer = styled(Flex)`
  cursor: pointer;
`

const PriceChartContainer: React.FC<React.PropsWithChildren<PriceChartContainerProps>> = ({
  inputCurrency,
  outputCurrency,
  isChartExpanded,
  setIsChartExpanded,
  isChartDisplayed,
  isMobile,
  isFullWidthContainer = true,
  currentSwapPrice,
  onCurrencySelectClick,
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

  return (
    <>
      <FlexPointer justifyContent="space-between" px="24px">
        <Flex alignItems="center" onClick={onCurrencySelectClick}>
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
          )}
          {inputCurrency && (
            <Text color="text" bold>
              {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
            </Text>
          )}
          <IconButton variant="text" onClick={onCurrencySelectClick}>
            <SyncAltIcon ml="6px" color="primary" />
          </IconButton>
        </Flex>
      </FlexPointer>
      {isWrap ? (
        <BnbWbnbNotice isDark={isDark} isChartExpanded />
      ) : (
        <PriceChart
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
      )}
    </>
  )
}

export default PriceChartContainer
