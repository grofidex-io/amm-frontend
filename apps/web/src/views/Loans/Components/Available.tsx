import { useContext } from 'react'
import { useStakingList } from 'views/Staking/Hooks/useStakingList'
import LoanContext from '../LoanContext'
import { CardLayout } from '../styles'
import LoanLoading from './LoanLoading'
import LoansCard from './LoansCard'


export default function Available() {
  const { data, periodTime, loading } = useStakingList()
  const { isApproved, isLoading, checkApproved, approveForAll } = useContext(LoanContext)
  return (
    <>
      <CardLayout>
        {loading ? <LoanLoading/> : (
          data?.staked.map((item, index) => (
            <LoansCard stakeInfo={item} key={index} isApproved={isApproved} checkApproved={checkApproved} approveForAll={approveForAll} isLoading={isLoading}/>
          ))
        )}
      </CardLayout>
    </>
  )
}