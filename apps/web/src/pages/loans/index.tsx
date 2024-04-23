import { InfoPageLayout } from 'views/Loans/Layout'
import { Overview } from 'views/Loans/Overview'

const InfoPage = () => {
  return <Overview />
}

InfoPage.Layout = InfoPageLayout
InfoPage.chains = []

export default InfoPage
