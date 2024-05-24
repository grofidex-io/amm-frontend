import LoanLoading from 'views/Loans/Components/LoanLoading'
import { useFetchListLaunchpad } from '../hooks/useFetchListLaunchpad'
import { Layout } from '../styles'
import { ILaunchpadItem } from '../types/LaunchpadType'
import LaunchpadCard from './LaunchpadCard'

export default function AllProjects() {
	const { data: list, isLoading } = useFetchListLaunchpad()
  console.log("🚀 ~ AllProjects ~ list:", list)
  return (
    <>
      <Layout>
				{isLoading ? <LoanLoading/> : (
					<>
					{list?.data.map((item: ILaunchpadItem) => (
						<LaunchpadCard type='upcoming' item={item}/>
					))}
					</>
				)}
      </Layout>
    </>
  )
}
