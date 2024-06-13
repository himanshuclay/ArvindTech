import { Card, Col, Row } from 'react-bootstrap'
import {
	Sparklines,
	SparklinesBars,
	SparklinesLine,
	SparklinesReferenceLine,
	SparklinesSpots,
} from 'react-sparklines'

// components
import { PageBreadcrumb } from '@/components'

const SparklinesCharts = () => {
	return (
		<>
			<PageBreadcrumb subName="Charts" title="Sparkline" />
			<Row>
				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Line Charts</h4>
							<div className="mt-4">
								<Sparklines
									data={[0, 23, 43, 35, 44, 45, 56, 37, 40]}
									height={50}
									width={160}
									limit={7}
									margin={5}
								>
									<SparklinesLine color="#45bbe0" />
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Bar Chart</h4>
							<div className="mt-4">
								<Sparklines
									data={[3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12]}
									height={50}
									width={160}
								>
									<SparklinesBars style={{ fill: '#348cd4' }} />
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">LineSpots Chart</h4>
							<div className="mt-4">
								<Sparklines
									height={50}
									width={160}
									data={[25, 23, 26, 24, 25, 32, 30, 24, 19]}
								>
									<SparklinesLine color="#348cd4" />
									<SparklinesSpots style={{ fill: '#348cd4' }} />
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Custom Chart</h4>
							<div className="mt-4">
								<Sparklines
									height={50}
									width={160}
									data={[25, 23, 26, 24, 25, 32, 30, 24, 19]}
								>
									<SparklinesBars
										style={{
											stroke: 'white',
											fill: '#41c3f9',
											fillOpacity: '.25',
										}}
									/>
									<SparklinesLine style={{ stroke: '#41c3f9', fill: 'none' }} />
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Reference Line Chart</h4>
							<div className="mt-4">
								<Sparklines
									height={50}
									width={160}
									data={[
										87, 50, 80, 20, 88, 56, 60, 30, 70, 9, 110, 11, 91, 93, 100,
									]}
								>
									<SparklinesLine color="#348cd4" />
									<SparklinesReferenceLine type="median" />
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Reference bar Chart</h4>
							<div className="text-center mt-4">
								<Sparklines
									height={50}
									width={160}
									data={[
										87, 50, 80, 20, 88, 56, 60, 30, 70, 9, 110, 11, 91, 93, 100,
									]}
								>
									<SparklinesBars
										style={{ fill: 'slategray', fillOpacity: '.5' }}
									/>
									<SparklinesReferenceLine type="avg" />
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Real world Chart</h4>
							<div className="text-center mt-4">
								<Sparklines
									height={100}
									width={290}
									data={[
										25, 23, 26, 24, 25, 32, 30, 24, 19, 35, 14, 38, 20, 31,
									]}
								>
									<SparklinesLine
										style={{ strokeWidth: 3, stroke: '#348cd4', fill: 'none' }}
									/>
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Real world With Background Chart</h4>
							<div className="text-center mt-4" style={{ minHeight: 164 }}>
								<Sparklines
									height={100}
									width={290}
									data={[5, 10, 5, 20, 8, 15, 5, 10, 5, 20, 8, 15]}
								>
									<SparklinesLine
										style={{
											stroke: 'rgb(52, 140, 212)',
											fill: 'rgb(69, 187, 224)',
											fillOpacity: '1',
										}}
									/>
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6} lg={4}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Box Plot Chart</h4>
							<div className="text-center mt-4" style={{ minHeight: 164 }}>
								<Sparklines
									height={100}
									width={290}
									data={[5, 10, 5, 20, 8, 15, 5, 10, 5, 20, 8, 15]}
									style={{ background: 'rgb(35, 62, 73)' }}
									margin={10}
								>
									<SparklinesLine
										style={{
											stroke: 'none',
											fill: 'rgb(65, 195, 249)',
											fillOpacity: '.5',
										}}
									/>
								</Sparklines>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default SparklinesCharts
