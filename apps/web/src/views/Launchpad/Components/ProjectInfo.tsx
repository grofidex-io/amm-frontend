import { useTranslation } from '@pancakeswap/localization';
import { Box, Button, Dots, Flex, Link, Text, TooltipText, useModal, useToast, useTooltip } from '@pancakeswap/uikit';
import { formatNumber } from '@pancakeswap/utils/formatBalance';
import { NumericalInput } from '@pancakeswap/widgets-internal';
import BigNumber from 'bignumber.js';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { ToastDescriptionWithTx } from 'components/Toast';
import dayjs from 'dayjs';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useActiveChainId } from 'hooks/useActiveChainId';
import useCatchTxError from 'hooks/useCatchTxError';
import parse from 'html-react-parser';
import forEach from 'lodash/forEach';
import keyBy from 'lodash/keyBy';
import uniqBy from 'lodash/uniqBy';
import { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { getLaunchpadContract, getLaunchpadManagerContract } from 'utils/contractHelpers';
import { formatDate } from 'views/CakeStaking/components/DataSet/format';
import { Break } from 'views/Info/components/InfoTables/shared';
import { Address, useWalletClient } from 'wagmi';
import { COUNTDOWN_TYPE, LAUNCHPAD_STATUS, PHASES_NONE, PHASES_TYPE } from '../helpers';
import { StyledButton, StyledNeubrutal } from '../styles';
import { ILaunchpadDetail, IPhase, ITierInfo, ITimeOfPhase, IUserWhiteListInfo } from '../types/LaunchpadType';
import CountdownTime from './CountdownTime';
import ModalDetail from './ModalDetail';


const StyledTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 22px;
  font-weight: 900;
  line-height: calc(24/20);
  color: ${({ theme }) => theme.colors.text};
  @media screen and (max-width: 1559px) {
    font-size: 20px;
  }
  @media screen and (max-width: 575px) {
    font-size: 18px;
  }
`
const StyledContent = styled(Text)`
	font-size: 15px;
  color: ${({ theme }) => theme.colors.textSubtle};
	@media screen and (max-width: 1559px) {
		font-size: 14px;
	}
`
const StyledContentDot = styled(Text)`
  position: relative;
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
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
	@media screen and (max-width: 1559px) {
		font-size: 16px;
	}
`
const Image = styled.img`
  margin: auto;
`
const ImageInfo = styled.img`
  --size: 13px;
	width: var(--size);
	height: var(--size);
	@media screen and (max-width: 1559px) {
		--size: 12px;
	}
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
  font-size: 13px;
  font-style: italic;
  line-height: 16px;
	@media screen and (max-width: 1559px) {
		font-size: 12px;
	}
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
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  padding: 0;
  display: inline;
  text-decoration: underline;
  height: 32px;
  &:hover {
    color: ${({ theme }) => theme.colors.hover};
  }
	@media screen and (max-width: 1559px) {
		font-size: 12px;
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
	const _timeoutGetConfig = useRef<any>()
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
	const [isWhiteList, setIsWhiteList] = useState<boolean>(false)
	const [userCommitInfo, setUserCommitInfo] = useState<IUserWhiteListInfo>({
		u2uCommitted: 0,
		giveBackAmount: 0,
		isWhiteList: false
	})
	const [totalCommitByUser, setTotalCommitByUser] = useState<number>(0)
	const [currentCommit, setCurrentCommit] = useState<number>(0)
	const [isCommitting, setIsCommitting] = useState<boolean>(false)
	const [isApplying, setApplyWhitelist] = useState<boolean>(false)
	const [totalGiveback, setTotalGiveback] = useState<number>(0) 

  const { fetchWithCatchTxError } = useCatchTxError()
	const { toastSuccess, toastError } = useToast()
	const { chainId } = useActiveChainId()
	const { data: signer } = useWalletClient()
	const refSchedule = useRef<IPhase[]>([])

	const getTotalUserCommitted = async () => {
		try {
			if(account && launchpadManagerContract.current.account) {
				const _totalCommitted: any = await launchpadManagerContract.current.read.totalCommitByUser([account])
				const _totalCommitByUser = BigNumber(formatEther(_totalCommitted)).toNumber()
				setTotalCommitByUser(_totalCommitByUser)
				if(totalCommit && BigNumber(totalCommit).lt(info?.softCap) && info?.saleEnd < Date.now()) {
					setTotalGiveback(_totalCommitByUser)
				}
				if(!_totalCommitByUser) {
					setTotalGiveback(_totalCommitByUser)
				}
			}
		}catch(ex) {
			//
		}
	}


  const tierTooltip =useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="18px" mb="4px">{t('The tier depends on the number of U2Us staked in the GrofiDex staking system.')}</Text>
			{info?.phases.map((item: IPhase) => {
				if(item.type === PHASES_TYPE.TIER) {
					return (
						<StyledContentDot fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="20px">{`${item.name}: Minimum U2U stake amount is ${item.minStake || '--'} U2U`}</StyledContentDot>
					)
				}
				return <></>
			})}
      {/* <StyledContentDot fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="20px">{t('Starter: No stake or U2U stake amount less than 1000 U2U')}</StyledContentDot>  */}
    </>, {
      placement: 'right'
    }
  )

  const applyTooltip = useTooltip(
    <>
      <Text fontFamily="'Metuo', sans-serif" fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="18px" mb="4px">{t('Why need apply Whitelist?')}</Text>
      <Text color="textSubtle" fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="16px">{t('There are projects that require you to apply to the whitelist to ensure that you are serious about the project, you will be guaranteed priority when purchasing compared to those who do not apply to the whitelist.')}</Text>
    </>, {
      placement: 'right'
    }
  )

	const isWhitelistTime = () => {
		const _now = Date.now()
		if(timeWhiteList?.startTime < _now && _now < timeWhiteList?.endTime) {
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
		const _percentCancel: any = await _launchpadContract.current.read.percentCancel()
		setConfigInfo({..._configInfo, maxCommitAmount: BigNumber(formatEther(_configInfo.maxCommitAmount)).toNumber(), maxBuyPerUser: BigNumber(formatEther(_configInfo.maxBuyPerUser)).toNumber(), startCancel: BigNumber(_configInfo.startCancel).toNumber() * 1000, endCancel: BigNumber(_configInfo.endCancel).toNumber() * 1000, percentCancel: BigNumber(formatEther(_percentCancel)).toNumber()})
	}

	const getTokenRate = async () => {
		try {
			const _rate: any = await launchpadManagerContract.current.read.tokenRate()
			setRate(BigNumber(formatEther(_rate)).toNumber())
		}catch(ex){
			console.error(ex)
		}
	}

	const getUserConfig = async () => {
		const _contract = getLaunchpadContract(currentTier, signer ?? undefined, chainId)
		const _configInfo: any = await _contract.read.getConfigInfo()
		const _phaseByContract = keyBy(info?.phases, (o) => o.contractAddress.toLowerCase() )
		setUserConfigInfo({..._configInfo, maxCommitAmount: BigNumber(formatEther(_configInfo.maxCommitAmount)).toNumber(), maxBuyPerUser: BigNumber(formatEther(_configInfo.maxBuyPerUser)).toNumber(), name: _phaseByContract[currentTier.toLowerCase()]?.name, start: BigNumber(_configInfo.start).toNumber() * 1000, end: BigNumber(_configInfo.end).toNumber() * 1000})
	}

	const getUserCommitted = async (_contract?: any, type?: string) => {
		const contract = _contract || _launchpadContract.current
		const _userWhiteList: any = await contract.read.userCommit([account])
		const _data = {
			u2uCommitted: BigNumber(formatEther(_userWhiteList[0])).toNumber(),
			giveBackAmount: BigNumber(formatEther(_userWhiteList[1])).toNumber(),
			isWhiteList:  _userWhiteList[2],
		}
		if(contract.address.toLowerCase() === currentPhase?.contractAddress.toLowerCase()) {
			setUserCommitInfo(_data)
		}
		if(type === PHASES_TYPE.WHITELIST) {
			setIsWhiteList(_userWhiteList[2])
		}
	}
	

	const initContract = () => {
		if(currentPhase?.contractAddress) {
			_launchpadContract.current =  getLaunchpadContract(currentPhase.contractAddress, signer ?? undefined, chainId)
			if(currentPhase.type === PHASES_TYPE.WHITELIST || currentPhase.type === PHASES_TYPE.COMMUNITY) {
				getCurrentCommit()
			}
			getUserCommitted(_launchpadContract.current)
			getConfig()
		}
	}

	const initContractWhitelist = async () => {
		try {
			if(currentPhaseWhitelist?.contractAddress && signer) {
				_launchpadContractWhitelist.current =  getLaunchpadContract(currentPhaseWhitelist.contractAddress, signer ?? undefined, chainId)
				const _configInfo: ITierInfo = await _launchpadContractWhitelist.current.read.getConfigInfo()
				setConfigWhitelistInfo(_configInfo)
				getUserCommitted(_launchpadContractWhitelist.current, PHASES_TYPE.WHITELIST)
			}
		}catch(ex){
			//
		}
	}

	const handleWhitelist = async () => {
		setApplyWhitelist(true)
		try {
			const res = await fetchWithCatchTxError(() => _launchpadContractWhitelist.current.write.addWhiteList())
			if(res?.status) {
				getUserCommitted(_launchpadContractWhitelist.current, PHASES_TYPE.WHITELIST)
				checkSchedule()
			}
			setApplyWhitelist(false)
		}catch(ex) {
			setApplyWhitelist(false)
		}
		setApplyWhitelist(false)
	}

	// const checkTier = async (_contract: any, phases: IPhase) => {
	// 	try {
	// 		const status = await _contract.read.checkTier()
	// 		if(status) {
	// 			refSchedule.current.push(phases)
	// 		}
	// 	}catch(ex) {
	// 		//
	// 	}
	// }

	const checkWhiteList = async (_contract: any, phases: IPhase) => {
		const _userWhiteList: any = await _contract.read.userCommit([account])
		if(_userWhiteList[2]) {
			refSchedule.current.push(phases)
		}
	}

	const checkSchedule = () => {
		refSchedule.current = []
		const _schedule: any = []
		forEach(info.phases, (item: IPhase) => {
			const _contract = getLaunchpadContract(item.contractAddress, signer ?? undefined, chainId)
			if(item.type === PHASES_TYPE.TIER && item.contractAddress.toLowerCase() === currentTier?.toLowerCase()) {
				_schedule.push(item)
			}
			if(item.type === PHASES_TYPE.WHITELIST) {
				checkWhiteList(_contract, item)
			}
			if(item.type === PHASES_TYPE.COMMUNITY) {
				_schedule.push(item)
			}
		})

		if(_schedule.length > 0) {
			refSchedule.current = [...refSchedule.current, ..._schedule]
		}

	}

	const getGiveBack = async () => {
		if(totalCommit && BigNumber(totalCommit).lt(info?.softCap) && info?.saleEnd < Date.now()) {
			setTotalGiveback(totalCommitByUser)

		} else {
			const _contract = getLaunchpadContract(currentTier, signer ?? undefined, chainId)
			const _giveback: any = await _contract.read.getGiveBack([account])
			if(_giveback) {
				setTotalGiveback(BigNumber(formatEther(_giveback)).toNumber())
			}
		}
	}

	const [openCommittedModal] = useModal(
		<ModalDetail
			tokenName={info?.tokenSymbol}
			onDismiss
			saleEnd={info?.saleEnd}
			account={account}
			launchpad={info?.contractAddress}
			getTotalUserCommitted={getTotalUserCommitted}
			initContract={initContract}
			listPhase={keyBy(info?.phases, (o) => o.contractAddress.toLowerCase())}
			rate={rate}
			isSortCap={BigNumber(totalCommit).lt(info?.softCap) && Date.now() > info.saleEnd  }
		/>
	)
	
	useEffect(() => {
		clearTimeout(_timeoutGetConfig.current)
		_timeoutGetConfig.current = setTimeout(() => {
			if(account) {
				if(currentTier) {
					getUserConfig()
				}
			} else {
				setUserConfigInfo(null)
			}
		}, 500)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTier, info?.phases, account])

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
				if(PHASES_NONE.indexOf(item.type) === -1) {
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

		if(info?.contractAddress?.length > 0) {
			launchpadManagerContract.current = getLaunchpadManagerContract(info.contractAddress, signer ?? undefined, chainId )
			if(launchpadManagerContract.current.account) {
				getTotalUserCommitted()
				getTokenRate()
			}
		}

		if(currentTier && account) {
			getGiveBack()
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [info, signer, account, currentTier])

	useEffect(() => {
		setTotalCommitByUser(0)
		setUserConfigInfo(null)
		setTotalGiveback(0)

		setAmountCommit('')
		if(!account) {
			refSchedule.current = []
		}
	}, [account])
	const poolAvailable = Number(configInfo?.maxCommitAmount) - currentCommit

	let maxCommitAmountByTier = (userConfigInfo || configInfo) && userCommitInfo && (currentPhase?.type === PHASES_TYPE.TIER ? userConfigInfo && BigNumber(userConfigInfo.maxBuyPerUser).minus(BigNumber(userCommitInfo?.u2uCommitted)) :  configInfo && BigNumber(configInfo.maxBuyPerUser).minus(BigNumber(userCommitInfo?.u2uCommitted))) || 0
	if(BigNumber(poolAvailable).lte(maxCommitAmountByTier)) {
		maxCommitAmountByTier = poolAvailable
	}
	if(currentPhase?.type === PHASES_TYPE.WHITELIST && !isWhiteList) {
		maxCommitAmountByTier = 0
	}

	const handleCommitU2U = async () => {
		if(!disableCommitU2U && BigNumber(amountCommit).gt(0) && maxCommitAmountByTier && BigNumber(maxCommitAmountByTier).gte(BigNumber(amountCommit))) {
			try {
				setIsCommitting(true)
				const res = await fetchWithCatchTxError(() => _launchpadContract.current.write.commit({value: parseEther(new BigNumber(amountCommit).toFixed(18))}))
				if(res?.status) {
					getTotalUserCommitted()
					setAmountCommit('')
					getUserCommitted()
					if(currentPhase?.type === PHASES_TYPE.WHITELIST || currentPhase?.type === PHASES_TYPE.COMMUNITY) {
						getCurrentCommit()
					}
					toastSuccess(
						t('Success!'),
						<ToastDescriptionWithTx txHash={res.transactionHash}>
							Commit successfully
						</ToastDescriptionWithTx>,
					)
				}
				setIsCommitting(false)
			}catch(error: any) {
				setIsCommitting(false)
				const errorDescription = `${error.message} - ${error.data?.message}`
				toastError(t('Failed'), errorDescription)
			}
			setIsCommitting(false)
		}
	}
	
	let disableCommitU2U = false

	if(configInfo?.typeRound === PHASES_TYPE.TIER) {
		const _now = Date.now()
		if(!userConfigInfo?.start || currentPhase?.contractAddress.toLowerCase() !== currentTier?.toLowerCase() || !(userConfigInfo && (userConfigInfo.start < _now && userConfigInfo.end > _now)) ) {
			disableCommitU2U = true
		}
	}
	
	if(BigNumber(amountCommit).gt(maxCommitAmountByTier)) {
		disableCommitU2U = true
	}

	if((userConfigInfo?.typeRound === PHASES_TYPE.WHITELIST && !isWhiteList) || !currentPhase || (currentPhase.type === PHASES_TYPE.WHITELIST && !isWhiteList)) {
		disableCommitU2U = true
	}

	if(amountCommit?.length === 0 || BigNumber(amountCommit).lte(0)) {
		disableCommitU2U = true
	}
	

	const scheduleOrder = uniqBy(refSchedule.current.sort((a: IPhase, b: IPhase) => (a.startTime - b.startTime)), (item) => item.contractAddress)

	// const diffCancelTime = () => {
	// 	if(configInfo) {
	// 		const diffTime = dayjs(configInfo?.endCancel).diff(dayjs(configInfo?.startCancel), 'hour')
	// 		if(diffTime < 0) {
	// 			return `in ${dayjs(configInfo?.endCancel).diff(dayjs(configInfo?.startCancel), 'second')} seconds`
	// 		}
	// 		return `in ${diffTime} hours`
	// 	}
	// 	return ''
	// }

	const isShowMaximum = (currentPhase?.type === PHASES_TYPE.TIER && currentPhase?.contractAddress.toLowerCase() === currentTier?.toLowerCase()) || (userConfigInfo?.typeRound === PHASES_TYPE.WHITELIST && isWhiteList) || currentPhase?.type === PHASES_TYPE.WHITELIST || currentPhase?.type === PHASES_TYPE.COMMUNITY 

  return (
    <>
      <Flex
        mt="30px"
        flexDirection={["column-reverse", "column-reverse", "column-reverse", "column-reverse", "row"]}
      >
        <StyledNeubrutal p={["24px 16px", "24px 16px", "28px 20px", "28px 20px", "32px 24px"]} height="100%" style={{ flex: '2' }}>
          <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]} mb={["20px", "20px", "26px", "26px", "32px"]}>
            <StyledTitle mb={["12px", "12px", "16px"]}>{t('About %token% Project', {token: info?.tokenName})}</StyledTitle>
            <StyledContent>{info?.description && parse(info?.description)}</StyledContent>
          </Box>
          {/* <Box px={["0", "0", "12px", "12px", "16px", "16px", "20px"]} mb={["20px", "20px", "26px", "26px", "32px"]}>
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
                <Text color="textSubtle" fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" textAlign="center" mt={["10px", "10px", "14px", "14px", "18px"]} mx="auto" maxWidth="200px">{t('Max Supply & Distribution 1.000.000')}</Text>
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
          </Box> */}
          {/* <Wrapper>
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
          </Wrapper> */}
        </StyledNeubrutal>
        {info?.status !== LAUNCHPAD_STATUS.UPCOMING && (
          <StyledNeubrutal style={{ flex: '1' }} height="100%" mx="auto" width="100%" minWidth={["100%", "100%", "360px"]} maxWidth={["460px", "460px", "460px", "460px", "460px", "460px", "460px", "500px"]} ml={["auto", "auto", "auto", "auto", "16px"]} mb={["16px", "16px", "16px", "16px", "0"]}>
            <Box p={["20px 16px", "20px 16px", "24px 20px"]}>
              <StyledTitle mb={["20px", "20px", "26px", "26px", "32px"]}>{t('Buy IDO %name%', { name: info?.tokenSymbol })}</StyledTitle>
								<Box mb={["20px", "20px", "24px"]}>
									<Flex mb="12px">
										<Text color="textSubtle" fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" mr="10px">{t('Your Tier')}</Text>
										<TooltipText ref={tierTooltip.targetRef} decorationColor="secondary">
											<ImageInfo src="/images/launchpad/icon-exclamation.svg" />
										</TooltipText>
										{tierTooltip.tooltipVisible && tierTooltip.tooltip}
									</Flex>
									<Flex alignItems="flex-end" mb="12px">
										<IconTier src={account ? '/images/launchpad/icon-tier-1.svg' : '/images/launchpad/icon-tier-starter.svg'} />
										<StyledText ml="12px" style={{ fontSize: '20px', lineHeight: '24px' }}>{account && userConfigInfo?.name || 'Starter'}</StyledText>
									</Flex>

									<Box>
										{(userConfigInfo && (currentPhase?.type === PHASES_TYPE.TIER || !currentPhase?.type)) && <>
											<StyledTextItalic>{t(`%estimate% %maxBuyPerUser% U2U to buy IDO in round buy %tier%.`, { maxBuyPerUser: userConfigInfo?.maxBuyPerUser, tier: userConfigInfo?.name, estimate: info?.snapshotTime < Date.now() ? 'Maximum' : 'Estimate maximum'})} {info.snapshotTime < Date.now() && <StyledTextItalic>{t('The snapshot process has ended at')} <span style={{ color: '#d6ddd0' }}>{info?.snapshotTime && formatDate(dayjs.unix(Math.floor(info.snapshotTime/ 1000)).utc(), 'YYYY/MM/DD hh:mm:ss')} UTC</span></StyledTextItalic>}</StyledTextItalic>
										</>}
										{(configInfo && currentPhase && currentPhase?.type !== PHASES_TYPE.TIER) && (
											<>
											<StyledTextItalic>{t(`%estimate% %maxBuyPerUser% U2U to buy IDO in round buy %tier%.`, { maxBuyPerUser: configInfo?.maxBuyPerUser, tier: currentPhase?.name, estimate: info?.snapshotTime < Date.now() ? 'Maximum' : 'Estimate maximum' })}</StyledTextItalic>
											{info.snapshotTime < Date.now() && <StyledTextItalic>{t('The snapshot process has ended at')} <span style={{ color: '#d6ddd0' }}>{info?.snapshotTime && formatDate(dayjs.unix(Math.floor(info.snapshotTime/ 1000)).utc(), 'YYYY/MM/DD hh:mm:ss')} UTC</span></StyledTextItalic>}
											</>
										)}
										{/* {(!userConfigInfo && info?.snapshotTime < Date.now()) && (
											<StyledTextItalic>{t('The snapshot process has ended at')} <span style={{ color: '#d6ddd0' }}>{info?.snapshotTime && formatDate(dayjs.unix(Math.floor(info.snapshotTime/ 1000)).utc(), 'YYYY/MM/DD hh:mm:ss')} UTC</span></StyledTextItalic>
										) } */}
										{info?.snapshotTime > Date.now()  && 
											<>
												<StyledTextItalic>{t('The snapshot will be ended at ')} <span style={{ color: '#d6ddd0' }}>{info?.snapshotTime && formatDate(dayjs.unix(Math.floor(info.snapshotTime/ 1000)).utc(), 'YYYY/MM/DD hh:mm:ss')} UTC</span></StyledTextItalic>
												<StyledTextItalic>
													{t('Staking more to upgrade your tier. ')}
													<Link fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} fontStyle="italic" style={{ display: 'inline', fontWeight: '300', textDecoration: 'underline' }} href="/staking">
														{t('Staking Now')}
													</Link>
												</StyledTextItalic>
												</>
											}
										{/* {userConfigInfo && <StyledTextItalic>{t('Maximum %maxBuyPerUser% U2U to buy IDO in round buy %tier%. The snapshot process has ended at 2024/05/03 14:22:22 UTC.', {maxBuyPerUser: userConfigInfo?.maxBuyPerUser, tier: userConfigInfo?.name })}</StyledTextItalic>} */}
									</Box>
								</Box>
             <Box mb={["20px", "20px", "24px"]}>
						 	<Flex mb="12px">
								<Text color="textSubtle" fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" mr="10px">{t('Apply Whitlelist')}</Text>
								<TooltipText ref={applyTooltip.targetRef} decorationColor="secondary">
									<ImageInfo src="/images/launchpad/icon-exclamation.svg" />
								</TooltipText>
								{applyTooltip.tooltipVisible && applyTooltip.tooltip}
							</Flex>
							{/* {isWhitelistTime() && ( */}
							{isWhiteList && account ? (
								<Flex alignItems="center">
									<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-success.svg" />
									<Text color="success" maxWidth="290px" fontSize={["14px", "14px", "14px", "14px", "14px", "14px", "14px", "15px"]} fontWeight="600" lineHeight="20px" ml="12px">{t(`Congratulation! You have applied whitelist.`)}</Text>
								</Flex>
							) : (
								<>
									{account ? (
										<>
										{isWhitelistTime() ? (
											<StyledButton className="button-hover" onClick={handleWhitelist} disabled={isApplying}>
											{		
												isApplying ?	
												<Dots>Applying</Dots> : 
												'Apply Now' 
											}
										</StyledButton>
										) : (
											<>
											{ timeWhiteList?.endTime < Date.now() && (
												<Flex alignItems="center">
													<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-error.svg" />
													<Text color="failure" maxWidth="290px" fontSize={["14px", "14px", "14px", "14px", "14px", "14px", "14px", "15px"]} fontWeight="600" lineHeight="20px" ml="12px">{t(`Apply whitelist has been expired. You don’t apply whitelist`)}</Text>
												</Flex>
												)}
											</>
										)}
										</>
									) : (
										<ConnectWalletButton/>
									)}
								</>
							)
						}
						{timeWhiteList?.endTime > Date.now() && (
							<Box mt="12px">
								<Text color="textSubtle" fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="20px">{t('Time during (UTC):')}</Text>
								<Text fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} lineHeight="20px" style={{ color: '#d6ddd0' }}>{`${timeWhiteList?.startTime && formatDate(dayjs.unix(Math.floor(timeWhiteList.startTime/ 1000)).utc())} - ${timeWhiteList?.endTime && formatDate(dayjs.unix(Math.floor(timeWhiteList.endTime/ 1000)).utc())}`}</Text>
							</Box>
						)}
			
					 		</Box>
							{currentPhaseOrNext && (
								<Box style={{ textAlign: 'center' }}>
									<Text color="hover" fontSize={["14px", "14px", "14px", "14px", "14px", "14px", "14px", "15px"]} fontWeight="600">{`Sale token for ${currentPhaseOrNext?.name} ${typeCountdown === 0 ? 'start in' : 'end in'}`}</Text>
									<Text color="primary" fontSize="24px" fontWeight="600" lineHeight="30px">
										<CountdownTime type={COUNTDOWN_TYPE.STRING} time={timeCountdown} cb={recheckPhase}/>
									</Text>
									{/* <Text color="primary" fontSize="24px" fontWeight="600" lineHeight="30px">{timeCountdown || t('To be announcement')}</Text> */}
									{(currentPhase?.type === PHASES_TYPE.WHITELIST || currentPhase?.type === PHASES_TYPE.COMMUNITY) && (
										<StyledContent maxWidth="340px" m="auto" mt={["12px", "12px", "16px", "16px", "20px", "20px", "24px"]}>
											<span style={{ color: theme.colors.hover }}>FCFS: </span>
											First come first serve. {currentPhase?.type === PHASES_TYPE.WHITELIST ? 'Whitelist' : 'Community'} pool is available ${formatNumber(Number(configInfo?.maxCommitAmount) - currentCommit, 0, 6)} U2U ~ {formatNumber((Number(configInfo?.maxCommitAmount) - currentCommit) * rate, 0, 6)} {info?.tokenName}.
										</StyledContent>
									 )}
								</Box>
							)}
            
            </Box>
            <Break/>
            <Box p={["20px 16px", "20px 16px", "24px 20px"]}>
              <Box>
                <Flex alignItems="center">
                  <Text color="textSubtle" fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" mr="8px">{t('Your committed')}</Text>
                  <StyledButtonText variant="text" onClick={openCommittedModal}>
                    {t('Show detail')}
                  </StyledButtonText>
                </Flex>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="24px" fontWeight="700" lineHeight="32px">{formatNumber(totalCommitByUser, 2, 6)} U2U</Text>
                  {(totalGiveback || (info?.saleEnd < Date.now() && BigNumber(totalCommitByUser).gt(0))) && (<StyledButton disabled={totalGiveback < 0} onClick={openCommittedModal} className="button-hover">{t('Claim')}</StyledButton>)}
                </Flex>
                { (totalGiveback || (info?.saleEnd < Date.now() && BigNumber(totalCommitByUser).gt(0))) && (
									<StyledTextItalic textAlign="right" mt="8px">Estimate {formatNumber(totalGiveback, 0, 6)} U2U{ info?.saleEnd < Date.now() && BigNumber(totalCommit).gt(info?.softCap) ? `, ${formatNumber((totalCommitByUser  - totalGiveback) * rate, 0, 6)} ${info?.tokenSymbol}` : '' } </StyledTextItalic>
								) }
                {(currentPhase && configInfo?.startCancel && configInfo?.startCancel < Date.now()) && (
									<StyledTextItalic mt="12px">
										Note: You can cancel your request buy from {configInfo?.startCancel ? formatDate(dayjs.unix(configInfo.startCancel/ 1000).utc()) : '--'} - {configInfo.endCancel ? formatDate(dayjs.unix(configInfo.endCancel/ 1000).utc()) : '--'} UTC. <span style={{ color: theme.colors.hover }}>{configInfo.percentCancel}% fee</span> when canceling IDO orders.&nbsp;
										<StyledButtonText variant="text" onClick={openCommittedModal}  >
											{t('Cancel buy IDO')}
										</StyledButtonText>
									</StyledTextItalic>
								)}
              </Box>
							<Box my={["20px", "20px", "24px"]}>
								{Date.now() < info?.saleEnd && (
										<>
											<Text color="textSubtle" fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" mb="8px">{t('U2U Commit')}</Text>
											<Flex alignItems="center">
												<StyledInput
													value={isFocusInput ? amountCommit : amountCommit && formatNumber(Number(amountCommit), 0, 6)}
													onFocus={() => {setIsFocusInput(true)}}
													onBlur={() => {setIsFocusInput(false)}}
													onUserInput={handleInputAmount}
													align='left'
													placeholder="Enter amount U2U commit"
												/>
												{!account ? <ConnectWalletButton/> : 				
													<StyledButton
														className="button-hover"
														px="16px"
														disabled={disableCommitU2U || isCommitting}
														onClick={handleCommitU2U}
													>
													{isCommitting ?
														<Dots>Commit U2U</Dots> : 
															'Commit U2U'
													}
													</StyledButton>
												} 
								
											</Flex>
											{(BigNumber(maxCommitAmountByTier).gte(0)) ? (
												<Text color="textSubtle" fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} fontStyle="italic" lineHeight="16px" mt="8px">{t('Maximum %maxCommitAmount% U2U', { maxCommitAmount: isShowMaximum ? maxCommitAmountByTier.toString() : '0' })}</Text>
											) : ''}
										</>
								)}
				
								{Date.now() > info?.saleEnd && (
									<>
									{
										BigNumber(totalCommit).gt(info?.softCap) ? (
											<Flex alignItems="center">
												<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-card-success.svg" />
												<Box ml="16px">
													<Text color='success' fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" lineHeight="20px" textTransform="uppercase">{t('IDO Successfully')}</Text>
													<StyledContent lineHeight="20px" mt="4px">{t('The project has been IDO successfully, your committed U2U has been swapped to %tokenName%. Claim to your wallet.', {tokenName: info?.tokenSymbol})}</StyledContent>
												</Box>
											</Flex>
										) : (
											<Flex alignItems="center">
												<Image style={{ margin: 'unset', width: '24px', height: '24px' }} src="/images/launchpad/icon-card-failed.svg" />
												<Box ml="16px">
													<Text color='failure' fontSize={["16px", "16px", "16px", "16px", "16px", "16px", "16px", "17px"]} fontWeight="600" lineHeight="20px" textTransform="uppercase">{t('IDO Failed')}</Text>
													<StyledContent lineHeight="20px" mt="4px">{t('Unfortunately, the IDO project failed. The total raised value does not reach the softcap minimum.')}</StyledContent>
												</Box>
											</Flex>
										)
									}
									</>
								)} 
								{(info?.saleEnd < Date.now() && BigNumber(totalCommitByUser).gt(0)) && (
									<StyledTextItalic mt="12px">
										Please click the 
										<Text onClick={openCommittedModal} fontSize={["12px", "12px", "12px", "12px", "12px", "12px", "12px", "13px"]} fontStyle="italic" mx="4px" textTransform="uppercase" style={{ display: 'inline', color: theme.colors.primary, fontWeight: '300', cursor: 'pointer'}}>
											{t('Claim')}
										</Text>
										button above to get your  { BigNumber(totalCommit).gt(BigNumber(info?.softCap)) ? info?.tokenName : 'U2U committed'}
									</StyledTextItalic>
								)}
							</Box>
              <Box>
								{!account && (
									<StyledContent>
										{t(`You need connect wallet to see your schedule time. `)}
										<ConnectWalletButton as="a"> <Text fontSize={["14px", "14px", "14px", "14px", "14px", "14px", "14px", "15px"]} style={{ textDecoration: "underline", color: theme.colors.primary, cursor: "pointer"}}>			{t('Connect now')}</Text> </ConnectWalletButton>
									</StyledContent>
								)}
             
                {scheduleOrder?.length > 0 && (<StyledContent mb="3px">{t(`Schedule time for you (UTC), don't miss it:`)}</StyledContent>)}
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