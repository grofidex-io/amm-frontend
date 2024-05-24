import { useQuery } from "@tanstack/react-query"
import { fetchLaunchpadDetail } from "../apis"

export const useFetchLaunchpadDetail = (_contract: string) => {
	return useQuery({
    queryKey: ['fetchLaunchpadDetail', _contract],
		queryFn: async () => {
			const res = await fetchLaunchpadDetail(_contract)
			return res.data
		},
		enabled: Boolean(_contract),
		retry: 3,
		retryDelay: 3000,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
  })
}