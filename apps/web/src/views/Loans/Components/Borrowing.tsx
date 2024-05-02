import BigNumber from 'bignumber.js'
import NoData from 'components/NoData'
import { useContext, useEffect } from 'react'
import LoanContext from '../LoanContext'
import { useListBorrowing } from '../hooks/useListBorrowing'
import { CardLayout } from '../styles'
import LoanLoading from './LoanLoading'
import LoansCard from "./LoansCard"


export default function Borrowing() {
  const {data, isLoading, refetch}  = useListBorrowing()
  const {totalRepayableU2U, totalInterestForBorrowingU2U, setTotalRepayable, setTotalCollateral} = useContext(LoanContext)
  const stakeInfo = {
    id: '',
    amount: '',
    amountDisplay: '',
    timestamp: 0,
    reward: BigNumber(0),
    rewardDisplay: '',
  }
  
  useEffect(() => {
      if(totalRepayableU2U?.current && setTotalRepayable) {
        totalRepayableU2U.current = {}
          setTotalRepayable(0)
      }
      if(totalInterestForBorrowingU2U?.current && setTotalCollateral) {
        totalInterestForBorrowingU2U.current = {}
        setTotalCollateral(0)
      }
  }, [data, totalInterestForBorrowingU2U, totalRepayableU2U, setTotalRepayable])

  if(!isLoading && data?.length === 0) {
    return (
      <NoData/>
    )
  }
  return (
    <>
      <CardLayout>
      {
        isLoading ? <LoanLoading/> : (
          data && data?.map((item) => (
            <LoansCard type isBorrowing stakeInfo={stakeInfo}  borrowing={item} key={item.id} refreshListLoans={refetch} />
          ))
        )
      }
      </CardLayout>
    </>
  )
}