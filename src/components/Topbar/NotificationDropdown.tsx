import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { NotificationItem } from '@/Layouts/Topbar'
import SimpleBar from 'simplebar-react'

interface NotificationDropDownProps {
	notifications: Array<NotificationItem>
}
const NotificationDropdown = ({ notifications }: NotificationDropDownProps) => {
	const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)

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

	/**
	 * Toggles the notification dropdown
	 */
	const toggleDropDown = () => {
		setDropDownOpen(!dropDownOpen)
	}

	// return (
	// 	<Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
	// 		<Dropdown.Toggle
	// 			as="a"
	// 			className="nav-link arrow-none"
	// 			data-bs-toggle="dropdown"
	// 			role="button"
	// 			onClick={toggleDropDown}
	// 		>
	// 			<i className="ri-notification-3-line fs-22" />
	// 			<span className="noti-icon-badge badge text-bg-pink">3</span>
	// 		</Dropdown.Toggle>
	// 		<Dropdown.Menu
	// 			align="end"
	// 			className="dropdown-menu-animated dropdown-lg py-0"
	// 		>
	// 			<div
	// 				className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border"
	// 				onClick={toggleDropDown}
	// 			>
	// 				<div className="row align-items-center">
	// 					<div className="col">
	// 						<h6 className="m-0 fs-16 fw-semibold"> Notification</h6>
	// 					</div>
	// 					<div className="col-auto">
	// 						<Link to="#" className="text-dark text-decoration-underline">
	// 							<small>Clear All</small>
	// 						</Link>
	// 					</div>
	// 				</div>
	// 			</div>
	// 			<SimpleBar style={{ maxHeight: 300 }}>

	// 				{(notifications || []).map((notification, idx) => {
	// 					return (
	// 						<Link key={idx} to="" className="dropdown-item notify-item">
	// 							<div
	// 								className={`notify-icon bg-${notification.variant}-subtle`}
	// 							>
	// 								<i
	// 									className={`${notification.icon} text-${notification.variant}`}
	// 								/>
	// 							</div>
	// 							<p className="notify-details">
	// 								{notification.title}
	// 								<small className="noti-time">
	// 									{timeSince(notification.createdAt)}
	// 								</small>
	// 							</p>
	// 						</Link>
	// 					)
	// 				})}
	// 			</SimpleBar>
	// 			<Link
	// 				to="#"
	// 				className="dropdown-item text-center text-primary text-decoration-underline fw-bold notify-item border-top border-light py-2"
	// 			>
	// 				View All
	// 			</Link>
	// 		</Dropdown.Menu>
	// 	</Dropdown>
	// )
}

export default NotificationDropdown
