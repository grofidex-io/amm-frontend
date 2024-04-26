import useAccountActiveChain from 'hooks/useAccountActiveChain';
import useCatchTxError from 'hooks/useCatchTxError';
import { useStakingContract } from 'hooks/useContract';
import { createContext, useEffect, useState } from 'react';
import { getBorrowAddress } from 'utils/addressHelpers';
import { LoansPackageItem, fetchLoansPackages } from './data/listLoansPackage';
// Initiate Context
export interface ContextApi {
  isApproved: boolean,
  isLoading: boolean,
  loansPackages: LoansPackageItem[],
  totalCollateral: number,
  totalRepayable: number,
  checkApproved?: () => void,
  approveForAll?: () => void,
  setTotalCollateral?: (value: number) => void,
  setTotalRepayable?: (value: number) => void,
}
const LoanContext = createContext<ContextApi>({isApproved: false, isLoading: false, loansPackages: [], totalCollateral: 0, totalRepayable: 0});
// Provide Context
export const LoanProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isApproved, setApprove] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [totalCollateral, setTotalCollateral] = useState<number>(0)
  const [totalRepayable, setTotalRepayable] = useState<number>(0)
  const [loansPackages, setLoansPackages] = useState<LoansPackageItem[]>([])
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()
  const stakingContract = useStakingContract()

  const initData = async () => {
    const listPackage = await fetchLoansPackages()
    if(listPackage.data?.length > 0) {
      setLoansPackages(listPackage.data)
    }
  }

  const checkApproved = async () => {
    if(!stakingContract.account) return
    const status: any = await stakingContract.read.isApprovedForAll([account, getBorrowAddress(chainId)])
    setApprove(status)
  }

  const handleUpdateTotalCollateral = (value: number) => {
    setTotalCollateral(value + totalCollateral)
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
      initData()
      checkApproved()
    }
  }, [stakingContract?.account])


  return (
    <LoanContext.Provider value={{isApproved, isLoading, loansPackages, totalCollateral, totalRepayable, checkApproved, approveForAll, setTotalCollateral, setTotalRepayable}}>
      {children}
    </LoanContext.Provider>
  )
}

export default LoanContext;