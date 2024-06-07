import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, OpenNewIcon, Progress, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import NextLink from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { getLaunchpadManagerContract } from 'utils/contractHelpers'
import { formatEther } from 'viem'
import { useWalletClient } from 'wagmi'
import { COUNTDOWN_TYPE, LAUNCHPAD_STATUS, getColorLaunchpadByStatus, getStatusNameLaunchpad } from '../helpers'
import { ILaunchpadItem } from '../types/LaunchpadType'
import CountdownTime from './CountdownTime'


const CardLayout = styled(Box)`
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.card};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  overflow: hidden;
`
const CardHeader = styled(Box)`
  position: relative;
  background: ${({ theme }) => theme.colors.backgroundPage};
  // aspect-ratio: 16/9;
  min-height: 200px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    transform: translate(-100%);
    background-image: linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0, rgba(255, 255, 255, 0));
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    to {
      transform:translate(100%)
    }
  }
`
const CardBody = styled.div`
  padding: 16px;
`
const ImageHeader = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  object-fit: cover;
`
const Image = styled.img`
  --size: 100%;
  width: var(--size);
  height: var(--size);
  object-fit: cover;
`
const StyledLogo = styled(Box)`
  --size: 72px;
  min-width: var(--size);
  width: var(--size);
  height: var(--size);
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
  @media screen and (max-width: 1439px) {
    --size: 66px;
  }
  @media screen and (max-width: 1199px) {
    --size: 60px;
  }
  @media screen and (max-width: 991px) {
    --size: 54px;
  }
  @media screen and (max-width: 424px) {
    --size: 50px;
  }
`
const StyledButton = styled(Button)`
  --size: 72px;
  min-width: calc(var(--size) + 8px);
  width: calc(var(--size) + 8px);
  height: var(--size);
  white-space: wrap;
  font-weight: 700;
  line-height: calc(19/16);
  @media screen and (max-width: 1439px) {
    --size: 66px;
  }
  @media screen and (max-width: 1199px) {
    --size: 32px;
    min-width: var(--size);
    width: var(--size);
    padding: 0;
    border-radius: 6px;
  }
  @media screen and (max-width: 424px) {
    --size: 30px;
  }
  span {
    @media screen and (max-width: 1199px) {
      display: none;
    }
  }
  svg {
    fill: ${({ theme }) => theme.colors.black};
    @media screen and (min-width: 1200px) {
      display: none
    }
  }
`
const StyledText = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 20px;
  font-weight: 900;
  line-height: calc(24/20);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1439px) {
    font-size: 18px;
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

type LaunchpadProps ={
  type?: string,
	item: ILaunchpadItem
}



const LaunchpadCard = ({ item }: LaunchpadProps) => {
  const { t } = useTranslation()
  const theme = useTheme();
	const launchpadManagerContract = useRef<any>()
	const [timeCountdown, setTimeCountdown] = useState<number>(0)
	const [totalCommit, setTotalCommit] = useState<number>(0)
	const { chainId } = useActiveChainId()
	const { data: signer } = useWalletClient()

	const getTotalCommit = async () => {
		try {
			const _totalCommit: any = await launchpadManagerContract.current.read.totalCommit()
			const _total = BigNumber(formatEther(_totalCommit)).toNumber()
			setTotalCommit(_total)
		}catch(ex) {
			console.error(ex)
		}
	}

	const checkTimeCountdown = () => {
		if(item.saleStart && item.status === LAUNCHPAD_STATUS.UPCOMING) {
			setTimeCountdown(item.saleStart)
		}
		if(item.saleEnd && item.status === LAUNCHPAD_STATUS.ON_GOING) {
			setTimeCountdown(item.saleEnd)
		}
	}



	useEffect(() => {
		if(item.contractAddress && item.contractAddress?.length > 0 && item.status === LAUNCHPAD_STATUS.ON_GOING) {
			launchpadManagerContract.current = getLaunchpadManagerContract(item.contractAddress, signer ?? undefined, chainId)
			getTotalCommit()
		}
	}, [item])


	useEffect(() => {
		checkTimeCountdown()
	}, [])


  return (
    <CardLayout>
      <CardHeader>
        <ImageHeader src={item.projectImageThumbnail} alt='' />
      </CardHeader>
      <CardBody>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          className='border-neubrutal'
          borderRadius="8px"
          p={["10px", "10px", "12px", "12px", "12px", "12px", "14px"]}
          background={theme.colors.backgroundPage}
        >
          <StyledLogo>
						<Image src={item.projectImageThumbnail} alt=''/>
          </StyledLogo>
          <Box style={{ flex: 1 }} overflow="hidden" mx={["12px", "16px", "16px", "16px", "16px", "20px", "24px"]}>
            <StyledText title={item.projectName}>{item.projectName}</StyledText>
            <Flex alignItems="center" mt={["4px", "6px", "6px", "8px", "8px", "10px", "12px"]}>
              <StyledDot
                background={getColorLaunchpadByStatus(item.status, theme)}
              />
              <Text
                ml={["6px", "6px", "6px", "6px", "6px", "8px"]}
                fontSize={["14px", "14px", "14px", "15px", "15px", "16px"]}
                fontWeight="700"
                lineHeight="20px"
                color={getColorLaunchpadByStatus(item.status, theme)}
              >
                {
                  getStatusNameLaunchpad(item.status)
                }
              </Text>
            </Flex>
          </Box>
          <NextLink href={`/launchpad/${item.contractAddress}`} passHref>
            <StyledButton
              className="button-hover"
            >
              <span>{t('View Detail')}</span>
              <OpenNewIcon/>
            </StyledButton>
          </NextLink>
        </Flex>
        <Box px={["0", "0", "16px", "16px", "0", "0", "16px"]} p="16px">
          <Text minHeight={50} fontSize="14px" fontWeight="400" mb="16px" color='textSubtle'>{item.shortDescription}</Text>
          <Flex justifyContent="space-between" alignItems="center" mb="12px">
            <Text fontSize="14px" fontWeight="600" lineHeight="20px" color='textSubtle'>{t('Sale price')}</Text>
            <Text fontSize={["15px", "15px", "16px", "16px", "15px", "16px"]} fontWeight="700" lineHeight="20px" color='text'>1 U2U = {item.priceToken} {item.tokenName}</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px" fontWeight="600" lineHeight="20px" color='textSubtle'>{t('Total Raise')}</Text>
            <Text fontSize={["15px", "15px", "16px", "16px", "15px", "16px"]} fontWeight="700" lineHeight="20px" color='text'>{formatNumber(item.totalRaise)} U2U</Text>
          </Flex>
        </Box>
        {item.status === LAUNCHPAD_STATUS.UPCOMING ? (
          <Flex 
					borderRadius="8px"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					className='border-neubrutal'
					p={["27px 12px", "27px 16px", "27px 16px", "27px 16px", "27px 16px", "27px 16px", "30px 16px"]}
					style={{ background: '#445434' }}
					>
            <Text style={{ color: theme.colors.hover }} fontSize="16px" fontWeight="600" lineHeight="20px" mb="8px">{t('Sale start in')}</Text>
            <Text minWidth={250} textAlign="center" color='secondary' fontSize={["24px", "24px", "24px", "25px", "24px", "24px", "28px"]} fontWeight="600" style={{ lineHeight: 'calc(34/28)' }}>{ item.saleStart ? <CountdownTime type={COUNTDOWN_TYPE.STRING} time={timeCountdown}/> : t('To be announced')}</Text>
          </Flex>
        ) : (
          <Box className='border-neubrutal' borderRadius="8px" p={["16px 12px", "16px 12px", "16px 12px", "16px 12px", "16px 12px", "16px 12px","20px 16px"]}>
            <Flex alignItems="center" justifyContent="space-between" mb="20px">
              <Text fontFamily="'Metuo', sans-serif" fontSize="18px" fontWeight="900" lineHeight="1">{t('Progress')}</Text>
              <Text minWidth={145} fontSize={["14px", "16px", "16px", "16px", "16px", "14px", "16px"]} lineHeight="1">
								<CountdownTime type={COUNTDOWN_TYPE.STRING} time={timeCountdown}/>
							</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb="10px">
              <Flex>
                <Text fontSize="14px" fontWeight="700" lineHeight="24px">{formatNumber(totalCommit, 0, 6)}</Text>
                <Text color='textSubtle' fontSize="10px" lineHeight="24px" ml="6px">U2U Raised</Text>
              </Flex>
              <Text color='textSubtle' fontSize="14px" fontWeight="600">{formatNumber(item?.totalRaise ? (totalCommit / item?.totalRaise) * 100 : 0, 0, 2) }%</Text>
            </Flex>
            <Progress primaryStep={item?.totalRaise ? (totalCommit / item?.totalRaise) * 100 : 0 } scale="sm" />
          </Box>
        )}
      </CardBody>
    </CardLayout>
  )
}

export default LaunchpadCard