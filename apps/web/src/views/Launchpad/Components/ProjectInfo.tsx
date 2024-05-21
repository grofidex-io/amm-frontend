import { useTranslation } from '@pancakeswap/localization';
import { AutoColumn, Box, Button, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit';
import { useCallback, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared';
import { StyledButton, StyledNeubrutal } from '../styles';
import ModalDetail from './ModalDetail';

const StyledTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 20px;
  font-weight: 900;
  line-height: calc(24/20);
  color: ${({ theme }) => theme.colors.text};
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

export default function ProjectInfo() {

  const { t } = useTranslation()
  const theme = useTheme()
  const [isOpen, setOpen] = useState(false)
  const closeModal = useCallback(() => setOpen(false), [])
  const tierTooltip = useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize="12px" lineHeight="18px" mb="4px">{t('The level depends on the number of U2Us staked in the GrofiDex staking system.')}</Text>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Level 1: Minimum U2U stake amount is 5000 U2U')}</StyledContentDot>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Level 2: Minimum U2U stake amount is 2000 U2U')}</StyledContentDot>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Level 3: Minimum U2U stake amount is 1000 U2U')}</StyledContentDot>
      <StyledContentDot fontSize="12px" lineHeight="20px">{t('Starter: No stake or U2U stake amount less than 1000 U2U')}</StyledContentDot>
    </>, {
      placement: 'right',
      trigger: 'hover'
    }
  )
  const applyTooltip = useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize="12px" lineHeight="18px" mb="4px">{t('Why need apply Whitelist?')}</Text>
      <StyledContent fontSize="12px" lineHeight="16px">{t('There are projects that require you to apply to the whitelist to ensure that you are serious about the project, you will be guaranteed priority when purchasing compared to those who do not apply to the whitelist.')}</StyledContent>
    </>, {
      placement: 'right',
      trigger: 'hover'
    }
  )

  return (
    <>
      <Flex mt="30px">
        <StyledNeubrutal p="32px 24px" style={{ flex: '2' }}>
          <Box px="20px" mb="32px">
            <StyledTitle mb="16px">{t('About XToken Project')}</StyledTitle>
            <StyledContent>{t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porta odio sapien, id efficitur est faucibus a. Donec porttitor sem eget egestas mollis. Ut velit arcu, luctus eu varius non, mollis sed erat. ....')}</StyledContent>
          </Box>
          <Box px="20px" mb="32px">
            <StyledTitle mb="16px">{t('Roadmap')}</StyledTitle>
            <Box ml="30px">
              <StyledText>{t('2024 Q1')}</StyledText>
              <StyledContent>{t('Aenean eget vehicula neque. In hendrerit, arcu vitae porttitor aliquam, lorem mauris laoreet ipsum')}</StyledContent>
            </Box>
            <Box ml="30px" mt="12px">
              <StyledText>{t('2024 Q1')}</StyledText>
              <StyledContent>{t('Aenean eget vehicula neque. In hendrerit, arcu vitae porttitor aliquam, lorem mauris laoreet ipsum')}</StyledContent>
            </Box>
          </Box>
          <Box px="20px" mb="32px">
            <StyledTitle mb="32px">{t('TokenX’s Tokenomics')}</StyledTitle>
            <Flex>
              <Box style={{ flex: '1', textAlign: 'center' }}>
                <Image src="/images/project-chart.png"/>
                <Text color="textSubtle" fontSize="16px" fontWeight="600" textAlign="center" mt="18px" mx="auto" maxWidth="186px">{t('Max Supply & Distribution 1.000.000')}</Text>
              </Box>
              <Box style={{ flex: '1' }}>
                <Box mb="24px">
                  <StyledText mb="12px">{t('Max Supply of 1 Billion token')}</StyledText>
                  <StyledContentDot lineHeight="17px">{t('95% of total supply sent to Liquidity')}</StyledContentDot>
                  <StyledContentDot mt="8px" lineHeight="17px">{t('5% of total supply sent to dev wallet')}</StyledContentDot>
                </Box>
                <Box>
                  <StyledText mb="12px">{t('10% of Tax in each transaction')}</StyledText>
                  <StyledContentDot lineHeight="17px">{t('5% of which is burned, forever, decreasing circulating supply')}</StyledContentDot>
                  <StyledContentDot mt="8px" lineHeight="17px">{t('5% of remaining is sent to Marketing wallet, for Massive Marketing campaigns')}</StyledContentDot>
                </Box>
              </Box>
            </Flex>
          </Box>
          <Box px="20px">
            <StyledTitle mb="24px">{t('Schedule Time IDO')}</StyledTitle>
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
        <StyledNeubrutal style={{ flex: '1' }} height="100%" ml="16px">
          <Box p="24px 20px">
            <StyledTitle mb="32px">{t('Buy IDO TokenX')}</StyledTitle>
            <Box mb="24px">
              <Flex mb="12px">
                <Text color="textSubtle" fontSize="16px" fontWeight="600" mr="10px">{t('Your Tier')}</Text>
                <TooltipText ref={tierTooltip.targetRef} decorationColor="secondary">
                  <Image style={{ margin: 'unset', width: '12px', height: '12px' }} src="/images/launchpad/icon-exclamation.svg" />
                </TooltipText>
                {tierTooltip.tooltipVisible && tierTooltip.tooltip}
              </Flex>
              <Flex alignItems="flex-end" mb="12px">
                <IconTier src="/images/launchpad/icon-tier-1.svg" />
                <StyledText ml="12px" style={{ fontSize: '20px', lineHeight: '24px' }}>{t('Tier 1')}</StyledText>
              </Flex>
              <Box>
                <StyledTextItalic>{t('Estimate maximum 100 U2U to buy IDO in round buy IDO Tier 1.')}</StyledTextItalic>
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
            <Box mb="24px">
              <Flex mb="12px">
                <Text color="textSubtle" fontSize="16px" fontWeight="600" mr="10px">{t('Apply Whitlelist')}</Text>
                <TooltipText ref={applyTooltip.targetRef} decorationColor="secondary">
                  <Image style={{ margin: 'unset', width: '12px', height: '12px' }} src="/images/launchpad/icon-exclamation.svg" />
                </TooltipText>
                {applyTooltip.tooltipVisible && applyTooltip.tooltip}
              </Flex>
              <StyledButton
                className="button-hover"
              >
                {t('Connect Wallet')}
              </StyledButton>
              <StyledButton
                className="button-hover"
              >
                {t('Apply Now')}
              </StyledButton>
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
            <Text textAlign="center" color="hover" fontSize="14px" fontWeight="600">{t('Sale token for Tier 1 start in')}</Text>
            <Text textAlign="center" color="primary" fontSize="24px" fontWeight="600" lineHeight="30px">{t('00d : 18h : 35m : 11s')}</Text>
          </Box>
          <Break/>
          <Box p="24px 20px">
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
              <StyledTextItalic mt="12px">
                Note: You can cancel your request buy in 2 hours from 2024/05/03 14h:00m:00s - to 2024/05/05 14h:00m:00s UTC. <span style={{ color: theme.colors.hover }}>5% fee</span> when canceling IDO orders.&nbsp;
                <Link fontSize="12px" fontStyle="italic" style={{ display: 'inline', fontWeight: '300', textDecoration: 'underline' }} external href="/">
                  {t('Cancel buy IDO')}
                </Link>
              </StyledTextItalic>
            </Box>
            <Box my="24px">
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
              <Text color="textSubtle" fontSize="12px" fontStyle="italic" lineHeight="16px" mt="8px">{t('Maximum 50 U2U')}</Text>
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
