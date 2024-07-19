import { Box } from "@pancakeswap/uikit";
import { formatNumber } from "@pancakeswap/utils/formatBalance";
import BigNumber from "bignumber.js";
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
	@media screen and (max-width: 1199px) {
		--size: 360px;
	}
	@media screen and (max-width: 991px) {
		--size: 400px;
	}
	@media screen and (max-width: 575px) {
		--size: 360px;
	}
	@media screen and (max-width: 424px) {
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
			ctx.font =  window.innerWidth > 576 ? 'bolder 18px Urbanist' : 'bolder 16px Urbanist'
			ctx.fillStyle = 'white'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(`${formatNumber(chart.data.datasets[0].total)} USDT`, centerX, centerY)
		}
	}

	const data = {
		labels: Object.keys(balances)?.map((id: any) => { return window.innerWidth > 576 ? `${balances[id]?.symbol} - ${formatNumber(BigNumber(listAssetAllocation[id]).div(totalValue).multipliedBy(100).toNumber(), 0, 2)}%` : `${balances[id]?.symbol}` }),
		datasets: [{
			label: 'Total Asset',
			total: totalValue,
			data: Object.keys(listAssetAllocation).map((item) => listAssetAllocation[item]),
			backgroundColor: Object.keys(balances)?.map((id: any) => { return LIST_COLOR[balances[id]?.symbol] || getRandomColor() }),
			hoverOffset: 4,
			borderWidth: 0,
		}]
	};
	return (
		<Box>
			<StyledChart>
				<Doughnut
					data={data}
					options={{
						responsive: true,
						cutout: '70%',
						radius: window.innerWidth > 992 ? '95%' : '90%',
						plugins: {
							legend: {
								position: window.innerWidth > 992 ? 'right' : 'bottom',
								labels: {
									color: '#fff',
									usePointStyle: true,
									boxWidth: 6,
									boxHeight: 6,
									boxPadding: 2,
									font: {
										size: window.innerWidth > 576 ? 14 : 12
									}
								}
							},
							tooltip: {
								callbacks: {
									title: (context) => {
										return context[0].label.split(':')[0]
									},
									label: (context: any) => {
										return `${context.raw && formatNumber(context.raw)} USDT`
									}
								}
							}
						},
					}}
					plugins={[doughnutLabel]}
				/>
			</StyledChart>
		</Box>
	)
}