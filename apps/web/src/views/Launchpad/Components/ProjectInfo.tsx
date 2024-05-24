import { useTranslation } from '@pancakeswap/localization';
import { AutoColumn, Box, Button, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit';
import { useCallback, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared';
import { useAccount } from 'wagmi';
import { StyledButton, StyledNeubrutal } from '../styles';
import { ILaunchpadDetail, ITierInfo, IUserWhiteListInfo } from '../types/LaunchpadType';
import ModalDetail from './ModalDetail';

const StyledTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 20px;
  font-weight: 900;
  line-height: calc(24/20);
  color: ${({ theme }) => theme.colors.text};
  @media screen and (max-width: 575px) {
    font-size: 18px;
  }
`
const StyledContent = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
`
const StyledContentDot = styled(Text)`
  position: relative;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  padding-left: 20px;
  &::before {
    content: '•';
    position: absolute;
    top: 8px;
    left: 8px;
    line-height: 0;
  }
`
const StyledText = styled(Text)`
  color: #d6ddd0;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
`
const Image = styled.img`
  margin: auto;
`
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
  grid-template-columns: repeat(5, 1fr);
  padding: 0 24px;
  > * {
    min-width: 100px;
    @media screen and (max-width: 1199px) and (min-width: 992px) {
      min-width: 80px;
    }
  }
  @media screen and (max-width: 1199px) and (min-width: 992px) {
    padding: 0 16px;
  }
`
const IconTier = styled.img`
  height: 40px;
`
const StyledTextItalic = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  font-style: italic;
  line-height: 16px;
`
const StyledInput = styled.input`
  background-color: rgba(191, 252, 251, 0.2);
  border-radius: 4px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.cardBorder};
  color: rgba(159, 159, 159, 1);
  display: block;
  font-size: 16px;
  height: 48px;
  outline: 0;
  padding: 0 10px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  margin-right: 12px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  @media screen and (max-width: 1199px) {
    max-width: 100%;
  }
`
const StyledButtonText = styled(Button)`
  font-size: 12px;
  font-weight: 300;
  font-style: italic;
  padding: 0;
  display: inline;
  text-decoration: underline;
  height: 32px;
  &:hover {
    color: ${({ theme }) => theme.colors.hover};
  }
`

const data = [
  { round: 'Tier 1', startTime: '0h', endTime: '0h', cancelTime: '0h', Claimable: '0h' },
  { round: 'Tier 2', startTime: '3h', endTime: '3h', cancelTime: '3h', Claimable: '3h' },
  { round: 'Tier 3', startTime: '6h', endTime: '6h', cancelTime: '6h', Claimable: '6h' },
  { round: 'Apply Whitelist', startTime: '9h', endTime: '9h', cancelTime: '9h', Claimable: '9h' },
  { round: 'Community', startTime: '12h', endTime: '12h', cancelTime: '12h', Claimable: '12h' },
]

export default function ProjectInfo({ tierInfo, userWhiteListInfo, info }: { tierInfo?: ITierInfo, userWhiteListInfo?: IUserWhiteListInfo, info: ILaunchpadDetail }) {

  const { t } = useTranslation()
  const theme = useTheme()
  const [isOpen, setOpen] = useState(false)
  const closeModal = useCallback(() => setOpen(false), [])
  const { address: account } = useAccount()
  const tierTooltip = useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize="12px" lineHeight="18px" mb="4px">{t('The tier depends on the number of U2Us staked in the GrofiDex staking system.')}</Text>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Tier 1: Minimum U2U stake amount is 5000 U2U')}</StyledContentDot>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Tier 2: Minimum U2U stake amount is 2000 U2U')}</StyledContentDot>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Tier 3: Minimum U2U stake amount is 1000 U2U')}</StyledContentDot>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Starter: No stake or U2U stake amount less than 1000 U2U')}</StyledContentDot>
    </>, {
      placement: 'right'
    }
  )
  const applyTooltip = useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize="12px" lineHeight="18px" mb="4px">{t('Why need apply Whitelist?')}</Text>
      <StyledContent fontSize="12px" lineHeight="16px">{t('There are projects that require you to apply to the whitelist to ensure that you are serious about the project, you will be guaranteed priority when purchasing compared to those who do not apply to the whitelist.')}</StyledContent>
    </>, {
      placement: 'right'
    }
  )

  return (
    <>
      <Flex
        mt="30px"
        flexDirection={["column-reverse", "column-reverse", "column-reverse", "column-reverse", "row"]}
      >
        <StyledNeubrutal p={["24px 16px", "24px 16px", "28px 20px", "28px 20px", "32px 24px"]} height="100%" style={{ flex: '2' }}>
          <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]} mb={["20px", "20px", "26px", "26px", "32px"]}>
            <StyledTitle mb={["12px", "12px", "16px"]}>{t('About %token% Project', {token: info?.tokenName})}</StyledTitle>
            <StyledContent>{info.description}</StyledContent>
          </Box>
          <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]} mb={["20px", "20px", "26px", "26px", "32px"]}>
            <StyledTitle mb={["12px", "12px", "16px"]}>{t('Roadmap')}</StyledTitle>
            <Box ml={["18px", "18px", "24px", "24px", "30px"]}>
              <StyledText>{t('2024 Q1')}</StyledText>
              <StyledContent>{t('Aenean eget vehicula neque. In hendrerit, arcu vitae porttitor aliquam, lorem mauris laoreet ipsum')}</StyledContent>
            </Box>
            <Box ml={["18px", "18px", "24px", "24px", "30px"]} mt="12px">
              <StyledText>{t('2024 Q1')}</StyledText>
              <StyledContent>{t('Aenean eget vehicula neque. In hendrerit, arcu vitae porttitor aliquam, lorem mauris laoreet ipsum')}</StyledContent>
            </Box>
          </Box>
          <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]} mb={["20px", "20px", "26px", "26px", "32px"]}>
            <StyledTitle mb={["24px", "24px", "28px", "28px", "32px"]}>{t('TokenX’s Tokenomics')}</StyledTitle>
            <Flex flexDirection={["column", "column", "row"]}>
              <Box style={{ flex: '1', textAlign: 'center' }}>
                <Image src="/images/project-chart.png"/>
                <Text color="textSubtle" fontSize="16px" fontWeight="600" textAlign="center" mt={["10px", "10px", "14px", "14px", "18px"]} mx="auto" maxWidth="186px">{t('Max Supply & Distribution 1.000.000')}</Text>
              </Box>
              <Box style={{ flex: '1' }} mt={["16px", "16px", "0"]}>
                <Box mb={["16px", "16px", "20px", "20px", "24px"]}>
                  <StyledText mb={["8px", "8px", "10px", "10px", "12px"]}>{t('Max Supply of 1 Billion token')}</StyledText>
                  <StyledContentDot lineHeight="17px">{t('95% of total supply sent to Liquidity')}</StyledContentDot>
                  <StyledContentDot mt={["4px", "4px", "6px", "6px", "8px"]} lineHeight="17px">{t('5% of total supply sent to dev wallet')}</StyledContentDot>
                </Box>
                <Box>
                  <StyledText mb={["8px", "8px", "10px", "10px", "12px"]}>{t('10% of Tax in each transaction')}</StyledText>
                  <StyledContentDot lineHeight="17px">{t('5% of which is burned, forever, decreasing circulating supply')}</StyledContentDot>
                  <StyledContentDot mt={["4px", "4px", "6px", "6px", "8px"]} lineHeight="17px">{t('5% of remaining is sent to Marketing wallet, for Massive Marketing campaigns')}</StyledContentDot>
                </Box>
              </Box>
            </Flex>
          </Box>
          <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]}>
            <StyledTitle mb={["20px", "20px", "24px"]}>{t('Schedule Time IDO')}</StyledTitle>
          </Box>
          <Wrapper>
            <TableWrapper>
              <LayoutScroll>
                <ResponsiveGrid>
                  <Text color="textSubtle" textAlign="center">
                    {t('Round')}
                  </Text>
                  <Text color="textSubtle" textAlign="center">
                    {t('Start Time')}
                  </Text>
                  <Text color="textSubtle" textAlign="center">
                    {t('End Time')}
                  </Text>
                  <Text color="textSubtle" textAlign="center">
                    {t('Cancel Time')}
                  </Text>
                  <Text color="textSubtle" textAlign="center">
                    {t('Claimable')}
                  </Text>
                </ResponsiveGrid>
                <AutoColumn gap="16px">
                  <Break />
                  {data?.map((item) => (
                    <>
                      <ResponsiveGrid>
                        <Text color='text' textAlign="center">{item.round}</Text>
                        <Text color='text' textAlign="center">{item.startTime}</Text>
                        <Text color='text' textAlign="center">{item.endTime}</Text>
                        <Text color='text' textAlign="center">{item.cancelTime}</Text>
                        <Text color='text' textAlign="center">{item.Claimable}</Text>
                      </ResponsiveGrid>
                      <Break />
                    </>
                  ))}
                </AutoColumn>
              </LayoutScroll>
            </TableWrapper>
          </Wrapper>
        </StyledNeubrutal>
        <StyledNeubrutal style={{ flex: '1' }} height="100%" mx="auto" width="100%" minWidth={["100%", "100%", "360px"]} maxWidth="460px" ml={["auto", "auto", "auto", "auto", "16px"]} mb={["16px", "16px", "16px", "16px", "0"]}>
          <Box p={["20px 16px", "20px 16px", "24px 20px"]}>
            <StyledTitle mb={["20px", "20px", "26px", "26px", "32px"]}>{t('Buy IDO TokenX')}</StyledTitle>
            <Box mb={["20px", "20px", "24px"]}>
              <Flex mb="12px">
                <Text color="textSubtle" fontSize="16px" fontWeight="600" mr="10px">{t('Your Tier')}</Text>
                <TooltipText ref={tierTooltip.targetRef} decorationColor="secondary">
                  <Image style={{ margin: 'unset', width: '12px', height: '12px' }} src="/images/launchpad/icon-exclamation.svg" />
                </TooltipText>
                {tierTooltip.tooltipVisible && tierTooltip.tooltip}
              </Flex>
              <Flex alignItems="flex-end" mb="12px">
                <IconTier src="/images/launchpad/icon-tier-1.svg" />
                <StyledText ml="12px" style={{ fontSize: '20px', lineHeight: '24px' }}>{`Tier ${tierInfo?.tier}`}</StyledText>
              </Flex>
              <Box>
                <StyledTextItalic>{t(`Estimate maximum %maxBuyPerUser% U2U to buy IDO in round buy IDO Tier %tier%.`, { maxBuyPerUser: tierInfo?.maxBuyPerUser, tier: tierInfo?.tier })}</StyledTextItalic>
                <StyledTextItalic>{t('The snapshot will be ended at ')} <span style={{ color: '#d6ddd0' }}>{t('2024/05/03 14:22:22 UTC.')}</span></StyledTextItalic>
                <StyledTextItalic>
                  {t('Staking more to upgrade your tier. ')}
                  <Link fontSize="12px" fontStyle="italic" style={{ display: 'inline', fontWeight: '300', textDecoration: 'underline' }} external href="https://www.hashdit.io">
                    {t('Staking Now')}
                  </Link>
                </StyledTextItalic>
                <StyledTextItalic>{t('Maximum 100 U2U to buy IDO in round buy IDO Tier 1. The snapshot process has ended at 2024/05/03 14:22:22 UTC.')}</StyledTextItalic>
              </Box>
            </Box>
            <Box mb={["20px", "20px", "24px"]}>
              <Flex mb="12px">
                <Text color="textSubtle" fontSize="16px" fontWeight="600" mr="10px">{t('Apply Whitlelist')}</Text>
                <TooltipText ref={applyTooltip.targetRef} decorationColor="secondary">
                  <Image style={{ margin: 'unset', width: '12px', height: '12px' }} src="/images/launchpad/icon-exclamation.svg" />
                </TooltipText>
                {applyTooltip.tooltipVisible && applyTooltip.tooltip}
              </Flex>
              {account ? !userWhiteListInfo?.isWhiteList && (
                <StyledButton className="button-hover">
                  {t('Apply Now')}
                </StyledButton>
              ) : (
                <StyledButton className="button-hover">
                  {t('Connect Wallet')}
                </StyledButton>
              )}
              <Flex alignItems="center">
                <Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-error.svg" />
                <Text color="failure" maxWidth="290px" fontSize="14px" fontWeight="600" lineHeight="20px" ml="12px">{t(`Apply whitelist has been expired. You don’t apply whitelist`)}</Text>
              </Flex>
              <Flex alignItems="center">
                <Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-success.svg" />
                <Text color="success" maxWidth="290px" fontSize="14px" fontWeight="600" lineHeight="20px" ml="12px">{t(`Congratulation! You have applied whitelist at 2024/05/03 14:22:22 UTC.`)}</Text>
              </Flex>
              <Box mt="12px">
                <Text color="textSubtle" fontSize="12px" lineHeight="20px">{t('Time during (UTC):')}</Text>
                <Text fontSize="12px" lineHeight="20px" style={{ color: '#d6ddd0' }}>{t('2024/05/03 14h:00m:00s - 2024/05/05 14h:00m:00s')}</Text>
              </Box>
            </Box>
            <Box style={{ textAlign: 'center' }}>
              <Text color="hover" fontSize="14px" fontWeight="600">{t('Sale token for Tier 1 start in')}</Text>
              <Text color="primary" fontSize="24px" fontWeight="600" lineHeight="30px">{t('00d : 18h : 35m : 11s')}</Text>
              <StyledContent maxWidth="340px" m="auto" mt={["12px", "12px", "16px", "16px", "20px", "20px", "24px"]}>
                <span style={{ color: theme.colors.hover }}>FCFS: </span>
                First come first serve. Whitelist pool is available 200 U2U ~ 200,000 TOKENX.
              </StyledContent>
            </Box>
          </Box>
          <Break/>
          <Box p={["20px 16px", "20px 16px", "24px 20px"]}>
            <Box>
              <Flex alignItems="center">
                <Text color="textSubtle" fontSize="16px" fontWeight="600" mr="8px">{t('Your committed')}</Text>
                <StyledButtonText variant="text" onClick={() => setOpen(!isOpen)}>
                  {t('Show detail')}
                </StyledButtonText>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="text" fontSize="24px" fontWeight="700" lineHeight="32px">0.0000 U2U</Text>
                <StyledButton className="button-hover">{t('Claim')}</StyledButton>
              </Flex>
              <StyledTextItalic textAlign="right" mt="8px">Estimate 1.2345 U2U, 18,000.000 TOKENX</StyledTextItalic>
              <StyledTextItalic mt="12px">
                Note: You can cancel your request buy in 2 hours from 2024/05/03 14h:00m:00s - to 2024/05/05 14h:00m:00s UTC. <span style={{ color: theme.colors.hover }}>5% fee</span> when canceling IDO orders.&nbsp;
                <Link fontSize="12px" fontStyle="italic" style={{ display: 'inline', fontWeight: '300', textDecoration: 'underline' }} external href="/">
                  {t('Cancel buy IDO')}
                </Link>
              </StyledTextItalic>
            </Box>
            <Box my={["20px", "20px", "24px"]}>
              <Text color="textSubtle" fontSize="16px" fontWeight="600" mb="8px">{t('U2U Commit')}</Text>
              <Flex alignItems="center">
                <StyledInput
                  placeholder="Enter amount U2U commit"
                />
                <StyledButton
                  className="button-hover"
                  px="16px"
                >
                  {t('Commit U2U')}
                </StyledButton>
              </Flex>
              <Text color="textSubtle" fontSize="12px" fontStyle="italic" lineHeight="16px" mt="8px">{t('Maximum %maxCommitAmount% U2U', { maxCommitAmount: tierInfo?.maxCommitAmount })}</Text>
              <Flex alignItems="center">
                <Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-card-failed.svg" />
                <Box ml="16px">
                  <Text color='failure' fontSize="16px" fontWeight="600" lineHeight="20px" textTransform="uppercase">{t('IDO Failed')}</Text>
                  <StyledContent lineHeight="20px" mt="4px">{t('Unfortunately, the IDO project failed. The total raised value does not reach the softcap minimum.')}</StyledContent>
                </Box>
              </Flex>
              <Flex alignItems="center">
                <Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-card-success.svg" />
                <Box ml="16px">
                  <Text color='success' fontSize="16px" fontWeight="600" lineHeight="20px" textTransform="uppercase">{t('IDO Successfully')}</Text>
                  <StyledContent lineHeight="20px" mt="4px">{t('The project has been IDO successfully, your committed U2U has been swapped to TOKENX. Claim to your wallet.')}</StyledContent>
                </Box>
              </Flex>
              <StyledTextItalic mt="12px">
                Please click the 
                <Link fontSize="12px" fontStyle="italic" mx="4px" textTransform="uppercase" style={{ display: 'inline', fontWeight: '300', textDecoration: 'underline' }} external href="/">
                  {t('Claim')}
                </Link>
                button above to get your TOKENX
              </StyledTextItalic>
            </Box>
            <Box>
              <StyledContent>
                {t(`You need connect wallet to see your schedule time. `)}
                <Link fontSize="14px" style={{ display: 'inline', fontWeight: '400' }} external href="/">
                  {t('Connect now')}
                </Link>
              </StyledContent>
              <StyledContent>{t(`Schedule time for you (UTC), don't miss it:`)}</StyledContent>
              <StyledContentDot lineHeight="17px" mb="4px">
                {t('Tier 1:')}
                <Text fontSize="14px" lineHeight="20px" mt="2px" style={{ color: '#d6ddd0' }}>{t('2024/05/03 14h:00m:00s - 2024/05/03 14h:00m:00s ')}</Text>
              </StyledContentDot>
              <StyledContentDot lineHeight="17px" mb="4px">
                {t('Whitelist:')}
                <Text fontSize="14px" lineHeight="20px" mt="2px" style={{ color: '#d6ddd0' }}>{t('2024/05/03 14h:00m:00s - 2024/05/03 14h:00m:00s ')}</Text>
              </StyledContentDot>
              <StyledContentDot lineHeight="17px">
                {t('Community:')}
                <Text fontSize="14px" lineHeight="20px" mt="2px" style={{ color: '#d6ddd0' }}>{t('2024/05/03 14h:00m:00s - 2024/05/03 14h:00m:00s ')}</Text>
              </StyledContentDot>
            </Box>
          </Box>
        </StyledNeubrutal>
      </Flex>
      <ModalDetail
        isOpen={isOpen}
        onDismiss={closeModal}
        closeOnOverlayClick
      />
    </>
  )
}
