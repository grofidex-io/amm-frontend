import { Box, BoxProps, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const Wrapper = styled(Flex)`
  overflow-x: auto;
  padding: 0;
  border-radius: 8px 8px 0 0;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
`

const Inner = styled(Flex)`
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
  width: 100%;
`

interface TabProps extends BoxProps {
  isActive?: boolean
  onClick?: () => void
}

export const TabToggle = styled(Box).attrs({
  as: 'button',
})<TabProps>`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  border: 0;
  outline: 0;
  margin: 0;
  border-radius: 8px 8px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.text : theme.colors.textSubtle)};
  background-color: ${({ theme, isActive }) => (isActive ? theme.card.background : theme.colors.backgroundPage)};
  box-shadow: none;
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

TabToggle.defaultProps = {
  p: '16px',
}

interface TabToggleGroupProps {
  children: React.ReactElement[]
}

export const TabToggleGroup: React.FC<React.PropsWithChildren<TabToggleGroupProps>> = ({ children }) => {
  return (
    <Wrapper p={['0 4px', '0 16px']}>
      <Inner>{children}</Inner>
    </Wrapper>
  )
}
