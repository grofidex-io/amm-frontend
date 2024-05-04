import { useQuery } from "@tanstack/react-query"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { fetchLoansHistory } from "../data/fetchLoansHistory"

const QUERY_SETTINGS_IMMUTABLE = {
  retry: 3,
  retryDelay: 3000,
  refetchInterval: 30000, // milliseconds
  refetchOnMount: true,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
}
// Approve contract borrow
export const useLoansHistory = (page: number) => {
  const { account } = useActiveWeb3React()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [`fetchLoansHistory`, account, page],
    queryFn: () => fetchLoansHistory(account, page),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return {data: data?.data, isLoading, refetch}
}
