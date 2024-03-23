import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AutoColumn,
  Box,
  Flex,
  ScanLink,
  SortArrowIcon,
  Text,
  Toggle,
} from '@pancakeswap/uikit'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainLinkSupportChains, multiChainId } from 'state/info/constant'
import { useChainIdByQuery, useChainNameByQuery } from 'state/info/hooks'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { Transaction, TransactionType } from '../../types'
import { shortenAddress } from '../../utils'
import { unixToDate } from '../../utils/date'
import { formatDollarAmount } from '../../utils/numbers'
import HoverInlineText from '../HoverInlineText'
import Loader from '../Loader'
import { RowFixed } from '../Row'
import { SortButton, useSortFieldClassName } from '../SortButton'

const ResponsiveGrid = styled.div<{ widthFirstCol: number }>`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: ${({ widthFirstCol }) =>
    widthFirstCol ? `${widthFirstCol}fr repeat(5, 1fr)` : '0.5fr repeat(5, 1fr)'};
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 1.5fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 1.5fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1.5fr repeat(1, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const SortText = styled.button<{ active: boolean }>`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  margin-right: 16px !important;
  border: 2px solid transparent;
  background-color: ${({ active, theme }) => (active ? theme.colors.secondary : theme.colors.transparent)};
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${({ active, theme }) => (active ? theme.colors.black : theme.colors.textSubtle)};
  border-color: ${({ active, theme }) => (active ? theme.colors.cardBorder : theme.colors.transparent)};
  outline: none;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
  &:hover {
    color: ${({ active, theme }) => (active ? theme.colors.black : theme.colors.hover)};
  }
`

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

const DataRow = ({
  transaction,
  type,
  filterFn,
}: {
  transaction: Transaction
  color?: string
  type?: string
  filterFn?: () => void
}) => {
  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const chainName = useChainNameByQuery()
  const chainId = useChainIdByQuery()

  const token0Symbol = getTokenSymbolAlias(transaction.token0Address, chainId, transaction.token0Symbol)
  const token1Symbol = getTokenSymbolAlias(transaction.token1Address, chainId, transaction.token1Symbol)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? token0Symbol : token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? token0Symbol : token1Symbol
  let typeSwap = `Swap ${inputTokenSymbol} for ${outputTokenSymbol}`
  let typeMint = `Add ${token0Symbol} and ${token1Symbol}`
  let typeRemove = `Remove ${token0Symbol} and ${token1Symbol}`
  if (type === 'SWAP_TRANSACTION') {
    typeSwap = transaction.amountToken0 > 0 ? 'Sell' : 'Buy'
    typeMint = 'Add'
    typeRemove = 'Remove'
  }

  return (
    <ResponsiveGrid widthFirstCol={filterFn ? 0.5 : 1.5}>
      <Flex justifyContent="center">
        <ScanLink
          useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
          href={getBlockExploreLink(transaction.hash, 'transaction', multiChainId[chainName])}
        >
          <Text fontWeight={400}>
            {transaction.type === TransactionType.MINT
              ? typeMint
              : transaction.type === TransactionType.SWAP
              ? typeSwap
              : typeRemove}
          </Text>
        </ScanLink>
      </Flex>

      <Text fontWeight={400}>{formatDollarAmount(transaction.amountUSD)}</Text>
      <Text fontWeight={400}>
        <HoverInlineText text={`${formatAmount(abs0)}  ${token0Symbol}`} maxCharacters={16} />
      </Text>
      <Text fontWeight={400}>
        <HoverInlineText text={`${formatAmount(abs1)}  ${token1Symbol}`} maxCharacters={16} />
      </Text>
      <Text fontWeight={400}>
        <ScanLink
          useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
          href={getBlockExploreLink(transaction.sender, 'address', multiChainId[chainName])}
        >
          {shortenAddress(transaction.sender)}
        </ScanLink>
      </Text>
      <Text fontWeight={400}>{unixToDate(Number(transaction.timestamp), 'YYYY-DD-MM HH:mm:ss')}</Text>
    </ResponsiveGrid>
  )
}

export default function TransactionTable({
  transactions,
  maxItems = 10,
  type,
  filterFn,
  toggleFilter,
}: {
  transactions: Transaction[]
  maxItems?: number
  type?: string
  filterFn?: () => void
  toggleFilter?: boolean
}) {
  const { t } = useTranslation()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)
  const getSortFieldClassName = useSortFieldClassName(sortField, sortDirection)

  useEffect(() => {
    let extraPages = 1
    if (
      transactions.filter((x) => {
        return txFilter === undefined || x.type === txFilter
      }).length %
        maxItems ===
      0
    ) {
      extraPages = 0
    }
    const maxPageResult =
      Math.floor(
        transactions.filter((x) => {
          return txFilter === undefined || x.type === txFilter
        }).length / maxItems,
      ) + extraPages
    setMaxPage(maxPageResult)
    if (maxPageResult === 0) setPage(0)
    else setPage(1)
  }, [maxItems, transactions, txFilter])

  const sortedTransactions = useMemo(() => {
    return transactions
      ? [...transactions]
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Transaction] > b[sortField as keyof Transaction]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .filter((x) => {
            return txFilter === undefined || x.type === txFilter
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [transactions, maxItems, page, sortField, sortDirection, txFilter])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  if (!transactions) {
    return <Loader />
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" my="16px">
        <RowFixed>
          <SortText
            onClick={() => {
              setTxFilter(undefined)
            }}
            active={txFilter === undefined}
          >
            {t('All')}
          </SortText>
          <SortText
            onClick={() => {
              setTxFilter(TransactionType.SWAP)
            }}
            active={txFilter === TransactionType.SWAP}
          >
            {t('Swaps')}
          </SortText>
          <SortText
            onClick={() => {
              setTxFilter(TransactionType.MINT)
            }}
            active={txFilter === TransactionType.MINT}
          >
            {t('Adds')}
          </SortText>
          <SortText
            onClick={() => {
              setTxFilter(TransactionType.BURN)
            }}
            active={txFilter === TransactionType.BURN}
          >
            {t('Removes')}
          </SortText>
        </RowFixed>
        {filterFn && (
          <Flex alignItems="center">
            <Toggle scale="sm" checked={toggleFilter} onChange={filterFn} />
            <Text ml="16px" small color="textSubtle">
              {t('Only my transactions')}
            </Text>
          </Flex>
        )}
      </Flex>
      <TableWrapper>
        <ResponsiveGrid widthFirstCol={filterFn ? 0.5 : 1.5}>
          <Text textAlign="center" color="textSubtle">
            {t('Type')}
          </Text>
          <ClickableColumnHeader color="textSubtle">
            {t('Total Value')}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SORT_FIELD.amountUSD)}
              className={getSortFieldClassName(SORT_FIELD.amountUSD)}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
          <ClickableColumnHeader color="textSubtle">
            {t('Token%index% Amount', { index: '0' })}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SORT_FIELD.amountToken0)}
              className={getSortFieldClassName(SORT_FIELD.amountToken0)}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
          <ClickableColumnHeader color="textSubtle">
            {t('Token%index% Amount', { index: '1' })}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SORT_FIELD.amountToken1)}
              className={getSortFieldClassName(SORT_FIELD.amountToken1)}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
          <ClickableColumnHeader color="textSubtle">
            {t('Account')}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SORT_FIELD.sender)}
              className={getSortFieldClassName(SORT_FIELD.sender)}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
          <ClickableColumnHeader color="textSubtle">
            {`${t('Time')} `}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SORT_FIELD.timestamp)}
              className={getSortFieldClassName(SORT_FIELD.timestamp)}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <AutoColumn gap="16px">
          <Break />

          {sortedTransactions.map((d, index) => {
            if (d) {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={`${d.hash}/${d.timestamp}/${index}/transactionRecord`}>
                  <DataRow transaction={d} type={type} filterFn={filterFn} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          {sortedTransactions.length === 0 && (
            <Flex justifyContent="center">
              <Text>{t('No Transactions')}</Text>
            </Flex>
          )}
          <PageButtons>
            <Box
              onClick={() => {
                if (page > 1) setPage(page - 1)
              }}
            >
              <Arrow>
                <ArrowBackIcon color={page <= 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
            </Box>
            <Text>{`Page ${page} of ${maxPage}`}</Text>
            <Box
              onClick={() => {
                if (page !== maxPage) setPage(page + 1)
              }}
            >
              <Arrow>
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </Box>
          </PageButtons>
        </AutoColumn>
      </TableWrapper>
    </>
  )
}
