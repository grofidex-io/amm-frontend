import { gql } from 'graphql-request'
import { loansClients } from 'utils/graphql'

export const LOANS_HISTORY = gql`
  query loanHistories($account: String!, $skip: Int)  {
    loanHistories(where: {user_: {id: $account}}, skip: $skip , first: 10, orderBy: borrowTime
      orderDirection: desc) {
      borrowAmount
      borrowTime
      repayAmount
      repayTime
      rewardUser
      stakeAmount
      type,
      id
    }
  }
`



export interface HistoryItem {
  borrowAmount: any,
  borrowTime: string | number,
  repayAmount: string | number,
  repayTime: number,
  rewardUser: number,
  stakeAmount: any,
  type: string,
  id: string
}

export interface HistoryResponses {
  loanHistories: HistoryItem[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchLoansHistory(account: any, page: number): Promise<{
  data: HistoryItem[]
}> {
  try {
    const data = await loansClients.request<HistoryResponses>(LOANS_HISTORY, {
      client: loansClients,
      account,
      skip: (page - 1) * 10
    })

    return {
      data: data.loanHistories
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
    }
  }
}
