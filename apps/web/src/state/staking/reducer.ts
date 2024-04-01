import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { replaceStakingState, resetStakingState, updateSlippagePercent, updateStakingAmountError } from './actions'

export interface StakingState {
  readonly currencyId: string
  readonly stakingAmount: string
  readonly stakingAmountError: string
  readonly slippagePercent: number | undefined
}

const initialState: StakingState = {
  currencyId: 'U2U',
  stakingAmount: '',
  stakingAmountError: '',
  slippagePercent: undefined,
}

const reducer = createReducer<StakingState>(initialState, (builder) =>
  builder
    .addCase(replaceStakingState, (state, { payload: { amount, amountError, percent } }) => {
      return {
        currencyId: state.currencyId,
        stakingAmount: amount,
        stakingAmountError: amountError,
        slippagePercent: percent,
      }
    })
    .addCase(updateSlippagePercent, (state, { payload: percent }) => {
      state.slippagePercent = percent
    })
    .addCase(updateStakingAmountError, (state, { payload: msg }) => {
      state.stakingAmountError = msg
    })
    .addCase(resetStakingState, () => initialState),
)

export const stakingReducerAtom = atomWithReducer(initialState, reducer)
