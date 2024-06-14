import { launchpadClients } from "utils/graphql"
import { Address } from "viem"
import { ICommittedItem, IHistoryTransaction, ILaunchpadDetail, ILaunchpadItem, IPagination } from "../types/LaunchpadType"

const BASE_LAUNCHPAD_URL = process.env.NEXT_PUBLIC_LAUNCHPAD_API
export const fetchListLaunchpad = async (page: number) : Promise<{data: ILaunchpadItem[], status: boolean, pagination: IPagination}> => {
	const response = await fetch(`${BASE_LAUNCHPAD_URL}/launchpad?page=${page}`)
	const data = await response.json()
	return data
}

export const fetchLaunchpadDetail = async (_contract: string) : Promise<{data: ILaunchpadDetail, status: boolean}> => {
	const response = await fetch(`${BASE_LAUNCHPAD_URL}/launchpad/${_contract}`)
	const data = await response.json()
	return data
}

const LIST_COMMITTED = `
query listCommitted($user: String!, $launchpad: String!)  {
	userCommits(
		where: {user: $user, launchpadAddress: $launchpad}, orderBy: processTime, orderDirection: asc
	) {
		id
		u2uAmount
		roundType
		roundAddress
		startCancel
    endCancel
		isClaimed
	}
}
`

const HISTORY_TRANSACTION = `
query listTransaction($user: String!, $launchpad: String!, $skip: Int)  {
	transactionHistories(
		where: {user: $user, launchpadAddress: $launchpad}, skip: $skip , first: 10, orderBy: processTime, orderDirection: desc
	) {
    processTime
		hash
    u2uAmount
    transactionType
    tokenAmount
    roundType
	}
}
`

export async function fetchListCommitted(user: Address, launchpad: Address): Promise<{
  data: ICommittedItem[]
}> {
  try {
    const data = await launchpadClients.request(LIST_COMMITTED, {
      client: launchpadClients,
      user: user?.toLowerCase(),
      launchpad:  launchpad?.toLowerCase(),
      fetchPolicy: 'cache-first',
    })

    return {
      data: data.userCommits
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
    }
  }
}

export async function fetchListHistory(user: Address, launchpad: Address, page: number): Promise<{
  data: IHistoryTransaction[]
}> {
  try {
    const data = await launchpadClients.request(HISTORY_TRANSACTION, {
      client: launchpadClients,
      user: user?.toLowerCase(),
      launchpad:  launchpad?.toLowerCase(),
			skip: (page - 1) * 10,
      fetchPolicy: 'cache-first',
    })

    return {
      data: data.transactionHistories
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
    }
  }
}