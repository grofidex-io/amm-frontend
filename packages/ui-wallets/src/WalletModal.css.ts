import { atoms } from '@pancakeswap/uikit/css/atoms'
import { responsiveStyle } from '@pancakeswap/uikit/css/responsiveStyle'
import { keyframes, style } from '@vanilla-extract/css'

const promotedGradientKf = keyframes({
  '0%': {
    backgroundPosition: '50% 0%',
  },
  '50%': {
    backgroundPosition: '50% 100%',
  },
  '100%': {
    backgroundPosition: '50% 0%',
  },
})

export const promotedGradientClass = style([
  atoms({
    background: 'gradientBold',
  }),
  style({
    animation: `${promotedGradientKf} 3s ease infinite`,
    backgroundSize: '400% 400%',
  }),
])

export const modalWrapperClass = style([
  style({
    display: 'flex',
  }),
  responsiveStyle({
    xs: {
      width: '100%',
      marginBottom: 0,
    },
    md: {
      height: '360px',
      width: '400px',
    },
  }),
])

export const desktopWalletSelectionClass = style(
  responsiveStyle({
    xs: {
      maxWidth: '100%',
    },
    sm: {
      maxWidth: '100%',
    },
    lg: {
      maxWidth: '100%',
    },
  }),
)

export const walletSelectWrapperClass = style(
  responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr 1fr',
      rowGap: '10px',
      columnGap: '8px',
    },
    sm: {
      rowGap: '24px',
      columnGap: '16px',
      gridTemplateColumns: '1fr 1fr',
    },
    lg: {
      gridTemplateColumns: '1fr 1fr',
    },
  }),
)

export const walletIconClass = style({
  width: '50px',
  height: '50px',
  borderRadius: '12px',
})
