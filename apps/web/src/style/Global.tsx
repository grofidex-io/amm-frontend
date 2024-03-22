import { PancakeTheme } from '@pancakeswap/uikit'
import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Urbanist', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }

  .br-4 {
    border-radius: 4px;
  }

  .border-2 {
    border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  }

  .border-neubrutal {
    border: 2px solid ${({ theme }) => theme.colors.cardBorder};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
  .button-hover {
    transition: all 0.3s;
    // border: 2px solid ${({ theme }) => theme.colors.cardBorder};
    &:hover {
      opacity: 1 !important;
      color: ${({ theme }) => theme.colors.cardBorder};
      border-color: ${({ theme }) => theme.colors.cardBorder};
      background: ${({ theme }) => theme.colors.hover};
      box-shadow: ${({ theme }) => theme.shadows.button};
    }
  }
`

export default GlobalStyle
