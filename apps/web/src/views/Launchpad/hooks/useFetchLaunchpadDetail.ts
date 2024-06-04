import { useQuery } from "@tanstack/react-query"
import { fetchLaunchpadDetail } from "../apis"

export const useFetchLaunchpadDetail = (_contract: string) => {
	return useQuery({
    queryKey: ['fetchLaunchpadDetail', _contract],
		queryFn: async () => {
			const res = await fetchLaunchpadDetail(_contract)
			const _data = res.data
			_data.contractAddress = "0x794236E6594ff178bC921E0E77c40fa1aA36F0Bc"
			_data.saleStart = 1717488000000
			_data.saleEnd = 1717560000000
			_data.phases[1].startTime = 1717488000000
			_data.phases[1].endTime = 1717490400000
			_data.phases[1].contractAddress = '0x6377747d02749436b3174B154B8D2846EBAB0254'
			_data.phases[2].startTime = 1717491600000
			_data.phases[2].endTime = 1717494000000
			_data.phases[2].contractAddress = '0x8Fb02b997B8f51fa197Db6058D98F792797e4EeC'
			_data.phases[4].startTime = 1717495200000
			_data.phases[4].endTime = 1717497600000
			_data.phases[4].contractAddress = '0x016E24788aBF93877D40b22eF56681df02F27F34'
			_data.phases[5].startTime = 1717556400000
			_data.phases[5].endTime = 1717558800000
			_data.phases[5].contractAddress = '0x56e7165d8D9597b13F7586E5Ff6DbD06ee4e33c2'
			return {..._data, phases: [_data.phases[1], _data.phases[2], _data.phases[4], _data.phases[5]] }
		},
		enabled: Boolean(_contract),
		retry: 3,
		retryDelay: 3000,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
  })
}