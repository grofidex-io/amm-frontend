import { CardLayout } from '../styles'
import LoansCard from "./LoansCard"


export default function Available() {
  return (
    <>
      <CardLayout>
        <LoansCard />
        <LoansCard />
        <LoansCard />
      </CardLayout>
    </>
  )
}