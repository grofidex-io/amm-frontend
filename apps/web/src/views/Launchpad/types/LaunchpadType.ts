export interface ITierInfo {
  minStake: number
  maxBuyPerUser: number
  start: number
  end: number
  maxCommitAmount: number
  currentCommit: number
  startCancel: number
  endCancel: number
  startCalculate: number
  endCalculate: number
  tier?: number
}

export interface IUserWhiteListInfo {
  isWhiteList: boolean,
  u2uCommitted: number
}

export interface ILaunchpadItem {
	contractAddress: string,
	priceToken: number,
	projectImageThumbnail: string,
	projectName: string,
	saleEnd: number,
	saleStart: number,
	shortDescription: string,
	status: string,
	tokenLogo: string,
	tokenName: string,
	totalRaise: number
}

export interface IPagination {
	totalPages: number,
	totalRecords: number,
	page: number,
	size: number
}

export interface ISocial {
	type: string,
	link: string
}

export interface IPhare {
	name: string,
	startTime: number,
	endTime: number,
	isActive: boolean,
	imageUrl: string | null,
	contractAddress: string
}

export interface ILaunchpadDetail {
	tokenName: string,
	tokenSymbol: string,
	tokenDecimals: number,
	totalSupply: number,
	tokenAddress: string,
	tokenLogo: string,
	projectName: string,
	description: string,
	shortDescription: string,
	projectImageThumbnail: string,
	contractAddress: string,
	priceToken: number,
	totalRaise: number,
	totalSale: number,
	softCap: number,
	snapshotTime: number,
	saleStart: number,
	saleEnd: number,
	status: string,
	socials: ISocial[],
	phases: IPhare[]
}