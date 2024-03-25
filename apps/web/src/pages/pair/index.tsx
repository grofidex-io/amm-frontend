import { InfoPageLayout } from 'views/Pair'
import Pools from 'views/V3Info/views/PoolsPage'

const InfoPoolsPage = () => {
  return <Pools />
}

InfoPoolsPage.Layout = InfoPageLayout
InfoPoolsPage.chains = [] // set all

export default InfoPoolsPage
