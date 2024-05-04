import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, AutoColumn, Box, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import dayjs from 'dayjs'
import { formatEther } from 'ethers/lib/utils'
import { useState } from 'react'
import styled from 'styled-components'
import { formatDate } from 'views/CakeStaking/components/DataSet/format'
import { Arrow, Break, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { useLoansHistory } from '../hooks/useLoansHistory'


const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
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
  grid-template-columns: repeat(6, 1fr);
  padding: 0 24px;
  > * {
    min-width: 120px;
    &:nth-child(6) {
      min-width: 160px;
    }
    &:nth-child(5) {
      min-width: 160px;
    }
  }

  // @media screen and (max-width: 800px) {
  //   grid-template-columns: 0.8fr repeat(5, 1fr);
  //   & > *:nth-child(5) {
  //     display: none;
  //   }
  //   & > *:nth-child(3) {
  //     display: none;
  //   }
  //   & > *:nth-child(4) {
  //     display: none;
  //   }
  // }

`
const TableLoader: React.FC<React.PropsWithChildren> = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}
export function LoansHistory() {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const { data } = useLoansHistory(page)
  const disableNext = data ? data?.length === 0 || data?.length < 10 : false
  // const getPercent = (value: string) => {
  //   return (Number(value) / Number(data?.token.totalSupply)) * 100
  // }
  if(data?.length === 0) {
    return <TableLoader />
  }
  return (
    <div>
    <Wrapper>
      <TableWrapper>
      <LayoutScroll>
        <ResponsiveGrid>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Loan Amount')}
          </Text>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Stake Amount')}
          </Text>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Type')}
          </Text>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Repay Amount')}
          </Text>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Loan Time')}
          </Text>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Repay Time')}
          </Text>
        </ResponsiveGrid>
        <AutoColumn gap="16px">
        <Break />

            {data?.map((item) => {
              if (item) {
                const refund: any = Number(item.stakeAmount) - Number(item.repayAmount) + Number(item.rewardUser)
                return (
                  <ResponsiveGrid key={item.id}>
                    <Text>{formatNumber(Number(formatEther(item.borrowAmount)))} U2U</Text>
                    <Text>{formatNumber(Number(formatEther(item.stakeAmount)))} U2U</Text>
                    <Text>{item.type}</Text>
                    <Text>
                      <Flex flexDirection="column">
                        {formatNumber(Number(formatEther(item.repayAmount)))} U2U
                        <Text color='gray' fontSize={12}>{item.type === 'LIQUIDATION' ? `Refund ${formatNumber(Number(formatEther(refund.toString())))} U2U` : ''}</Text>
                      </Flex>
                    </Text>
                    <Text>{ item?.borrowTime ? formatDate(dayjs.unix(Number(item.borrowTime)).utc()): '_'} UTC</Text>
                    <Text>{ item?.repayTime ? formatDate(dayjs.unix(Number(item.repayTime)).utc()): '_'} UTC</Text>
                  </ResponsiveGrid>
                  // eslint-disable-next-line react/no-array-index-key
                  // <Fragment key={index}>
                  //   <DataRow transaction={transaction} />
                  //   <Break />
                  // </Fragment>
                )
              }
              return null
            })}
            {data?.length === 0 && (
              <Flex justifyContent="center">
                <Text>{t('No History')}</Text>
              </Flex>
            )}
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
                    setPage(data.length === 0 ? page : page + 1)
                  }
                }}
              >
                <ArrowForwardIcon color={disableNext ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
 

      </TableWrapper>
    </Wrapper>
    </div>
  )
}
