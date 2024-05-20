import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, Flex, ScanLink, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared'


const Wrapper = styled.div`
  width: 100%;
`
const LayoutScroll = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-x: auto;
`
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 0.3fr repeat(4, 1fr);
  padding: 0 24px;
  > * {
    min-width: 140px;
    &:last-child {
      min-width: 180px;
    }
  }

`
const StyledScanLink = styled(ScanLink)`
  transition: 0.3s ease;
  &:hover {
    text-decoration: none;
    opacity: 0.65;
  }
  > div {
    @media screen and (max-width: 575px) {
      font-size: 14px;
    }
  }
`

export default function Transactions() {
  const { t } = useTranslation()

  return (
    <Box mt="30px">
      <Wrapper>
        <TableWrapper>
          <LayoutScroll>
            <ResponsiveGrid>
              <Text color="textSubtle">
                {t('Hash')}
              </Text>
              <Text color="textSubtle" textAlign="center">
                {t('Type')}
              </Text>
              <Text color="textSubtle" textAlign="right">
                {t('Token')}
              </Text>
              <Text color="textSubtle" textAlign="center">
                {t('Context')}
              </Text>
              <Text color="textSubtle" textAlign="right">
                {t('Time')}
              </Text>
            </ResponsiveGrid>
            <AutoColumn gap="16px">
              <Break/>
              <>
                <ResponsiveGrid>
                  <Flex>
                    <StyledScanLink
                      href='/'
                    >
                      <Text
                        color='primary'
                      >
                        dasdsa
                      </Text>
                    </StyledScanLink>
                  </Flex>
                  <Text color="text" textAlign="center">Commit</Text>
                  <Text color="text" textAlign="right">50.000 U2U</Text>
                  <Text color="text" textAlign="center">Tier 1</Text>
                  <Text color="text" textAlign="right">May 02, 2024, 02:00:00 AM</Text>
                </ResponsiveGrid>
                <Break />
              </>
            </AutoColumn>
          </LayoutScroll>
        </TableWrapper>
      </Wrapper>
    </Box>
  )
}
