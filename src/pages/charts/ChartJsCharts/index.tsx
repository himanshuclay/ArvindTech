import { Card, Col, Row } from 'react-bootstrap'
import { useEffect } from 'react'
import Chart, { type ChartItem } from 'chart.js/auto'

// data
import {
	boundariesConfig,
	datasetConfig,
	borderRadiusConfig,
	floatingConfig,
	interpolationConfig,
	lineConfig,
	bubbleConfig,
	donutConfig,
} from './data'

// components
import { PageBreadcrumb } from '@/components'

const ChartjsCharts = () => {
	useEffect(() => {
		const boundariesTag = document.getElementById(
			'boundaries-example'
		) as ChartItem
		const boundariesChart = new Chart(boundariesTag, boundariesConfig)

		const datasetTag = document.getElementById('dataset-example') as ChartItem
		const datasetChart = new Chart(datasetTag, datasetConfig)

		const borderRadiusTag = document.getElementById(
			'border-radius-example'
		) as ChartItem
		const borderRadiusChart = new Chart(borderRadiusTag, borderRadiusConfig)

		const floatingTag = document.getElementById('floating-example') as ChartItem
		const floatingChart = new Chart(floatingTag, floatingConfig)

		const interpolationTag = document.getElementById(
			'interpolation-example'
		) as ChartItem
		const interpolationChart = new Chart(interpolationTag, interpolationConfig)

		const lineTag = document.getElementById('line-example') as ChartItem
		const lineChart = new Chart(lineTag, lineConfig)

		const bubbleTag = document.getElementById('bubble-example') as ChartItem
		const bubbleChart = new Chart(bubbleTag, bubbleConfig)

		const donutTag = document.getElementById('donut-example') as ChartItem
		const donutChart = new Chart(donutTag, donutConfig)

		return () => {
			boundariesChart.destroy()
			datasetChart.destroy()
			borderRadiusChart.destroy()
			floatingChart.destroy()
			interpolationChart.destroy()
			lineChart.destroy()
			bubbleChart.destroy()
			donutChart.destroy()
		}
	}, [])

	return (
		<>
			<PageBreadcrumb title="Chartjs" subName="Charts" />
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Boundaries</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="boundaries-example"
										data-colors="#3bc0c3,#47ad77"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Different Dataset</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="dataset-example"
										data-colors="#3bc0c3,#4489e4,#d03f3f,#716cb0, #f24f7c"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Border Radius</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="border-radius-example"
										data-colors="#3e60d5,#47ad77"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<div className="card-body">
							<h4 className="header-title mb-4">Floating</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="floating-example"
										data-colors="#3e60d5,#47ad77"
									></canvas>
								</div>
							</div>
						</div>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Interpolation</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="interpolation-example"
										data-colors="#4489e4,#d03f3f"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Line</h4>

							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="line-example"
										data-colors="#3e60d5,#47ad77"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Bubble</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="bubble-example"
										data-colors="#3e60d5,#47ad77"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">DONUT</h4>
							<div>
								<div className="mt-3 chartjs-chart" style={{ height: '320px' }}>
									<canvas
										id="donut-example"
										data-colors="#3e60d5,#fa5c7c,#47ad77,#ebeff2"
									></canvas>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default ChartjsCharts
