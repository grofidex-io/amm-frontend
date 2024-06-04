import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { Arrow, PageButtons } from 'views/Info/components/InfoTables/shared'
import LoanLoading from 'views/Loans/Components/LoanLoading'
import { useFetchListLaunchpad } from '../hooks/useFetchListLaunchpad'
import { Layout } from '../styles'
import { ILaunchpadItem } from '../types/LaunchpadType'
import LaunchpadCard from './LaunchpadCard'

export default function AllProjects() {
	const { t } = useTranslation()
  const [page, setPage] = useState(1)
	const { data: list, isLoading } = useFetchListLaunchpad(page)


  return (
    <>
      <Layout>
				{isLoading ? <LoanLoading/> : (
					<>
					{list?.data.map((item: ILaunchpadItem) => (
						<LaunchpadCard type='upcoming' item={item}/>
					))}
					</>
				)}
      </Layout>
			{list?.data && list?.data.length > 0 && (<PageButtons style={{marginTop: 20}}>
				<Arrow
					onClick={() => {
						setPage(page === 1 ? page : page - 1)
					}}
				>
					<ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
				</Arrow>

				<Text>{t('Page %page% of %maxPage%', { page, maxPage: list?.pagination.totalPages })}</Text>
				<Arrow
					onClick={() => {
						setPage(page === list?.pagination.totalPages ? page : page + 1)
					}}
				>
					<ArrowForwardIcon color={page === list?.pagination.totalPages ? 'textDisabled' : 'primary'} />
				</Arrow>
			</PageButtons>)
			}
    </>
  )
}
