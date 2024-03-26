import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | U2Dex',
  defaultTitle: 'U2Dex',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@U2Dex',
    site: '@U2Dex',
  },
  openGraph: {
    title: "U2Dex - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
    images: [{ url: '/thumbnail.png' }],
  },
}
