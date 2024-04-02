import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { MouseEventHandler } from 'react'
import { T } from 'vitest/dist/reporters-1evA5lom'
import { StakedInfo } from '../Hooks/useStakingList'

type UnStakeActionsProps = {
  data: StakedInfo
  periodTime: number
  handleWithdraw: MouseEventHandler<T> | undefined
}

export function UnStakeActions({ data, periodTime, handleWithdraw }: UnStakeActionsProps) {
  const { t } = useTranslation()

  const unStakeTime = dayjs.unix(data.timestamp)
  const remainTime = unStakeTime.add(periodTime, 'second').diff(dayjs()) // default milliseconds

  if (remainTime <= 0) {
    return (
      <Button height="40px" variant="secondary" className="button-hover" onClick={handleWithdraw}>
        {t('Withdraw')}
      </Button>
    )
  }
  return (
    <Box>
      <Text textAlign="center" fontSize="16px" fontWeight="700" color="secondary">
        {t('Release In')}
      </Text>
      <Text fontSize="16px" letterSpacing="0.5px" fontWeight="500">
        {dayjs.duration(remainTime).format('HH:mm:ss')}
      </Text>
    </Box>
  )
}
