import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Progress, Text } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import styled, { useTheme } from 'styled-components'


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
const StyledButton = styled(Button)`
  --size: 72px;
  width: calc(var(--size) + 8px);
  height: var(--size);
  white-space: wrap;
  font-weight: 700;
  line-height: calc(19/16);
`
const StyledText = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 20px;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  type?: string
}

const LaunchpadCard = ({ type }: LaunchpadProps) => {
  const { t } = useTranslation()
  const theme = useTheme();

  return (
    <CardLayout>
      <CardHeader>
        <ImageHeader src='/images/project-background.png' alt='' />
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" justifyContent="space-between" className='border-neubrutal' borderRadius="8px" p="14px" background={theme.colors.backgroundPage}>
          <Box className='border-neubrutal' borderRadius="8px" overflow="hidden" width="72px" height="72px" style={{ minWidth: '72px' }}>
            <Image src='/images/project-image.png' alt=''/>
          </Box>
          <Box style={{ flex: 1 }} overflow="hidden" mx="24px">
            <StyledText >XToken Project</StyledText>
            <Flex alignItems="center" mt="12px">
              <StyledDot
                background={
                  type === 'upcoming' ? theme.colors.yellow
                  : type === 'cancelled' ? theme.colors.orange
                  : type === 'claimable' ? theme.colors.cyan
                  : type === 'ended' ? theme.colors.textSubtle
                  : theme.colors.primary
                }
              />
              <Text
                ml="8px"
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                color={
                  type === 'upcoming' ? theme.colors.yellow
                    : type === 'cancelled' ? theme.colors.orange
                    : type === 'claimable' ? theme.colors.cyan
                    : type === 'ended' ? theme.colors.textSubtle
                    : theme.colors.primary
                }
              >
                {
                  type === 'upcoming' ? t('Upcoming')
                    : type === 'cancelled' ? t('Cancelled')
                    : type === 'claimable' ? t('Claimable')
                    : type === 'ended' ? t('Ended')
                    : t('On Going')
                }
              </Text>
            </Flex>
          </Box>
          <NextLink href="/launchpad/1" passHref>
            <StyledButton
              className="button-hover"
            >
              {t('View Detail')}
            </StyledButton>
          </NextLink>
        </Flex>
        <Box p="16px">
          <Text fontSize="14px" fontWeight="400" mb="16px" color='textSubtle'>{t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porta odio sapien, id efficitur est faucibus a. Donec porttitor sem eget egestas mollis. Ut velit arcu, luctus eu varius non, mollis sed erat. ....')}</Text>
          <Flex justifyContent="space-between" alignItems="center" mb="12px">
            <Text fontSize="14px" fontWeight="600" lineHeight="20px" color='textSubtle'>{t('Sale price')}</Text>
            <Text fontSize="16px" fontWeight="700" lineHeight="20px" color='text'>1 U2U = 100 Xtoken</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px" fontWeight="600" lineHeight="20px" color='textSubtle'>{t('Total Raise')}</Text>
            <Text fontSize="16px" fontWeight="700" lineHeight="20px" color='text'>200.000 U2U</Text>
          </Flex>
        </Box>
        {type === 'upcoming' ? (
          <Flex borderRadius="8px" flexDirection="column" alignItems="center" justifyContent="center" className='border-neubrutal' p="30px" style={{ background: '#445434' }}>
            <Text style={{ color: theme.colors.hover }} fontSize="16px" fontWeight="600" lineHeight="20px" mb="8px">{t('Sale start in')}</Text>
            <Text color='secondary' fontSize="28px" fontWeight="600" lineHeight="34px">{t('To be announced')}</Text>
          </Flex>
        ) : (
          <Box className='border-neubrutal' borderRadius="8px" p="20px 16px">
            <Flex alignItems="center" justifyContent="space-between" mb="20px">
              <Text fontFamily="'Metuo', sans-serif" fontSize="18px" fontWeight="900" lineHeight="1">{t('Progress')}</Text>
              <Text fontSize="16px" lineHeight="20px">00d : 18h : 35m : 11s</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb="10px">
              <Flex>
                <Text fontSize="14px" fontWeight="700" lineHeight="24px">40.000</Text>
                <Text color='textSubtle' fontSize="10px" lineHeight="24px" ml="6px">U2U Raised</Text>
              </Flex>
              <Text color='textSubtle' fontSize="14px" fontWeight="600">20%</Text>
            </Flex>
            <Progress primaryStep={20} scale="sm" />
          </Box>
        )}
      </CardBody>
    </CardLayout>
  )
}

export default LaunchpadCard