import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, Flex, ScanLink, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { shortenAddress } from 'views/V3Info/utils'


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
  grid-template-columns: repeat(4, 1fr);
  padding: 0 24px;
  > * {
    min-width: 140px;
    &:last-child {
      min-width: 180px;
    }
    &:first-child {
      min-width: 200px;
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
const data = [
  { hash: '0x759241dbe1d49dFda80b819eE86726Cd25EEd7dB', type: 'Commit', token: '50.000 U2U', time: 'May 02, 2024, 02:00:00 AM' },
  { hash: '0x759241dbe1d49dFda80b819eE86726Cd25EEd7dB', type: 'Cancel', token: '20.000 U2U', time: 'May 02, 2024, 02:00:00 AM' },
  { hash: '0x759241dbe1d49dFda80b819eE86726Cd25EEd7dB', type: 'Refund', token: '10.000 U2U', time: 'May 02, 2024, 02:00:00 AM' },
  { hash: '0x759241dbe1d49dFda80b819eE86726Cd25EEd7dB', type: 'Claim', token: '200.000.000 TOKENX', time: 'May 02, 2024, 02:00:00 AM' },
]

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
              <Text color="textSubtle" textAlign="center">
                {t('Token')}
              </Text>
              <Text color="textSubtle" textAlign="center">
                {t('Time')}
              </Text>
            </ResponsiveGrid>
            <AutoColumn gap="16px">
              <Break/>
              {data?.map(item => (
                <>
                  <ResponsiveGrid>
                    <Flex>
                      <StyledScanLink href='/'>
                        <Text color='primary'>
                          {shortenAddress(item.hash)}
                        </Text>
                      </StyledScanLink>
                    </Flex>
                    <Text color="text" textAlign="center">{item.type}</Text>
                    <Text color="text" textAlign="center">{item.token}</Text>
                    <Text color="text" textAlign="center">{item.time}</Text>
                  </ResponsiveGrid>
                  <Break />
                </>
              ))}

            </AutoColumn>
          </LayoutScroll>
        </TableWrapper>
      </Wrapper>
    </Box>
  )
}
