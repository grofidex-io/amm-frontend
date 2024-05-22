export const convertTierInfo = (args) => {
  return {
    minStake: args[0],
    maxBuyPerUser: args[1],
    start: args[2],
    end: args[3],
    maxCommitAmount: args[4],
    currentCommit: args[5],
    startCancel: args[6],
    endCancel: args[7],
    startCalculate: args[8],
    endCalculate: args[9]
  }
}