import { Flex, Text } from "@pancakeswap/uikit"

const NoData = () => {
  return (
    <Flex mt="40px" mb="20px" flexDirection="column" alignItems="center" justifyContent="center">
      <img alt='' src='/images/no-data.svg' />
      <Text color="#9F9F9F" marginTop="10px" fontFamily="Metuo,sans-serif">No Data</Text>
    </Flex>
  )
}

export default NoData