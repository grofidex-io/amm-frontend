import { createAction } from '@reduxjs/toolkit'

export const replaceStakingState = createAction<{
  amount: string
  amountError: string
  percent: number | undefined
}>('staking/replaceStakingState')

export const updateSlippagePercent = createAction<number | undefined>('staking/updateSlippagePercent')

export const updateStakingAmountError = createAction<string>('staking/updateStakingAmountError')

export const resetStakingStake = createAction('staking/resetStakingStake')
