import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, ExpandIcon, Flex, IconButton, Input, ShrinkIcon, Skeleton, Text } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useChainNameByQuery } from 'state/info/hooks'
import { PoolData } from 'state/info/types'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { styled } from 'styled-components'
import { DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { useSearchData } from 'views/V3Info/hooks'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'

const StyledInput = styled(Input)`
  z-index: 9999;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const BoxMenu = styled(Box)`
  position: relative;
`

const HoverRowLink = styled.div`
  padding: 5px 10px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  top: 50px;
  min-width: 200px;
  max-height: 400px;
  overflow: auto;
  left: 0;
  padding: 1rem;
  padding-bottom: 1.5rem;
  position: absolute;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  margin-top: 4px;
`
const HoverText = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  display: block;
  margin-top: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
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
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const getAddress = (token: any) => {
    if (native.wrapped.address.toLowerCase() === token.address?.toLowerCase()) {
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
  const { t } = useTranslation()
  const chainName = useChainNameByQuery()
  const [value, setValue] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const debouncedSearchTerm = useDebounce(value, 600)
  const [poolsShown, setPoolsShown] = useState(3)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const showMorePoolRef = useRef<HTMLDivElement>(null)
  const { pools, loading } = useSearchData(debouncedSearchTerm)

  const listTopPool = useMemo(() => {
    const list: Array<{
      token0: any
      token1: any
    }> = []
    const listId: Array<string> = []
    poolDatas.forEach((item: PoolData) => {
      const id = `${item.token0?.address}/${item.token1?.address}`
      if (listId.indexOf(id) === -1) {
        list.push({
          token0: item.token0,
          token1: item.token1,
        })
        listId.push(id)
      }
    })
    return list
  }, [poolDatas])

  const handleChange = (option: any) => {
    const inputCurrencyId = getAddress(option.token0) || ''
    const outputCurrencyId = getAddress(option?.token1) || ''
    onSelectPair(inputCurrencyId, outputCurrencyId)
    replaceBrowserHistory('inputCurrency', inputCurrencyId)
    replaceBrowserHistory('outputCurrencyId', outputCurrencyId)
    setValue(`${getSymbol(option.token0)}/${getSymbol(option.token1)}`)
    setShowMenu(false)
  }

  const listPool = useMemo(() => {
    return pools?.length > 0 ? pools : listTopPool
  }, [pools, listTopPool])

  const handleOutsideClick = (e: any) => {
    const menuClick = menuRef.current && menuRef.current.contains(e.target)
    const inputCLick = inputRef.current && inputRef.current.contains(e.target)
    const showMorePoolClick = showMorePoolRef.current && showMorePoolRef.current.contains(e.target)
    if (!menuClick && !inputCLick && !showMorePoolClick) {
      setPoolsShown(3)
      setShowMenu(false)
    }
  }

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick)
    } else {
      document.removeEventListener('click', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [showMenu])

  return (
    <StyledPriceChart
      height="70%"
      overflow="unset"
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      $isFullWidthContainer={isFullWidthContainer}
    >
      <Flex justifyContent="space-between" px="24px">
        <BoxMenu minWidth="165px">
          <StyledInput
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder="Select pairs"
            ref={inputRef}
            onFocus={() => {
              setShowMenu(true)
            }}
          />
          {showMenu && (
            <Menu ref={menuRef}>
              {loading && value?.length > 0 ? (
                <Skeleton />
              ) : (
                listPool?.slice(0, poolsShown).map((p) => (
                  <HoverRowLink
                    onClick={() => {
                      handleChange(p)
                    }}
                  >
                    <Flex>
                      <DoubleCurrencyLogo
                        address0={p.token0.address}
                        address1={p.token1.address}
                        chainName={chainName}
                      />
                      <Text ml="10px" style={{ whiteSpace: 'nowrap' }}>
                        <Text>{`${getSymbol(p.token0)} / ${getSymbol(p.token1)}`}</Text>
                      </Text>
                    </Flex>
                  </HoverRowLink>
                ))
              )}
              <HoverText
                onClick={() => {
                  if (poolsShown + 5 < listPool?.length) setPoolsShown(poolsShown + 5)
                  else setPoolsShown(listPool?.length)
                }}
                ref={showMorePoolRef}
                style={{ display: listPool?.length <= poolsShown ? 'none' : 'block' }}
              >
                {t('See more...')}
              </HoverText>
            </Menu>
          )}
        </BoxMenu>
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
