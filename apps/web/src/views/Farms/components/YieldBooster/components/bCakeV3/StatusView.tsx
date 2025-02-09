import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, HelpIcon, Text, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useBCakeBoostLimitAndLockInfo } from '../../hooks/bCakeV3/useBCakeV3Info'
import { BoostStatus } from '../../hooks/bCakeV3/useBoostStatus'

const BoosterTooltip = () => {
  const { t } = useTranslation()
  return (
    <>
      {t(
        `Boost multiplier is calculated based on the staking conditions from both Farms and veCAKE. Numbers will be automatically updated upon user actions.`,
      )}
    </>
  )
}

export const StatusView: React.FC<{
  status: BoostStatus
  boostedMultiplier?: number
  expectMultiplier?: number
  isFarmStaking?: boolean
  shouldUpdate?: boolean
}> = ({ status, boostedMultiplier, isFarmStaking, shouldUpdate, expectMultiplier }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { address: account } = useAccount()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<BoosterTooltip />, {
    placement: 'top',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  const { locked, isLockEnd } = useBCakeBoostLimitAndLockInfo()
  const bCakeMessage = useBCakeMessage(
    account,
    Boolean(isFarmStaking),
    locked,
    isLockEnd,
    false,
    status === BoostStatus.farmCanBoostButNot,
    status === BoostStatus.Boosted,
    shouldUpdate ?? false,
  )

  return (
    <Box>
      <Text color="textSubtle" bold fontSize={12} lineHeight="120%" textTransform="uppercase">
        {t('Yield Booster')}
      </Text>
      <Flex alignItems="center">
        {shouldUpdate ? (
          <Flex>
            <Text fontSize={16} lineHeight="120%" bold color="success" mr="3px">
              {(expectMultiplier ?? 0) < 1.001 && expectMultiplier !== 1
                ? '< 1.001'
                : expectMultiplier?.toLocaleString('en-US', {
                    maximumFractionDigits: 3,
                  })}
              x
            </Text>
            <Text fontSize={16} lineHeight="120%" bold color="textSubtle" style={{ textDecoration: 'line-through' }}>
              {boostedMultiplier?.toLocaleString('en-US', {
                maximumFractionDigits: 3,
              })}
              x
            </Text>
          </Flex>
        ) : (
          <Text fontSize={16} lineHeight="120%" bold color="textSubtle">
            {(status === BoostStatus.Boosted || (status === BoostStatus.farmCanBoostButNot && isFarmStaking)) &&
            locked &&
            !isLockEnd
              ? `${
                  (boostedMultiplier ?? 0) < 1.001 && boostedMultiplier !== 1
                    ? '< 1.001'
                    : boostedMultiplier?.toLocaleString('en-US', {
                        maximumFractionDigits: 3,
                      })
                }x`
              : expectMultiplier && expectMultiplier > 1
              ? `${expectMultiplier?.toLocaleString('en-US', {
                  maximumFractionDigits: 3,
                })}x`
              : t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
          </Text>
        )}
        <Flex ref={targetRef}>
          <HelpIcon color="textSubtle" width="20px" height="20px" />
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
      <Text color="textSubtle" fontSize={12} lineHeight="120%">
        {bCakeMessage}
      </Text>
    </Box>
  )
}

const useBCakeMessage = (
  account: `0x${string}` | undefined,
  isFarmStaking: boolean,
  locked: boolean,
  isLockEnd: boolean,
  isReachedMaxBoostLimit: boolean,
  canBoostedButNot: boolean,
  boosted: boolean,
  shouldUpdate: boolean,
) => {
  const { t } = useTranslation()
  const bCakeMessage = useMemo(() => {
    if (!account) return t('Connect wallet to activate yield booster')
    if (!isFarmStaking) return t('Start staking to activate yield booster.')
    if (!locked) return t('Get veCAKE to activate yield booster')
    if (shouldUpdate) return t('Click to update and increase your boosts.')
    if (isLockEnd) return t('Renew your U2U staking to activate yield booster')
    if (isReachedMaxBoostLimit && canBoostedButNot) return t('Unset other boosters to activate')
    if (canBoostedButNot) return t('Yield booster available')
    if (boosted) return t('Active')
    return ''
  }, [t, account, isFarmStaking, locked, isLockEnd, isReachedMaxBoostLimit, canBoostedButNot, boosted, shouldUpdate])
  return bCakeMessage
}
