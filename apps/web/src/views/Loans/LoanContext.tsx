import useAccountActiveChain from 'hooks/useAccountActiveChain';
import useCatchTxError from 'hooks/useCatchTxError';
import { useStakingContract } from 'hooks/useContract';
import { createContext, useEffect, useState } from 'react';
import { getBorrowAddress } from 'utils/addressHelpers';
// Initiate Context
export interface ContextApi {
  isApproved: boolean,
  isLoading: boolean
  checkApproved?: () => void,
  approveForAll?: () => void
}
const LoanContext = createContext<ContextApi>({isApproved: false, isLoading: false});
// Provide Context
export const LoanProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isApproved, setApprove] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()
  const stakingContract = useStakingContract()
  const checkApproved = async () => {
    if(!stakingContract.account) return
    const status: any = await stakingContract.read.isApprovedForAll([account, getBorrowAddress(chainId)])
    setApprove(status)
  }

  const approveForAll = async () => {
    if(!stakingContract.account) return
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => stakingContract.write.setApprovalForAll([getBorrowAddress(chainId), true]))
    if (receipt?.status) {
      checkApproved()
    }
    setLoading(false)
  }
  useEffect(() => {
    if(stakingContract.account) {
      checkApproved()
    }
  }, [stakingContract?.account])


  return (
    <LoanContext.Provider value={{isApproved, isLoading, checkApproved, approveForAll}}>
      {children}
    </LoanContext.Provider>
  )
}

export default LoanContext;