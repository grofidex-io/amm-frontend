import { useTranslation } from '@pancakeswap/localization'
import { Button, useToast } from '@pancakeswap/uikit'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCurrency } from 'hooks/Tokens'
import useCatchTxError from 'hooks/useCatchTxError'
import { useStakingContract } from 'hooks/useContract'
import { useAtom } from 'jotai'
import { resetStakingStake, updateStakingAmountError } from 'state/staking/actions'
import { useStakingState } from 'state/staking/hooks'
import { stakingReducerAtom } from 'state/staking/reducer'
import { stake } from 'utils/calls/staking'

const FormStakingBtn = () => {
  const { t } = useTranslation()

  const { currencyId, stakingAmount, stakingAmountError } = useStakingState()
  const currency = useCurrency(currencyId)

  const [, dispatch] = useAtom(stakingReducerAtom)
  const stakingContract = useStakingContract()

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
      const value = BigNumber(stakingAmount).multipliedBy(bigIntToBigNumber(10n ** BigInt(currency?.decimals ?? 18)))
      const receipt = await fetchWithCatchTxError(() => stake(stakingContract, value.toFixed(0, BigNumber.ROUND_DOWN)))
      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully staked.')}
          </ToastDescriptionWithTx>,
        )
        dispatch(resetStakingStake())
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Button
      width="100%"
      className="button-hover"
      // disabled={isPending}
      onClick={handleStake}
    >
      {t('Stake')}
    </Button>
  )
}

export default FormStakingBtn
