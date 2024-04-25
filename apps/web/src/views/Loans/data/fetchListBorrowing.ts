import { gql } from 'graphql-request'
import { loansClients } from 'utils/graphql'


export const LIST_BORROWING = gql`
  query listBorrowing($account: String!)  {
    loans(where: {user_: {id: $account}}) {
      borrowAmount
      borrowTime
      id
      repayTime
      stakeId
      loanPackage {
        id
        maxBorrowRatio
        minBorrow
        period
        annualRate
      }
    }
  }
`

export interface BorrowItem {
  borrowAmount: string | number,
  borrowTime: string | number,
  id: string | number,
  repayAmount: string | number,
  repayTime: number ,
  stakeId: number | string,
  loanPackage: {
    id: string,
    maxBorrowRatio: string,
    minBorrow: string,
    period: number,
    annualRate: string
  }
  user: {
    id: string
  }
}

export interface BorrowResponses {
  loans: BorrowItem[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchListBorrowing(account: any): Promise<{
  data: BorrowItem[]
}> {
  try {
    const data = await loansClients.request<BorrowResponses>(LIST_BORROWING, {
      client: loansClients,
      account: account.toLowerCase(),
      fetchPolicy: 'cache-first',
    })

    return {
      data: data.loans
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
    }
  }
}
