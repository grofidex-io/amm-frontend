import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { WNATIVE } from '@pancakeswap/sdk'
import {
	Box,
	Button,
	CopyAddress,
	Flex,
	FlexGap,
	InfoFilledIcon,
	InjectedModalProps,
	LinkExternal,
	Message,
	Skeleton,
	Text,
	TooltipText,
	useTooltip,
} from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useAuth from 'hooks/useAuth'
import useNativeCurrency from 'hooks/useNativeCurrency'
import useTokenBalance from 'hooks/useTokenBalance'

import { formatBigInt, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import InternalLink from 'components/Links'
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { Address, useBalance } from 'wagmi'

const COLORS = {
  ETH: '#404040',
  BNB: '#14151A',
}

const BorderLayout = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border-radius: 8px;
  padding: 16px;
`

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  switchView: (newIndex: number) => void
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId, chain } = useActiveWeb3React()
  const { domainName } = useDomainNameForAddress(account ?? '')
  const isBSC = chainId === ChainId.BSC
  const bnbBalance = useBalance({ address: account ?? undefined, chainId: ChainId.BSC })
  const nativeBalance = useBalance({ address: account ?? undefined, enabled: !isBSC })
  const native = useNativeCurrency()
  const wNativeToken = !isBSC ? WNATIVE[chainId as ChainId] : null
  // const wBNBToken = WNATIVE[ChainId.BSC]
  const { balance: wNativeBalance, fetchStatus: wNativeFetchStatus } = useTokenBalance(wNativeToken?.address as Address)
  // const { balance: wBNBBalance, fetchStatus: wBNBFetchStatus } = useTokenBalance(wBNBToken?.address, true)
  // const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useBSCCakeBalance()
  const [mobileTooltipShow, setMobileTooltipShow] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }
  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <>
      <Box maxWidth="140px">
        <FlexGap gap="8px" flexDirection="column" justifyContent="space-between">
          <Text as="p">
            {t('%currency% Balance Low. You need %currency% for transaction fees.', {
              currency: native?.symbol,
            })}
          </Text>
          <InternalLink href="/buy-crypto" onClick={() => onDismiss?.()}>
            <Button height="30px">{t('Buy %currency%', { currency: native?.symbol })}</Button>
          </InternalLink>
        </FlexGap>
      </Box>
    </>,
    {
      isInPortal: false,
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    },
  )

  const showBscEntryPoint = Number(bnbBalance?.data?.value) === 0 && SUPPORT_BUY_CRYPTO.includes(chainId as ChainId)
  const showNativeEntryPoint =
    Number(nativeBalance?.data?.value) === 0 && SUPPORT_BUY_CRYPTO.includes(chainId as ChainId)

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <FlexGap flexDirection="column" mb="24px" gap="8px">
        <CopyAddress tooltipMessage={t('Copied')} account={account ?? undefined} />
        {domainName ? <Text color="textSubtle">{domainName}</Text> : null}
      </FlexGap>
      {hasLowNativeBalance && SUPPORT_BUY_CRYPTO.includes(chainId as ChainId) && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">
              {t('%currency% Balance Low', {
                currency: native.symbol,
              })}
            </Text>
            <InternalLink href="/buy-crypto" onClick={() => onDismiss?.()}>
              <Text color="primary">
                {t('You need %currency% for transaction fees.', {
                  currency: native.symbol,
                })}
              </Text>
            </InternalLink>
          </Box>
        </Message>
      )}
      <BorderLayout>
        {!isBSC && chain && (
          <Box mb="16px">
            <Flex justifyContent="space-between" alignItems="center" mb="8px">
              <Flex bg={COLORS.ETH} borderRadius="4px" pl="4px" pr="8px" py="2px">
                <ChainLogo chainId={chain.id} />
                <Text color="white" ml="4px">
                  {chain.name}
                </Text>
              </Flex>
              <LinkExternal href={getBlockExploreLink(account, 'address', chainId)}>
                {getBlockExploreName(chainId)}
              </LinkExternal>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">
                {native.symbol} {t('Balance')}
              </Text>
              {!nativeBalance.isFetched ? (
                <Skeleton height="22px" width="60px" />
              ) : (
                <Flex>
                  <Text
                    color={showNativeEntryPoint ? 'warning' : 'text'}
                    fontWeight={showNativeEntryPoint ? 'bold' : 'normal'}
                  >
                    {formatBigInt(nativeBalance?.data?.value ?? 0n, 6)}
                  </Text>
                  {showNativeEntryPoint ? (
                    <TooltipText
                      ref={buyCryptoTargetRef}
                      onClick={() => setMobileTooltipShow(false)}
                      display="flex"
                      style={{ justifyContent: 'center' }}
                    >
                      <InfoFilledIcon pl="2px" fill="#000" color="#D67E0A" width="22px" />
                    </TooltipText>
                  ) : null}
                  {buyCryptoTooltipVisible && (!isMobile || mobileTooltipShow) && buyCryptoTooltip}
                </Flex>
              )}
            </Flex>
            {wNativeBalance && wNativeBalance.gt(0) && (
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="textSubtle">
                  {wNativeToken?.symbol} {t('Balance')}
                </Text>
                {wNativeFetchStatus !== FetchStatus.Fetched ? (
                  <Skeleton height="22px" width="60px" />
                ) : (
                  wNativeToken?.decimals && (
                    <Text>{getFullDisplayBalance(wNativeBalance, wNativeToken?.decimals, 6)}</Text>
                  )
                )}
              </Flex>
            )}
          </Box>
        )}

        {/* <Box>
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Flex bg={COLORS.BNB} borderRadius="16px" pl="4px" pr="8px" py="2px">
              <ChainLogo chainId={ChainId.BSC} />
              <Text color="white" ml="4px">
                BNB Smart Chain
              </Text>
            </Flex>
            <ScanLink useBscCoinFallback href={getBlockExploreLink(account, 'address', ChainId.BSC)}>
              {getBlockExploreName(ChainId.BSC)}
            </ScanLink>
          </Flex>
          {chainId === 56 ? (
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">BNB {t('Balance')}</Text>
              {!bnbBalance.isFetched ? (
                <Skeleton height="22px" width="60px" />
              ) : (
                <Flex alignItems="center" justifyContent="center">
                  <Text
                    fontWeight={showBscEntryPoint ? 'bold' : 'normal'}
                    color={showBscEntryPoint ? 'warning' : 'normal'}
                  >
                    {formatBigInt(bnbBalance?.data?.value ?? 0n, 6)}
                  </Text>
                  {showBscEntryPoint ? (
                    <TooltipText
                      ref={buyCryptoTargetRef}
                      onClick={() => setMobileTooltipShow(false)}
                      display="flex"
                      style={{ justifyContent: 'center' }}
                    >
                      <InfoFilledIcon pl="2px" fill="#000" color="#D67E0A" width="22px" />
                    </TooltipText>
                  ) : null}
                  {buyCryptoTooltipVisible && (!isMobile || mobileTooltipShow) && buyCryptoTooltip}
                </Flex>
              )}
            </Flex>
          ) : null}
          {wBNBBalance.gt(0) && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">WBNB {t('Balance')}</Text>
              {wBNBFetchStatus !== FetchStatus.Fetched ? (
                <Skeleton height="22px" width="60px" />
              ) : (
                <Text>{getFullDisplayBalance(wBNBBalance, wBNBToken.decimals, 6)}</Text>
              )}
            </Flex>
          )}
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">{t('U2U Balance')}</Text>
            {cakeFetchStatus !== FetchStatus.Fetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Text>{formatBigInt(cakeBalance, 3)}</Text>
            )}
          </Flex>
        </Box> */}
      </BorderLayout>
      <Button variant="secondary" mt="24px" className="button-hover" width="100%" minHeight={48} onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
