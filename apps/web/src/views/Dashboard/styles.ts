import { Box, Text } from "@pancakeswap/uikit"
import styled from "styled-components"

export const BorderCard = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 20px 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`
export const StyledTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
  @media screen and (max-width: 1439px) {
    margin-bottom: 28px;
  }
  @media screen and (max-width: 991px) {
    margin-bottom: 24px;
  }
  @media screen and (max-width: 575px) {
    margin-bottom: 20px;
  }
`