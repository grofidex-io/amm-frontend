import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, PageHeader, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import FormStaking from '../Components/FormStaking'
import FormStakingBtn from '../Components/FormStakingBtn'
import StakingList from '../Components/StakingList'
import { BorderLayout, StakingH1, StakingText } from '../style'

export const Overview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader>
        <Box style={{ flex: '1 1 100%', maxWidth: '678px' }}>
          <StakingH1 as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Become a participant on our jorney')}
          </StakingH1>
          <StakingText>
            {t(
              'Staking is simple and accessible process. You can contribute to the security and stability of the U2U Network while earning U2U Tokens as Reward.',
            )}
          </StakingText>
        </Box>
      </PageHeader>
      <Page>
        <Flex
          flexDirection={['column', 'column', 'column', 'column', 'row']}
          justifyContent="center"
          position="relative"
          alignItems="flex-start"
          width="100%"
          style={{ gap: '16px' }}
        >
          <Flex
            flexDirection="column"
            order={['2', '2', '2', '2', '1']}
            width={['100%', '100%', '100%', '100%', 'auto']}
            flexGrow={2}
          >
            <StakingList />
          </Flex>
          <Flex
            flexDirection="column"
            order={['1', '1', '1', '1', '2']}
            width={['100%', '100%', '100%', '100%', '360px']}
            flexGrow={1}
            mb={['30px', '30px', '36px', '40px', '0']}
          >
            <BorderLayout p="30px 16px">
              <Text fontFamily="'Metuo', sans-serif" fontSize="24px" fontWeight="900" mb="36px">
                {t('Staking')}
              </Text>
              <FormStaking />
              <FormStakingBtn />
            </BorderLayout>
          </Flex>
        </Flex>
      </Page>
    </>
  )
}
