import { Card, Col, Row } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'

import {
	apexColumnChartOpts,
	columnWithDataLableOpts,
	multipleYAxisChartOpts,
	simpleBubbleChartOpts,
	secondBubbleChartOpts,
	simpleCandlestickChartOpts,
	basicRadialBarChart,
	multipleRadialBarOpts,
	AreaApexOpt,
	SpilineAreaApexOpt,
	BasicBarOps,
	GroupBarOps,
	BasicBoxplotOps,
	ScatterBoxplotOps,
	lineChartOpts,
	LineWithDataLabelOps,
	SimplePieOpt,
	SimpleDonutOpt,
	BasicPolarAreaOpt,
	MonochromePolarAreaOpt,
	BasicRadarOpt,
	PolygonFillOpt,
	lineColumnChartOpts,
} from './data'

// components
import { PageBreadcrumb } from '@/components'

const ApexCharts = () => {
	return (
		<>
			<PageBreadcrumb title="Apex Charts" subName="chats" />
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Basic Area Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={AreaApexOpt}
									height={380}
									series={AreaApexOpt.series}
									type="area"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Spline Area</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={SpilineAreaApexOpt}
									height={380}
									series={SpilineAreaApexOpt.series}
									type="area"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Basic Bar Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={BasicBarOps}
									height={380}
									series={BasicBarOps.series}
									type="bar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Grouped Bar Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={GroupBarOps}
									height={380}
									series={GroupBarOps.series}
									type="bar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Basic Boxplot</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={BasicBoxplotOps}
									height={350}
									series={BasicBoxplotOps.series}
									type="boxPlot"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Scatter Boxplot </h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={ScatterBoxplotOps}
									height={350}
									series={ScatterBoxplotOps.series}
									type="boxPlot"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Simple Bubble Chart </h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={simpleBubbleChartOpts}
									height={380}
									series={simpleBubbleChartOpts.series}
									type="bubble"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">3D Bubble Chart </h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={secondBubbleChartOpts}
									height={380}
									series={secondBubbleChartOpts.series}
									type="bubble"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Basic Column Chart </h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={apexColumnChartOpts}
									height={380}
									series={apexColumnChartOpts.series}
									type="bar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">
								Column Chart with Datalabels{' '}
							</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={columnWithDataLableOpts}
									height={380}
									series={columnWithDataLableOpts.series}
									type="bar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Simple line chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={lineChartOpts}
									height={380}
									series={lineChartOpts.series}
									type="line"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Line with Data Labels</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={LineWithDataLabelOps}
									height={380}
									series={LineWithDataLabelOps.series}
									type="line"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<div>
								<h4 className="header-title">Line & Column Chart</h4>
								<div>
									<ReactApexChart
										className="apex-charts"
										options={lineColumnChartOpts}
										height={380}
										series={lineColumnChartOpts.series}
										type="line"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<div>
								<h4 className="header-title">Multiple Y-Axis Chart</h4>
								<ReactApexChart
									className="apex-charts"
									options={multipleYAxisChartOpts}
									height={380}
									series={multipleYAxisChartOpts.series}
									type="line"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Simple Pie Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={SimplePieOpt}
									height={320}
									series={SimplePieOpt.series}
									type="pie"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Simple Donut Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={SimpleDonutOpt}
									height={320}
									series={SimpleDonutOpt.series}
									type="donut"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Basic Polar Area Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={BasicPolarAreaOpt}
									height={380}
									series={BasicPolarAreaOpt.series}
									type="polarArea"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Monochrome Polar Area</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={MonochromePolarAreaOpt}
									height={380}
									series={MonochromePolarAreaOpt.series}
									type="polarArea"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Basic Radar Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={BasicRadarOpt}
									height={350}
									series={BasicRadarOpt.series}
									type="radar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Radar with Polygon-fill</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={PolygonFillOpt}
									height={350}
									series={PolygonFillOpt.series}
									type="radar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Basic RadialBar Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={basicRadialBarChart}
									height={350}
									series={basicRadialBarChart.series}
									type="radialBar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Multiple RadialBars</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={multipleRadialBarOpts}
									height={350}
									series={multipleRadialBarOpts.series}
									type="radialBar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Simple Candlestick Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={simpleCandlestickChartOpts}
									height={400}
									series={simpleCandlestickChartOpts.series}
									type="candlestick"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default ApexCharts
