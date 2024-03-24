import { U2U_REWARD } from '@pancakeswap/sdk'
import { Balance, Link, OpenNewIcon, Skeleton } from '@pancakeswap/uikit'
import { useRewardBalance } from 'state/farms/hooks'
import styled, { useTheme } from 'styled-components'

const BalanceWrap = styled(Balance)`
  color: ${({ theme }) => theme.colors.primary};
`

export function FarmV3Reward() {
  const theme = useTheme()
  const { data: balance, isFetching } = useRewardBalance()

  if (isFetching) {
    return <Skeleton width={60} />
  }
  return (
    <Link ml="4px" href={`/swap?inputCurrency=U2U&outputCurrency=${U2U_REWARD.address.toLowerCase()}`}>
      <BalanceWrap value={Number(balance)} decimals={2} fontWeight={600} fontSize={20} marginRight={1} />
      <OpenNewIcon color={theme.colors.primary} />
    </Link>
  )
}
