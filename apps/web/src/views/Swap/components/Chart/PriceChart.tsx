import { Box, ExpandIcon, Flex, IconButton, Select, ShrinkIcon } from '@pancakeswap/uikit'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo } from 'react'
import { PoolData } from 'state/info/types'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'

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
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const getSymbol = (token: any) => {
    if (native.wrapped.address.toLowerCase() === token.address?.toLowerCase()) {
      return native.symbol
    }
    return token.symbol
  }
  const options = useMemo(() => {
    const list: Array<{
      label: string
      value: string
      token0: any
      token1: any
    }> = []
    const listId: Array<string> = []
    poolDatas.forEach((item: PoolData) => {
      const value = `${item.token0?.address}/${item.token1?.address}`
      if (listId.indexOf(value) === -1) {
        list.push({
          label: `${getSymbol(item.token0)}/${getSymbol(item.token1)}`,
          value,
          token0:
            native.wrapped?.address?.toLowerCase() === item.token0?.address?.toLowerCase()
              ? native.symbol
              : item.token0?.address,
          token1:
            native.wrapped?.address?.toLowerCase() === item.token1?.address?.toLowerCase()
              ? native.symbol
              : item.token1?.address,
        })
        listId.push(value)
      }
    })
    return list
  }, [poolDatas])

  const handleChange = (option: any) => {
    const inputCurrencyId = option?.token0 || ''
    const outputCurrencyId = option?.token1 || ''
    onSelectPair(inputCurrencyId, outputCurrencyId)
  }

  return (
    <StyledPriceChart
      height="70%"
      overflow="unset"
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      $isFullWidthContainer={isFullWidthContainer}
    >
      <Flex justifyContent="space-between" px="24px">
        <Box minWidth="165px">
          <Select options={options} onOptionChange={handleChange} />
        </Box>
        {/* <Flex alignItems="center">
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
          <IconButton variant="text" onClick={onSwitchTokens}>
            <SyncAltIcon ml="6px" color="primary" />
          </IconButton>
        </Flex> */}
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
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
