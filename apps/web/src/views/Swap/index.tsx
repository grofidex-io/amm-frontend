import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Flex, Tab, TabMenu, useModal } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { AppBody } from 'components/App'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { currencyId } from 'utils/currencyId'

import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { BigNumber } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import TransactionsTable from 'views/V3Info/components/TransactionsTable'
import { useProtocolTransactionDataWidthPair, useTopPoolsData } from 'views/V3Info/hooks'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import { V3SwapForm } from './V3Swap'
import { TopHolders } from './V3Swap/containers/TopHolders'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import useWarningImport from './hooks/useWarningImport'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'

export default function Swap() {
  // const { query } = useRouter()
  // const { isDesktop } = useMatchBreakpoints()
  const {
    isChartExpanded,
    isChartDisplayed,
    setIsChartExpanded,
    isChartSupported,
    // isHotTokenSupported,
  } = useContext(SwapFeaturesContext)
  // const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [isOnlyMyTransaction, setOnlyMyTransaction] = useState<boolean>(false)
  const [tab, setTab] = useState<number>(0)
  // const [timeFetchTransaction, updateTimeFetchTransaction] = useState<number>(0)
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
    origin: isOnlyMyTransaction && account ? account : null,
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

      if (
        !BigNumber.from(listCurrency[0].wrapped.address).lt(BigNumber.from(listCurrency[1].wrapped.address)) &&
        output.wrapped?.address?.toLowerCase() !== input?.wrapped?.address?.toLowerCase()
      ) {
        input = listCurrency[1]
        output = listCurrency[0]
      }
      const _inputCurrencyId = getAddress(input) || ''
      const _outputCurrencyId = _inputCurrencyId === 'U2U' ? output.wrapped?.address : getAddress(output) || ''
      onSelectPair(_inputCurrencyId, _outputCurrencyId)
      replaceBrowserHistory('inputCurrency', _inputCurrencyId)
      replaceBrowserHistory('outputCurrency', _outputCurrencyId)
    }
  }
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal onMultiCurrencySelect={handleSelectCurrency} isSelectMulti />,
  )
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

  const handleFilter = () => {
    setOnlyMyTransaction(!isOnlyMyTransaction)
  }

  return (
    <>
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex
        flexDirection={['column', 'column', 'column', 'column', 'row']}
        justifyContent="center"
        position="relative"
        alignItems="flex-start"
        width="100%"
      >
        <Flex
          flexDirection="column"
          order={['2', '2', '2', '2', '1']}
          width={['100%', '100%', '100%', '100%', 'auto']}
          flexGrow={2}
          style={{ minWidth: `calc(100vw - 510px)` }}
        >
          {isChartSupported && (
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
          {/* {!isDesktop && isChartSupported && (
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
          )} */}
          {/* {isSwapHotTokenDisplay && isHotTokenSupported && <HotTokenList handleOutputSelect={handleOutputSelect} />} */}
          {/* <ModalV2
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
          </ModalV2> */}
          <Box mt={['30px', '30px', '36px', '40px', '48px']}>
            <TabMenu activeIndex={tab} onItemClick={setTab} customWidth isShowBorderBottom={false}>
              <Tab>{t('Transactions')}</Tab>
              <Tab>{t('Holders')}</Tab>
            </TabMenu>
          </Box>
          {transactionData && tab === 0 && (
            <TransactionsTable
              transactions={transactionData}
              type="SWAP_TRANSACTION"
              filterFn={handleFilter}
              toggleFilter={isOnlyMyTransaction}
              account={account}
            />
          )}
          {tab === 1 && <TopHolders />}
        </Flex>
        <Flex
          flexDirection="column"
          order={['1', '1', '1', '1', '2']}
          width={['100%', '100%', '100%', '100%', 'auto']}
          flexGrow={1}
          mb={['30px', '30px', '36px', '40px', '0']}
        >
          <StyledSwapContainer $isChartExpanded={isChartExpanded} margin={['auto', 'auto', 'auto', 'auto', 'unset']}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <V3SwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
    </>
  )
}
