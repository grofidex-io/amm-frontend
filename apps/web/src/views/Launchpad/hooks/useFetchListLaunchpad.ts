import { useQuery } from "@tanstack/react-query"
import { fetchListLaunchpad } from "../apis"

export const useFetchListLaunchpad = () => {
	return useQuery({
    queryKey: ['fetchListLaunchpad'],
		queryFn: () => {
			return fetchListLaunchpad()
		},
		retry: 3,
		retryDelay: 3000,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
  })
}