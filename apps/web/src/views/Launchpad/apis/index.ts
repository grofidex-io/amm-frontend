import { ILaunchpadDetail, ILaunchpadItem, IPagination } from "../types/LaunchpadType"

const BASE_LAUNCHPAD_URL = 'http://192.168.1.182:8080/api/v1'
export const fetchListLaunchpad = async () : Promise<{data: ILaunchpadItem[], status: boolean, pagination: IPagination}> => {
	const response = await fetch(`${BASE_LAUNCHPAD_URL}/launchpad`)
	const data = await response.json()
	return data
}

export const fetchLaunchpadDetail = async (_contract: string) : Promise<{data: ILaunchpadDetail, status: boolean}> => {
	const response = await fetch(`${BASE_LAUNCHPAD_URL}/launchpad/${_contract}`)
	const data = await response.json()
	return data
}