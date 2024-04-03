import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useStakingList } from '../Hooks/useStakingList'
import { BorderLayout, StyledIcon, StyledIconImage, StyledTextTitle } from '../style'
import StakingItem from './StakingItem'
import StakingLoading from './StakingLoading'

function StakingList() {
  const { t } = useTranslation()
  const { data, periodTime, loading } = useStakingList()

  const renderHeaderItem = ({image, title, value}: {
    image: string, 
    title: string,
    value: string | null | undefined,
  }) => {
    return (
      <Flex alignItems="center">
        <StyledIcon>
          <StyledIconImage src={image} />
        </StyledIcon>
        <Box ml="16px">
          <StyledTextTitle fontSize="10px">{t(title)}</StyledTextTitle>
          {loading ? <Skeleton height={12} width={60}/> : <Text fontSize="16px" fontWeight="600">
            {value ?? '--'}
          </Text>}
        </Box>
      </Flex>
    )
  }
  const renderHeader = () => {
    return (
      <BorderLayout p="16px">
        <Flex justifyContent="space-around">
          {renderHeaderItem({
            image: "/images/staking/icon-package.svg", 
            title: 'Total Package', 
            value: data?.totalPackage?.toString() ?? '0'
          })}
          {renderHeaderItem({
            image: "/images/staking/icon-amount.svg", 
            title: 'Total Staked Amount', 
            value: data?.totalStakedDisplay
          })}
          {renderHeaderItem({
            image: "/images/staking/icon-reward.svg", 
            title: 'Total U2U Reward', 
            value: data?.totalRewardDisplay
          })}
        </Flex>
      </BorderLayout>
    )
  }


  return (
    <>
      {renderHeader()}
      {loading && <StakingLoading/>}
      {data?.staked.map((e) => {
        return <StakingItem stakedInfo={e} periodTime={periodTime ?? Number.NaN} isUnStake={false} key={`amm-staked-${e.id}`}/>
      })}
      {data?.unStake.map((e) => {
        return <StakingItem stakedInfo={e} periodTime={periodTime ?? Number.NaN} isUnStake key={`amm-un-staked-${e.id}`}/>
      })}
    </>
  )
}

export default StakingList
