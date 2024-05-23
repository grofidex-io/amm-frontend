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