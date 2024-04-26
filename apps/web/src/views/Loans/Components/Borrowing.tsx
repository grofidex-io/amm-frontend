import BigNumber from 'bignumber.js'
import NoData from 'components/NoData'
import { useListBorrowing } from '../hooks/useListBorrowing'
import { CardLayout } from '../styles'
import LoanLoading from './LoanLoading'
import LoansCard from "./LoansCard"


export default function Borrowing() {
  const {data, isLoading, refetch}  = useListBorrowing()

  const stakeInfo = {
    id: '',
    amount: '',
    amountDisplay: '',
    timestamp: 0,
    reward: BigNumber(0),
    rewardDisplay: '',
  }
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
            <LoansCard type stakeInfo={stakeInfo}  borrowing={item} key={item.id} refreshListLoans={refetch} />
          ))
        )
      }
      </CardLayout>
    </>
  )
}