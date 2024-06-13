import { Card, CardGroup, Col, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// component
import { PageBreadcrumb } from '@/components'

// constants
import { colorVariants, extendedColorVariants } from '@/constants/colorVariants'

// images
import cardImg from '@/assets/images/small/small-1.jpg'
import cardImg1 from '@/assets/images/small/small-2.jpg'
import cardImg3 from '@/assets/images/small/small-3.jpg'
import cardImg4 from '@/assets/images/small/small-4.jpg'

interface CardGroupDetailsTypes {
	id: number
	image: string
	title: string
	text: string
	subtext: string
}

const CardWithImage = () => {
	return (
		<>
			<Card className="d-block">
				<Card.Img className="card-img-top" src={cardImg} alt="Card image cap" />
				<Card.Body>
					<Card.Title as="h4">Card title</Card.Title>
					<Card.Text className="card-text">
						Some quick example text to build on the card title and make up the
						bulk of the card's content. Some quick example text to build on the
						card title and make up.
					</Card.Text>
					<Link to="#" className="btn btn-primary">
						Button
					</Link>
				</Card.Body>
			</Card>
		</>
	)
}

const CardWithImage2 = () => {
	return (
		<>
			<Card className="d-block">
				<Card.Img
					className="card-img-top"
					src={cardImg1}
					alt="Card image cap"
				/>
				<Card.Body>
					<Card.Text as="h4">Card title</Card.Text>
					<Card.Text>Some quick example text to build on the card..</Card.Text>
				</Card.Body>

				<ListGroup variant="flush">
					<li className="list-group-item">Cras justo odio</li>
				</ListGroup>

				<Card.Body>
					<Card.Link href="#" className="text-custom">
						Card link
					</Card.Link>
					<Card.Link href="#" className="text-custom">
						Another link
					</Card.Link>
				</Card.Body>
			</Card>
		</>
	)
}

const CardWithImage3 = () => {
	return (
		<>
			<Card className="d-block">
				<Card.Img
					className="card-img-top"
					src={cardImg3}
					alt="Card image cap"
				/>
				<Card.Body>
					<Card.Text>
						Some quick example text to build on the card title and make up the
						bulk of the card's content. Some quick example text to build on the
						card title and make up.
					</Card.Text>
					<Link to="#" className="btn btn-primary">
						Button
					</Link>
				</Card.Body>
			</Card>
		</>
	)
}

const CardWithTitleAndImage = () => {
	return (
		<>
			<Card className="d-block">
				<Card.Body>
					<Card.Text as="h4">Card title</Card.Text>
					<Card.Subtitle as="h6" className="card-subtitle text-muted">
						Support card subtitle
					</Card.Subtitle>
				</Card.Body>
				<Card.Img className="img-fluid" src={cardImg4} alt="Card image cap" />
				<Card.Body>
					<Card.Text>
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</Card.Text>
					<Card.Link href="#" className="text-custom">
						Card link
					</Card.Link>
					<Card.Link href="#" className="text-custom">
						Another link
					</Card.Link>
				</Card.Body>
			</Card>
		</>
	)
}

const CardWithSpecialTitle = () => {
	return (
		<>
			<Card as={Card.Body}>
				<Card.Text as="h4">Special title treatment</Card.Text>
				<Card.Text>
					With supporting text below as a natural lead-in to additional content.
				</Card.Text>
				<Link to="#" className="btn btn-primary">
					Go somewhere
				</Link>
			</Card>
		</>
	)
}

const CardWithHeader = () => {
	return (
		<>
			<Card>
				<Card.Header as="h5" className="bg-light-subtle">
					Featured
				</Card.Header>
				<Card.Body>
					<Card.Title as="h5">Special title treatment</Card.Title>
					<Card.Text>
						With supporting text below as a natural lead-in to additional
						content.
					</Card.Text>
					<Link to="#" className="btn btn-primary">
						Go somewhere
					</Link>
				</Card.Body>
			</Card>
		</>
	)
}

const CardWithHeaderAndQuote = () => {
	return (
		<>
			<Card>
				<Card.Header className="bg-light-subtle">Quote</Card.Header>
				<Card.Body>
					<blockquote className="card-bodyquote">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
							posuere erat a ante.
						</p>
						<footer>
							Someone famous in <cite title="Source Title">Source Title</cite>
						</footer>
					</blockquote>
				</Card.Body>
			</Card>
		</>
	)
}

const CardWithHeaderAndFooter = () => {
	return (
		<>
			<Card>
				<Card.Header className="bg-light-subtle">Featured</Card.Header>
				<Card.Body>
					<Link to="#" className="btn btn-primary">
						Go somewhere
					</Link>
				</Card.Body>
				<div className="card-footer border-top border-light text-muted">
					2 days ago
				</div>
			</Card>
		</>
	)
}
const ColoredCards = () => {
	const colors = [...extendedColorVariants]
	const removeindex = colors.indexOf('light')

	if (removeindex !== -1) {
		colors.splice(removeindex, 3)
	}

	return (
		<>
			<Col lg={4} sm={6}>
				<Card className="text-bg-secondary">
					<Card.Body>
						<Card.Title as="h5" className="card-title">
							Special title treatment
						</Card.Title>
						<Card.Text>
							With supporting text below as a natural lead-in to additional
							content.
						</Card.Text>
						<Link to="#" className="btn btn-primary btn-sm">
							Button
						</Link>
					</Card.Body>
				</Card>
			</Col>
			{(colors || []).map((color, idx) => {
				return (
					<Col lg={4} sm={6} key={idx}>
						<Card className={`text-bg-primary bg-${color}`}>
							<Card.Body>
								<blockquote className="card-bodyquote">
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										Integer posuere erat a ante.
									</p>
									<footer>
										Someone famous in{' '}
										<cite title="Source Title">Source Title</cite>
									</footer>
								</blockquote>
							</Card.Body>
						</Card>
					</Col>
				)
			})}
		</>
	)
}
const BorderdCards = () => {
	return (
		<>
			{(colorVariants || []).slice(0, 3).map((item, idx) => {
				return (
					<Col md={4} key={idx}>
						<Card className={`border border-${item}`}>
							<Card.Body>
								<Card.Title as="h5">Special title treatment</Card.Title>
								<Card.Text>
									With supporting text below as a natural lead-in to additional
									content.
								</Card.Text>
								<Link to="#" className={`btn btn-${item} btn-sm`}>
									Button
								</Link>
							</Card.Body>
						</Card>
					</Col>
				)
			})}
		</>
	)
}

const HorizontalCards = () => {
	return (
		<>
			<Col lg={6}>
				<Card>
					<Row className="g-0 align-items-center">
						<Col md={4}>
							<Card.Img
								src={cardImg4}
								className="img-fluid rounded-start"
								alt="..."
							/>
						</Col>
						<Col md={8}>
							<Card.Body>
								<Card.Title as="h5" className="card-title">
									Card title
								</Card.Title>
								<Card.Text>
									This is a wider card with supporting text below as a natural
									lead-in to additional content. This content is a little bit
									longer.
								</Card.Text>
								<Card.Text>
									<small className="text-muted">Last updated 3 mins ago</small>
								</Card.Text>
							</Card.Body>
						</Col>
					</Row>
				</Card>
			</Col>
			<Col lg={6}>
				<Card>
					<Row className="g-0 align-items-center">
						<Col md={8}>
							<Card.Body>
								<Card.Title as="h5">Card title</Card.Title>
								<Card.Text>
									This is a wider card with supporting text below as a natural
									lead-in to additional content. This content is a little bit
									longer.
								</Card.Text>
								<Card.Text>
									<small className="text-muted">Last updated 3 mins ago</small>
								</Card.Text>
							</Card.Body>
						</Col>
						<Col md={4}>
							<Card.Img
								src={cardImg}
								className="img-fluid rounded-end"
								alt="..."
							/>
						</Col>
					</Row>
				</Card>
			</Col>
		</>
	)
}

const CardwithstretchedLink = () => {
	return (
		<>
			<Col sm={6} lg={3}>
				<Card>
					<Card.Img src={cardImg1} className="card-img-top" alt="..." />
					<Card.Body>
						<Card.Title as="h5">Card with stretched link</Card.Title>
						<Link to="#" className="btn btn-primary mt-2 stretched-link">
							Go somewhere
						</Link>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={6} lg={3}>
				<Card>
					<Card.Img src={cardImg3} className="card-img-top" alt="..." />
					<Card.Body>
						<Card.Title as="h5">
							<Link to="#" className="text-success stretched-link">
								Card with stretched link
							</Link>
						</Card.Title>
						<Card.Text>
							Some quick example text to build on the card up the bulk of the
							card's content.
						</Card.Text>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={6} lg={3}>
				<Card>
					<Card.Img src={cardImg4} className="card-img-top" alt="..." />
					<Card.Body>
						<Card.Title as="h5">Card with stretched link</Card.Title>
						<Link to="#" className="btn btn-info mt-2 stretched-link">
							Go somewhere
						</Link>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={6} lg={3}>
				<Card>
					<Card.Img src={cardImg} className="card-img-top" alt="..." />
					<Card.Body>
						<Card.Title as="h5">
							<Link to="#" className="stretched-link">
								Card with stretched link
							</Link>
						</Card.Title>
						<Card.Text>
							Some quick example text to build on the card up the bulk of the
							card's content.
						</Card.Text>
					</Card.Body>
				</Card>
			</Col>
		</>
	)
}

const CardWithGroup = ({ item }: { item: CardGroupDetailsTypes }) => {
	return (
		<>
			<Card className="d-block">
				<Card.Img
					className="card-img-top"
					src={item.image}
					alt="Card image cap"
				/>
				<Card.Body>
					<Card.Title as="h5" className="card-title">
						{item.title}
					</Card.Title>
					<Card.Text>{item.text}</Card.Text>
					<Card.Text>
						<small className="text-muted">{item.subtext}</small>
					</Card.Text>
				</Card.Body>
			</Card>
		</>
	)
}

const Cards = () => {
	const CardGroupDetails: CardGroupDetailsTypes[] = [
		{
			id: 1,
			image: cardImg,
			title: 'Card title',
			text: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
			subtext: 'Last updated 3 mins ago',
		},
		{
			id: 2,
			image: cardImg1,
			title: 'Card title',
			text: 'This card has supporting text below as a natural lead-in to additional content.',
			subtext: 'Last updated 3 mins ago',
		},
		{
			id: 3,
			image: cardImg3,
			title: 'Card title',
			text: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
			subtext: 'Last updated 3 mins ago',
		},
	]
	return (
		<>
			<PageBreadcrumb title="Cards" subName="Base UI" />
			<Row>
				<Col sm={6} lg={3}>
					<CardWithImage />
				</Col>

				<Col sm={6} lg={3}>
					<CardWithImage2 />
				</Col>

				<Col sm={6} lg={3}>
					<CardWithImage3 />
				</Col>
				<Col sm={6} lg={3}>
					<CardWithTitleAndImage />
				</Col>
			</Row>

			<Row>
				<Col sm={6}>
					<CardWithSpecialTitle />
				</Col>
				<Col sm={6}>
					<CardWithSpecialTitle />
				</Col>
			</Row>

			<Row>
				<Col md={4}>
					<CardWithHeader />
				</Col>
				<Col md={4}>
					<CardWithHeaderAndQuote />
				</Col>
				<Col md={4}>
					<CardWithHeaderAndFooter />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4 mt-2">Card Colored</h4>
				</Col>
			</Row>
			<Row>
				<ColoredCards />
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4 mt-2">Card Bordered</h4>
				</Col>
			</Row>
			<Row>
				<BorderdCards />
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4 mt-2">Horizontal Card</h4>
				</Col>
			</Row>
			<Row>
				<HorizontalCards />
			</Row>

			<Row>
				<Col xs={12} className="col-12">
					<h4 className="mb-4 mt-2">Stretched link</h4>
				</Col>
			</Row>
			<Row>
				<CardwithstretchedLink />
			</Row>

			<Row>
				<Col xs={12}>
					<h4 className="mb-4 mt-2">Card Group</h4>
					<CardGroup>
						{(CardGroupDetails || []).map((item, idx) => (
							<CardWithGroup item={item} key={idx} />
						))}
					</CardGroup>
				</Col>
			</Row>
		</>
	)
}

export default Cards
