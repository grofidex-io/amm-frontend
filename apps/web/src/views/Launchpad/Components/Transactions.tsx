import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, AutoColumn, Box, Flex, ScanLink, Text } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import styled from 'styled-components'
import { formatEther } from 'viem'
import { formatDate } from 'views/CakeStaking/components/DataSet/format'
import { Arrow, Break, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { useFetchTransactionHistory } from '../hooks/useFetchTransactionHistory'


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
export default function Transactions({info, account}) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
	const {data} = useFetchTransactionHistory(account, info?.contractAddress, page)
  const disableNext = data ? data?.length === 0 || data?.length < 10 : false
  return (
    <Box mt="30px">
      <Wrapper>
        <TableWrapper>
          <LayoutScroll>
            <ResponsiveGrid>
              <Text color="textSubtle">
                {t('HASH')}
              </Text>
              <Text color="textSubtle" textAlign="center">
                {t('TYPE')}
              </Text>
              <Text color="textSubtle" textAlign="center">
                {t('TOKEN')}
              </Text>
              <Text color="textSubtle" textAlign="right">
                {t('TIME')}
              </Text>
            </ResponsiveGrid>
            <AutoColumn gap="16px">
              <Break/>
              {data?.map(item => (
								<React.Fragment key={item.hash}>
                  <ResponsiveGrid >
                    <Flex>
                      <StyledScanLink href='/'>
                        <Text color='primary'>
                          {item.hash && truncateHash(item.hash, 20, 8)}
                        </Text>
                      </StyledScanLink>
                    </Flex>
                    <Text color="text" textAlign="center">{item.transactionType}</Text>
                    <Text color="text" textAlign="center">{item.transactionType === 'CLAIM' ? `${formatEther(item.tokenAmount)} ${info?.tokenName}` : `${formatEther(item.u2uAmount)} U2U` }</Text>
                    <Text color="text" textAlign="right">{formatDate(dayjs.unix(Math.floor(item.processTime)).utc())}</Text>
                  </ResponsiveGrid>
        				<Break/>
								</React.Fragment>
              ))}
            </AutoColumn>
          </LayoutScroll>
					<PageButtons>
					<Arrow
						onClick={() => {
							setPage(page === 1 ? page : page - 1)
						}}
					>
						<ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
					</Arrow>

					<Text>Page {page}</Text>
					<Arrow
						onClick={() => {
							if(!disableNext) {
								setPage(data?.length === 0 ? page : page + 1)
							}
						}}
					>
						<ArrowForwardIcon color={disableNext ? 'textDisabled' : 'primary'} />
					</Arrow>
				</PageButtons>
        </TableWrapper>
      </Wrapper>
    </Box>
  )
}
