import { Box } from "@pancakeswap/uikit";
import { formatNumber } from "@pancakeswap/utils/formatBalance";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styled from 'styled-components';
import { getRandomColor, LIST_COLOR } from "../helper";

ChartJS.register(ArcElement, Tooltip, Legend);
const StyledChart = styled(Box)`
	--size: 400px;
	width: var(--size);
	height: var(--size);
	margin: auto;
	@media screen and (max-width: 575px) {
		--size: 300px;
	}
	@media screen and (max-width: 374px) {
		--size: 250px;
	}
`
export default function AssetAllocation ({balances, listAssetAllocation, totalValue}) {

	const doughnutLabel = {
		id: 'doughnutLabel',
		afterDatasetsDraw(chart) {
			const { ctx } = chart
			const centerX = chart.getDatasetMeta(0).data[0]?.x
			const centerY = chart.getDatasetMeta(0).data[0]?.y
			ctx.save()
			ctx.font = 'bolder 18px Arial'
			ctx.fillStyle = 'white'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(`${formatNumber(chart.data.datasets[0].total)} USDT`, centerX, centerY)
		}
	}

	const data = {
		labels: Object.keys(balances)?.map((id: any) => { return balances[id]?.currency?.symbol }),
		datasets: [{
			label: 'Total Asset',
			total: totalValue,
			data: listAssetAllocation,
			backgroundColor: Object.keys(balances)?.map((id: any) => { return LIST_COLOR[balances[id]?.currency?.symbol] || getRandomColor() }),
			hoverOffset: 4
		}]
	};
	return (
		<Box px={["0", "0", "0", "0", "12px", "16px", "20px"]}>
			<StyledChart>
				<Doughnut
					data={data}
					options={{
						responsive: true,
						cutout: '70%',
						radius: window.innerWidth > 576 ? '95%' : '90%',
						plugins: {
							legend: {
								position: window.innerWidth > 576 ? 'right' : 'bottom',
								labels: {
									color: '#fff',
								}
							},
							tooltip: {
								// callbacks: {
								// 	title: (context) => {
								// 		return context[0].label.split(':')[0]
								// 	},
								// 	label: (context) => {
								// 		return `${context.raw}%`
								// 	}
								// }
							}
						},
					}}
					plugins={[doughnutLabel]}
				/>
			</StyledChart>
		</Box>
	)
}