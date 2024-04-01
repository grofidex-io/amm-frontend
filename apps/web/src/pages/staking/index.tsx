import { InfoPageLayout } from 'views/Staking/Layout'
import { Overview } from 'views/Staking/Overview'

const InfoPage = () => {
  return <Overview />
}

InfoPage.Layout = InfoPageLayout
InfoPage.chains = [] // set all

export default InfoPage
