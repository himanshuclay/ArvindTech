import { Image } from 'react-bootstrap'
import { ThemeSettings, useCommonContext, useThemeContext } from '@/common'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

// assets
import logo from '@/assets/images/logo.png'
import logoSm from '@/assets/images/logo-sm.png'
import logoDark from '@/assets/images/Clayimage.png'
import profilePic from '@/assets/images/avatar.png'


// components
import {
	ProfileDropdown,
} from '@/components'
import { useThemeCustomizer } from '@/components'
import { useViewport } from '@/hooks'
import axios from 'axios'
import config from '@/config'
/**
 * for subtraction minutes
 */
export interface MessageItem {
	id: number
	name: string
	subText: string
	avatar: string
	createdAt: Date
}

export interface NotificationItem {
	id: number
	title: string
	icon: string
	variant: string
	createdAt: Date
}

export interface ProfileOption {
	label: string
	icon: string
	redirectTo: string
}


const profileMenus: ProfileOption[] = [
	{
		label: 'MyProfile',
		icon: 'ri-customer-service-2-line',
		redirectTo: '/pages/profile',
	},
	// {
	// 	label: 'My Account',
	// 	icon: 'mdi mdi-account-plus',
	// 	redirectTo: '/pages/profile',
	// },

	// {
	// 	label: 'Settings',
	// 	icon: 'ri-settings-4-line',
	// 	redirectTo: '/pages/profile',
	// },

	// {
	// 	label: 'Lock Screen',
	// 	icon: 'ri-lock-password-line',
	// 	redirectTo: '/auth/lock-screen',
	// },
	{
		label: 'Logout',
		icon: 'ri-logout-box-line',
		redirectTo: '/auth/logout',
	},
]

type TopbarProps = {
	topbarDark?: boolean
	toggleMenu?: () => void
	navOpen?: boolean
}
const Topbar = ({ toggleMenu, navOpen }: TopbarProps) => {
	const { unreadCount, setUnreadCount } = useCommonContext()
	const { sideBarType } = useThemeCustomizer()
	const { width } = useViewport()

	/**
	 * Toggle the leftmenu when having mobile screen
	 */

	const handleLeftMenuCallBack = () => {
		if (width < 768) {
			if (sideBarType === 'full') {
				showLeftSideBarBackdrop()
				document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
			} else {
				updateSidebar({ size: ThemeSettings.sidebar.size.full })
			}
		} else if (sideBarType === 'condensed') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
		} else if (sideBarType === 'full') {
			showLeftSideBarBackdrop()
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
		} else if (sideBarType === 'fullscreen') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
		} else {
			updateSidebar({ size: ThemeSettings.sidebar.size.condensed })
		}
	}

	/**
	 * creates backdrop for leftsidebar
	 */
	function showLeftSideBarBackdrop() {
		const backdrop = document.createElement('div')
		backdrop.id = 'custom-backdrop'
		backdrop.className = 'offcanvas-backdrop fade show'
		document.body.appendChild(backdrop)

		backdrop.addEventListener('click', function () {
			document
				.getElementsByTagName('html')[0]
				.classList.remove('sidebar-enable')
			hideLeftSideBarBackdrop()
		})
	}

	function hideLeftSideBarBackdrop() {
		const backdrop = document.getElementById('custom-backdrop')
		if (backdrop) {
			document.body.removeChild(backdrop)
			document.body.style.removeProperty('overflow')
		}
	}
	const { updateSidebar } = useThemeContext()
	// State to store the employee name
	const [empName, setEmpName] = useState<string | null>('Admin')
	const [empID, setEmpID] = useState<string | null>('Admin')

	// Fetch employee name from localStorage when component mounts
	useEffect(() => {
		const storedEmpName = localStorage.getItem('EmpName')
		const storedEmpID = localStorage.getItem('EmpId')
		if (storedEmpName || storedEmpID) {
			setEmpName(storedEmpName)
			setEmpID(storedEmpID)
		}
	}, [])

	useEffect(() => {
		const fetchNotificationCount = async () => {
			try {
				const doerID = localStorage.getItem('EmpId') // fallback if missing
				const response = await axios.get(`${config.API_URL_APPLICATION}/NotificationMaster/GetNotificationCount?DoerID=${doerID}`)

				if (response.data && response.data.isSuccess) {
					setUnreadCount(response.data.unread)
				} else {
					console.warn('Failed to fetch notification count:', response.data.message)
				}
			} catch (error) {
				console.error('Error fetching notification count:', error)
			}
		}

		// Initial fetch
		fetchNotificationCount()

		// Interval for polling every 10 seconds
		const intervalId = setInterval(() => {
			fetchNotificationCount()
		}, 15000)

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId)
	}, [])

	return (
		<>
			<div className="navbar-custom">
				<div className="topbar container-fluid">
					<div className="d-flex align-items-center gap-1">
						{/* Topbar Brand Logo */}
						<div className="logo-topbar">
							{/* Logo light */}
							<Link to="/" className="logo-light">
								<span className="logo-lg">
									<Image src={logo} alt="logo" />
								</span>
								<span className="logo-sm">
									<Image src={logoSm} alt="small logo" />
								</span>
							</Link>
							{/* Logo Dark */}
							<Link to="/" className="logo-dark">
								<span className="logo-lg">
									<img src={logoDark} alt="dark logo" style={{ height: '50px' }} />
								</span>
								<span className="logo-sm">
									<img src={logoSm} alt="small logo" />
								</span>
							</Link>
						</div>
						{/* Sidebar Menu Toggle Button */}
						<button
							className="button-toggle-menu"
							onClick={handleLeftMenuCallBack}
						>
							<i className="ri-menu-line" />
						</button>
						{/* Horizontal Menu Toggle Button */}
						<button
							className={`navbar-toggle ${navOpen ? 'open' : ''}`}
							data-bs-toggle="collapse"
							data-bs-target="#topnav-menu-content"
							onClick={toggleMenu}
						>
							<div className="lines">
								<span />
								<span />
								<span />
							</div>
						</button>
					</div>
					<ul className="topbar-menu d-flex align-items-center gap-3">

						<li className="position-relative notification-bell me-3">
							<Link to={"/pages/NotificationPage"}>
								<i className="text-primary fs-2 ri-notification-line"></i>
								{unreadCount !== 0 && <div className='position-absolute counter-bell'>{unreadCount}</div>}

							</Link>

						</li>


						<li className="dropdown">
							<ProfileDropdown
								menuItems={profileMenus}
								userImage={profilePic}
								username={empName || 'Guest'}
								userid={empID || 'Guest ID'}
							/>
						</li>
					</ul>
				</div>
			</div>
		</>
	)
}

export default Topbar