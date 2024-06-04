import { useTranslation } from '@pancakeswap/localization';
import { AutoColumn, Box, Button, Flex, Link, Text, TooltipText, useModal, useToast, useTooltip } from '@pancakeswap/uikit';
import { formatNumber } from '@pancakeswap/utils/formatBalance';
import { NumericalInput } from '@pancakeswap/widgets-internal';
import BigNumber from 'bignumber.js';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { ToastDescriptionWithTx } from 'components/Toast';
import dayjs from 'dayjs';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useActiveChainId } from 'hooks/useActiveChainId';
import useCatchTxError from 'hooks/useCatchTxError';
import forEach from 'lodash/forEach';
import keyBy from 'lodash/keyBy';
import { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { getLaunchpadContract, getLaunchpadManagerContract } from 'utils/contractHelpers';
import { formatDate } from 'views/CakeStaking/components/DataSet/format';
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared';
import { Address, useWalletClient } from 'wagmi';
import { COUNTDOWN_TYPE, LAUNCHPAD_STATUS, PHASES_TYPE } from '../helpers';
import { StyledButton, StyledNeubrutal } from '../styles';
import { ILaunchpadDetail, IPhase, ITierInfo, ITimeOfPhase, IUserWhiteListInfo } from '../types/LaunchpadType';
import CountdownTime from './CountdownTime';
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
const StyledInput = styled(NumericalInput)`
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

export default function ProjectInfo({ info, timeWhiteList, account, currentTier, totalCommit }: { info: ILaunchpadDetail, timeWhiteList: ITimeOfPhase, account: string, currentTier: Address, totalCommit: number }) {
  const { t } = useTranslation()
  const theme = useTheme()
	const _refIntervalCheckPhase = useRef<any>()
	const _refTimeoutCheckPhase = useRef<any>()
	const _launchpadContract = useRef<any>()
	const _launchpadContractWhitelist = useRef<any>()
	const launchpadManagerContract = useRef<any>()
	const [rate, setRate] = useState<number>(0)

	const [isFocusInput, setIsFocusInput] = useState(false)
	const [timeCountdown, setTimeCountdown] = useState<number>(0)
	const [currentPhaseOrNext, setCurrentPhaseOrNext] = useState<IPhase>()
	const [currentPhase, setCurrentPhase] = useState<IPhase | null>()
	const [currentPhaseWhitelist, setCurrentPhaseWhitelist] = useState<IPhase | null>()
	const [typeCountdown, setTypeCountdown] = useState<number>(0)
	const [checkPhase, setCheckPhase] = useState<number>(0)
	const [amountCommit, setAmountCommit] = useState<string>('')
	const [configInfo, setConfigInfo] = useState<ITierInfo | null>()
	const [userConfigInfo, setUserConfigInfo] = useState<ITierInfo | null>()
	const [configWhitelistInfo, setConfigWhitelistInfo] = useState<ITierInfo | null>()
	const [userCommitInfo, setUserCommitInfo] = useState<IUserWhiteListInfo>()
	const [totalCommitByUser, setTotalCommitByUser] = useState<number>(0)
	const [currentCommit, setCurrentCommit] = useState<number>(0)
  const { fetchWithCatchTxError } = useCatchTxError()
	const { toastSuccess, toastError } = useToast()
	const { chainId } = useActiveChainId()
	const { data: signer } = useWalletClient()
	const refSchedule = useRef<IPhase[]>([])

	const getTotalUserCommitted = async () => {
		const _totalCommitted: any = await launchpadManagerContract.current.read.totalCommitByUser([account])
		if(_totalCommitted) {
			setTotalCommitByUser(BigNumber(formatEther(_totalCommitted)).toNumber())
		}
	}


  // const tierTooltip = useTooltip(
  //   <>
  //     <Text fontFamily="'Metuo', sans-serif" fontSize="12px" lineHeight="18px" mb="4px">{t('The tier depends on the number of U2Us staked in the GrofiDex staking system.')}</Text>
  //     <StyledContentDot fontSize="12px" lineHeight="20px">{t('Tier 1: Minimum U2U stake amount is 5000 U2U')}</StyledContentDot>
  //     <StyledContentDot fontSize="12px" lineHeight="20px">{t('Tier 2: Minimum U2U stake amount is 2000 U2U')}</StyledContentDot>
  //     <StyledContentDot fontSize="12px" lineHeight="20px">{t('Tier 3: Minimum U2U stake amount is 1000 U2U')}</StyledContentDot>
  //     <StyledContentDot fontSize="12px" lineHeight="20px">{t('Starter: No stake or U2U stake amount less than 1000 U2U')}</StyledContentDot>
  //   </>, {
  //     placement: 'right'
  //   }
  // )

  const applyTooltip = useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize="12px" lineHeight="18px" mb="4px">{t('Why need apply Whitelist?')}</Text>
      <StyledContent fontSize="12px" lineHeight="16px">{t('There are projects that require you to apply to the whitelist to ensure that you are serious about the project, you will be guaranteed priority when purchasing compared to those who do not apply to the whitelist.')}</StyledContent>
    </>, {
      placement: 'right'
    }
  )

	const isWhitelistTime = () => {
		const _now = Date.now()
		if(timeWhiteList?.startTime > _now && _now < timeWhiteList?.endTime) {
			return true
		}
		return false
	}

	const handleInputAmount = (_value) => {
		setAmountCommit(_value)
	}

	const getCurrentCommit = async () => {
		const _currentCommit = await _launchpadContract.current.read.currentCommit()
		setCurrentCommit(BigNumber(formatEther(_currentCommit)).toNumber())
	}

	const getConfig = async () => {
		const _configInfo: ITierInfo = await _launchpadContract.current.read.getConfigInfo()
		setConfigInfo({..._configInfo, maxCommitAmount: BigNumber(formatEther(_configInfo.maxCommitAmount)).toNumber(), maxBuyPerUser: formatEther(_configInfo.maxBuyPerUser), startCancel: BigNumber(_configInfo.startCancel).toNumber(), endCancel: BigNumber(_configInfo.endCancel).toNumber()})
	}

	const getTokenRate = async () => {
		const _rate: any = await launchpadManagerContract.current.read.tokenRate()
		setRate(BigNumber(formatEther(_rate)).toNumber())
	}

	const getUserConfig = async () => {
		const _contract = getLaunchpadContract(currentTier, signer ?? undefined, chainId)
		const _configInfo: any = await _contract.read.getConfigInfo()
		const _phaseByContract = keyBy(info?.phases, 'contractAddress')
		setUserConfigInfo({..._configInfo, maxCommitAmount: BigNumber(formatEther(_configInfo.maxCommitAmount)).toNumber(), maxBuyPerUser: formatEther(_configInfo.maxBuyPerUser), name: _phaseByContract[currentTier.toLowerCase()]?.name})
	}

	const getUserCommitted = async (_contract?: any) => {
		const contract = _contract || _launchpadContract.current
		const _userWhiteList: any = await contract.read.userCommit([account])
		setUserCommitInfo({
			u2uCommitted: BigNumber(_userWhiteList[0]).toNumber(),
			giveBackAmount: BigNumber(_userWhiteList[1]).toNumber(),
			isWhiteList: _userWhiteList[2],
		})
	}

	const initContract = () => {
		if(currentPhase?.contractAddress) {
			_launchpadContract.current =  getLaunchpadContract(currentPhase.contractAddress, signer ?? undefined, chainId)
			if(currentPhase.type === PHASES_TYPE.WHITELIST || currentPhase.type === PHASES_TYPE.COMMUNITY) {
				getCurrentCommit()
			}
			getConfig()
		}
	}

	const initContractWhitelist = async () => {
		if(currentPhaseWhitelist?.contractAddress && signer) {
			_launchpadContractWhitelist.current =  getLaunchpadContract(currentPhaseWhitelist.contractAddress, signer ?? undefined, chainId)
			const _configInfo: ITierInfo = await _launchpadContractWhitelist.current.read.getConfigInfo()
			setConfigWhitelistInfo(_configInfo)
			getUserCommitted(_launchpadContractWhitelist.current)
		}
	}

	const handleWhitelist = async () => {
		const _res = await _launchpadContractWhitelist.current.write.addWhiteList()
		if(_res) {
			getUserCommitted(_launchpadContractWhitelist.current)
		}
	}

	const checkTier = async (_contract: any, phases: IPhase) => {
		const status = await _contract.read.checkTier([account])
		if(status) {
			refSchedule.current.push(phases)
		}
	}

	const checkWhiteList = async (_contract: any, phases: IPhase) => {
		const _userWhiteList: any = await _contract.read.userCommit([account])
		if(_userWhiteList[2]) {
			refSchedule.current.push(phases)
		}
	}

	const checkSchedule = () => {
		refSchedule.current = []
		const _schedule: any = []
		const _now = Date.now()
		forEach(info.phases, (item: IPhase) => {
			const _contract = getLaunchpadContract(item.contractAddress, signer ?? undefined, chainId)
			if(item.type === PHASES_TYPE.TIER && item.contractAddress === currentTier && item.startTime > _now) {
				checkTier(_contract, item)
			}
			if(item.type === PHASES_TYPE.WHITELIST && item.startTime > _now) {
				checkWhiteList(_contract, item)
			}
			if(item.type !== PHASES_TYPE.TIER && item.type !== PHASES_TYPE.WHITELIST && item.startTime > _now) {
				_schedule.push(item)
			}
		})

		if(_schedule.length > 0) {
			refSchedule.current = [...refSchedule.current, ..._schedule]
		}
	}

	const [openCommittedModal] = useModal(
		<ModalDetail
			tokenName={info?.tokenName}
			onDismiss
			saleEnd={info?.saleEnd}
			account={account}
			launchpad={info?.contractAddress}
			getTotalUserCommitted={getTotalUserCommitted}
			listPhase={keyBy(info?.phases, 'contractAddress')}
			rate={rate}
		/>
	)
	
	useEffect(() => {
		if(currentTier) {
			getUserConfig()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTier, info?.phases])

	useEffect(() => {
		if(currentPhase?.contractAddress && signer) {
			initContract()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPhase?.contractAddress, signer])

	useEffect(() => {
		if(currentPhaseWhitelist?.contractAddress) {
			initContractWhitelist()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPhaseWhitelist?.contractAddress, signer])

	useEffect(() => {
	const _now = Date.now()
	if(currentPhaseOrNext?.startTime && currentPhaseOrNext.startTime > _now) {
		setTimeCountdown(currentPhaseOrNext?.startTime)
		setTypeCountdown(0)
	}
	if(currentPhaseOrNext?.endTime && currentPhaseOrNext.endTime > _now && currentPhaseOrNext.startTime < _now) {
		setTimeCountdown(currentPhaseOrNext?.endTime)
		setTypeCountdown(1)
	}
	}, [currentPhaseOrNext, currentPhase])


	useEffect(() => {
		if(info?.phases) {
			const _now = Date.now()
			let _nextPhase: any = null
			let _currentPhase: any = null
			forEach(info.phases, (item: IPhase) => {
				if(item?.type === PHASES_TYPE.WHITELIST) {
					setCurrentPhaseWhitelist(item)

				}
				if(item.startTime <= _now && _now <= item.endTime) {
					_currentPhase = item
					setCurrentPhase(item)
					setCurrentPhaseOrNext(item)
				}
				if(!_nextPhase && _now < item.startTime) {
					_nextPhase = item
				}
			})

			if(!_currentPhase) {
				setCurrentPhase(null)
				if(_nextPhase) {
					setCurrentPhaseOrNext(_nextPhase)
				}
			}
		}
	}, [info, checkPhase])


	
	const recheckPhase = () => {
		clearTimeout(_refTimeoutCheckPhase.current)
		clearInterval(_refIntervalCheckPhase.current)
		_refIntervalCheckPhase.current = setInterval(() => {
			setCheckPhase(Date.now())
		}, 500)
		_refTimeoutCheckPhase.current = setTimeout(() => {
			clearInterval(_refIntervalCheckPhase.current)
		}, 3000)
	}

	useEffect(() => {
		return () => {
			clearInterval(_refIntervalCheckPhase.current)
		}
	}, [])


	useEffect(() => {
		if(info?.phases.length > 0 && account) {
			checkSchedule()
		}
		if(info?.contractAddress) {
			launchpadManagerContract.current = getLaunchpadManagerContract(info.contractAddress, signer ?? undefined, chainId )
			if(launchpadManagerContract.current.account) {
				getTotalUserCommitted()
				getTokenRate()
			}
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [info, signer, account])

	const handleCommitU2U = async () => {
		if(!disableCommitU2U && BigNumber(amountCommit).gt(0) && configInfo?.maxCommitAmount && BigNumber(configInfo?.maxCommitAmount).gt(BigNumber(amountCommit))) {
			try {

				const res = await fetchWithCatchTxError(() => _launchpadContract.current.write.commit({value: parseEther(amountCommit)}))
				if(res?.status) {
					getTotalUserCommitted()
					setAmountCommit('')
					toastSuccess(
						t('Success!'),
						<ToastDescriptionWithTx txHash={res.transactionHash}>
							Commit successfully
						</ToastDescriptionWithTx>,
					)
				}
			}catch(error: any) {
				const errorDescription = `${error.message} - ${error.data?.message}`
				toastError(t('Failed'), errorDescription)
			}
		}
	}
	

	let disableCommitU2U = false
	if(configInfo?.typeRound === PHASES_TYPE.TIER) {
		if(currentPhase?.contractAddress !== currentTier?.toLowerCase() || amountCommit?.length === 0 || BigNumber(amountCommit).lte(0) || BigNumber(amountCommit).gt(configInfo.maxCommitAmount)) {
			disableCommitU2U = true
		}
	}

	if(!configInfo?.start || (configInfo?.typeRound === PHASES_TYPE.WHITELIST && !userCommitInfo?.isWhiteList)) {
		disableCommitU2U = true
	}

	const scheduleOrder = refSchedule.current.sort((a: IPhase, b: IPhase) => (a.startTime - b.startTime) )


  return (
    <>
      <Flex
        mt="30px"
        flexDirection={["column-reverse", "column-reverse", "column-reverse", "column-reverse", "row"]}
      >
        <StyledNeubrutal p={["24px 16px", "24px 16px", "28px 20px", "28px 20px", "32px 24px"]} height="100%" style={{ flex: '2' }}>
          <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]} mb={["20px", "20px", "26px", "26px", "32px"]}>
            <StyledTitle mb={["12px", "12px", "16px"]}>{t('About %token% Project', {token: info?.tokenName})}</StyledTitle>
            <StyledContent>{info?.description}</StyledContent>
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
            <StyledTitle mb={["24px", "24px", "28px", "28px", "32px"]}>{t('%name% Tokenomics', {name: info?.tokenName})}</StyledTitle>
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
        {info?.status !== LAUNCHPAD_STATUS.UPCOMING && (
          <StyledNeubrutal style={{ flex: '1' }} height="100%" mx="auto" width="100%" minWidth={["100%", "100%", "360px"]} maxWidth="460px" ml={["auto", "auto", "auto", "auto", "16px"]} mb={["16px", "16px", "16px", "16px", "0"]}>
            <Box p={["20px 16px", "20px 16px", "24px 20px"]}>
              <StyledTitle mb={["20px", "20px", "26px", "26px", "32px"]}>{t('Buy IDO %name%', { name: info?.tokenName })}</StyledTitle>
              { userConfigInfo && (
								<Box mb={["20px", "20px", "24px"]}>
									<Flex mb="12px">
										<Text color="textSubtle" fontSize="16px" fontWeight="600" mr="10px">{t('Your Tier')}</Text>
										{/* <TooltipText ref={tierTooltip.targetRef} decorationColor="secondary">
											<Image style={{ margin: 'unset', width: '12px', height: '12px' }} src="/images/launchpad/icon-exclamation.svg" />
										</TooltipText> */}
										{/* {tierTooltip.tooltipVisible && tierTooltip.tooltip} */}
									</Flex>
									<Flex alignItems="flex-end" mb="12px">
										<IconTier src="/images/launchpad/icon-tier-1.svg" />
										<StyledText ml="12px" style={{ fontSize: '20px', lineHeight: '24px' }}>{userConfigInfo?.name}</StyledText>
									</Flex>
									<Box>
										<StyledTextItalic>{t(`Estimate maximum %maxBuyPerUser% U2U to buy IDO in round buy %tier%.`, { maxBuyPerUser: userConfigInfo?.maxBuyPerUser, tier: userConfigInfo?.name })}</StyledTextItalic>
										<StyledTextItalic>{t('The snapshot will be ended at ')} <span style={{ color: '#d6ddd0' }}>{info?.snapshotTime && formatDate(dayjs.unix(Math.floor(info.snapshotTime/ 1000)).utc())}</span></StyledTextItalic>
										<StyledTextItalic>
											{t('Staking more to upgrade your tier. ')}
											<Link fontSize="12px" fontStyle="italic" style={{ display: 'inline', fontWeight: '300', textDecoration: 'underline' }} href="/staking">
												{t('Staking Now')}
											</Link>
										</StyledTextItalic>
										<StyledTextItalic>{t('Maximum %maxBuyPerUser% U2U to buy IDO in round buy %tier%. The snapshot process has ended at 2024/05/03 14:22:22 UTC.', {maxBuyPerUser: userConfigInfo?.maxBuyPerUser, tier: userConfigInfo?.name })}</StyledTextItalic>
									</Box>
								</Box>
							)} 
             <Box mb={["20px", "20px", "24px"]}>
							{isWhitelistTime() ? (
								<>
								<Flex mb="12px">
									<Text color="textSubtle" fontSize="16px" fontWeight="600" mr="10px">{t('Apply Whitlelist')}</Text>
									<TooltipText ref={applyTooltip.targetRef} decorationColor="secondary">
										<Image style={{ margin: 'unset', width: '12px', height: '12px' }} src="/images/launchpad/icon-exclamation.svg" />
									</TooltipText>
									{applyTooltip.tooltipVisible && applyTooltip.tooltip}
								</Flex>
								{account ? !userCommitInfo?.isWhiteList && configWhitelistInfo && configWhitelistInfo?.endAddWhiteList > Date.now()  && (
									<StyledButton className="button-hover" onClick={handleWhitelist}>
										{t('Apply Now')}
									</StyledButton>
								) : (
									<ConnectWalletButton/>
								)}
								{userCommitInfo?.isWhiteList && (
									<Flex alignItems="center">
										<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-success.svg" />
										<Text color="success" maxWidth="290px" fontSize="14px" fontWeight="600" lineHeight="20px" ml="12px">{t(`Congratulation! You have applied whitelist.`)}</Text>
									</Flex>
								)}
								<Box mt="12px">
									<Text color="textSubtle" fontSize="12px" lineHeight="20px">{t('Time during (UTC):')}</Text>
									<Text fontSize="12px" lineHeight="20px" style={{ color: '#d6ddd0' }}>{`${timeWhiteList?.startTime && formatDate(dayjs.unix(Math.floor(timeWhiteList.startTime/ 1000)).utc())} - ${timeWhiteList?.endTime && formatDate(dayjs.unix(Math.floor(timeWhiteList.endTime/ 1000)).utc())}`}</Text>
								</Box>
							</>
							): (
								<Flex alignItems="center">
									<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-error.svg" />
									<Text color="failure" maxWidth="290px" fontSize="14px" fontWeight="600" lineHeight="20px" ml="12px">{t(`Apply whitelist has been expired. You don’t apply whitelist`)}</Text>
								</Flex>
							)}
					 		</Box>
							{currentPhaseOrNext && (
								<Box style={{ textAlign: 'center' }}>
									<Text color="hover" fontSize="14px" fontWeight="600">{`Sale token for ${currentPhaseOrNext?.name} ${typeCountdown === 0 ? 'start in' : 'end in'}`}</Text>
									<Text color="primary" fontSize="24px" fontWeight="600" lineHeight="30px">
										<CountdownTime type={COUNTDOWN_TYPE.STRING} time={timeCountdown} cb={recheckPhase}/>
									</Text>
									{/* <Text color="primary" fontSize="24px" fontWeight="600" lineHeight="30px">{timeCountdown || t('To be announcement')}</Text> */}
									{currentPhase?.type === PHASES_TYPE.WHITELIST || currentPhase?.type === PHASES_TYPE.COMMUNITY && (
										<StyledContent maxWidth="340px" m="auto" mt={["12px", "12px", "16px", "16px", "20px", "20px", "24px"]}>
											<span style={{ color: theme.colors.hover }}>FCFS: </span>
											First come first serve. Whitelist pool is available ${formatNumber(Number(configInfo?.maxCommitAmount) - currentCommit, 0, 6)} U2U ~ {formatNumber((Number(configInfo?.maxCommitAmount) - currentCommit) * rate, 0, 6)} {info?.tokenName}.
										</StyledContent>
									 )}
								</Box>
							)}
            
            </Box>
            <Break/>
            <Box p={["20px 16px", "20px 16px", "24px 20px"]}>
              <Box>
                <Flex alignItems="center">
                  <Text color="textSubtle" fontSize="16px" fontWeight="600" mr="8px">{t('Your committed')}</Text>
                  <StyledButtonText variant="text" onClick={openCommittedModal}>
                    {t('Show detail')}
                  </StyledButtonText>
                </Flex>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="24px" fontWeight="700" lineHeight="32px">{formatNumber(totalCommitByUser, 2, 6)} U2U</Text>
                  <StyledButton disabled={BigNumber(totalCommitByUser).lte(0)} onClick={openCommittedModal} className="button-hover">{t('Claim')}</StyledButton>
                </Flex>
                {/* <StyledTextItalic textAlign="right" mt="8px">Estimate 1.2345 U2U, 18,000.000 {info?.tokenName}</StyledTextItalic> */}
                {configInfo?.startCancel && (
									<StyledTextItalic mt="12px">
										Note: You can cancel your request buy in 2 hours from {configInfo?.startCancel ? formatDate(dayjs.unix(configInfo.startCancel).utc()) : '--'} - {configInfo.endCancel ? formatDate(dayjs.unix(configInfo.endCancel).utc()) : '--'} UTC. <span style={{ color: theme.colors.hover }}>5% fee</span> when canceling IDO orders.&nbsp;
										<StyledButtonText variant="text" onClick={openCommittedModal}  >
											{t('Cancel buy IDO')}
										</StyledButtonText>
									</StyledTextItalic>
								)}
              </Box>
              <Box my={["20px", "20px", "24px"]}>
                <Text color="textSubtle" fontSize="16px" fontWeight="600" mb="8px">{t('U2U Commit')}</Text>
                <Flex alignItems="center">
                  <StyledInput
										value={isFocusInput ? amountCommit : amountCommit && formatNumber(Number(amountCommit), 0, 6)}
										onFocus={() => {setIsFocusInput(true)}}
										onBlur={() => {setIsFocusInput(false)}}
										onUserInput={handleInputAmount}
                    placeholder="Enter amount U2U commit"
                  />
                  <StyledButton
                    className="button-hover"
                    px="16px"
										disabled={disableCommitU2U}
										onClick={handleCommitU2U}
                  >
                    {t('Commit U2U')}
                  </StyledButton>
                </Flex>
								{configInfo?.maxCommitAmount && (
                	<Text color="textSubtle" fontSize="12px" fontStyle="italic" lineHeight="16px" mt="8px">{t('Maximum %maxCommitAmount% U2U', { maxCommitAmount: configInfo?.maxCommitAmount })}</Text>
								)}
								{Date.now() > info?.saleEnd && (
									<>
									{
										BigNumber(totalCommit).gt(info.softCap) ? (
											<Flex alignItems="center">
												<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-card-success.svg" />
												<Box ml="16px">
													<Text color='success' fontSize="16px" fontWeight="600" lineHeight="20px" textTransform="uppercase">{t('IDO Successfully')}</Text>
													<StyledContent lineHeight="20px" mt="4px">{t('The project has been IDO successfully, your committed U2U has been swapped to TOKENX. Claim to your wallet.')}</StyledContent>
												</Box>
											</Flex>
										) : (
											<Flex alignItems="center">
												<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-card-failed.svg" />
												<Box ml="16px">
													<Text color='failure' fontSize="16px" fontWeight="600" lineHeight="20px" textTransform="uppercase">{t('IDO Failed')}</Text>
													<StyledContent lineHeight="20px" mt="4px">{t('Unfortunately, the IDO project failed. The total raised value does not reach the softcap minimum.')}</StyledContent>
												</Box>
											</Flex>
										)
									}
									</>
								)} 
          
                <StyledTextItalic mt="12px">
                  Please click the 
                  <Text fontSize="12px" fontStyle="italic" mx="4px" textTransform="uppercase" style={{ display: 'inline', color: theme.colors.primary, fontWeight: '300'}}>
                    {t('Claim')}
                  </Text>
                  button above to get your {info?.tokenName}
                </StyledTextItalic>
              </Box>
              <Box>
								{!account && (
									<StyledContent>
										{t(`You need connect wallet to see your schedule time. `)}
										<ConnectWalletButton as="a"> <Text fontSize="14px" style={{ textDecoration: "underline", color: theme.colors.primary, cursor: "pointer"}}>			{t('Connect now')}</Text> </ConnectWalletButton>
									</StyledContent>
								)}
             
                {scheduleOrder?.length > 0 && (<StyledContent>{t(`Schedule time for you (UTC), don't miss it:`)}</StyledContent>)}
								{scheduleOrder?.map((item: IPhase) => (
									<StyledContentDot lineHeight="17px" mb="4px">
										{item.name}
										<Text fontSize="14px" lineHeight="20px" mt="2px" style={{ color: '#d6ddd0' }}>{`${formatDate(dayjs.unix(Math.floor(item.startTime/ 1000)).utc())} - ${formatDate(dayjs.unix(Math.floor(item.endTime/ 1000)).utc())}`}</Text>
									</StyledContentDot>
								))}
          
              </Box>
            </Box>
          </StyledNeubrutal>
        )}
      </Flex>
    </>
  )
}
