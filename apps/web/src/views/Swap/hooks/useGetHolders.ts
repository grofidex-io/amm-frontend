import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useGetHolders({ contractaddress }) {
  return useQuery({
    queryKey: ['getHolders'],
    queryFn: async () => {
      const res = await Promise.all([
        fetch(`https://testnet.u2uscan.xyz/api?module=token&action=getToken&contractaddress=${contractaddress}`),
        fetch(
          `https://testnet.u2uscan.xyz/api?module=token&action=getTokenHolders&contractaddress=${contractaddress}&page=1&offset=10`,
        ),
      ])
      const token = await res[0]?.json()
      const listHolders = await res[1]?.json()
      return {
        token: token?.result,
        listHolders: listHolders?.result,
      }
    },
    enabled: Boolean(contractaddress),
    placeholderData: keepPreviousData,
  })
}
