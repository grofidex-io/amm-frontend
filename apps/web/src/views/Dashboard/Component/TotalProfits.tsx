import dayjs from "dayjs"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import styled from "styled-components"

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`
export default function TotalProfits({info, currentAsset}) {
	const listData = info?.data ? [...info?.data?.dailyAssets, ...currentAsset] : []
	const data = listData.map((item) => {
		return {
			name: dayjs.unix(item.timestamp).format('YYYY-MM-DD'),
			Total: item.totalAssets
		}
	})
	return (
		<Wrapper>
		<ResponsiveContainer width="100%" height="100%">
		<AreaChart width={500} height={250} data={data}
			margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
			<defs>
				{/* <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#E1FABB" stopOpacity={0.8}/>
					<stop offset="100%" stopColor="#E1FABB" stopOpacity={0}/>
				</linearGradient> */}
				<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#E1FABB" stopOpacity={0.25}/>
				<stop offset="90%" stopColor="#FFFFFF" stopOpacity={0}/>
				</linearGradient>
			</defs>
			<XAxis dataKey="name" axisLine={false} tickLine={false} />
			<YAxis axisLine={false} tickLine={false}/>
			<CartesianGrid  vertical={false} strokeDasharray="1 0" opacity={0.1}/>
			<Tooltip  cursor={false} wrapperStyle={{outline: 'none'}} contentStyle={{ background: '#404040', borderRadius: 8, padding: 0, border: '2px solid black', boxShadow: '2px 2px 0 0 rgba(0, 0, 0, 1)'}} labelStyle={{textAlign: 'center',background: '#69CF00', padding: '5px 20px', borderRadius: "8px 8px 0 0", color: 'black', fontWeight: 'bold', borderBottom: '2px solid black'}} itemStyle={{background: '#404040', padding: '5px 20px', borderRadius: "0 0 8px 8px", color: 'white'}}/>
			{/* <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" /> */}
			<Area type="monotone" dataKey="Total" stroke="#69CF00" fillOpacity={1} fill="url(#colorPv)" strokeWidth={2}/>
		</AreaChart>
		</ResponsiveContainer>
		</Wrapper>
	)
}