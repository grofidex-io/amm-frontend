import BigNumber from 'bignumber.js'
import { useRef } from 'react'
import { useListBorrowing } from '../hooks/useListBorrowing'
import { CardLayout } from '../styles'
import LoanLoading from './LoanLoading'
import LoansCard from "./LoansCard"


export default function Available() {
  const {data, isLoading, refetch}  = useListBorrowing()
  const totalInterestForBorrowing = useRef<number>(0)
  const totalRepayable = useRef<number>(0)
  const stakeInfo = {
    id: '',
    amount: '',
    amountDisplay: '',
    timestamp: 0,
    reward: BigNumber(0),
    rewardDisplay: '',
  }
  return (
    <>
      <CardLayout>
      {
        isLoading ? <LoanLoading/> : (
          data && data?.map((item) => (
            <LoansCard type stakeInfo={stakeInfo}  borrowing={item} key={item.id} refreshListLoans={refetch} totalInterestForBorrowing={totalInterestForBorrowing.current} totalRepayable={totalRepayable.current}/>
          ))
        )
      }
      </CardLayout>
    </>
  )
}