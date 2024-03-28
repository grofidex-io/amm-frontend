import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'

const FormStaking = ({ children }) => {
  const { t } = useTranslation()

  return (
    <>
      <Box>
        <Flex>
          <Text>{t('Staking amount')}</Text>
        </Flex>
      </Box>
    </>
  )
}

export default FormStaking
