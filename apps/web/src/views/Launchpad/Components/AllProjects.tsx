import { Layout } from '../styles'
import LaunchpadCard from './LaunchpadCard'

export default function AllProjects() {
  return (
    <>
      <Layout>
        <LaunchpadCard type='upcoming'/>
        <LaunchpadCard type='ended'/>
        <LaunchpadCard type='claimable'/>
        <LaunchpadCard type='cancelled'/>
        <LaunchpadCard type='on-going'/>
      </Layout>
    </>
  )
}
