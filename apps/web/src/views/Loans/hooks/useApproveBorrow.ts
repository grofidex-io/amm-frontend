import useCatchTxError from "hooks/useCatchTxError"
import { useStakingContract } from "hooks/useContract"
import { useMemo, useState } from "react"
import { getBorrowAddress } from "utils/addressHelpers"
export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}
// Approve contract borrow
export const useCheckApproveBorrowContract = (account: `0x${string}` | undefined, chainId: number | undefined) => {
  const stakingContract = useStakingContract()
  const [state, setState] = useState<ApprovalState>(ApprovalState.UNKNOWN)
  if(!stakingContract.account) return state
  const checkApprove = () => {
    setState(ApprovalState.PENDING)
    stakingContract.read.isApprovedForAll([account, getBorrowAddress(chainId)]).then((status) => {
      if(status) {
        setState(ApprovalState.APPROVED)
      } else {
        setState(ApprovalState.NOT_APPROVED)
      }
    })
  }
  return useMemo(() => {
    checkApprove()
    return state
  }, [account, chainId])
}

export const onApproveBorrow = async (chainId: number | undefined) => {
  const stakingContract = useStakingContract()
  const { fetchWithCatchTxError } = useCatchTxError()
  const [loading, setLoading] = useState<boolean>(false)
  if(!stakingContract.account) return false
  setLoading(true)
  const setApprove = stakingContract.write.setApprovalForAll([getBorrowAddress(chainId), true])
  const receipt = await fetchWithCatchTxError(() => setApprove)
  if (receipt?.status) {
    setLoading(false)
  }
}