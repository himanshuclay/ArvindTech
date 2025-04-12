import { Card, Col, Row } from 'react-bootstrap'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

// components
import { CustomCardPortlet } from '@/components'

const UsChart = () => {
	const usChartOpts: ApexOptions = {
		series: [44, 55, 13, 43],

		chart: {
			width: 80,
			type: 'pie',
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		colors: ['#1a2942', '#f13c6e', '#3bc0c3', '#d1d7d973'],
		labels: ['Team A', 'Team B', 'Team C', 'Team D'],
	}
	return (
		<Card>
			<Card.Body>
				<div className="d-flex align-items-center">
					<div className="flex-grow-1 overflow-hidden">
						<h4 className="fs-22 fw-semibold">69.25%</h4>
						<p className="text-uppercase fw-medium text-muted text-truncate mb-0">
							{' '}
							US Dollar Share
						</p>
					</div>
					<div className="flex-shrink-0" dir="ltr">
						<ReactApexChart
							height={90}
							width={80}
							options={usChartOpts}
							series={usChartOpts.series}
							type="pie"
							className="apex-charts"
						/>
					</div>
				</div>
			</Card.Body>
		</Card>
	)
}
const YearlySelesChart = () => {
	const yearlyChartOpts: ApexOptions = {
		series: [
			{
				name: 'Mobile',
				data: [25, 15, 25, 36, 32, 42, 45],
			},
			{
				name: 'Desktop',
				data: [20, 10, 20, 31, 27, 37, 40],
			},
		],
		chart: {
			height: 250,
			type: 'line',
			toolbar: {
				show: false,
			},
		},
		colors: ['#3bc0c3', '#1a2942', '#d1d7d973'],

		stroke: {
			curve: 'smooth',
			width: [3, 3],
		},
		markers: {
			size: 3,
		},
		xaxis: {
			categories: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
		},
		legend: {
			show: false,
		},
	}

	return (
		<>
			<CustomCardPortlet
				cardTitle="Yearly Sales Report"
				titleClass="header-title"
			>
				<div dir="ltr">
					<ReactApexChart
						height={250}
						options={yearlyChartOpts}
						series={yearlyChartOpts.series}
						type="line"
						className="apex-charts"
					/>
				</div>
				<Row className="text-center">
					<Col>
						<p className="text-muted mt-3 mb-2">Quarter 1</p>
						<h4 className="mb-0">$56.2k</h4>
					</Col>
					<Col>
						<p className="text-muted mt-3 mb-2">Quarter 2</p>
						<h4 className="mb-0">$42.5k</h4>
					</Col>
					<Col>
						<p className="text-muted mt-3 mb-2">All Time</p>
						<h4 className="mb-0">$102.03k</h4>
					</Col>
				</Row>
			</CustomCardPortlet>

			<UsChart />
		</>
	)
}

export default YearlySelesChart
