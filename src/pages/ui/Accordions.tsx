import { Accordion, Card, Col, Row } from 'react-bootstrap'

// Components
import { PageBreadcrumb } from '@/components'

const Accordions = () => {
	return (
		<>
			<PageBreadcrumb title="Accordions" subName="Base UI" />
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Default Accordions</h4>
							<p className="text-muted mb-0">
								Click the accordions below to expand/collapse the accordion
								content.
							</p>
						</Card.Header>
						<Card.Body>
							<Accordion defaultActiveKey="0">
								<Accordion.Item eventKey="1">
									<Accordion.Header as="h2">Accordion Item #1</Accordion.Header>
									<Accordion.Body>
										<strong>This is the first item's accordion body.</strong> It
										is shown by default, until the collapse plugin adds the
										appropriate classes that we use to style each element. These
										classes control the overall appearance, as well as the
										showing and hiding via CSS transitions. You can modify any
										of this with custom CSS or overriding our default variables.
										It's also worth noting that just about any HTML can go
										within the <code>.accordion-body</code>, though the
										transition does limit overflow.
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="2">
									<Accordion.Header as="h2">Accordion Item #2</Accordion.Header>
									<Accordion.Body>
										<strong>This is the first item's accordion body.</strong> It
										is shown by default, until the collapse plugin adds the
										appropriate classes that we use to style each element. These
										classes control the overall appearance, as well as the
										showing and hiding via CSS transitions. You can modify any
										of this with custom CSS or overriding our default variables.
										It's also worth noting that just about any HTML can go
										within the <code>.accordion-body</code>, though the
										transition does limit overflow.
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="3">
									<Accordion.Header as="h2">Accordion Item #3</Accordion.Header>
									<Accordion.Body>
										<strong>This is the first item's accordion body.</strong> It
										is shown by default, until the collapse plugin adds the
										appropriate classes that we use to style each element. These
										classes control the overall appearance, as well as the
										showing and hiding via CSS transitions. You can modify any
										of this with custom CSS or overriding our default variables.
										It's also worth noting that just about any HTML can go
										within the <code>.accordion-body</code>, though the
										transition does limit overflow.
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Flush Accordions</h4>
							<p className="text-muted mb-0">
								Add <code>.accordion-flush</code> to remove the default{' '}
								<code>background-color</code>, some borders, and some rounded
								corners to render accordions edge-to-edge with their parent
								container.
							</p>
						</Card.Header>
						<Card.Body>
							<Accordion flush defaultActiveKey="0">
								<Accordion.Item eventKey="1">
									<Accordion.Header as="h2">Accordion Item #1</Accordion.Header>
									<Accordion.Body className="accordion-body">
										Placeholder content for this accordion, which is intended to
										demonstrate the
										<code>.accordion-flush</code> class. This is the first
										item's accordion body.
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="2">
									<Accordion.Header as="h2">Accordion Item #2</Accordion.Header>
									<Accordion.Body className="accordion-body">
										Placeholder content for this accordion, which is intended to
										demonstrate the
										<code>.accordion-flush</code> class. This is the first
										item's accordion body.
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="3">
									<Accordion.Header as="h2">Accordion Item #3</Accordion.Header>
									<Accordion.Body className="accordion-body">
										Placeholder content for this accordion, which is intended to
										demonstrate the
										<code>.accordion-flush</code> class. This is the first
										item's accordion body.
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Simple Card Accordions</h4>
							<p className="text-muted mb-0">
								Using the card component, you can extend the default collapse
								behavior to create an accordion. To properly achieve the
								accordion style, be sure to use <code>.accordion</code> as a
								wrapper.
							</p>
						</Card.Header>
						<Card.Body>
							<Accordion defaultActiveKey="1" flush>
								<Card as={Accordion.Item} eventKey="1" className="mb-0">
									<Card.Header as={Accordion.Header} className="p-0">
										<h5 className="m-0">
											<a className="text-reset d-block" href="#CardcollapseOne">
												Collapsible Group Item #1
											</a>
										</h5>
									</Card.Header>
									<Accordion.Body aria-labelledby="CardheadingOne">
										<Card.Body className="pt-0">
											Anim pariatur cliche reprehenderit, enim eiusmod high life
											accusamus terry richardson ad squid. 3 wolf moon officia
											aute, non cupidatat skateboard dolor brunch. Food truck
											quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
											tempor, sunt aliqua put a bird on it squid single-origin
											coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
											helvetica, craft beer labore wes anderson cred nesciunt
											sapiente ea proident. Ad vegan excepteur butcher vice
											lomo. Leggings occaecat craft beer farm-to-table, raw
											denim aesthetic synth nesciunt you probably haven't heard
											of them accusamus labore sustainable VHS.
										</Card.Body>
									</Accordion.Body>
								</Card>
								<Card as={Accordion.Item} eventKey="2" className="mb-0">
									<Card.Header as={Accordion.Header} className="p-0">
										<h5 className="m-0">
											<a className="text-reset d-block" href="#CardcollapseTwo">
												Collapsible Group Item #2
											</a>
										</h5>
									</Card.Header>
									<Accordion.Body>
										<Card.Body className="pt-0">
											Anim pariatur cliche reprehenderit, enim eiusmod high life
											accusamus terry richardson ad squid. 3 wolf moon officia
											aute, non cupidatat skateboard dolor brunch. Food truck
											quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
											tempor, sunt aliqua put a bird on it squid single-origin
											coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
											helvetica, craft beer labore wes anderson cred nesciunt
											sapiente ea proident. Ad vegan excepteur butcher vice
											lomo. Leggings occaecat craft beer farm-to-table, raw
											denim aesthetic synth nesciunt you probably haven't heard
											of them accusamus labore sustainable VHS.
										</Card.Body>
									</Accordion.Body>
								</Card>
								<Card as={Accordion.Item} eventKey="3" className="mb-0">
									<Card.Header as={Accordion.Header} className="p-0">
										<h5 className="m-0">
											<a
												className="text-reset d-block"
												href="#CardcollapseThree"
											>
												Collapsible Group Item #3
											</a>
										</h5>
									</Card.Header>
									<Accordion.Body>
										<Card.Body className="pt-0">
											Anim pariatur cliche reprehenderit, enim eiusmod high life
											accusamus terry richardson ad squid. 3 wolf moon officia
											aute, non cupidatat skateboard dolor brunch. Food truck
											quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
											tempor, sunt aliqua put a bird on it squid single-origin
											coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
											helvetica, craft beer labore wes anderson cred nesciunt
											sapiente ea proident. Ad vegan excepteur butcher vice
											lomo. Leggings occaecat craft beer farm-to-table, raw
											denim aesthetic synth nesciunt you probably haven't heard
											of them accusamus labore sustainable VHS.
										</Card.Body>
									</Accordion.Body>
								</Card>
							</Accordion>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Always Open Accordions</h4>
							<p className="text-muted mb-0">
								Omit the <code>data-bs-parent</code> attribute on each{' '}
								<code>.accordion-collapse</code> to make accordion items stay
								open when another item is opened.
							</p>
						</Card.Header>
						<Card.Body>
							<Accordion defaultActiveKey="1">
								<Accordion.Item eventKey="1">
									<Accordion.Header as="h2">Accordion Item #1</Accordion.Header>
									<Accordion.Body>
										<strong>This is the first item's accordion body.</strong> It
										is shown by default, until the collapse plugin adds the
										appropriate classes that we use to style each element. These
										classes control the overall appearance, as well as the
										showing and hiding via CSS transitions. You can modify any
										of this with custom CSS or overriding our default variables.
										It's also worth noting that just about any HTML can go
										within the <code>.accordion-body</code>, though the
										transition does limit overflow.
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="2">
									<Accordion.Header as="h2">Accordion Item #2</Accordion.Header>
									<Accordion.Body>
										<strong>This is the first item's accordion body.</strong> It
										is shown by default, until the collapse plugin adds the
										appropriate classes that we use to style each element. These
										classes control the overall appearance, as well as the
										showing and hiding via CSS transitions. You can modify any
										of this with custom CSS or overriding our default variables.
										It's also worth noting that just about any HTML can go
										within the <code>.accordion-body</code>, though the
										transition does limit overflow.
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="3">
									<Accordion.Header as="h2">Accordion Item #3</Accordion.Header>
									<Accordion.Body>
										<strong>This is the first item's accordion body.</strong> It
										is shown by default, until the collapse plugin adds the
										appropriate classes that we use to style each element. These
										classes control the overall appearance, as well as the
										showing and hiding via CSS transitions. You can modify any
										of this with custom CSS or overriding our default variables.
										It's also worth noting that just about any HTML can go
										within the <code>.accordion-body</code>, though the
										transition does limit overflow.
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Accordions
