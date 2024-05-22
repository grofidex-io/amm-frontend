import useAccountActiveChain from "hooks/useAccountActiveChain"
import { getLaunchpadContract } from "utils/contractHelpers"

export const useUserTier = () => {
  const launchpadContract = getLaunchpadContract()
  const { account } = useAccountActiveChain()
  const getUserTier = async () => {
    const tier: any = await launchpadContract.read.getUserTier([account])
    console.log("🚀 ~ getUserTier ~ tier:", tier)
  }
  if(launchpadContract.account) {
    getUserTier()
  }
}