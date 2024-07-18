import dayjs from "dayjs";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export default function DailyProfit({info, currentAsset}) {
	const getKey = (value: string) => {
		if(Number(value) > 0) {
			return 'pv'
		}
		return 'uv'
	}
	const listData = info?.data ? [...info?.data?.dailyAssets, ...currentAsset] : []
	const data = listData.map((item, index) => {
		const _asset = index === 0 ? item.totalAssets : listData[index] && (Number(listData[index].totalAssets) - Number(listData[index - 1].totalAssets)).toFixed(4)
		return {
			name: dayjs.unix(item.timestamp).format('YYYY-MM-DD'),
			[getKey(_asset)]: _asset
		}
	})
	return (
		<BarChart width={600} height={300} data={data}
		margin={{top: 20, right: 30, left: 20, bottom: 5}}>
			<CartesianGrid  vertical={false} strokeDasharray="1 0" opacity={0.1} />
			<XAxis dataKey="name" axisLine={false} tickLine={false} />
			<YAxis axisLine={false} tickLine={false}/>
			<Tooltip  cursor={false} wrapperStyle={{outline: 'none'}} contentStyle={{ background: '#404040', borderRadius: 8, padding: 0, border: '2px solid black', boxShadow: '2px 2px 0 0 rgba(0, 0, 0, 1)'}} labelStyle={{textAlign: 'center',background: '#69CF00', padding: '5px 20px', borderRadius: "8px 8px 0 0", color: 'black', fontWeight: 'bold', borderBottom: '2px solid black'}} itemStyle={{background: '#404040', padding: '5px 20px', borderRadius: "0 0 8px 8px", color: 'white'}}/>
			{/* <Legend /> */}
			<Bar dataKey="pv" name="Profit" stackId="a" fill="#00B58D" />
			<Bar dataKey="uv" name="Profit" stackId="a" fill="#FE5300" />
		</BarChart>
	)
}