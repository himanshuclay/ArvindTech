import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row } from 'react-bootstrap'

//images
import img1 from '@/assets/images/small/small-1.jpg'
import img2 from '@/assets/images/small/small-2.jpg'
import img3 from '@/assets/images/small/small-3.jpg'

// components
import { PageBreadcrumb } from '@/components'

interface TimelineData {
	[key: string]: {
		date: string
		time: string
		text: string
		images?: string[]
		variant?: string
	}[]
}
const Timeline = () => {
	const timelineData: TimelineData = {
		Today: [
			{
				date: '1 hour ago',
				time: '08:25 am',
				text: 'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
			},
			{
				date: '2 hours ago',
				time: '08:25 am',
				text: 'consectetur adipisicing elit. Iusto, optio, dolorum John deon provident rerum aut hic quasi placeat iure tempora laudantium',
				variant: 'success',
			},
			{
				date: '10 hours ago',
				time: '08:25 am',
				text: '3 new photo Uploaded on facebook fan page',
				images: [img1, img2, img3],
				variant: 'primary',
			},
			{
				date: '14 hours ago',
				time: '08:25 am',
				text: 'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson regarding to setup a new show room.',
				variant: 'purple',
			},
			{
				date: '19 hours ago',
				time: '08:25 am',
				text: 'Jonatha Smith added new milestone crishtianLorem ipsum dolor sit amet consiquest dio',
			},
		],
		Yesterday: [
			{
				date: '07 January 2018',
				time: '08:25 am',
				text: 'Montly Regular Medical check up at Greenland Hospital by the doctor Johm meon',
				variant: 'warning',
			},
			{
				date: '07 January 2018',
				time: '08:25 am',
				text: 'Download the new updates of Valonic admin dashboard',
				variant: 'primary',
			},
			{
				date: '07 January 2018',
				time: '08:25 am',
				text: 'Jonatha Smith added new milestone crishtianLorem ipsum dolor sit amet consiquest dio',
				variant: 'success',
			},
		],
		LastMonth: [
			{
				date: '31 December 2015',
				time: '08:25 am',
				text: 'Download the new updates of Velonic admin dashboard',
			},
			{
				date: '16 Decembar 2015',
				time: '08:25 am',
				text: 'Jonatha Smith added new milestone prankLorem ipsum dolor sit amet consiquest dio',
				variant: 'danger',
			},
		],
	}
	return (
		<>
			<PageBreadcrumb title="Timeline" subName="Pages" />
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<div className="timeline" dir="ltr">
								{Object.keys(timelineData).map((day, idx) => {
									return (
										<React.Fragment key={idx}>
											<article className="timeline-item alt">
												<div className="text-end">
													<div className="time-show first">
														<Link to="#" className="btn btn-primary w-lg">
															{day}
														</Link>
													</div>
												</div>
											</article>
											{(timelineData[day] || []).map((item, idx) => {
												return idx % 2 === 0 ? (
													<article className="timeline-item alt" key={idx}>
														<div className="timeline-desk">
															<div className="panel">
																<div className="timeline-box">
																	<span className="arrow-alt"></span>
																	<span
																		className={`timeline-icon ${
																			item.variant ? `bg-${item.variant}` : ''
																		}`}
																	>
																		<i className="ri-record-circle-line"></i>
																	</span>
																	<h4
																		className={`fs-16 fw-semibold ${
																			item.variant ? `text-${item.variant}` : ''
																		}`}
																	>
																		{item.date}
																	</h4>
																	<p className="timeline-date text-muted">
																		<small>{item.time}</small>
																	</p>
																	<p>{item.text} </p>
																	{item.images && (
																		<React.Fragment>
																			<div className="album">
																				{(item.images || []).map((img, idx) => {
																					return (
																						<Link to="#" key={idx}>
																							<img alt="" src={img} />
																						</Link>
																					)
																				})}
																			</div>
																			<div className="clearfix" />
																		</React.Fragment>
																	)}
																</div>
															</div>
														</div>
													</article>
												) : (
													<article key={idx} className="timeline-item">
														<div className="timeline-desk">
															<div className="panel">
																<div className="timeline-box">
																	<span className="arrow"></span>
																	<span
																		className={`timeline-icon ${
																			item.variant ? `bg-${item.variant}` : ''
																		}`}
																	>
																		<i className="ri-record-circle-line"></i>
																	</span>
																	<h4
																		className={`fs-16 fw-semibold ${
																			item.variant ? `text-${item.variant}` : ''
																		}`}
																	>
																		{item.date}
																	</h4>
																	<p className="timeline-date text-muted">
																		<small>{item.time}</small>
																	</p>
																	<p>{item.text}</p>
																	{item.images && (
																		<React.Fragment>
																			<div className="album">
																				{(item.images || []).map((img, idx) => {
																					return (
																						<Link to="#" key={idx}>
																							<img alt="" src={img} />
																						</Link>
																					)
																				})}
																			</div>
																			<div className="clearfix" />
																		</React.Fragment>
																	)}
																</div>
															</div>
														</div>
													</article>
												)
											})}
										</React.Fragment>
									)
								})}
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<Card>
						<div className="card-body">
							<div className="timeline timeline-left">
								{Object.keys(timelineData)
									.slice(0, 1)
									.map((day, idx) => {
										return (
											<React.Fragment key={idx}>
												<article className="timeline-item alt">
													<div className="text-start">
														<div className="time-show first">
															<Link to="#" className="btn btn-primary w-lg">
																{day}
															</Link>
														</div>
													</div>
												</article>
												{(timelineData[day] || []).map((item, idx) => {
													return (
														<article key={idx} className="timeline-item">
															<div className="timeline-desk">
																<div className="panel">
																	<div className="timeline-box">
																		<span className="arrow"></span>
																		<span
																			className={`timeline-icon ${
																				item.variant ? `bg-${item.variant}` : ''
																			}`}
																		>
																			<i className="ri-record-circle-line"></i>
																		</span>
																		<h4
																			className={`fs-16 fw-semibold ${
																				item.variant
																					? `text-${item.variant}`
																					: ''
																			}`}
																		>
																			{item.date}
																		</h4>
																		<p className="timeline-date text-muted">
																			<small>{item.time}</small>
																		</p>
																		<p>{item.text}</p>
																		{item.images && (
																			<React.Fragment>
																				<div className="album">
																					{(item.images || []).map(
																						(img, idx) => {
																							return (
																								<Link to="#" key={idx}>
																									<img alt="" src={img} />
																								</Link>
																							)
																						}
																					)}
																				</div>
																				<div className="clearfix" />
																			</React.Fragment>
																		)}
																	</div>
																</div>
															</div>
														</article>
													)
												})}
											</React.Fragment>
										)
									})}
							</div>
						</div>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Timeline
