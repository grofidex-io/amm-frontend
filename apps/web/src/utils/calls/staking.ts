import { getStakingContract } from 'utils/contractHelpers'

export const stake = async (stakingContract: ReturnType<typeof getStakingContract>, amount: string) => {
  if (!stakingContract.account) return undefined
  return stakingContract.write.stake([0], {
    // gas: DEFAULT_GAS_LIMIT,
    // gasPrice,
    account: stakingContract.account,
    chain: stakingContract.chain,
    value: amount,
  })
}
