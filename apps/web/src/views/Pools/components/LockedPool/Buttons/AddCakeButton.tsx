import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps, Skeleton, useModal } from '@pancakeswap/uikit'
import { memo, useCallback } from 'react'
import { usePool } from 'state/pools/hooks'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'

interface AddButtonPropsType extends AddButtonProps, ButtonProps {}

const AddCakeButton: React.FC<React.PropsWithChildren<AddButtonPropsType>> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  stakingTokenBalance,
  stakingTokenPrice,
  customLockAmount,
  ...props
}) => {
  const {
    pool: { userDataLoaded },
  } = usePool(0)

  const { t } = useTranslation()

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      currentLockedAmount={currentLockedAmount}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      lockEndTime={lockEndTime}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
      customLockAmount={customLockAmount}
    />,
    true,
    true,
    'AddAmountModal',
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const handleClicked = useCallback(() => {
    return currentBalance.gt(0) ? openAddAmountModal() : onPresentTokenRequired()
  }, [currentBalance, openAddAmountModal, onPresentTokenRequired])

  return userDataLoaded ? (
    <Button
      onClick={handleClicked}
      width="100%"
      style={{ whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0 }}
      {...props}
    >
      {t('Add U2U')}
    </Button>
  ) : (
    <Skeleton height={48} />
  )
}

export default memo(AddCakeButton)
