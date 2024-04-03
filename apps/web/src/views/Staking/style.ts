import { Box, Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const BorderLayout = styled(Box)`
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`

export const StyledBox = styled(Box)`
  flex: 1;
  position: relative;
  &:first-child {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: -50px;
      width: 2px;
      height: 100%;
      background: #445434;
    }
  }
`
export const StyledTextTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
`

export const StakingH1 = styled(Heading)`
  font-size: 32px;
  font-weight: 900;
  line-height: calc(56 / 52);
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 52px;
    margin-bottom: 24px;
  }
`
export const StakingText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  line-height: calc(24 / 18);
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 18px;
    margin-bottom: 18px;
  }
`
export const StyledIcon = styled.div`
  --size: 36px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(225, 250, 187, 0.2);
`
export const StyledIconImage = styled.img`
  --size: 24px;
  width: var(--size);
  margin: auto;
`
export const StyledButton = styled(Box)`
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
