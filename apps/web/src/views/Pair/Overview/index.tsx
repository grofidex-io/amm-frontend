import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, FlexGap, Heading, Link, Tab, TabMenu, Text } from '@pancakeswap/uikit'
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
  display: block;
  height: 278px;
  min-width: 450px;
`
const ImageIcon = styled.img`
  height: 94px;
  min-width: 134px;
`
const StyledHeading = styled(Heading)`
  font-size: 48px;
  font-weight: 700;
`
const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.hover};
  padding: 20px 40px;
  height: 80px;
  width: 50%;
  font-size: 18px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`
const StylesInternalLink = styled(Link)`
  width: auto;
  &:hover {
    text-decoration: none;
  }
`
const StyledPools = styled(Pools)`
  > * {
    padding: 0;
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
        <BorderLayout p="20px 40px" my="32px" background="var(--colors-backgroundAlt)">
          <FlexGap alignItems="center" justifyContent="space-between" gap="50px">
            <Box>
              <StyledHeading>{t('Put your funds to work by providing liquidity.')}</StyledHeading>
              <Text mt="20px" fontSize="18px" color="textSubtle">
                {t(
                  'When you add liquidity to a pool, you can receive a share of its trading volume and potentially snag extra rewards when there are incentives involved!',
                )}
              </Text>
            </Box>
            <Box>
              <Image src="/images/pair/pair-banner-image.png" />
            </Box>
          </FlexGap>
        </BorderLayout>
        <Box mb={['30px', '40px', '50px', '60px']}>
          <StylesInternalLink href="/buy-crypto">
            <StyledButton>
              {t('I want to create a position')}
              <ImageIcon src="/images/pair/pair-icon.svg" />
            </StyledButton>
          </StylesInternalLink>
        </Box>
        <TabMenu customWidth isShowBorderBottom={false} activeIndex={tab} onItemClick={handleTypeChange}>
          <Tab>{t(`All Pairs`)}</Tab>
          <Tab>{t(`Your Liquidity`)}</Tab>
        </TabMenu>
      </Container>
      {tab === 0 && <StyledPools />}
      {tab === 1 && <Liquidity />}
    </Box>
  )
}
