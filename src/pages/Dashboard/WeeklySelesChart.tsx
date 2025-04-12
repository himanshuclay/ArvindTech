import { Col, Row } from 'react-bootstrap'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

// components
import { CustomCardPortlet } from '@/components'

const weeklyChartOpts: ApexOptions = {
	series: [
		{
			name: 'Revenue',
			data: [440, 505, 414, 526, 227, 413, 201],
		},
		{
			name: 'Sales',
			data: [320, 258, 368, 458, 201, 365, 389],
		},
		{
			name: 'Profit',
			data: [320, 458, 369, 520, 180, 369, 160],
		},
	],
	chart: {
		height: 377,
		type: 'bar',
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: '60%',
		},
	},
	stroke: {
		show: true,
		width: 2,
		colors: ['transparent'],
	},
	dataLabels: {
		enabled: false,
	},
	colors: ['#3bc0c3', '#1a2942', '#d1d7d973'],
	xaxis: {
		categories: [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		],
	},
	yaxis: {
		title: {
			text: '$ (thousands)',
		},
	},
	legend: {
		offsetY: 7,
	},
	grid: {
		padding: {
			bottom: 20,
		},
	},
	fill: {
		opacity: 1,
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return '$ ' + val + ' thousands'
			},
		},
	},
}

const WeeklySelesChart = () => {
	return (
		<CustomCardPortlet
			cardTitle="Weekly Sales Report"
			titleClass="header-title"
		>
			<div dir="ltr">
				<ReactApexChart
					height={377}
					options={weeklyChartOpts}
					series={weeklyChartOpts.series}
					type="bar"
					className="apex-charts"
				/>
			</div>

			<Row className="text-center">
				<Col>
					<p className="text-muted mt-3">Current Week</p>
					<h3 className=" mb-0">
						<span>$506.54</span>
					</h3>
				</Col>
				<Col>
					<p className="text-muted mt-3">Previous Week</p>
					<h3 className=" mb-0">
						<span>$305.25 </span>
					</h3>
				</Col>
				<Col>
					<p className="text-muted mt-3">Conversation</p>
					<h3 className=" mb-0">
						<span>3.27%</span>
					</h3>
				</Col>
				<Col>
					<p className="text-muted mt-3">Customers</p>
					<h3 className=" mb-0">
						<span>3k</span>
					</h3>
				</Col>
			</Row>
		</CustomCardPortlet>
	)
}

export default WeeklySelesChart
