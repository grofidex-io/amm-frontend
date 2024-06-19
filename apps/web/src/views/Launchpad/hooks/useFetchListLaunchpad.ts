import { useQuery } from "@tanstack/react-query"
import { fetchListLaunchpad } from "../apis"

export const useFetchListLaunchpad = (page: number) => {
	return useQuery({
    queryKey: ['fetchListLaunchpad', page],
		queryFn: () => {
			return fetchListLaunchpad(page)
		},
		retry: 3,
		retryDelay: 3000,
		refetchOnMount: true,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
  })
}