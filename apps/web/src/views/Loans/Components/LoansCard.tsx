import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Dots, Flex, OptionProps, Select, Slider, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { NumericalInput } from '@pancakeswap/widgets-internal'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { StakedInfo } from 'views/Staking/Hooks/useStakingList'

const CardLayout = styled(Box)`
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  background: ${({ theme }) => theme.colors.backgroundAlt};
`
const CardHeader = styled(Flex)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.colors.backgroundPage};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px 8px 0 0;
  padding: 20px;
`
const CardBody = styled.div`
  padding: 24px 20px;
`
const Span = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  margin-left: 6px;
`
const StyledButton = styled(Button)`
  margin-top: 24px;
  height: 44px;
`
const StyledText = styled(Text)`
  line-height: 18px;
  font-size: 14px;
  font-weight: 400;
  &:nth-child(1) {
    min-width: 130px;
  }
  &:nth-child(2) {
    text-align: right;
  }
`

const StyledInput = styled(NumericalInput)`
  background-color: rgba(191, 252, 251, 0.2);
  border-radius: 4px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.cardBorder};
  color: rgba(159, 159, 159, 1);
  display: block;
  font-size: 16px;
  height: 40px;
  outline: 0;
  padding: 0 14px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  text-align: right;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  max-width: 180px;

`
const StyledSlider = styled(Slider)`
  width: 70%;
  height: 22px;
`
const FlexInput = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  @media screen and (max-width: 1199px) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media screen and (max-width: 575px) {
    margin-bottom: 20px;
  }
  div {
    @media screen and (max-width: 1199px) {
      margin-bottom: 10px;
    }
    @media screen and (max-width: 991px) {
      margin-bottom: 8px;
    }
    @media screen and (max-width: 575px) {
      margin-bottom: 6px;
    }
  }
`

type LoansProps = {
  type?: boolean,
  stakeInfo: StakedInfo,
  isLoading: boolean,
  isApproved?: boolean,
  checkApproved?: () => void,
  approveForAll?: () => void
}

const LoansCard = ({ type, stakeInfo, isApproved, isLoading, approveForAll }: LoansProps) => {
  const { t } = useTranslation()
  const [ isRepay, setIsRepay ] = useState(true)
  const [sortOption, setSortOption] = useState('1')
  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)
  const [percentForSlider, onPercentSelectForSlider] = useState(0)
  const handleChangePercent = useCallback(
    (value: any) => onPercentSelectForSlider(Math.ceil(value)),
    [onPercentSelectForSlider],
  )

  const handleAction = () => {
    if(isApproved) {
      //
    } else {
      approveForAll && approveForAll()
    }
  }

  // const { percent } = useLocalSelector<{ percent: number }>((s) => s) as { percent: number }
  // const { onPercentSelect } = useBurnV3ActionHandlers()
  // const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)
  // const handleChangePercent = useCallback(
  //   (value: any) => onPercentSelectForSlider(Math.ceil(value)),
  //   [onPercentSelectForSlider],
  // )


  return (
    <CardLayout>
      <CardHeader alignItems={!type ? 'center' : ''} flexDirection={type ? 'column' : 'row'}>
        <Text fontFamily="'Metuo', sans-serif" fontSize="20px" fontWeight="900" lineHeight="24px" color='textSubtle' mr="10px">{t('Staked Amount')}</Text>
        <Flex mt={type ? ['4px', '4px', '8px', '8px','12px'] : '0'} alignItems="flex-end" justifyContent="space-between" style={{ flexWrap: 'wrap' }}>
          <Text fontSize={["20px", "20px", "22px", "22px", "24px"]} fontWeight="700" lineHeight="24px" color='text'>
            {formatNumber(Number(stakeInfo?.amountDisplay || 0))}
            <Span>U2U</Span>
          </Text>
          {type && (
            <Text color='#c4c4c4' fontSize="10px" fontStyle="italic">{t('Maximum borrow: 700000 U2U (LTV 70%)')}</Text>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        {!type && (
          <>
            <Box mb={["20px", "20px", "24px", "24px", "28px"]}>
              <StyledText color='textSubtle' mb={["6px", "6px", "8px", "8px", "10px", "12px"]}>{t('Interest Period')}</StyledText>
              <Select
                options={[
                  {
                    label: t('1 days'),
                    value: '1'
                  },
                  {
                    label: t('7 days'),
                    value: '7'
                  },
                  {
                    label: t('30 days'),
                    value: '30'
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
              <Text fontSize="12px" fontStyle="italic" lineHeight="14px" color='textExtra' mt="12px">{t('Maximum borrow: 700.000 U2U (LTV 70%)')}</Text>
            </Box>
            <FlexInput>
              <StyledText color='textSubtle'>{t('Borrow amount (Max)')}</StyledText>
              {/* <StyledInput
                scale="lg"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,6}$"
                placeholder="0"
                // value={borrowAmount}
                maxLength={20}
                // onChange={parseAmountChange}
                // isWarning={!!borrowAmountError}
                style={{ textAlign: 'right' }}
              /> */}
              <StyledInput     
                value={localValue}
                placeholder="0"
                fontSize="20px"
                align="center"
                onUserInput={setLocalValue}
              />
            </FlexInput>
            <Flex alignItems="center" justifyContent="space-between" mb={["20px", "20px", "22px"]}>
              <StyledSlider
                name="lp-amount"
                min={0}
                max={100}
                value={percentForSlider}
                onValueChanged={handleChangePercent}
                mb="16px"
              />
              <Text fontSize="14px" fontWeight="500" fontStyle="italic" color='text' mt="10px">LTV 50%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="12px">
              <StyledText color='textSubtle'>{t('Annual Interest Rate')}</StyledText>
              <StyledText color='text'>10%</StyledText>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="12px">
              <StyledText color='textSubtle'>{t('Total Interest')}</StyledText>
              <StyledText color='text'>50.000 U2U</StyledText>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <StyledText color='textSubtle'>{t('Repayment Amount')}</StyledText>
              <StyledText color='text'>550.000 U2U</StyledText>
            </Flex>
            <StyledButton
              width="100%"
              className="button-hover btn-loading"
              isLoading={isLoading}
              onClick={handleAction}
            >
             {isLoading ? 
             <Dots>{'Approving' }</Dots> : 
              isApproved ? t('Borrow Now') : 'Approve' 
             }
            </StyledButton>
          </>
        )}
        {type && (
          <>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('Interest Period')}</StyledText>
              <StyledText color='text'>30 days</StyledText>
            </Flex>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('Borrow amount')}</StyledText>
              <StyledText color='text'>500.000 U2U</StyledText>
            </Flex>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('LTV')}</StyledText>
              <StyledText color='text'>50%</StyledText>
            </Flex>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('Annual Interest Rate')}</StyledText>
              <StyledText color='text'>30%</StyledText>
            </Flex>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('Total Interest')}</StyledText>
              <StyledText color='text'>50.000 U2U</StyledText>
            </Flex>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('Repayment Amount')}</StyledText>
              <StyledText color='text'>550.000 U2U</StyledText>
            </Flex>
            <Flex justifyContent="space-between" mb="12px">
              <StyledText color='textSubtle'>{t('Loan Time')}</StyledText>
              <StyledText color='text'>2024/04/20 13:46:00 UTC</StyledText>
            </Flex>
            <Flex justifyContent="space-between">
              <StyledText color='textSubtle'>{t('Repayable Time')}</StyledText>
              <StyledText color='text'>2024/04/20 13:46:00 UTC</StyledText>
            </Flex>
            <StyledButton
              width="100%"
              className="button-hover"
              disabled={isRepay}
            >
              {isRepay ? t('It has been foreclosed') : t('Repay Now')}
            </StyledButton>
          </>
        )}
      </CardBody>
    </CardLayout>
  )
}

export default LoansCard