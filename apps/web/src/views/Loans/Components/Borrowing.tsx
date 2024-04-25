import { useListBorrowing } from '../hooks/useListBorrowing'
import { CardLayout } from '../styles'
import LoanLoading from './LoanLoading'
import LoansCard from "./LoansCard"


export default function Available() {
  const {data, isLoading, refetch}  = useListBorrowing()
  return (
    <>
      <CardLayout>
      {
        isLoading ? <LoanLoading/> : (
          data && data?.map((item, index) => (
            <LoansCard type borrowing={item} key={index} refreshListLoans={refetch}/>
          ))
        )
      }
      </CardLayout>
    </>
  )
}