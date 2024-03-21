import { Currency } from '@pancakeswap/swap-sdk-core'
import { ExpandIcon, Flex, IconButton, ShrinkIcon, SyncAltIcon, Text, useModal } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useCallback, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { styled } from 'styled-components'
// import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { BigNumber } from 'ethers'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'

const FlexPointer = styled(Flex)`
  cursor: pointer;
`
const PriceChart = ({
  poolDatas,
  inputCurrency,
  outputCurrency,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  isFullWidthContainer,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const native = useNativeCurrency()
  const { onSelectPair } = useSwapActionHandlers()
  const [value, setValue] = useState('')
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const getAddress = (token: any) => {
    if (native.wrapped.address.toLowerCase() === token.wrapped.address?.toLowerCase()) {
      return native.symbol
    }
    return token.address
  }
  const getSymbol = (token: any) => {
    if (native.wrapped.address.toLowerCase() === token.address?.toLowerCase()) {
      return native.symbol
    }
    return token.symbol
  }

  const handleSelectCurrency = (listCurrency: Array<Currency>) => {
    if (listCurrency[0] && listCurrency[1]) {
      let input = listCurrency[0]
      let output = listCurrency[1]
      if (!BigNumber.from(listCurrency[0].wrapped.address).lt(BigNumber.from(listCurrency[1].wrapped.address))) {
        input = listCurrency[1]
        output = listCurrency[0]
      }
      const inputCurrencyId = getAddress(input) || ''
      const outputCurrencyId = getAddress(output) || ''
      onSelectPair(inputCurrencyId, outputCurrencyId)
      replaceBrowserHistory('inputCurrency', inputCurrencyId)
      replaceBrowserHistory('outputCurrencyId', outputCurrencyId)
      setValue(`${getSymbol(input)}/${getSymbol(output)}`)
    }
  }

  const [onPresentCurrencyModal] = useModal(<CurrencySearchModal onMultiCurrencySelect={handleSelectCurrency} />)

  const onCurrencySelectClick = useCallback(() => {
    onPresentCurrencyModal()
  }, [onPresentCurrencyModal])

  return (
    <StyledPriceChart
      height="70%"
      overflow="unset"
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      $isFullWidthContainer={isFullWidthContainer}
    >
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
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </FlexPointer>
      <BasicChart
        token0Address={token0Address}
        token1Address={token1Address}
        isChartExpanded={isChartExpanded}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        isMobile={isMobile}
        currentSwapPrice={currentSwapPrice}
      />
    </StyledPriceChart>
  )
}

export default PriceChart
