import { useTranslation } from '@pancakeswap/localization';
import { Box, Flex, Link, Progress, Tab, TabMenu, Text } from "@pancakeswap/uikit";
import { formatNumber } from '@pancakeswap/utils/formatBalance';
import BigNumber from 'bignumber.js';
import Container from 'components/Layout/Container';
import dayjs from 'dayjs';
import { formatEther } from 'ethers/lib/utils';
import useAccountActiveChain from 'hooks/useAccountActiveChain';
import { useActiveChainId } from 'hooks/useActiveChainId';
import forEach from 'lodash/forEach';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from "styled-components";
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getLaunchpadManagerContract } from 'utils/contractHelpers';
import { formatDate } from 'views/CakeStaking/components/DataSet/format';
import { Address, useWalletClient } from 'wagmi';
import CountdownTime from '../Components/CountdownTime';
import ProjectInfo from '../Components/ProjectInfo';
import Transactions from '../Components/Transactions';
import { COUNTDOWN_TYPE, LAUNCHPAD_STATUS, PHASES_TYPE, getColorLaunchpadByStatus, getStatusNameLaunchpad } from '../helpers';
import { useFetchLaunchpadDetail } from '../hooks/useFetchLaunchpadDetail';
import { StyledNeubrutal } from '../styles';
import { IPhase, ITimeOfPhase } from '../types/LaunchpadType';

const StyledBanner = styled(Box)`
  position: relative;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 240px;
  padding: 30px 0;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 75px;
    width: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  }
  > div {
    max-width: 1448px;
    margin: auto;
    height: 100%;
    padding: 0 16px;
    @media screen and (max-width: 1559px) {
      max-width: 1248px;
    }
    @media screen and (min-width: 425px) {
      padding: 0 24px;
    }
  }
  @media screen and (max-width: 1439px) {
    height: 220px;
    padding: 25px 0;
  }
  @media screen and (max-width: 991px) {
    height: 200px;
    padding: 20px 0;
  }
  @media screen and (max-width: 575px) {
    height: 180px;
  }
`
const StyledLogo = styled(Box)`
  --size: 120px;
  min-width: var(--size);
  width: var(--size);
  height: var(--size);
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  @media screen and (max-width: 1439px) {
    --size: 100px;
  }
  @media screen and (max-width: 991px) {
    --size: 80px;
  }
  @media screen and (max-width: 575px) {
    --size: 60px;
  }
`
const Image = styled.img`
  --size: 100%;
  width: var(--size);
  height: var(--size);
  object-fit: cover;
`
const StyledText = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 20px;
  max-width: 360px;
  @media screen and (max-width: 1439px) {
    font-size: 32px;
    margin-bottom: 16px;
  }
  @media screen and (max-width: 1199px) {
    font-size: 30px;
    margin-bottom: 12px;
  }
  @media screen and (max-width: 991px) {
    font-size: 28px;
    margin-bottom: 8px;
  }
  @media screen and (max-width: 767px) {
    font-size: 26px;
  }
  @media screen and (max-width: 575px) {
    font-size: 24px;
  }
  @media screen and (max-width: 424px) {
    font-size: 22px;
  }
`
const StyledDot = styled(Box)`
  --size: 12px;
  position: relative;
  width: calc(var(--size) / 2);
  height: calc(var(--size) / 2);
  border-radius: 50%;
  margin: 3px;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    opacity: 0.4;
    width: var(--size);
    height: var(--size);
    background: inherit;
  }
`
const StyledTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 20px;
  font-weight: 900;
  line-height: calc(24/20);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  @media screen and (max-width: 991px) {
    margin-bottom: 20px;
  }
  @media screen and (max-width: 575px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`
const IconImg = styled.img`
  height: 16px;
`
const StyledProgress = styled(Progress)`
  height: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`
const StyledBoxTab = styled(Box)`
  > div {
    > div {
      @media screen and (max-width: 479px) {
        display: block;
      }
    }
  }
`
const StyledTab = styled(Tab)`
  text-transform: capitalize;
  font-size: 20px;
  align-items: center;
  padding: 12px;
  font-weight: 700;
  margin-left: 0 !important;
  @media screen and (max-width: 991px) {
    font-size: 18px;
    padding: 10px 12px;
  }
  @media screen and (max-width: 424px) {
    font-size: 16px;
    padding: 8px 12px;
  }
  &.none {
    display: none;
  }
  svg {
    --size: 24px;
    width: var(--size);
    height: var(--size);
    margin-right: 10px;
    @media screen and (max-width: 991px) {
      --size: 20px;
      margin-right: 8px;
    }
    @media screen and (max-width: 424px) {
      --size: 16px;
      margin-right: 6px;
    }
  }
`
const StyledLink = styled(Link)`
  opacity: 0.8;
  transition: all 0.3s ease-out;
  &:not(:last-child) {
    margin-right: 12px;
  }
  &:hover {
    opacity: 1;
    img {
      transform: scale(1.1);
    }
  }
  img {
    --size: 32px;
    width: var(--size);
    height: var(--size);
    transition: all 0.3s ease-out;
    @media screen and (max-width: 991px) {
      --size: 28px;
    }
    @media screen and (max-width: 575px) {
      --size: 24px;
    }
  }
`
const StyledSlide = styled(Box)`
  position: relative;
  margin-bottom: 24px;
  // &::before {
  //   content: '';
  //   position: absolute;
  //   left: -2px;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   background: ${({ theme }) => theme.colors.backgroundAlt};
  //   box-shadow: ${({ theme }) => theme.shadows.card};
  //   border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  //   border-radius: ${({ theme }) => theme.radii.card};
  //   width: calc(100% + 4px);
  //   height: 121px;
  // }
`
const StyledBox = styled(Box)`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.card};
  pointer-events: none;
  margin: 10px 0;
  padding: 2px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.colors.backgroundAlt};
    border: 2px solid ${({ theme }) => theme.colors.cardBorder};
    box-shadow: ${({ theme }) => theme.shadows.card};
    border-radius: ${({ theme }) => theme.radii.card};
    height: 100%;
    width: 100%;
  }
  svg {
    --size: 52px;
    position: absolute;
    left: calc(100% - 5px);
    top: 50%;
    transform: translateY(-50%);
    width: var(--size);
    height: calc(var(--size) * 132 / 49);
  }
`
const StyledContent = styled.div`
  height: 100%;
  position: relative;
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 16px 10px;
  z-index: 1;
  padding-left: 56px;
  img {
    --size: 40px;
    width: var(--size);
    height: var(--size);
  }
`
const StyledSwiper = styled(Swiper)`
	position: relative;
	@media screen and (min-width: 1200px) {
		.swiper-wrapper {
			justify-content: center;
		}
	}
`

const StyledListTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  flex: 1;
`
const StyledListText = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin-left: 12px;
  @media screen and (max-width: 1439px) {
    font-size: 15px;
    margin-left: 8px;
  }
  @media screen and (max-width: 991px) {
    margin-left: 10px;
  }
  @media screen and (max-width: 575px) {
    margin-left: 8px;
  }
  @media screen and (max-width: 424px) {
    font-size: 14px;
  }
`


const SOCIAL_ICON = {
	WEBSITE: 'global',
	TWITTER: 'x',
	FACEBOOK: 'facebook',
	YOUTUBE: 'youtube',
	TELEGRAM: 'telegram',
	LINKEDIN: 'linkedin',
	MEDIUM: 'medium',
	DISCORD: 'discord'
}

const LaunchpadDetailPage = () => {
  const { t } = useTranslation()
  const theme = useTheme()
	const refIntervalFetchTotalCommitted = useRef<any>()
	const launchpadManagerContract = useRef<any>()
	const currentPhase = useRef<string>()
  const [tab, setTab] = useState<number>(0)
  const { account } = useAccountActiveChain()
	const [timeWhiteList, setTimeWhiteList] = useState<ITimeOfPhase>()
	const [showCountdown, setShowCountdown] = useState<boolean>(false)
	const [currentTier, setCurrentTier] = useState<Address>()
	const [totalCommit, setTotalCommit] = useState<number>(0)
	const router = useRouter()
  const { launchpadId } = router.query
	const { data: detail } = useFetchLaunchpadDetail(launchpadId as string)
	const { chainId } = useActiveChainId()
	const { data: signer } = useWalletClient()
	const getTotalCommit = async () => {
		try {
			if(launchpadManagerContract.current?.account) {
				const _totalCommit: any = await launchpadManagerContract.current.read.totalCommit()
				const _total = BigNumber(formatEther(_totalCommit)).toNumber()
				setTotalCommit(_total)
			}
		}catch(ex) {
			console.error(ex)
		}
	}


	const getTimeWhiteList = () => {
		let _startTime = 0
		let _endTime = 0
		const _now = Date.now()
		forEach(detail?.phases, (item: IPhase) => {
			if(item.startTime < _now &&  _now < item.endTime && item.contractAddress.length > 0) {
				currentPhase.current = item.contractAddress
			}
			if(item.type === PHASES_TYPE.APPLY_WHITELIST) {
				if(_startTime === 0) {
					_startTime = item.startTime
				}
				if(_endTime === 0) {
					_endTime = item.endTime
				}
				if(item.startTime < _startTime) {
					_startTime = item.startTime
				}
				if(item.endTime > _endTime) {
					_endTime = item.endTime
				}
			}
			setTimeWhiteList({
				startTime: _startTime,
				endTime: _endTime
			})
		})
	}


  const initFunction = useCallback(() => {

    const getUserTier = async () => {
			try {
				const _address: any = await launchpadManagerContract.current.read.viewTierPharse([account])
				if(_address !== '0x0000000000000000000000000000000000000000') {
					setCurrentTier(_address)
				}
			}catch(ex){
				console.error(ex)
			}
    }

    if( launchpadManagerContract.current?.account) {
      getUserTier()
    }
    return {
      getUserTier
    }

  }, [launchpadManagerContract, account])


	useEffect(() => {
		if(detail?.saleEnd && detail.status === LAUNCHPAD_STATUS.ON_GOING) {
			setShowCountdown(true)
		}
		if(detail?.contractAddress) {
			launchpadManagerContract.current = getLaunchpadManagerContract(detail.contractAddress, signer ?? undefined, chainId)
			getTotalCommit()
			refIntervalFetchTotalCommitted.current = setInterval(() => {
				getTotalCommit()
			}, 600000)
			initFunction()
		}
		getTimeWhiteList()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detail, signer])




	useEffect(() => {
		return () => {
			// clearInterval(refInterval.current)
			setShowCountdown(false)
			clearInterval(refIntervalFetchTotalCommitted.current)
		}
	}, [])

	const isComplete = (_item: IPhase) => {
		const _now = Date.now()
		if(_now > _item.startTime && _item.contractAddress !== currentPhase.current) {
			return true
		}
		return false
	}
	const isInProgress = (_item: IPhase) => {
		const _now = Date.now()
		if(_now > _item.startTime && _now < _item.endTime && currentPhase.current === _item.contractAddress) {
			return true
		}
		return false
	}

	const isCountdownEnd = detail?.saleEnd && detail?.saleEnd > Date.now()

	// useEffect(() => {
	// 	if(detail?.phases) {
	// 		forEach()
	// 	}
	// }, [detail])

  return (
    <>
      <StyledBanner style={{ backgroundImage: `url(${detail?.projectImageThumbnail})` }}>
        <Flex justifyContent="flex-end" alignItems="flex-end" position="relative">
          {detail?.socials.map(item => {
						return SOCIAL_ICON[item.type] && (
							<StyledLink external href={item.link}>
								<img src={`/images/launchpad/icon-${SOCIAL_ICON[item.type]}.svg`} alt="" />
							</StyledLink>
						)
						}
          )}
        </Flex>
      </StyledBanner>
      <Container>
        <Flex my="16px" flexDirection={["column", "column", "column", "row"]}>
          <Flex alignItems="center" flex={1.5}>
            <StyledLogo>
              <Image src={detail?.projectImageThumbnail} alt=''/>
            </StyledLogo>
            <Box overflow="hidden" ml={["16px", "16px", "20px", "20px", "24px"]}>
              <StyledText >{detail?.projectName}</StyledText>
              <Flex alignItems="center">
                <StyledDot
                  background={detail?.status && getColorLaunchpadByStatus(detail?.status, theme)}
                />
                <Text
                  ml="8px"
                  fontSize={["14px", "14px", "16px"]}
                  fontWeight="700"
                  lineHeight="20px"
                  color={detail?.status && getColorLaunchpadByStatus(detail?.status, theme)}
                >
                  {
                    detail?.status && getStatusNameLaunchpad(detail.status)
                  }
                </Text>
              </Flex>
            </Box>
          </Flex>
          <Flex
            flex={2}
            ml="16px"
            alignItems={["flex-end", "flex-end", "flex-end", "flex-end", "center"]}
            justifyContent="center"
            flexDirection="column"
          >
            <Text color="primary" textAlign="center" fontSize="14px" fontWeight="600" lineHeight="17px" mb={["6px", "6px", "8px", "8px", "10px", "10px", "12px"]}>{isCountdownEnd ? t('Sale end in') : t('Sale start in')}</Text>
						{showCountdown ? <CountdownTime type={COUNTDOWN_TYPE.ARRAY} time={isCountdownEnd ? detail?.saleEnd : detail?.saleStart}/> : 	<Text color="hover" fontSize={["16px", "16px", "20px", "20px", "24px"]} fontWeight="600" lineHeight={["22px", "22px", "26px", "26px", "30px"]}>To be announcement</Text>}
          </Flex>
        </Flex>
        <Flex flexDirection={["column", "column", "column", "column", "row"]} mb="32px">
          <StyledNeubrutal  p={["16px", "16px", "20px", "20px", "24px"]} mx="auto" width="100%" minWidth={["100%", "100%", "360px"]} maxWidth="460px" style={{ flex: "1" }}>
            <StyledTitle>{t('Sale Info')}</StyledTitle>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Sale price')}</StyledListTitle>
              <Flex alignItems="center">
                <IconImg src='/images/u2u.svg' />
                <StyledListText>{detail?.priceToken && formatNumber(detail?.priceToken)} U2U</StyledListText>
              </Flex>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Total Raise')}</StyledListTitle>
              <Flex alignItems="center">
                <IconImg src='/images/u2u.svg' />
                <StyledListText>{detail?.totalRaise && formatNumber(detail.totalRaise)} U2U</StyledListText>
              </Flex>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Total for Sale')}</StyledListTitle>
              <Flex alignItems="center">
                <IconImg src={detail?.tokenLogo}/>
                <StyledListText>{detail?.totalSale && formatNumber(detail.totalSale)} {detail?.tokenSymbol}</StyledListText>
              </Flex>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Sale Type')}</StyledListTitle>
              <StyledListText style={{ color: theme.colors.primary }}>Public</StyledListText>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Network')}</StyledListTitle>
              <Flex alignItems="center">
                <IconImg src='/images/u2u.svg' />
                <StyledListText>U2U Chain</StyledListText>
              </Flex>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Softcap')}</StyledListTitle>
              <Flex alignItems="center">
                <IconImg src='/images/u2u.svg' />
                <StyledListText>{detail?.softCap && formatNumber(detail.softCap)} U2U</StyledListText>
              </Flex>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Snapshot time')}</StyledListTitle>
              <StyledListText>{detail?.snapshotTime && formatDate(dayjs.unix(Math.floor(detail.snapshotTime/ 1000)).utc())} UTC</StyledListText>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Start Apply Whitelist')}</StyledListTitle>
              <StyledListText>{timeWhiteList?.startTime && formatDate(dayjs.unix(Math.floor(timeWhiteList.startTime/ 1000)).utc())} UTC</StyledListText>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('End Apply Whitelist')}</StyledListTitle>
              <StyledListText>{timeWhiteList?.endTime && formatDate(dayjs.unix(Math.floor(timeWhiteList.endTime/ 1000)).utc())} UTC</StyledListText>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Sale Start')}</StyledListTitle>
              <StyledListText>{detail?.saleStart && formatDate(dayjs.unix(Math.floor(detail.saleStart/ 1000)).utc())} UTC</StyledListText>
            </Flex>
            <Flex mb={["8px", "8px", "12px", "12px", "16px", "16px", "20px"]} alignItems="center" justifyContent="space-between">
              <StyledListTitle>{t('Sale End')}</StyledListTitle>
              <StyledListText>{detail?.saleEnd && formatDate(dayjs.unix(Math.floor(detail.saleEnd/ 1000)).utc())} UTC</StyledListText>
            </Flex>
          </StyledNeubrutal>
          <Box style={{ flex: "2" }} ml={["0", "0", "0", "0", "16px"]} mt={["16px", "16px", "16px", "16px", "0"]}>
            <StyledNeubrutal  p={["16px", "16px", "20px", "20px", "24px"]}>
              <StyledTitle>{t('Progress')}</StyledTitle>
              <Flex justifyContent="space-between" alignItems="center" mb={["8px", "8px", "10px", "10px", "12px"]}>
                <Flex>
                  <Text fontSize="14px" fontWeight="700" lineHeight="24px">{formatNumber(totalCommit, 0, 6)}</Text>
                  <Text color='textSubtle' fontSize="10px" lineHeight="24px" ml="6px">U2U Raised</Text>
                </Flex>
                <Text color='textSubtle' fontSize="14px" fontWeight="600">{formatNumber(detail?.totalRaise ? (totalCommit / detail?.totalRaise) * 100 : 0, 0, 2) }%</Text>
              </Flex>
              <StyledProgress primaryStep={detail?.totalRaise ? (totalCommit / detail?.totalRaise) * 100 : 0 } scale="sm" />
              <Flex alignItems="center" justifyContent="center" mt="12px">
                <Text color='text' fontSize="16px" fontWeight="700">{detail?.totalRaise ? formatNumber(detail.totalRaise) : '_'} U2U</Text>
                <Text color='textSubtle' fontSize="14px" fontWeight="600" ml="8px">{t('Total Raise')}</Text>
              </Flex>
            </StyledNeubrutal>
            <Flex mt="16px" width="100%" flexDirection={["column", "column", "row"]}>
              <StyledNeubrutal  p="16px" minHeight={["120px", "120px", "140px"]} style={{ flex: '1' }}>
                <Flex alignItems="center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M7.47753 13.8008C7.47756 13.8665 7.46466 13.9315 7.43954 13.9922C7.41443 14.0529 7.3776 14.108 7.33116 14.1544C7.28473 14.2009 7.22959 14.2377 7.16891 14.2628C7.10823 14.2879 7.0432 14.3008 6.97753 14.3008H4.61584L4.81347 14.4985C4.86066 14.5448 4.89822 14.5999 4.92397 14.6608C4.94972 14.7216 4.96315 14.787 4.96348 14.8531C4.96382 14.9192 4.95105 14.9847 4.92591 15.0458C4.90078 15.1069 4.86378 15.1624 4.81706 15.2091C4.77033 15.2559 4.71481 15.2929 4.65369 15.318C4.59258 15.3431 4.52709 15.3559 4.46101 15.3556C4.39493 15.3552 4.32958 15.3418 4.26872 15.316C4.20787 15.2903 4.15272 15.2527 4.10647 15.2055L3.05565 14.1543C3.00921 14.1079 2.97238 14.0528 2.94725 13.9921C2.92211 13.9315 2.90918 13.8665 2.90918 13.8008C2.90918 13.7351 2.92211 13.6701 2.94725 13.6095C2.97238 13.5488 3.00921 13.4937 3.05565 13.4473L4.10644 12.3965C4.15269 12.3493 4.20784 12.3117 4.26869 12.286C4.32955 12.2602 4.3949 12.2468 4.46098 12.2465C4.52706 12.2461 4.59255 12.2589 4.65366 12.284C4.71478 12.3092 4.7703 12.3462 4.81703 12.3929C4.86375 12.4396 4.90075 12.4951 4.92588 12.5563C4.95102 12.6174 4.96379 12.6829 4.96345 12.7489C4.96312 12.815 4.94969 12.8804 4.92394 12.9412C4.89819 13.0021 4.86063 13.0572 4.81344 13.1035L4.61617 13.3008H6.97753C7.0432 13.3007 7.10824 13.3136 7.16892 13.3387C7.2296 13.3639 7.28474 13.4007 7.33118 13.4471C7.37761 13.4936 7.41444 13.5487 7.43955 13.6094C7.46467 13.6701 7.47757 13.7351 7.47753 13.8008ZM16.2275 5.44092H5.58788C5.19019 5.44135 4.80891 5.59953 4.5277 5.88074C4.24649 6.16195 4.08831 6.54323 4.08788 6.94092V10.75C4.08788 10.8826 4.14056 11.0098 4.23432 11.1036C4.32809 11.1973 4.45527 11.25 4.58788 11.25C4.72049 11.25 4.84766 11.1973 4.94143 11.1036C5.0352 11.0098 5.08788 10.8826 5.08788 10.75V6.94092C5.08805 6.80836 5.14078 6.68129 5.23451 6.58755C5.32825 6.49382 5.45532 6.44109 5.58788 6.44092H16.2275C16.3601 6.44109 16.4872 6.49382 16.5809 6.58755C16.6746 6.68129 16.7274 6.80836 16.7275 6.94092V12.8008C16.7274 12.9333 16.6746 13.0604 16.5809 13.1542C16.4872 13.2479 16.3601 13.3006 16.2275 13.3008H8.97753C8.84492 13.3008 8.71774 13.3535 8.62397 13.4472C8.53021 13.541 8.47753 13.6682 8.47753 13.8008C8.47753 13.9334 8.53021 14.0606 8.62397 14.1543C8.71774 14.2481 8.84492 14.3008 8.97753 14.3008H16.2275C16.6252 14.3004 17.0065 14.1422 17.2877 13.861C17.5689 13.5798 17.7271 13.1985 17.7275 12.8008V6.94092C17.7271 6.54323 17.5689 6.16195 17.2877 5.88074C17.0065 5.59953 16.6252 5.44135 16.2275 5.44092ZM8.60453 9.8711C8.60453 9.41547 8.73964 8.97007 8.99277 8.59123C9.24591 8.21238 9.6057 7.91711 10.0266 7.74275C10.4476 7.56839 10.9108 7.52276 11.3577 7.61165C11.8045 7.70054 12.215 7.91995 12.5372 8.24213C12.8594 8.56431 13.0788 8.97479 13.1677 9.42167C13.2566 9.86854 13.211 10.3317 13.0366 10.7527C12.8622 11.1736 12.567 11.5334 12.1881 11.7866C11.8093 12.0397 11.3639 12.1748 10.9082 12.1748C10.2974 12.1742 9.71181 11.9313 9.27991 11.4994C8.848 11.0675 8.60513 10.4819 8.60453 9.8711ZM9.60453 9.8711C9.60453 10.129 9.68099 10.381 9.82425 10.5954C9.9675 10.8098 10.1711 10.9769 10.4093 11.0756C10.6476 11.1742 10.9097 11.2001 11.1626 11.1498C11.4155 11.0994 11.6478 10.9753 11.8301 10.7929C12.0124 10.6106 12.1366 10.3783 12.1869 10.1254C12.2372 9.87251 12.2114 9.61038 12.1127 9.37216C12.014 9.13393 11.8469 8.93033 11.6325 8.78708C11.4181 8.64383 11.166 8.56738 10.9082 8.56739C10.5626 8.56782 10.2312 8.70531 9.9868 8.94971C9.7424 9.19411 9.60496 9.52547 9.60453 9.8711ZM7.2061 9.3711H6.74413C6.61152 9.3711 6.48434 9.42378 6.39057 9.51754C6.29681 9.61131 6.24413 9.73849 6.24413 9.8711C6.24413 10.0037 6.29681 10.1309 6.39057 10.2247C6.48434 10.3184 6.61152 10.3711 6.74413 10.3711H7.20605C7.33866 10.3711 7.46583 10.3184 7.5596 10.2247C7.65337 10.1309 7.70605 10.0037 7.70605 9.8711C7.70605 9.73849 7.65337 9.61131 7.5596 9.51754C7.46583 9.42378 7.33871 9.3711 7.2061 9.3711ZM15.0713 10.3711C15.2039 10.3711 15.3311 10.3184 15.4249 10.2247C15.5186 10.1309 15.5713 10.0037 15.5713 9.8711C15.5713 9.73849 15.5186 9.61131 15.4249 9.51754C15.3311 9.42378 15.2039 9.3711 15.0713 9.3711H14.6103C14.4777 9.3711 14.3506 9.42378 14.2568 9.51754C14.163 9.61131 14.1103 9.73849 14.1103 9.8711C14.1103 10.0037 14.163 10.1309 14.2568 10.2247C14.3506 10.3184 14.4777 10.3711 14.6103 10.3711H15.0713Z" fill="#FE5300"/>
                  </svg>
                  <Text color="orange" fontSize="14px" fontWeight="500" ml="8px">{t('Refund Policy')}</Text>
                </Flex>
                <Text color="textSubtle" fontSize="12px" fontWeight="600" mt="8px" maxWidth="260px">{t('You can cancel your IDO Token purchase if you change your mind after U2U commits to the system.')}</Text>
              </StyledNeubrutal>
              <StyledNeubrutal  p="16px" minHeight={["120px", "120px", "140px"]} ml={["0", "0", "16px"]} mt={["16px", "16px", "0"]} style={{ flex: '1' }}>
                <Flex alignItems="center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <g clip-path="url(#clip0_1413_11372)">
                    <path d="M12.5081 1.82356L8.33144 0.430889C8.19468 0.385342 8.04685 0.385342 7.9101 0.430889L3.73344 1.82356C3.06937 2.04414 2.49171 2.46839 2.08253 3.03603C1.67335 3.60366 1.45346 4.28581 1.4541 4.98556V8.39689C1.4541 13.4389 7.58744 16.2236 7.8501 16.3396C7.93532 16.3774 8.02752 16.397 8.12077 16.397C8.21401 16.397 8.30622 16.3774 8.39144 16.3396C8.6541 16.2236 14.7874 13.4389 14.7874 8.39689V4.98556C14.7881 4.28581 14.5682 3.60366 14.159 3.03603C13.7498 2.46839 13.1722 2.04414 12.5081 1.82356ZM13.4541 8.39689C13.4541 12.0336 9.24144 14.4189 8.12077 14.9896C6.99877 14.4209 2.78744 12.0429 2.78744 8.39689V4.98556C2.78748 4.56574 2.91962 4.15658 3.16515 3.81605C3.41067 3.47552 3.75713 3.22088 4.15544 3.08822L8.12077 1.76622L12.0861 3.08822C12.4844 3.22088 12.8309 3.47552 13.0764 3.81605C13.3219 4.15658 13.4541 4.56574 13.4541 4.98556V8.39689Z" fill="#00DEFF"/>
                    <path d="M10.3206 5.93011L7.52863 8.73012L6.03263 7.17011C5.97259 7.10447 5.90003 7.05151 5.8192 7.01435C5.73838 6.97718 5.65094 6.95657 5.56203 6.95372C5.47312 6.95087 5.38453 6.96585 5.3015 6.99777C5.21847 7.02968 5.14266 7.0779 5.07854 7.13956C5.01443 7.20123 4.96331 7.2751 4.92818 7.35683C4.89306 7.43856 4.87465 7.5265 4.87404 7.61545C4.87343 7.70441 4.89062 7.79259 4.92461 7.87479C4.95861 7.957 5.00871 8.03157 5.07196 8.09412L6.6093 9.69412C6.72395 9.81796 6.86252 9.91725 7.01664 9.986C7.17076 10.0548 7.33722 10.0915 7.50596 10.0941H7.52796C7.69333 10.0947 7.85717 10.0624 8.00995 9.99907C8.16273 9.93578 8.30142 9.84278 8.41796 9.72545L11.266 6.87745C11.3282 6.81538 11.3775 6.74166 11.4112 6.66051C11.445 6.57936 11.4624 6.49236 11.4625 6.40449C11.4625 6.31661 11.4453 6.22958 11.4118 6.14836C11.3782 6.06713 11.329 5.99332 11.267 5.93111C11.2049 5.86891 11.1312 5.81954 11.05 5.78583C10.9689 5.75211 10.8819 5.73471 10.794 5.73462C10.7061 5.73453 10.6191 5.75174 10.5379 5.78529C10.4567 5.81883 10.3828 5.86804 10.3206 5.93011Z" fill="#00DEFF"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_1413_11372">
                    <rect width="16" height="16" fill="white" transform="translate(0.121094 0.396484)"/>
                    </clipPath>
                    </defs>
                  </svg>
                  <Text color="cyan" fontSize="14px" fontWeight="500" ml="8px">{t('Investor protection mechanism')}</Text>
                </Flex>
                <Text color="textSubtle" fontSize="12px" fontWeight="600" mt="8px" maxWidth="260px">{t('In case, total raise U2U does not reach the value of Softcap, the launched will be cancelled and refund U2U for investors')}</Text>
              </StyledNeubrutal>
            </Flex>
          </Box>
        </Flex>
				{detail?.phases && detail?.phases.length > 0 && (
				<StyledSlide>
					<StyledSwiper
						slidesPerView="auto"
					>
						{detail?.phases.map((item, index) => (
							<SwiperSlide className="swiper-launchpad" style={{ zIndex: detail?.phases.length - index }} key={item.name}>
								<StyledBox>
									<StyledContent style={{ background: `${isComplete(item) ? theme.colors.backgroundItem : isInProgress(item) ? theme.colors.primary : theme.colors.backgroundAlt}` }}>
										<img style={{ filter: `${isComplete(item) && 'grayscale(1)'}` }} src={item.imageUrl || `/images/launchpad/icon-step-01.svg`} alt="" />
										<Text style={{ color: `${isComplete(item) ? theme.colors.hover : isInProgress(item) ? theme.colors.black : theme.colors.primary}` }} fontSize="14px" fontWeight="600" lineHeight="17px" mt="8px">{item.name}</Text>
										<Text style={{ color: `${isComplete(item) ? theme.colors.textSubtle : isInProgress(item) ? theme.colors.black : theme.colors.hover}` }} fontSize="11px" fontWeight="400" lineHeight="13px" mt="4px" minHeight={13}>{item.startTime ? formatDate(dayjs.unix(Math.floor(item.startTime/ 1000)).utc(), 'MMM D YYYY HH:mm:ss') : ''}</Text>
									</StyledContent>
									<svg style={{ color: `${isComplete(item) ? theme.colors.backgroundItem : isInProgress(item) ? theme.colors.primary : theme.colors.backgroundAlt}` }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 132" fill="none">
										<g mask="url(#mask0_3011_2807)">
										<path d="M6.5 5L4.5 4.5L3.5 125L8 128.5L48 67L7.5 6L6.5 5Z" fill="black" stroke="black"/>
										<g filter="url(#filter0_d_3011_2807)">
										<path d="M44.2741 62.7092C44.7145 63.377 44.7145 64.2431 44.2741 64.911L3.66973 126.496C2.57759 128.152 -6.22358e-06 127.379 -6.13685e-06 125.395L-7.52944e-07 2.22534C-6.66216e-07 0.241251 2.57759 -0.532019 3.66974 1.12444L44.2741 62.7092Z" fill="currentColor"/>
										<path d="M43.4393 64.3605L2.83486 125.945C2.28879 126.773 0.999994 126.387 0.999994 125.395L0.999999 2.22534C0.999999 1.23329 2.2888 0.846667 2.83487 1.67489L43.4393 63.2596C43.6595 63.5936 43.6595 64.0266 43.4393 64.3605Z" stroke="black" stroke-width="2"/>
										</g>
										</g>
										<defs>
										<filter id="filter0_d_3011_2807" x="0" y="0.22168" width="48.6045" height="131.177" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
										<feFlood flood-opacity="0" result="BackgroundImageFix"/>
										<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
										<feOffset dx="4" dy="4"/>
										<feComposite in2="hardAlpha" operator="out"/>
										<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
										<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3011_2807"/>
										<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3011_2807" result="shape"/>
										</filter>
										</defs>
									</svg>
								</StyledBox>
							</SwiperSlide>
						))}
					</StyledSwiper>

				</StyledSlide>
				)}
  
        <StyledBoxTab>
          <TabMenu activeIndex={tab} onItemClick={setTab} customWidth isShowBorderBottom={false}>
            <StyledTab>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.78508 0.847935C10.0151 1.50702 9.66712 2.22773 9.00803 2.45767C6.11773 3.466 3.82332 5.75204 2.80361 8.63709C2.571 9.29524 1.84889 9.64014 1.19074 9.40758C0.532582 9.17497 0.187629 8.45286 0.420243 7.7947C1.69556 4.18642 4.5603 1.33206 8.17535 0.0708823C8.83444 -0.159052 9.55514 0.188845 9.78508 0.847935ZM14.9402 0.858324C15.1728 0.20017 15.8949 -0.144782 16.5531 0.0878441C20.1453 1.35751 22.9902 4.20246 24.2598 7.7947C24.4925 8.45286 24.1476 9.17497 23.4893 9.40758C22.8312 9.64014 22.1091 9.29524 21.8766 8.63709C20.8614 5.76492 18.5829 3.48638 15.7107 2.47121C15.0525 2.23859 14.7075 1.51648 14.9402 0.858324ZM11.0699 6.95816C11.0701 6.26011 11.6359 5.69429 12.334 5.69435H12.3466C13.0447 5.69442 13.6106 6.26035 13.6104 6.9584C13.6104 7.65645 13.0445 8.22228 12.3464 8.22222H12.3337C11.6357 8.22215 11.0699 7.65621 11.0699 6.95816ZM12.349 9.48607C13.0471 9.48746 13.6118 10.0545 13.6104 10.7525L13.5978 17.0723C13.5964 17.7703 13.0294 18.3351 12.3313 18.3337C11.6333 18.3323 11.0685 17.7652 11.0699 17.0673L11.0826 10.7475C11.084 10.0494 11.651 9.48468 12.349 9.48607ZM1.19074 14.6076C1.84889 14.3751 2.571 14.72 2.80361 15.3781C3.81877 18.2503 6.09729 20.5289 8.96946 21.544C9.62762 21.7767 9.97259 22.4988 9.73994 23.1569C9.50733 23.8151 8.78521 24.1601 8.12707 23.9274C4.53483 22.6578 1.68989 19.8128 0.420243 16.2206C0.187629 15.5624 0.532582 14.8403 1.19074 14.6076ZM23.4893 14.6076C24.1476 14.8403 24.4925 15.5624 24.2598 16.2206C22.9902 19.8128 20.1453 22.6578 16.553 23.9274C15.8949 24.1601 15.1728 23.8151 14.9402 23.1569C14.7075 22.4988 15.0525 21.7767 15.7106 21.544C18.5829 20.5289 20.8614 18.2503 21.8766 15.3781C22.1091 14.72 22.8312 14.3751 23.4893 14.6076Z" fill="currentColor"/>
              </svg>
              {t('Project Info')}
            </StyledTab>
            <StyledTab className={detail?.status === LAUNCHPAD_STATUS.UPCOMING ? 'none' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24" fill="none">
                <g clip-path="url(#clip0_1413_11482)">
                <path d="M19.8359 22.0007H5.83594C4.51034 21.9991 3.2395 21.4719 2.30216 20.5345C1.36482 19.5972 0.837525 18.3263 0.835938 17.0007L0.835938 7.00073C0.837525 5.67514 1.36482 4.40429 2.30216 3.46695C3.2395 2.52961 4.51034 2.00232 5.83594 2.00073H19.8359C21.1615 2.00232 22.4324 2.52961 23.3697 3.46695C24.3071 4.40429 24.8344 5.67514 24.8359 7.00073V17.0007C24.8344 18.3263 24.3071 19.5972 23.3697 20.5345C22.4324 21.4719 21.1615 21.9991 19.8359 22.0007ZM5.83594 4.00073C5.04029 4.00073 4.27723 4.3168 3.71462 4.87941C3.15201 5.44202 2.83594 6.20508 2.83594 7.00073V17.0007C2.83594 17.7964 3.15201 18.5594 3.71462 19.1221C4.27723 19.6847 5.04029 20.0007 5.83594 20.0007H19.8359C20.6316 20.0007 21.3946 19.6847 21.9573 19.1221C22.5199 18.5594 22.8359 17.7964 22.8359 17.0007V7.00073C22.8359 6.20508 22.5199 5.44202 21.9573 4.87941C21.3946 4.3168 20.6316 4.00073 19.8359 4.00073H5.83594Z" fill="currentColor"/>
                <path d="M19.8359 13.0007H11.8359C11.5707 13.0007 11.3164 12.8954 11.1288 12.7078C10.9413 12.5203 10.8359 12.266 10.8359 12.0007C10.8359 11.7355 10.9413 11.4812 11.1288 11.2936C11.3164 11.1061 11.5707 11.0007 11.8359 11.0007H19.8359C20.1012 11.0007 20.3555 11.1061 20.543 11.2936C20.7306 11.4812 20.8359 11.7355 20.8359 12.0007C20.8359 12.266 20.7306 12.5203 20.543 12.7078C20.3555 12.8954 20.1012 13.0007 19.8359 13.0007Z" fill="currentColor"/>
                <path d="M7.83593 13.0007H5.83594C5.57072 13.0007 5.31637 12.8954 5.12883 12.7078C4.94129 12.5203 4.83594 12.266 4.83594 12.0007C4.83594 11.7355 4.94129 11.4812 5.12883 11.2936C5.31637 11.1061 5.57072 11.0007 5.83594 11.0007H7.83593C8.10115 11.0007 8.3555 11.1061 8.54304 11.2936C8.73057 11.4812 8.83593 11.7355 8.83593 12.0007C8.83593 12.266 8.73057 12.5203 8.54304 12.7078C8.3555 12.8954 8.10115 13.0007 7.83593 13.0007Z" fill="currentColor"/>
                <path d="M13.8359 17.9995H5.83594C5.57072 17.9995 5.31637 17.8942 5.12883 17.7066C4.94129 17.5191 4.83594 17.2647 4.83594 16.9995C4.83594 16.7343 4.94129 16.4799 5.12883 16.2924C5.31637 16.1049 5.57072 15.9995 5.83594 15.9995H13.8359C14.1012 15.9995 14.3555 16.1049 14.543 16.2924C14.7306 16.4799 14.8359 16.7343 14.8359 16.9995C14.8359 17.2647 14.7306 17.5191 14.543 17.7066C14.3555 17.8942 14.1012 17.9995 13.8359 17.9995Z" fill="currentColor"/>
                <path d="M19.8359 17.9995H17.8359C17.5707 17.9995 17.3164 17.8942 17.1288 17.7066C16.9413 17.5191 16.8359 17.2647 16.8359 16.9995C16.8359 16.7343 16.9413 16.4799 17.1288 16.2924C17.3164 16.1049 17.5707 15.9995 17.8359 15.9995H19.8359C20.1011 15.9995 20.3555 16.1049 20.543 16.2924C20.7306 16.4799 20.8359 16.7343 20.8359 16.9995C20.8359 17.2647 20.7306 17.5191 20.543 17.7066C20.3555 17.8942 20.1011 17.9995 19.8359 17.9995Z" fill="currentColor"/>
                </g>
                <defs>
                <clipPath id="clip0_1413_11482">
                <rect width="24" height="24" fill="white" transform="translate(0.835938)"/>
                </clipPath>
                </defs>
              </svg>
              {t('Transactions')}
            </StyledTab>
          </TabMenu>
          {tab === 0 && <ProjectInfo info={detail} timeWhiteList={timeWhiteList} currentTier={currentTier} account={account} totalCommit={totalCommit}/>}
          {tab === 1 && <Transactions info={detail} account={account}/>}
        </StyledBoxTab>
      </Container>
    </>
  )
}

LaunchpadDetailPage.chains = [] // set all

export default LaunchpadDetailPage
