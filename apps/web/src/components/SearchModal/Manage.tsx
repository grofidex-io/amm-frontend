import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { TokenList } from '@pancakeswap/token-lists'
import { ButtonMenu, ButtonMenuItem, ModalBody } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

const StyledButtonMenu = styled(ButtonMenu)`
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundItem};
`

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [showLists, setShowLists] = useState(true)

  const { t } = useTranslation()

  return (
    <ModalBody style={{ overflow: 'visible' }}>
      <StyledButtonMenu
        activeIndex={showLists ? 0 : 1}
        onItemClick={() => setShowLists((prev) => !prev)}
        scale="sm"
        variant="subtle"
        mb="32px"
      >
        <ButtonMenuItem width="50%">{t('Lists')}</ButtonMenuItem>
        <ButtonMenuItem width="50%">{t('Tokens')}</ButtonMenuItem>
      </StyledButtonMenu>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </ModalBody>
  )
}
