import { Row, Col, Card } from 'react-bootstrap'

// components
import { PageBreadcrumb } from '@/components'

// data
import { materialIocons } from './data'
import { MdiIconType } from './data'

interface NewIconsProps {
	newIcons: MdiIconType[]
}

interface AllIconsProps {
	icons: MdiIconType[]
}

const NewIcons = ({ newIcons }: NewIconsProps) => {
	return (
		<>
			<Row className="icon-list-demo">
				{(newIcons || []).map((icon, index) => {
					return (
						<Col key={index} sm={6} md={4} lg={3}>
							<i className={`mdi mdi-${icon.name}`}></i>
							<span>mdi-{icon.name}</span>
						</Col>
					)
				})}
			</Row>
		</>
	)
}

const AllIcons = ({ icons }: AllIconsProps) => {
	return (
		<>
			<Row className="icon-list-demo">
				{(icons || []).map((icon, index) => {
					return (
						<Col key={index} sm={6} md={4} lg={3}>
							<i className={`mdi mdi-${icon.name}`}></i>
							<span>mdi-{icon.name}</span>
						</Col>
					)
				})}
			</Row>
		</>
	)
}

const MaterialIcons = () => {
	const newIcons: MdiIconType[] =
		materialIocons && materialIocons.filter((icon) => icon.version === '5.8.55')

	return (
		<>
			<PageBreadcrumb title="Material Design Icons" subName="Icons" />
			<Row className="icons-list-demo">
				<Col>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">New Icons v5.8.55</h4>
							<NewIcons newIcons={newIcons} />
						</Card.Body>
					</Card>

					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">All Icons</h4>
							<AllIcons icons={materialIocons} />
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Size</h4>

							<Row className="icons-list-demo">
								{[18, 24, 36, 48].map((size, index) => {
									return (
										<Col key={index} sm={6} md={4} lg={3}>
											<i
												className={`
                          mdi
                          mdi-${size}px
                          mdi-account
                        `}
											></i>
											<span>mdi-{size}px</span>
										</Col>
									)
								})}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Rotate</h4>

							<Row className="icons-list-demo">
								{[45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
									return (
										<Col key={index} sm={6} md={4} lg={3}>
											<i
												className={`
                          mdi
                          mdi-rotate-${angle}
                          mdi-account
                        `}
											></i>
											<span>mdi-rotate-{angle}</span>
										</Col>
									)
								})}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Spin</h4>

							<Row className="icons-list-demo">
								{['loading', 'star'].map((icon, index) => {
									return (
										<Col key={index} sm={6} md={4} lg={3}>
											<i className={`mdi mdi-${icon} mdi-spin`}></i>
											<span>mdi-spin</span>
										</Col>
									)
								})}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default MaterialIcons
