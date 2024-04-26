import { Flex, Text } from "@pancakeswap/uikit"

const NoData = () => {
  return (
    <Flex mt="40px" mb="20px" flexDirection="column" alignItems="center" justifyContent="center">
      <img alt='' src='/images/no-data.svg' />
      <Text>No Data</Text>
    </Flex>
  )
}

export default NoData