import { Card, Col, Row } from 'react-bootstrap'

// data
import {
	worldMapOpts,
	usaMapOpts,
	spainMapOpts,
	canadaMapOpts,
	russiaMapOpts,
	italyMapOpts,
	iraqMapOpts,
} from './data'

// component
import {
	CanadaVectorMap,
	IraqVectorMap,
	ItalyVectorMap,
	RussiaVectorMap,
	SpainVectorMap,
	UsaVectorMap,
	WorldMap,
} from '@/components'
import { PageBreadcrumb } from '@/components'

const VectorMaps = () => {
	return (
		<>
			<PageBreadcrumb title="Vector Maps" subName="Base UI" />
			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">World Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<WorldMap height="360px" width="100%" options={worldMapOpts} />
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">USA Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<UsaVectorMap height="300px" width="100%" options={usaMapOpts} />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">Russia Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<RussiaVectorMap
								height="300px"
								width="100%"
								options={russiaMapOpts}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">Italy Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<ItalyVectorMap
								height="300px"
								width="100%"
								options={italyMapOpts}
							/>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">Canada Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<CanadaVectorMap
								height="300px"
								width="100%"
								options={canadaMapOpts}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">Iraq Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<IraqVectorMap
								height="300px"
								width="100%"
								options={iraqMapOpts}
							/>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title mb-0">Spain Vector Map</h4>
						</Card.Header>
						<Card.Body>
							<SpainVectorMap
								height="300px"
								width="100%"
								options={spainMapOpts}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default VectorMaps
