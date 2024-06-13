import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

// data
import { remixIconsList } from './data'

// component
import PageBreadcrumb from '@/components/PageBreadcrumb'

const RemixIcons = () => {
	let headings: any[] = []
	headings.push(Object.keys(remixIconsList[0]))

	return (
		<>
			<PageBreadcrumb title="Remix Icons" subName="Icons" />
			<Row>
				<Col>
					{(headings[0] || []).map((heading: any, idx: number) => {
						return (
							<Card key={heading + idx}>
								<Card.Body>
									<Card.Title as="h5">{heading}</Card.Title>
									<p className="text-muted mb-2">
										Use{' '}
										<code>
											&lt;i class=&quot;ri-home-line&quot;&gt;&lt;/i&gt;
										</code>{' '}
										or{' '}
										<code>
											&lt;i class=&quot;ri-home-fill&quot;&gt;&lt;/i&gt;
										</code>
									</p>
									<Row className="icons-list-demo" id="icons">
										{heading !== 'Editor'
											? remixIconsList[0][heading].map(
													(icon: string, idx: number) => {
														return (
															<React.Fragment key={idx}>
																<Col xl={3} lg={4} sm={6}>
																	<i className={`ri-${icon}-line`} />
																	&nbsp;<span>ri-{icon}-line</span>
																</Col>
																<Col xl={3} lg={4} sm={6}>
																	<i className={`ri-${icon}-fill`} />
																	&nbsp;<span>ri-{icon}-fill</span>
																</Col>
															</React.Fragment>
														)
													}
											  )
											: (remixIconsList[0]['Editor'] || []).map(
													(icon: string, idx: number) => {
														return (
															<Col xl={3} lg={4} sm={6} key={icon + idx}>
																<i className={`ri-${icon}`} />
																&nbsp;<span>ri-{icon}</span>
															</Col>
														)
													}
											  )}
									</Row>
								</Card.Body>
							</Card>
						)
					})}
				</Col>
			</Row>
		</>
	)
}

export default RemixIcons
