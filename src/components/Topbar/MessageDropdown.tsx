import { useState } from 'react'
import { Card, Col, Dropdown, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { MessageItem } from '@/Layouts/Topbar'

interface MessageDropDownProps {
	messages: Array<MessageItem>
}
const MessageDropdown = ({ messages }: MessageDropDownProps) => {
	const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)

	/**
	 * Toggles the notification dropdown
	 */
	const toggleDropDown = () => {
		setDropDownOpen(!dropDownOpen)
	}

	/**
	 * Get time since
	 */
	function timeSince(date: Date) {
		if (typeof date !== 'object') {
			date = new Date(date)
		}

		var seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000)
		var intervalType: string

		var interval = Math.floor(seconds / 31536000)
		if (interval >= 1) {
			intervalType = 'year'
		} else {
			interval = Math.floor(seconds / 2592000)
			if (interval >= 1) {
				intervalType = 'month'
			} else {
				interval = Math.floor(seconds / 86400)
				if (interval >= 1) {
					intervalType = 'day'
				} else {
					interval = Math.floor(seconds / 3600)
					if (interval >= 1) {
						intervalType = 'hour'
					} else {
						interval = Math.floor(seconds / 60)
						if (interval >= 1) {
							intervalType = 'minute'
						} else {
							interval = seconds
							intervalType = 'second'
						}
					}
				}
			}
		}
		if (interval > 1 || interval === 0) {
			intervalType += 's'
		}
		return interval + ' ' + intervalType + ' ago'
	}
	return (
		<>
			<Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
				<Dropdown.Toggle
					as="a"
					className="nav-link dropdown-toggle arrow-none"
					role="button"
					onClick={toggleDropDown}
				>
					<i className="ri-mail-line fs-22" />
					<span className="noti-icon-badge badge text-bg-purple">4</span>
				</Dropdown.Toggle>
				<Dropdown.Menu
					align="end"
					className="dropdown-menu-animated dropdown-lg py-0"
				>
					<div
						className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border"
						onClick={toggleDropDown}
					>
						<Row className="align-items-center">
							<Col>
								<h6 className="m-0 fs-16 fw-semibold"> Messages</h6>
							</Col>
							<div className="col-auto">
								<Link to="#" className="text-dark text-decoration-underline">
									<small>Clear All</small>
								</Link>
							</div>
						</Row>
					</div>
					<SimpleBar style={{ maxHeight: 300 }}>
						{/* item*/}
						{(messages || []).map((message, idx) => {
							return (
								<Link
									key={idx}
									to=""
									className="dropdown-item p-0 notify-item read-noti card m-0 shadow-none"
								>
									<Card.Body>
										<div className="d-flex align-items-center">
											<div className="flex-shrink-0">
												<div className="notify-icon">
													<Image
														src={message.avatar}
														className="img-fluid rounded-circle"
														alt=""
													/>
												</div>
											</div>
											<div className="flex-grow-1 text-truncate ms-2">
												<h5 className="noti-item-title fw-semibold fs-14">
													{message.name}{' '}
													<small className="fw-normal text-muted float-end ms-1">
														{timeSince(message.createdAt)}
													</small>
												</h5>
												<small className="noti-item-subtitle text-muted">
													{message.subText}
												</small>
											</div>
										</div>
									</Card.Body>
								</Link>
							)
						})}
					</SimpleBar>
					{/* All*/}
					<Link
						to="#"
						className="dropdown-item text-center text-primary text-decoration-underline fw-bold notify-item border-top border-light py-2"
					>
						View All
					</Link>
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
}

export default MessageDropdown
