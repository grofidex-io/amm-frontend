import { useTranslation } from '@pancakeswap/localization'
import { Button, useToast } from '@pancakeswap/uikit'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useStakingContract } from 'hooks/useContract'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { resetStakingState, updateStakingAmountError } from 'state/staking/actions'
import { useStakingState } from 'state/staking/hooks'
import { stakingReducerAtom } from 'state/staking/reducer'
import styled from 'styled-components'
import { stake } from 'utils/calls/staking'
import useStakingConfig from '../Hooks/useStakingConfig'
import { useStakingList } from '../Hooks/useStakingList'

const StyledButton = styled(Button)`
  @media screen and (max-width: 991px) {
    height: 44px;
  }
`

const FormStakingBtn = () => {
  const { t } = useTranslation()

  const { stakingAmount, stakingAmountError } = useStakingState()
  const { currency } = useStakingConfig()

  const [, dispatch] = useAtom(stakingReducerAtom)
  const stakingContract = useStakingContract()
  const { refresh } = useStakingList()
  const [ isStaking, setIsStaking ] = useState(false)

  const { toastSuccess } = useToast()
  // const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { fetchWithCatchTxError } = useCatchTxError()

  const handleStake = async () => {
    try {
      if (stakingAmount === '' || BigNumber(stakingAmount).eq(0)) {
        dispatch(updateStakingAmountError(t('Enter an amount')))
        return
      }
      if (stakingAmountError) {
        return
      }
      setIsStaking(true)
      const value = BigNumber(stakingAmount).multipliedBy(bigIntToBigNumber(10n ** BigInt(currency?.decimals ?? 18)))
      const receipt = await fetchWithCatchTxError(() => stake(stakingContract, value.toFixed(0, BigNumber.ROUND_DOWN)))
      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully staked.')}
          </ToastDescriptionWithTx>,
        )
        dispatch(resetStakingState())
        refresh()
      }
      setIsStaking(false)
    } catch (e) {
      console.error(e)
      setIsStaking(false)
    }
  }

  return (
    <StyledButton
      width="100%"
      className="button-hover"
      disabled={isStaking}
      onClick={handleStake}
    >
      {isStaking ? t('Staking...') : t('Stake')}
    </StyledButton>
  )
}

export default FormStakingBtn
