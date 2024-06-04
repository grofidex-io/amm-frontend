import { Box, Button } from "@pancakeswap/uikit"
import styled from "styled-components"

export const Layout = styled.div`
  --item: 3;
  --space: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
  margin-top: 30px;
  @media screen and (max-width: 991px) {
    --item: 2;
  }
  @media screen and (max-width: 767px) {
    --item: 1;
  }
  > * {
    width: calc((100% - (var(--item) - 1) * var(--space)) / var(--item));
    @media screen and (max-width: 767px) {
      max-width: 480px;
      margin: auto;
    }
  }
`

export const StyledNeubrutal = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

export const StyledButton = styled(Button)`
  height: 42px !important;
  font-weight: 700 !important;
`