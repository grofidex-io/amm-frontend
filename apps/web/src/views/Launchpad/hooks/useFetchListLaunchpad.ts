import { useQuery } from "@tanstack/react-query"
import { fetchListLaunchpad } from "../apis"

export const useFetchListLaunchpad = (page: number, search: string, status: string | null) => {
	return useQuery({
    queryKey: ['fetchListLaunchpad', page, search, status],
		queryFn: () => {
			return fetchListLaunchpad(page, search, status)
		},
		retry: 3,
		retryDelay: 3000,
		refetchOnMount: true,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
  })
}