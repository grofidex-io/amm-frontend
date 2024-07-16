import { Box } from "@pancakeswap/uikit";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styled from 'styled-components';

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
export default function AssetAllocation () {
	const doughnutLabel = {
		id: 'doughnutLabel',
		afterDatasetsDraw(chart) {
			const { ctx } = chart
			const centerX = chart.getDatasetMeta(0).data[0].x
			const centerY = chart.getDatasetMeta(0).data[0].y
			ctx.save()
			ctx.font = 'bolder 18px Arial'
			ctx.fillStyle = 'white'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText('9,627.00 USDT', centerX, centerY)
		}
	}
	const data = {
		labels: [
			'Red',
			'Blue',
			'Yellow'
		],
		datasets: [{
			label: 'My First Dataset',
			data: [300, 50, 100],
			backgroundColor: [
				'rgb(255, 99, 132)',
				'rgb(54, 162, 235)',
				'rgb(255, 205, 86)'
			],
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