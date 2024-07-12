import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Heading, RowFixed, Text } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import OrdersAnalysis from '../Component/OrdersAnalysis'
import { BorderCard, StyledTitle } from '../styles'
import { TimeType } from '../types'

const StyledHeading = styled(Heading)`
  font-size: 24px;
  font-weight: 700;
  line-height: calc(56 / 52);
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 32px;
    font-weight: 900;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 36px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 44px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 52px;
  }
`
const SortText = styled.button<{ active: boolean }>`
  cursor: pointer;
  font-weight: 700;
  margin-left: 8px;
  border: 2px solid transparent;
  background-color: ${({ active, theme }) => (active ? theme.colors.secondary : theme.colors.transparent)};
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${({ active, theme }) => (active ? theme.colors.black : theme.colors.textSubtle)};
  border-color: ${({ active, theme }) => (active ? theme.colors.cardBorder : theme.colors.textSubtle)};
  outline: none;
  transition: all 0.3s ease-out;
  @media screen and (max-width: 374px) {
    margin-left: 4px;
    padding: 8px 12px;
  }
  &:hover {
    color: ${({ active, theme }) => (active ? theme.colors.black : theme.colors.hover)};
    border-color: ${({ active, theme }) => (active ? theme.colors.cardBorder : theme.colors.hover)};
  }
`
const StyledList = styled.div`
  --item: 4;
  --space: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
  margin-bottom: 56px;
  @media screen and (max-width: 575px) {
    --item: 1;
    gap: 0;
  }
`
const StyledItem = styled.div`
  width: calc((100% - (var(--item) - 1) * var(--space)) / var(--item));
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 20px 24px;
`
const StyleImg = styled.img`
  width: 100%;
  margin: auto;
`

const listInfo = [
  { title: 'Estimated Total Value', icon: true, price: '9,627.00', increase: '', decrease: '' },
  { title: 'Previous Day', icon: false, price: '460.40', increase: '', decrease: '4.56%' },
  { title: 'Total profit of past 7 days', icon: false, price: '460.40', increase: '4.56%', decrease: '' },
]

export const Overview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [txFilter, setTxFilter] = useState<TimeType | undefined>(TimeType.WEEK)

  return (
    <Box mt="60px">
      <Container>
        <Flex alignItems="center" justifyContent="space-between" mb={["20px", "20px", "24px", "24px", "28px", "28px", "32px"]}>
          <StyledHeading as="h1" scale="xxl" color="text">{t('Assets Analysis')}</StyledHeading>
          <RowFixed>
            <SortText
              onClick={() => {
                setTxFilter(TimeType.WEEK)
              }}
              active={txFilter === TimeType.WEEK}
            >
              {t('Past 7 days')}
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TimeType.MONTH)
              }}
              active={txFilter === TimeType.MONTH}
            >
              {t('Past 30 days')}
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TimeType.CUSTOM)
              }}
              active={txFilter === TimeType.CUSTOM}
            >
              {t('+ Custom time')}
            </SortText>
          </RowFixed>
        </Flex>
        <StyledList>
          {listInfo.map(item => (
            <StyledItem className="border-neubrutal" key={item.title}>
              <Flex alignItems="center" mb="16px">
                <Text color="textHighlight" fontSize="14px" mr="16px">{item.title}</Text>
                {item.icon && <img src="/images/dashboard/icon-eye.svg" width="16px" height="16px" alt="" />}
              </Flex>
              <Box>
                <Text color="text" fontSize="32px" fontWeight="700" lineHeight="1.2">
                  {item.increase ? '+' : item.decrease ? '-' : ''}
                  {item.price}
                </Text>
                <Flex alignItems="center" mt="8px">
                  {item.increase ? (
                    <img src="/images/dashboard/icon-arrow-up.svg" width="16px" height="16px" alt="" />
                  ) : item.decrease ? (
                    <img src="/images/dashboard/icon-arrow-down.svg" width="16px" height="16px" alt="" />
                  ) : (
                    <Text color="textSubtle" fontSize="16px" fontWeight="500" >≈</Text>
                  )}
                  <Text color={item.increase ? 'success' : item.decrease ? 'failure' : 'textSubtle'} fontSize="16px" fontWeight="500" ml="6px">
                    {item.increase ? item.increase : item.decrease ? item.decrease : item.price }
                  </Text>
                </Flex>
              </Box>
            </StyledItem>
          ))}
        </StyledList>
        <Flex>
          <BorderCard style={{ flex: 1 }}>
            <StyledTitle>Asset Allocation</StyledTitle>
            <StyleImg src="/images/dashboard/chart-01.png" alt="" />
          </BorderCard>
          <BorderCard style={{ flex: 2 }} ml="16px">
            <StyledTitle>Asset Growth</StyledTitle>
            <StyleImg src="/images/dashboard/chart-02.png" alt="" />
          </BorderCard>
        </Flex>
        <Flex mt="16px">
          <BorderCard style={{ flex: 1 }}>
            <StyledTitle>Asset Allocation</StyledTitle>
            <StyleImg src="/images/dashboard/chart-03.png" alt="" />
          </BorderCard>
          <BorderCard style={{ flex: 1 }} ml="16px">
            <StyledTitle>Asset Growth</StyledTitle>
            <StyleImg src="/images/dashboard/chart-04.png" alt="" />
          </BorderCard>
        </Flex>
        <OrdersAnalysis/>
      </Container>
    </Box>
  )
}
