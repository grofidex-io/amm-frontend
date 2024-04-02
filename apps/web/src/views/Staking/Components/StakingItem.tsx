import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Text, useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useStakingContract } from 'hooks/useContract'
import { ReactNode } from 'react'
import { claimReward } from 'utils/calls/staking'
import { StakedInfo } from '../Hooks/useStakingList'
import { BorderLayout, StyledBox, StyledTextTitle } from '../style'

type StakingProps = {
  stakedInfo: StakedInfo
  children?: ReactNode
}

const StakingItem = ({ stakedInfo, children }: StakingProps) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const enableClaim = stakedInfo.reward.gt(BigNumber(0))

  const stakingContract = useStakingContract()

  async function handleClaim() {
    const receipt = await fetchWithCatchTxError(() => claimReward(stakingContract, stakedInfo.id))
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed.')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <BorderLayout p="30px 40px">
      <Flex style={{ gap: '100px' }}>
        <StyledBox>
          <StyledTextTitle fontSize="20px">{t('Staked Amount')} (U2U)</StyledTextTitle>
          <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
            <Text fontSize="36px" lineHeight="1">
              {stakedInfo.amountDisplay}
            </Text>
            {children}
          </Flex>
        </StyledBox>
        <StyledBox>
          <StyledTextTitle fontSize="20px">
            <Text fontFamily="'Metuo', sans-serif" fontSize="20px" fontWeight="900" color="secondary" mr="8px">
              U2U
            </Text>
            {t('Reward')}
          </StyledTextTitle>
          <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
            <Text fontSize="36px" lineHeight="1">
              {stakedInfo.rewardDisplay}
            </Text>
            <Button height="42px" width="120px" disabled={!enableClaim} className="button-hover" onClick={handleClaim}>
              {t('Claim')}
            </Button>
          </Flex>
        </StyledBox>
      </Flex>
    </BorderLayout>
  )
}

export default StakingItem
