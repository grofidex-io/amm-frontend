import { useTranslation } from '@pancakeswap/localization'
import { Rounding } from '@pancakeswap/swap-sdk-core'
import { Box, Flex, Input, Text } from '@pancakeswap/uikit'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import BigNumber from 'bignumber.js'
import { gql } from 'graphql-request'
import { useCurrency } from 'hooks/Tokens'
import { useStakingContract } from 'hooks/useContract'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { replaceStakingState, resetStakingState, updateCalculateApr, updateSlippagePercent } from 'state/staking/actions'
import { useStakingState } from 'state/staking/hooks'
import { stakingReducerAtom } from 'state/staking/reducer'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { validator } from 'utils/calls/staking'
import { aprSubgraphClients } from 'utils/graphql'
import { useAccount } from 'wagmi'
import { StyledButton } from '../style'

const FormStaking = () => {
  const stakingContract = useStakingContract()
  const [, dispatch] = useAtom(stakingReducerAtom)
  const { currencyId, stakingAmount, stakingAmountError, slippagePercent, apr, estimatedRewards } = useStakingState()
  const { t } = useTranslation()

  const slippagePercents = [25, 50, 75, 100]

  useEffect(() => {
    dispatch(resetStakingState())
  }, [])

  const currency = useCurrency(currencyId)
  const { address: account } = useAccount()
  const currencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const rawBalance: BigNumber = new BigNumber(
    currencyBalance?.asFraction
      .divide(10n ** BigInt(currencyBalance?.currency.decimals))
      .toFixed(6, { groupSeparator: '' }, Rounding.ROUND_DOWN) ?? '0',
  )

  const getAmountError = (value) => {
    if (value === '') {
      return t('Enter an amount')
    }
    if (BigNumber(value).gt(rawBalance)) {
      return t('Insufficient %symbol% balance', { symbol: currencyId })
    }
    return ''
  }

  const parseAmountChange = (event) => {
    if (!event.currentTarget.validity.valid) return
    const amount = event.target.value.replace(/,/g, '.')
    dispatch(
      replaceStakingState({
        amount,
        amountError: getAmountError(amount),
        percent: undefined,
      }),
    )
    handleCalculateApr(BigNumber(amount))
  }

  const parseSlippagePercentToAmount = (percent) => {
    try {
      const amount = rawBalance.multipliedBy(new BigNumber(percent / 100))
      const amountStr = Number(amount.toFixed(6, BigNumber.ROUND_DOWN)).toString()
      dispatch(
        replaceStakingState({
          amount: amountStr,
          amountError: '',
          percent,
        }),
      )
      handleCalculateApr(BigNumber(amountStr))
    } catch (e) {
      console.error(e)
    }
  }

  const handleCalculateApr = async (amount: BigNumber) => {
    try {
      const validatorId = await validator(stakingContract)
      if (validatorId == null) {
        dispatch(
          updateCalculateApr({
            apr: 'NaN',
            estimatedRewards: 'NaN',
          }),
        )
        return
      }
      const APR_QUERY = gql`
        query getApr($amount: String!, $id: Int!) {
          calculateApr(
            validatorId: $id,
            amount: $amount,
            duration: 0
          )
        }
      `
      const { calculateApr } = await aprSubgraphClients.request(APR_QUERY, {
        amount: amount.multipliedBy(bigIntToBigNumber(10n ** BigInt(currencyBalance?.currency.decimals ?? 18))).toString(),
        id: Number(validatorId),
      })
      const aprValue = BigNumber(calculateApr)
      const estimatedValue = aprValue.multipliedBy(amount).dividedBy(100).multipliedBy(0.95)
      dispatch(
        updateCalculateApr({
          apr: aprValue.toFixed(2, BigNumber.ROUND_DOWN),
          estimatedRewards: estimatedValue.toFixed(2, BigNumber.ROUND_DOWN)
        }),
      )
    } catch(e) {
      console.error(e)
      dispatch(
        updateCalculateApr({
          apr: 'NaN',
          estimatedRewards: 'NaN',
        }),
      )
    }
  }

  const buildSlippageSelection = () => {
    return (
      <Flex mt="12px">
        {slippagePercents.map((percent) => {
          return (
            <StyledButton
              onClick={() => {
                dispatch(updateSlippagePercent(percent))
                parseSlippagePercentToAmount(percent)
              }}
              className={slippagePercent === percent ? 'active' : ''}
            >
              <Box className="divider" />
              {percent}%
            </StyledButton>
          )
        })}
      </Flex>
    )
  }

  return (
    <>
      <Box>
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text fontSize="16px" fontWeight="600" color="textSubtle">
            {t('Staking amount')}
          </Text>
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" ml="3px">
              {t('U2U Available')}
            </Text>
            <Text fontSize="12px" fontWeight="700" color="primary" ml="3px">
              {formatAmount(currencyBalance, 6)}
            </Text>
            <Text fontSize="12px" ml="3px">
              {currencyId}
            </Text>
          </Flex>
        </Flex>
        <Box>
          <Input
            scale="lg"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]{0,6}$"
            placeholder="0.00"
            value={stakingAmount}
            // onBlur={() => {
            //   parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
            // }}
            onChange={parseAmountChange}
            isWarning={!!stakingAmountError}
            // isSuccess={![25, 50, 75, 100].includes(userSlippageTolerance)}
            style={{ textAlign: 'right' }}
          />
          {!!stakingAmountError && (
            <Text fontSize="14px" color="warning" mt="8px">
              {stakingAmountError}
            </Text>
          )}
          {buildSlippageSelection()}
        </Box>
        <Box my="24px">
          <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text color="textSubtle" fontSize="14px">
              {t('Current estimated APR (%)')}
            </Text>
            <Text fontSize="14px">{apr === 'NaN' ? '--' : apr}</Text>
          </Flex>
          {/* <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text color="textSubtle" fontSize="14px">
              {t('30 days')}
            </Text>
            <Text fontSize="14px">0 U2U</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text color="textSubtle" fontSize="14px">
              {t('90 days')}
            </Text>
            <Text fontSize="14px">0 U2U</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text color="textSubtle" fontSize="14px">
              {t('180 days')}
            </Text>
            <Text fontSize="14px">0 U2U</Text>
          </Flex> */}
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle" fontSize="14px">
              {t('Estimated rewards')}
            </Text>
            <Text fontSize="14px">{estimatedRewards === 'NaN' ? '--' : estimatedRewards} U2U</Text>
          </Flex>
        </Box>
      </Box>
    </>
  )
}

export default FormStaking
