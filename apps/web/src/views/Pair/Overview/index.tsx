import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Heading, Link, Tab, TabMenu, Text } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import Container from 'components/Layout/Container'
import { useRouter } from 'next/router'
import Liquidity from 'pages/liquidity'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Pools from 'views/V3Info/views/PoolsPage'

const BorderLayout = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border-radius: 8px;
`
const Image = styled.img`
  --size: 100%;
  display: block;
  height: calc(var(--size) * 278 / 450);
  width: var(--size);
  max-width: 300px;
  margin-top: 30px;
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    --size: 350px;
    max-width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    --size: 400px;
    min-width: var(--size);
    margin-top: 0;
    display: block;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    --size: 450px;
  }
`
const ImageIcon = styled.img`
  --size: 74px;
  height: calc(var(--size) * 94 / 134);
  min-width: var(--size);
  ${({ theme }) => theme.mediaQueries.sm} {
    --size: 94px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    --size: 114px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    --size: 134px;
  }
`
const StyledFlex = styled(Flex)`
  flex-direction: column;
  gap: 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 50px;
  }
`
const StyledHeading = styled(Heading)`
  font-size: 24px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 32px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 48px;
  }
`
const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.hover};
  padding: 10px 20px;
  height: 50px;
  width: 60%;
  font-size: 15px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 10px 20px;
    height: 60px;
    font-size: 16px;
    width: 50%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 15px 30px;
    height: 70px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 20px 40px;
    height: 80px;
    font-size: 18px;
  }
  
  @media screen and (max-width: 424px) {
    width: 100%;
  }
`
const StylesInternalLink = styled(Link)`
  width: auto;
  &:hover {
    text-decoration: none;
  }
`

export const Overview = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const { query } = useRouter()

  const handleTypeChange = (index: number) => {
    setTab(index)
    replaceBrowserHistory('tab', tab)
  }

  useEffect(() => {
    if (query?.tab) {
      setTab(Number(query.tab))
    }
  }, [query.tab])
  return (
    <Box>
      <Container>
        <BorderLayout
          p={['20px', '20px', '20px 30px', '20px 30px', '20px 40px']}
          my="32px"
          background="var(--colors-backgroundAlt)"
        >
          <StyledFlex alignItems="center" justifyContent="space-between">
            <Box>
              <StyledHeading>{t('Put your funds to work by providing liquidity.')}</StyledHeading>
              <Text mt="20px" fontSize={['14px', '14px', '16px', '16px', '18px']} color="textSubtle">
                {t(
                  'When you add liquidity to a pair, you can receive a share of its trading volume and potentially snag extra rewards when there are incentives involved!',
                )}
              </Text>
            </Box>
            <Image src="/images/pair/pair-banner-image.png" />
          </StyledFlex>
        </BorderLayout>
        <Box mb={['30px', '40px', '50px', '60px']}>
          <StylesInternalLink href="/add">
            <StyledButton>
              {t('Add Liquidity')}
              <ImageIcon src="/images/pair/pair-icon.svg" />
            </StyledButton>
          </StylesInternalLink>
        </Box>
        <TabMenu customWidth isShowBorderBottom={false} activeIndex={tab} onItemClick={handleTypeChange}>
          <Tab>{t(`All Pairs`)}</Tab>
          <Tab>{t(`Your Liquidity`)}</Tab>
        </TabMenu>
      </Container>
      {tab === 0 && <Pools />}
      {tab === 1 && <Liquidity isPair />}
    </Box>
  )
}
