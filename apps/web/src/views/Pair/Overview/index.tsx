import { useTranslation } from '@pancakeswap/localization'
import { Tab, TabMenu } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import Container from 'components/Layout/Container'
import { useRouter } from 'next/router'
import Liquidity from 'pages/liquidity'
import { useEffect, useState } from 'react'
import Pools from 'views/V3Info/views/PoolsPage'

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
    <Container>
      <TabMenu customWidth isShowBorderBottom={false} activeIndex={tab} onItemClick={handleTypeChange}>
        <Tab>{t(`All Pairs`)}</Tab>
        <Tab>{t(`Your Liquidity`)}</Tab>
      </TabMenu>
      {tab === 0 && <Pools />}
      {tab === 1 && <Liquidity />}
    </Container>
  )
}
