import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { BottomDrawer, Flex, Heading, Modal, ModalV2, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { AppBody } from 'components/App'
import { useCallback, useContext, useMemo } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { currencyId } from 'utils/currencyId'

import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { BigNumber } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import TransactionsTable from 'views/V3Info/components/TransactionsTable'
import { useProtocolTransactionDataWidthPair, useTopPoolsData } from 'views/V3Info/hooks'
import Page from '../Page'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import { V3SwapForm } from './V3Swap'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import HotTokenList from './components/HotTokenList'
import useWarningImport from './hooks/useWarningImport'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'

export default function Swap() {
  // const { query } = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const {
    isChartExpanded,
    isChartDisplayed,
    setIsChartDisplayed,
    setIsChartExpanded,
    isChartSupported,
    isHotTokenSupported,
  } = useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()
  // const [firstTime, setFirstTime] = useState(true)

  // useEffect(() => {
  //   if (firstTime && query.showTradingReward) {
  //     setFirstTime(false)
  //     setIsSwapHotTokenDisplay(true)
  //     if (!isSwapHotTokenDisplay && isChartDisplayed) {
  //       setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
  //     }
  //   }
  // }, [firstTime, isChartDisplayed, isSwapHotTokenDisplay, query, setIsSwapHotTokenDisplay, setIsChartDisplayed])

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  const transactionData = useProtocolTransactionDataWidthPair({
    token0: inputCurrency?.wrapped.address?.toLowerCase() || '',
    token1: outputCurrency?.wrapped.address?.toLowerCase() || '',
  })

  const { onSelectPair } = useSwapActionHandlers()
  const native = useNativeCurrency()
  const getAddress = (token: any) => {
    if (native.wrapped.address.toLowerCase() === token.wrapped.address?.toLowerCase()) {
      return native.symbol
    }
    return token.address
  }

  const handleSelectCurrency = (listCurrency: Array<Currency>) => {
    if (listCurrency[0] && listCurrency[1]) {
      let input = listCurrency[0]
      let output = listCurrency[1]
      if (!BigNumber.from(listCurrency[0].wrapped.address).lt(BigNumber.from(listCurrency[1].wrapped.address))) {
        input = listCurrency[1]
        output = listCurrency[0]
      }
      const _inputCurrencyId = getAddress(input) || ''
      const _outputCurrencyId = _inputCurrencyId === 'U2U' ? output.wrapped?.address : getAddress(output) || ''
      onSelectPair(_inputCurrencyId, _outputCurrencyId)
      replaceBrowserHistory('inputCurrency', _inputCurrencyId)
      replaceBrowserHistory('outputCurrencyId', _outputCurrencyId)
      // setValue(`${getSymbol(input)}/${getSymbol(output)}`)
    }
  }
  const [onPresentCurrencyModal] = useModal(<CurrencySearchModal onMultiCurrencySelect={handleSelectCurrency} />)
  const onCurrencySelectClick = useCallback(() => {
    onPresentCurrencyModal()
  }, [onPresentCurrencyModal])

  const singleTokenPrice = useSingleTokenSwapInfo(
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    isChartSupported,
  )

  const warningSwapHandler = useWarningImport()
  useDefaultsFromURLSearch()
  const { onCurrencySelection } = useSwapActionHandlers()

  const handleOutputSelect = useCallback(
    (newCurrencyOutput: Currency) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)
      warningSwapHandler(newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const topPoolsData = useTopPoolsData()

  const poolDatas = useMemo(() => {
    if (topPoolsData)
      return Object.values(topPoolsData)
        .map((p) => p)
        .filter((p) => !isUndefinedOrNull(p))
    return []
  }, [topPoolsData])

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width={['328px', '100%']} justifyContent="center" position="relative" alignItems="flex-start">
        <Flex flexDirection="column" width={['328px', '100%']}>
          {isDesktop && isChartSupported && (
            <PriceChartContainer
              onCurrencySelectClick={onCurrencySelectClick}
              inputCurrencyId={inputCurrencyId}
              inputCurrency={currencies[Field.INPUT]}
              outputCurrencyId={outputCurrencyId}
              outputCurrency={currencies[Field.OUTPUT]}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              isChartDisplayed={isChartDisplayed}
              currentSwapPrice={singleTokenPrice}
              poolDatas={poolDatas}
            />
          )}
          {!isDesktop && isChartSupported && (
            <BottomDrawer
              content={
                <PriceChartContainer
                  inputCurrencyId={inputCurrencyId}
                  inputCurrency={currencies[Field.INPUT]}
                  outputCurrencyId={outputCurrencyId}
                  outputCurrency={currencies[Field.OUTPUT]}
                  isChartExpanded={isChartExpanded}
                  setIsChartExpanded={setIsChartExpanded}
                  isChartDisplayed={isChartDisplayed}
                  currentSwapPrice={singleTokenPrice}
                  isFullWidthContainer
                  isMobile
                  poolDatas={poolDatas}
                />
              }
              isOpen={isChartDisplayed}
              setIsOpen={(isOpen) => setIsChartDisplayed?.(isOpen)}
            />
          )}
          {isDesktop && isSwapHotTokenDisplay && isHotTokenSupported && (
            <HotTokenList handleOutputSelect={handleOutputSelect} />
          )}
          <ModalV2
            isOpen={!isDesktop && isSwapHotTokenDisplay && isHotTokenSupported}
            onDismiss={() => setIsSwapHotTokenDisplay(false)}
          >
            <Modal
              style={{ padding: 0 }}
              title={t('Top Token')}
              onDismiss={() => setIsSwapHotTokenDisplay(false)}
              bodyPadding="0px"
            >
              <HotTokenList
                handleOutputSelect={(newCurrencyOutput: Currency) => {
                  handleOutputSelect(newCurrencyOutput)
                  setIsSwapHotTokenDisplay(false)
                }}
              />
            </Modal>
          </ModalV2>
          <Heading scale="lg" mt="40px" mb="16px">
            {t('Transactions')}
          </Heading>
          {transactionData ? <TransactionsTable transactions={transactionData} type="SWAP_TRANSACTION" /> : null}
        </Flex>
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <V3SwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
