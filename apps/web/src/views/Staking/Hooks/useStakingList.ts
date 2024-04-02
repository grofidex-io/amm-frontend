import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useCurrency } from 'hooks/Tokens'
import { useStakingContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { pendingReward, withdrawalPeriodTime } from 'utils/calls/staking'
import { ammStakingClients } from 'utils/graphql'
import { useAccount } from 'wagmi'

export interface StakedInfo {
  id: string
  amount: string
  amountDisplay: string
  timestamp: number
  reward: BigNumber
  rewardDisplay: string
}

export interface StakingResponse {
  id: string
  totalPackage: number
  totalStakedAmount: BigNumber
  totalStakedDisplay: string
  totalReward: BigNumber
  totalRewardDisplay: string
  staked: StakedInfo[]
  unStake: StakedInfo[]
}

export function useStakingList() {
  const stakingContract = useStakingContract()

  const currency = useCurrency('U2U')
  const { address: account } = useAccount()

  const [periodTime, setPeriodTime] = useState<number>(Number.NaN)
  const [data, setData] = useState<StakingResponse | null>(null)

  const formatAmount = (value: BigNumber) => {
    const rawValue: BigNumber = value.dividedBy(bigIntToBigNumber(10n ** BigInt(currency?.decimals ?? 18)))
    return Number(rawValue.toFixed(6, BigNumber.ROUND_DOWN)).toString()
  }

  async function fetchWithdrawPeriodTime() {
    const value = await withdrawalPeriodTime(stakingContract)
    setPeriodTime(Number(value))
  }

  async function fetchRewards(dataList: StakedInfo[]) {
    const results: any[] = []

    for (const e of dataList) {
      results.push(pendingReward(stakingContract, e.id))
    }

    return Promise.all(results)
  }

  async function fetchStakingList(address: string | undefined) {
    // `0x${string}`
    await fetchWithdrawPeriodTime()
    if (address == null) return
    try {
      const STAKING_LIST_QUERY = gql`
        query getStakingList($address: String!) {
          user(id: $address) {
            id
            staked(orderDirection: desc, orderBy: timestamp) {
              id
              amount
              timestamp
            }
            unStake(orderDirection: desc, orderBy: timestamp) {
              id
              amount
              timestamp
            }
          }
        }
      `
      const { user } = await ammStakingClients.request<{ user: StakingResponse | null }>(STAKING_LIST_QUERY, {
        address,
      })
      if (user == null) {
        setData(null)
        return
      }
      user.totalPackage = user.staked.length + user.unStake.length
      user.totalStakedAmount = BigNumber(0)
      user.totalReward = BigNumber(0)

      const stakedRewardLi = await fetchRewards(user.staked)
      for (let i = 0; i < user.staked.length; ++i) {
        user.staked[i].amountDisplay = formatAmount(new BigNumber(user.staked[i].amount))
        user.staked[i].reward = bigIntToBigNumber(stakedRewardLi[i] as bigint)
        user.staked[i].rewardDisplay = formatAmount(user.staked[i].reward)

        // total
        user.totalStakedAmount = user.totalStakedAmount.plus(BigNumber(user.staked[i].amount))
        user.totalReward = user.totalReward.plus(user.staked[i].reward)
      }

      const unStakeRewardLi = await fetchRewards(user.unStake)
      for (let i = 0; i < user.unStake.length; ++i) {
        user.unStake[i].amountDisplay = formatAmount(new BigNumber(user.unStake[i].amount))
        user.unStake[i].reward = bigIntToBigNumber(unStakeRewardLi[i] as bigint)
        user.unStake[i].rewardDisplay = formatAmount(user.unStake[i].reward)

        // total
        user.totalReward = user.totalReward.plus(user.unStake[i].reward)
      }

      user.totalStakedDisplay = formatAmount(user.totalStakedAmount)
      user.totalRewardDisplay = formatAmount(user.totalReward)
      setData(user)
    } catch (e) {
      console.error(e)
      setData(null)
    }
  }

  // const { data, isPending } = useQuery({
  //   queryKey: ['amm-subgraphs/staking/list'],
  //   queryFn: async () => {
  //     return await fetchStakingList('0x64fd03b33505519f704608f1c70e02e40fee2901')
  //   },
  //   // enabled: Boolean(client && tokenId),
  //   refetchInterval: 60000,
  //   refetchOnReconnect: false,
  //   refetchOnWindowFocus: false,
  // })

  useEffect(() => {
    fetchStakingList(account?.toLowerCase())
  }, [stakingContract, account, currency])

  return { data, periodTime }
}
