import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { useStakingList } from '../Hooks/useStakingList'
import { BorderLayout, StyledIcon, StyledIconImage, StyledTextTitle } from '../style'
import StakingItem from './StakingItem'
import { UnStakeActions } from './UnStakeActions'

function StakingList() {
  const { t } = useTranslation()

  const { data, periodTime } = useStakingList()

  const renderHeader = () => {
    return (
      <BorderLayout p="16px">
        <Flex justifyContent="space-around">
          <Flex alignItems="center">
            <StyledIcon>
              <StyledIconImage src="/images/staking/icon-package.svg" />
            </StyledIcon>
            <Box ml="16px">
              <StyledTextTitle fontSize="10px">{t('Total Package ')}</StyledTextTitle>
              <Text fontSize="16px" fontWeight="600">
                {data?.totalPackage ?? 'NaN'}
              </Text>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <StyledIcon>
              <StyledIconImage src="/images/staking/icon-amount.svg" />
            </StyledIcon>
            <Box ml="16px">
              <StyledTextTitle fontSize="10px">{t('Total Staked Amount')}</StyledTextTitle>
              <Text fontSize="16px" fontWeight="600">
                {data?.totalStakedDisplay ?? 'NaN'}
              </Text>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <StyledIcon>
              <StyledIconImage src="/images/staking/icon-reward.svg" />
            </StyledIcon>
            <Box ml="16px">
              <StyledTextTitle fontSize="10px">{t('Total U2U Reward')}</StyledTextTitle>
              <Text fontSize="16px" fontWeight="600">
                {data?.totalRewardDisplay ?? 'NaN'}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </BorderLayout>
    )
  }

  return (
    <>
      {renderHeader()}
      {data?.staked.map((e) => {
        return (
          <StakingItem stakedInfo={e} key={`amm-staked-${e.id}`}>
            <Button
              height="40px"
              variant="secondary"
              className="button-hover"
              onClick={() => {
                console.log('handle stake')
              }}
            >
              {t('Unstake')}
            </Button>
          </StakingItem>
        )
      })}
      {data?.unStake.map((e) => {
        return (
          <StakingItem stakedInfo={e} key={`amm-un-staked-${e.id}`}>
            <UnStakeActions
              data={e}
              periodTime={periodTime}
              handleWithdraw={() => {
                console.log('Handle withdraw________')
              }}
            />
          </StakingItem>
        )
      })}
    </>
  )
}

export default StakingList
