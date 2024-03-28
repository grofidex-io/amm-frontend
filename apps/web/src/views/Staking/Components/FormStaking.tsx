import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Input, Text } from '@pancakeswap/uikit'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { useState } from 'react'
import styled from 'styled-components'
import { escapeRegExp } from 'utils'

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

enum SlippageError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const FormStaking = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippage()
  const [slippageInput, setSlippageInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else {
    slippageError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
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
              37236.928372
            </Text>
            <Text fontSize="12px" ml="3px">
              U2U
            </Text>
          </Flex>
        </Flex>
        <Box>
          <Input
            scale="lg"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]{0,2}$"
            placeholder={(userSlippageTolerance / 100).toFixed(2)}
            value={slippageInput}
            onBlur={() => {
              parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
            }}
            onChange={(event) => {
              if (event.currentTarget.validity.valid) {
                parseCustomSlippage(event.target.value.replace(/,/g, '.'))
              }
            }}
            isWarning={!slippageInputIsValid}
            isSuccess={![25, 50, 75, 100].includes(userSlippageTolerance)}
            style={{ textAlign: 'right' }}
          />
          {!!slippageError && (
            <Text fontSize="14px" color="warning" mt="8px">
              {slippageError === SlippageError.InvalidInput
                ? t('Enter a valid slippage percentage')
                : t('Enter input for Stake')}
            </Text>
          )}
          <Flex mt="12px">
            <StyledButton
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(25)
              }}
              className={userSlippageTolerance === 25 ? 'active' : ''}
            >
              <Box className="divider" />
              25%
            </StyledButton>
            <StyledButton
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(50)
              }}
              className={userSlippageTolerance === 50 ? 'active' : ''}
            >
              <Box className="divider" />
              50%
            </StyledButton>
            <StyledButton
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(75)
              }}
              className={userSlippageTolerance === 75 ? 'active' : ''}
            >
              <Box className="divider" />
              75%
            </StyledButton>
            <StyledButton
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(100)
              }}
              className={userSlippageTolerance === 100 ? 'active' : ''}
            >
              <Box className="divider" />
              100%
            </StyledButton>
          </Flex>
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
