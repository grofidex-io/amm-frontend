/* eslint-disable no-console */
import { useCallback } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { MiniProgramConnector } from '@pancakeswap/wagmi/connectors/miniProgram'
import getWeb3Provider from 'utils/mpBridge'
import { useConnect } from 'wagmi'
import { chains } from '../utils/wagmi'

const injected = new MiniProgramConnector({ chains, getWeb3Provider })
export const getAccount = () => injected.getAccount()

const useActive = () => {
  const { connectAsync } = useConnect()
  return useCallback(
    () =>
      connectAsync({ connector: injected }).catch((error) => {
        // captureException(error)
      }),
    [connectAsync],
  )
}
export const useEagerConnect = () => {
  // noop
}

export const useActiveHandle = () => {
  const handleActive = useActive()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const main = async () => {
    /**
     *  backward
     */
    console.log('~ before getAccount')
    const address = await getAccount()
    console.log('~ after getAccount', address)
    return new Promise((resolve) => {
      handleActive().then(resolve)
    })
  }
  return async (showToast = true) => {
    await main()
    const address = await getAccount()
    if (address && showToast) {
      toastSuccess(t('Success'), 'Wallet connected')
    }
  }
}
export default useEagerConnect
