import { Box, Flex, Text } from '@pancakeswap/uikit';
import dayjs from 'dayjs';
import forEach from 'lodash/forEach';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const LIST_COLOR = {
	U2U: '#15C179',
	WBTC: '#7F4EE0',
	USDT: '#FFD238',
	WETH: '#F12C73',
	WBNB: '#00DEFF',
	WTRX: '#F4924A',
	WSOL: '#6E0C3A',
	WDOGE: '#3CD5A3',
	WXRP: '#B170B9',
	WADA: '#481943',
	WNEAR: '#773F4A'
}
const Circle = styled.div<{color: string}>`
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: ${({ color }) => color};
	margin-right: 2px;
`
const FlexInfo = styled(Flex)`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: -22px;
`
export default function AssetGrowth({info}: any) {
	let listLine: any = []
	const dataChart = info && info?.data?.dailyAssets.map((item) => {
		listLine = []
		let newItem = {
			name: dayjs.unix(item.timestamp).format('YYYY-MM-DD'),
		}
		forEach(item.assets, (asset) => {
			newItem = {
				...newItem,
				[asset.name]: asset.balanceUsd
			}
			listLine.push({key: asset.name, value: LIST_COLOR[asset.name] || getRandomColor() })
		})
		return newItem
	})

	return (
		<Wrapper>
			<FlexInfo position="absolute">
				{listLine.map((item) => {
					return (
						<Box margin="0 5px">
							<Flex alignItems="center">
									<Circle color={item.value} />
									<Text fontSize={13}>{item.key}</Text>
							</Flex>
						</Box>
					)
				})}
			</FlexInfo>
			<ResponsiveContainer width="100%" height="100%">
			<LineChart
				width={500}
				height={300}
				data={dataChart}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid  vertical={false} strokeDasharray="1 0" opacity={0.1} />
				<XAxis dataKey="name" axisLine={false} tickLine={false} />
				<YAxis axisLine={false} tickLine={false}/>
				<Tooltip cursor={false} wrapperStyle={{outline: 'none'}} contentStyle={{ background: '#404040', borderRadius: 8, padding: 0, border: '2px solid black', boxShadow: '2px 2px 0 0 rgba(0, 0, 0, 1)', outline: 'none'}} labelStyle={{background: '#69CF00', padding: '5px 20px', borderRadius: "8px 8px 0 0", color: 'black', fontWeight: 'bold'}} itemStyle={{background: '#404040', padding: '5px 20px', borderRadius: "0 0 8px 8px", color: 'white'}}/>
				{/* <Legend /> */}
				{listLine.map((item) => {
					return (
					<Line type="monotone" dataKey={item.key} stroke={item.value} activeDot={{ r: 8 }} />
					)
				})}
				{/* <Line type="monotone" dataKey="USDT" stroke="#82ca9d" /> */}
			</LineChart>
		</ResponsiveContainer>
	</Wrapper>
	)
}