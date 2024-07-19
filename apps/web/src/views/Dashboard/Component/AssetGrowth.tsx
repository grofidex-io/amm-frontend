import { Box, Flex, Text } from '@pancakeswap/uikit';
import dayjs from 'dayjs';
import forEach from 'lodash/forEach';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { getRandomColor, LIST_COLOR } from '../helper';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`
const StyledResponsiveContainer = styled(ResponsiveContainer)`
	height: 360px !important;
	width: 100%;
	font-size: 14px;
	@media screen and (max-width: 1199px) {
		height: 300px !important;
	}
	@media screen and (max-width: 575px) {
		height: 250px !important;
	}
`
const Circle = styled.div<{color: string}>`
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: ${({ color }) => color};
	margin-right: 4px;
`
const FlexInfo = styled(Flex)`
	margin-bottom: 16px;
	flex-wrap: wrap;
	justify-content: center;
`
const CustomTooltipContainer = styled.div`
 background: '#404040';
  border-radius: 8px; 
	padding: 0;
	border: 2px solid black;
	box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 1);
	outline: none;
`
const TooltipLabel = styled.div`
	background: #69CF00;
	padding: 5px 20px; 
	border-radius: 8px 8px 0 0;
  color: black; 
	font-size: 14px;
	font-weight: bold;
	border-bottom: 2px solid black;
	text-align: center
`
const TooltipContent = styled.div`
	background: #404040;
	padding: 5px 20px;
	border-radius: 0 0 8px 8px; 
	color: white
`

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <TooltipLabel className="label">{`${label}`}</TooltipLabel>
				<TooltipContent>
				{
					payload.map((item) => {
						return (
							<Flex alignItems="center" mb="1">
								<Circle color={item.color}/>
								<p className="intro">{item.name} : <span style={{fontWeight: 'bold'}}>{item.value} USDT</span></p>
							</Flex>
						)
					})
				}
				</TooltipContent>
      </CustomTooltipContainer>
    );
  }

  return null;
};
export default function AssetGrowth({info, currentAsset}: any) {
	let listLine: any = []
	const dataChart = info && [...info?.data?.dailyAssets, ...currentAsset].map((item) => {
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
			<FlexInfo>
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
			<StyledResponsiveContainer>
				<LineChart
					width={500}
					height={300}
					data={dataChart}
					margin={{
						top: 5,
						right: 10,
						left: 0,
						bottom: 5,
					}}
				>
					<CartesianGrid  vertical={false} strokeDasharray="1 0" opacity={0.1} />
					<XAxis dataKey="name" axisLine={false} tickLine={false} />
					<YAxis axisLine={false} tickLine={false}/>
					<Tooltip
						cursor={false}
						wrapperStyle={{outline: 'none'}}
						content={<CustomTooltip/>}
						// formatter={function(value, name) { return `<div>${value}dasdas${name}</div>` }}
					/>
					{/* <Legend /> */}
					{listLine.map((item) => {
						return (
						<Line type="monotone" dataKey={item.key} stroke={item.value} activeDot={{ r: 5 }} />
						)
					})}
					{/* <Line type="monotone" dataKey="USDT" stroke="#82ca9d" /> */}
				</LineChart>
			</StyledResponsiveContainer>
		</Wrapper>
	)
}