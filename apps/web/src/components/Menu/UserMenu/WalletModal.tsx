import { useTranslation } from '@pancakeswap/localization'
import {
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalTitle,
  ModalWrapper,
  ModalHeader as UIKitModalHeader,
} from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'
import { parseEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'
import WalletWrongNetwork from './WalletWrongNetwork'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_NATIVE_BALANCE = parseEther('0.002', 'wei')

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const Tabs = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`
const StyledButtonMenu = styled(ButtonMenu)`
  background: ${({ theme }) => theme.colors.backgroundItem};
`

interface TabsComponentProps {
  view: WalletView
  handleClick: (newIndex: number) => void
}

const TabsComponent: React.FC<React.PropsWithChildren<TabsComponentProps>> = ({ view, handleClick }) => {
  const { t } = useTranslation()

  return (
    <Tabs>
      <StyledButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
        <ButtonMenuItem>{t('Wallet')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Transactions')}</ButtonMenuItem>
      </StyledButtonMenu>
    </Tabs>
  )
}

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
  initialView = WalletView.WALLET_INFO,
  onDismiss,
}) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  const hasLowNativeBalance = Boolean(isFetched && data && data.value <= LOW_NATIVE_BALANCE)

  const handleClick = useCallback((newIndex: number) => {
    setView(newIndex)
  }, [])

  return (
    <ModalWrapper minWidth="360px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" p="0" height="36px" scale="xs" onClick={onDismiss}>
          <CloseIcon p="4px" width="36px" height="36px" color="text" className="button-hover br-4 border-2" />
        </IconButton>
      </ModalHeader>
      {view !== WalletView.WRONG_NETWORK && <TabsComponent view={view} handleClick={handleClick} />}
      <ModalBody p="24px" width="100%">
        {view === WalletView.WALLET_INFO && (
          <WalletInfo hasLowNativeBalance={hasLowNativeBalance} switchView={handleClick} onDismiss={onDismiss} />
        )}
        {view === WalletView.TRANSACTIONS && !!onDismiss && <WalletTransactions onDismiss={onDismiss} />}
        {view === WalletView.WRONG_NETWORK && !!onDismiss && <WalletWrongNetwork onDismiss={onDismiss} />}
      </ModalBody>
    </ModalWrapper>
  )
}

export default WalletModal
