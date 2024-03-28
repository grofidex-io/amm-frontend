import { useTranslation } from '@pancakeswap/localization'
import { Rounding } from '@pancakeswap/swap-sdk-core'
import { Box, Flex, Input, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import BigNumber from 'bignumber.js'
import { useCurrency } from 'hooks/Tokens'
import { useAtom } from 'jotai'
import { replaceStakingState, updateSlippagePercent } from 'state/staking/actions'
import { useStakingState } from 'state/staking/hooks'
import { stakingReducerAtom } from 'state/staking/reducer'
import { useCurrencyBalance } from 'state/wallet/hooks'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

const StyledButton = styled(Box)`
  cursor: pointer;
  text-align: center;
  flex: 1;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  font-weight: 600;
  &:not(:last-child) {
    margin-right: 5px;
  }
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    .divider {
      background: ${({ theme }) => theme.colors.hover};
    }
  }
  .divider {
    border: 2px solid ${({ theme }) => theme.colors.cardBorder};
    background: ${({ theme }) => theme.colors.textSubtle};
    height: 10px;
    width: 100%;
    border-radius: 2px;
    margin-bottom: 4px;
  }
`

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const FormStaking = () => {
  const [, dispatch] = useAtom(stakingReducerAtom)
  const { currencyId, stakingAmount, stakingAmountError, slippagePercent } = useStakingState()
  const { t } = useTranslation()

  const slippagePercents = [25, 50, 75, 100]

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
  }

  const parseSlippagePercentToAmount = (percent) => {
    try {
      const amount = rawBalance.multipliedBy(new BigNumber(percent / 100))
      dispatch(
        replaceStakingState({
          amount: amount.toPrecision(6, BigNumber.ROUND_DOWN),
          amountError: '',
          percent,
        }),
      )
    } catch (e) {
      console.error(e)
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
            <Text fontSize="14px">0</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb="8px">
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
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle" fontSize="14px">
              {t('360 days')}
            </Text>
            <Text fontSize="14px">0 U2U</Text>
          </Flex>
        </Box>
      </Box>
    </>
  )
}

export default FormStaking
