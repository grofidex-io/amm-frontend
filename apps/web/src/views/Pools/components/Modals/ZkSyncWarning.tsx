import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Message, MessageText } from '@pancakeswap/uikit'
import { useNetwork } from 'wagmi'

const ZkSyncWarning = () => {
  const { t } = useTranslation()
  const { chain } = useNetwork()

  return (
    <>
      {chain?.id === ChainId.ZKSYNC || chain?.id === ChainId.ZKSYNC_TESTNET ? (
        <Box maxWidth={['100%', '100%', '100%', '307px']}>
          <Message variant="warning" m="24px 0 0 0">
            <MessageText>
              {t(
                'When staking on zkSync Era, unstaking your U2U shortly after staking could result in no rewards being earned.',
              )}
            </MessageText>
          </Message>
        </Box>
      ) : null}
    </>
  )
}

export default ZkSyncWarning
