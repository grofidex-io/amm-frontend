import { useStakingList } from 'views/Staking/Hooks/useStakingList'
import { CardLayout } from '../styles'
import LoanLoading from './LoanLoading'
import LoansCard from './LoansCard'


export default function Available() {
  const { data, refresh, loading } = useStakingList()
  return (
    <>
      <CardLayout>
        {loading ? <LoanLoading/> : (
          data?.staked.map((item, index) => (
            <LoansCard stakeInfo={item} key={index} refreshListLoans={refresh}/>
          ))
        )}
      </CardLayout>
    </>
  )
}