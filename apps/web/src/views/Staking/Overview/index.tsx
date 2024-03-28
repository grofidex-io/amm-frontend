import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Heading, PageHeader, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import FormStaking from '../Components/FormStaking'
import FormStakingBtn from '../Components/FormStakingBtn'

const StakingH1 = styled(Heading)`
  font-size: 32px;
  font-weight: 900;
  line-height: calc(56 / 52);
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 52px;
    margin-bottom: 24px;
  }
`
const StakingText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  line-height: calc(24 / 18);
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 18px;
    margin-bottom: 18px;
  }
`
const StyledIcon = styled.div`
  --size: 36px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(225, 250, 187, 0.2);
`
const StyledIconImage = styled.img`
  --size: 24px;
  width: var(--size);
  margin: auto;
`
const BorderLayout = styled(Box)`
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`
const StyledBox = styled(Box)`
  flex: 1;
  position: relative;
  &:first-child {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: -50px;
      width: 2px;
      height: 100%;
      background: #445434;
    }
  }
`
const StyledTextTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
`

export const Overview: React.FC<React.PropsWithChildren> = () => {
  const isTime = false
  const isWithdraw = true
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
            <BorderLayout p="16px">
              <Flex justifyContent="space-around">
                <Flex alignItems="center">
                  <StyledIcon>
                    <StyledIconImage src="/images/staking/icon-package.svg" />
                  </StyledIcon>
                  <Box ml="16px">
                    <StyledTextTitle fontSize="10px">{t('Total Package ')}</StyledTextTitle>
                    <Text fontSize="16px" fontWeight="600">
                      60.366
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center">
                  <StyledIcon>
                    <StyledIconImage src="/images/staking/icon-amount.svg" />
                  </StyledIcon>
                  <Box ml="16px">
                    <StyledTextTitle fontSize="10px">{t('Total Staked Amount')}</StyledTextTitle>
                    <Text fontSize="16px" fontWeight="600">
                      60.366
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center">
                  <StyledIcon>
                    <StyledIconImage src="/images/staking/icon-reward.svg" />
                  </StyledIcon>
                  <Box ml="16px">
                    <StyledTextTitle fontSize="10px">{t('Total U2U Reward')}</StyledTextTitle>
                    <Text fontSize="16px" fontWeight="600">
                      60.366
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </BorderLayout>
            <BorderLayout p="30px 40px">
              <Flex style={{ gap: '100px' }}>
                <StyledBox>
                  <StyledTextTitle fontSize="20px">{t('Staked Amount')} (U2U)</StyledTextTitle>
                  <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
                    <Text fontSize="36px" lineHeight="1">
                      20.122
                    </Text>
                    {isTime ? (
                      <Box>
                        <Text textAlign="center" fontSize="16px" fontWeight="700" color="secondary">
                          {t('Release In')}
                        </Text>
                        <Text fontSize="16px" letterSpacing="0.5px" fontWeight="500">
                          00 : 00 : 00
                        </Text>
                      </Box>
                    ) : (
                      <Button height="40px" variant="secondary" className="button-hover">
                        {!isWithdraw ? t('Withdraw') : t('Unstake')}
                      </Button>
                    )}
                  </Flex>
                </StyledBox>
                <StyledBox>
                  <StyledTextTitle fontSize="20px">
                    <Text fontFamily="'Metuo', sans-serif" fontSize="20px" fontWeight="900" color="secondary" mr="8px">
                      U2U
                    </Text>
                    {t('Reward')}
                  </StyledTextTitle>
                  <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
                    <Text fontSize="36px" lineHeight="1">
                      20.122
                    </Text>
                    <Button height="42px" width="120px" className="button-hover">
                      {t('Claim')}
                    </Button>
                  </Flex>
                </StyledBox>
              </Flex>
            </BorderLayout>
            <BorderLayout p="30px 40px">
              <Flex style={{ gap: '100px' }}>
                <StyledBox>
                  <StyledTextTitle fontSize="20px">{t('Staked Amount')} (U2U)</StyledTextTitle>
                  <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
                    <Text fontSize="36px" lineHeight="1">
                      20.122
                    </Text>
                    {!isTime ? (
                      <Box>
                        <Text textAlign="center" fontSize="16px" fontWeight="700" color="secondary">
                          {t('Release In')}
                        </Text>
                        <Text fontSize="16px" letterSpacing="0.5px" fontWeight="500">
                          00 : 00 : 00
                        </Text>
                      </Box>
                    ) : (
                      <Button height="40px" variant="secondary" className="button-hover">
                        {isWithdraw ? t('Withdraw') : t('Unstake')}
                      </Button>
                    )}
                  </Flex>
                </StyledBox>
                <StyledBox>
                  <StyledTextTitle fontSize="20px">
                    <Text fontFamily="'Metuo', sans-serif" fontSize="20px" fontWeight="900" color="secondary" mr="8px">
                      U2U
                    </Text>
                    {t('Reward')}
                  </StyledTextTitle>
                  <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
                    <Text fontSize="36px" lineHeight="1">
                      20.122
                    </Text>
                    <Button height="42px" width="120px" className="button-hover">
                      {t('Claim')}
                    </Button>
                  </Flex>
                </StyledBox>
              </Flex>
            </BorderLayout>
            <BorderLayout>
              <Flex p="14px 24px" style={{ gap: '100px' }}>
                <StyledBox>
                  <StyledTextTitle fontSize="20px">{t('Staked Amount')} (U2U)</StyledTextTitle>
                  <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
                    <Text fontSize="36px" lineHeight="1">
                      20.122
                    </Text>
                    {isTime ? (
                      <Box>
                        <Text textAlign="center" fontSize="16px" fontWeight="700" color="secondary">
                          {t('Release In')}
                        </Text>
                        <Text fontSize="16px" letterSpacing="0.5px" fontWeight="500">
                          00 : 00 : 00
                        </Text>
                      </Box>
                    ) : (
                      <Button height="40px" variant="secondary" className="button-hover">
                        {isWithdraw ? t('Withdraw') : t('Unstake')}
                      </Button>
                    )}
                  </Flex>
                </StyledBox>
                <StyledBox>
                  <StyledTextTitle fontSize="20px">
                    <Text fontFamily="'Metuo', sans-serif" fontSize="20px" fontWeight="900" color="secondary" mr="8px">
                      U2U
                    </Text>
                    {t('Reward')}
                  </StyledTextTitle>
                  <Flex alignItems="center" justifyContent="space-between" mt="26px" width="100%">
                    <Text fontSize="36px" lineHeight="1">
                      20.122
                    </Text>
                    <Button height="42px" width="120px" className="button-hover">
                      {t('Claim')}
                    </Button>
                  </Flex>
                </StyledBox>
              </Flex>
            </BorderLayout>
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
