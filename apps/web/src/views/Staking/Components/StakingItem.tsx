import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Text, useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useStakingContract } from 'hooks/useContract'
import { useState } from 'react'
import { claimReward, unStake, withdraw } from 'utils/calls/staking'
import useStakingConfig from '../Hooks/useStakingConfig'
import { StakedInfo, useStakingList } from '../Hooks/useStakingList'
import { BorderLayout, StyledBox, StyledTextTitle } from '../style'
import { UnStakeActions } from './UnStakeActions'

type StakingProps = {
  stakedInfo: StakedInfo
  periodTime: number
  isUnStake: boolean
}

const StakingItem = ({ stakedInfo, periodTime, isUnStake }: StakingProps) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const [ isClaiming, setIsClaiming ] = useState(false)
  const [ isUnStaking, setIsUnStaking] = useState(false)
  const [ isWithdrawing, setIsWithdrawing] = useState(false)

  const enableClaim = stakedInfo.reward.gt(BigNumber(0))

  const stakingContract = useStakingContract()
  const { currency } = useStakingConfig()
  const { refresh } = useStakingList()

  const handUnStake = async () => {
    if (isUnStaking) return
    setIsUnStaking(true)
    const receipt = await fetchWithCatchTxError(() => unStake(stakingContract, stakedInfo.id))
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully unStaked.')}
        </ToastDescriptionWithTx>,
      )
      refresh()
    }
    setIsUnStaking(false)
  }

  async function handleClaim() {
    if (isClaiming) return
    setIsClaiming(true)
    const receipt = await fetchWithCatchTxError(() => claimReward(stakingContract, stakedInfo.id))
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed.')}
        </ToastDescriptionWithTx>,
      )
      refresh()
    }
    setIsClaiming(false)
  }

  async function handleWithdraw() {
    if (isWithdrawing) return
    setIsWithdrawing(true)
    const receipt = await fetchWithCatchTxError(() => withdraw(stakingContract, stakedInfo.id))
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully withdrawn.')}
        </ToastDescriptionWithTx>,
      )
      refresh()
    }
    setIsWithdrawing(false)
  }

  const renderAction = () => {
    if (!isUnStake) {
      return (
        <Button
          height="40px"
          variant="secondary"
          disabled={enableClaim}
          className="button-hover"
          onClick={handUnStake}
        >
          {isUnStaking ? t('Unstaking...') : t('Unstake')}
        </Button>
      )
    }
    return (
      <UnStakeActions
        title={isWithdrawing ? t('Withdrawing...') : t('Withdraw')}
        data={stakedInfo}
        periodTime={periodTime}
        handleWithdraw={handleWithdraw}
      />
    )
  }

  return (
    <BorderLayout p="30px 40px">
      <Flex style={{ gap: '100px' }}>
        <StyledBox>
          <StyledTextTitle fontSize="20px">{t('Staked Amount')} ({currency.symbol})</StyledTextTitle>
          <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
            <Text fontSize="36px" lineHeight="1">
              {stakedInfo.amountDisplay}
            </Text>
            {renderAction()}
          </Flex>
        </StyledBox>
        <StyledBox>
          <StyledTextTitle fontSize="20px">
            <Text fontFamily="'Metuo', sans-serif" fontSize="20px" fontWeight="900" color="secondary" mr="8px">
              {currency.symbol}
            </Text>
            {t('Reward')}
          </StyledTextTitle>
          <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
            <Text fontSize="36px" lineHeight="1">
              {stakedInfo.rewardDisplay}
            </Text>
            <Button height="42px" width="120px" disabled={!enableClaim} className="button-hover" onClick={handleClaim}>
              {isClaiming ? t('Claiming...'): t('Claim')}
            </Button>
          </Flex>
        </StyledBox>
      </Flex>
    </BorderLayout>
  )
}

export default StakingItem
