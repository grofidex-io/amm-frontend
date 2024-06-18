import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, Text } from '@pancakeswap/uikit'
import NoData from 'components/NoData'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useState } from 'react'
import styled from 'styled-components'
import { Arrow, PageButtons } from 'views/Info/components/InfoTables/shared'
import LoanLoading from 'views/Loans/Components/LoanLoading'
import { useFetchListLaunchpad } from '../hooks/useFetchListLaunchpad'
import { useFetchListProjectByUser } from '../hooks/useFetchListProjectByUser'
import { Layout } from '../styles'
import { ILaunchpadItem } from '../types/LaunchpadType'
import LaunchpadCard from './LaunchpadCard'

const StyledText = styled(Text)`
  font-size: 15px;
  font-weight: 500;
  @media screen and (max-width: 1559px) {
    font-size: 14px;
  }
`
interface IProjectProp {
	filter: { 
		valueSearch: string
		filterType: string | null
	}
}
export default function AllProjects({filter}: IProjectProp) {
	const {valueSearch, filterType} = filter
	const { t } = useTranslation()
  const [page, setPage] = useState(1)
	const { account } = useAccountActiveChain()
	const { data: launchpad, isLoading } = useFetchListLaunchpad(page)
	const {data: listProject} = useFetchListProjectByUser(account)
	const _listLaunchpad: any = launchpad?.data || []
	const newData = _listLaunchpad?.filter((item: ILaunchpadItem) => {
		if(valueSearch?.length > 0 || filterType && filterType?.length > 0) {
			const _statusFilterName = valueSearch.length > 0 ? item.projectName.toLowerCase().includes(valueSearch.toLowerCase()) : true
			const _filterTypeSplit = filterType?.split('-')
			const _statusFilterType = _filterTypeSplit && _filterTypeSplit.length > 0 ? item.status.includes(_filterTypeSplit[0]) : true
			return _statusFilterName && _statusFilterType
		} 
		return true
	})
	const list: any = {
		...launchpad,
		data: newData || []
	}

  return (
    <>
      <Layout>
				{isLoading ? <LoanLoading/> : (
					<>
					{list?.data.map((item: ILaunchpadItem) => (
						<LaunchpadCard isContribution={listProject?.indexOf(item.contractAddress) !== -1} type='upcoming' item={item} filterType={filterType}/>
					))}
					</>
				)}
      </Layout>
			{list?.data && list?.data.length > 0 ? (<PageButtons style={{marginTop: 20}}>
				<Arrow
					onClick={() => {
						setPage(page === 1 ? page : page - 1)
					}}
				>
					<ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
				</Arrow>

				<StyledText>{t('Page %page% of %maxPage%', { page, maxPage: list?.pagination.totalPages })}</StyledText>
				<Arrow
					onClick={() => {
						setPage(page === list?.pagination.totalPages ? page : page + 1)
					}}
				>
					<ArrowForwardIcon color={page === list?.pagination.totalPages ? 'textDisabled' : 'primary'} />
				</Arrow>
			</PageButtons>) : !isLoading && <NoData/>
	
			}
    </>
  )
}
