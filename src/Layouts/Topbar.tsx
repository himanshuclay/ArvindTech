import { Image } from 'react-bootstrap'
import { ThemeSettings, useThemeContext } from '@/common'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

// assets
import logo from '@/assets/images/logo.png'
import logoSm from '@/assets/images/logo-sm.png'
import logoDark from '@/assets/images/logo-dark.png'
import profilePic from '@/assets/images/avatar.png'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'

// components
import {
	LanguageDropdown,
	MessageDropdown,
	// NotificationDropdown,
	ProfileDropdown,
	SearchDropDown,
} from '@/components'
import { useThemeCustomizer } from '@/components'
import { useViewport } from '@/hooks'
/**
 * for subtraction minutes
 */
function subtractHours(date: Date, minutes: number) {
	date.setMinutes(date.getMinutes() - minutes)
	return date
}
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
const Messages: MessageItem[] = [
	{
		id: 1,
		name: 'Cristina Pride',
		subText: 'Hi, How are you? What about our next meeting',
		avatar: avatar1,
		createdAt: subtractHours(new Date(), 1440),
	},
	{
		id: 2,
		name: 'Sam Garret',
		subText: 'Yeah everything is fine',
		avatar: avatar2,
		createdAt: subtractHours(new Date(), 2880),
	},
	{
		id: 3,
		name: 'Karen Robinson',
		subText: "Wow that's great",
		avatar: avatar3,
		createdAt: subtractHours(new Date(), 2880),
	},
	{
		id: 4,
		name: 'Sherry Marshall',
		subText: 'Hi, How are you? What about our next meeting',
		avatar: avatar4,
		createdAt: subtractHours(new Date(), 4320),
	},
	{
		id: 5,
		name: 'Shawn Millard',
		subText: 'Yeah everything is fine',
		avatar: avatar5,
		createdAt: subtractHours(new Date(), 5760),
	},
]


const profileMenus: ProfileOption[] = [
	{
		label: 'MyProfile',
		icon: 'ri-customer-service-2-line',
		redirectTo: '/pages/faq',
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
	const [empID, setEmpID] =  useState<string | null>('Admin')

	// Fetch employee name from localStorage when component mounts
	useEffect(() => {
		const storedEmpName = localStorage.getItem('EmpName')
		const storedEmpID = localStorage.getItem('EmpId')
		if (storedEmpName || storedEmpID) {
			setEmpName(storedEmpName)
			setEmpID(storedEmpID)
		}
	}, [])
	/**
	 * Toggle Dark Mode
	 */
	// const toggleDarkMode = () => {
	// 	if (settings.theme === 'dark') {
	// 		updateSettings({ theme: ThemeSettings.theme.light })
	// 	} else {
	// 		updateSettings({ theme: ThemeSettings.theme.dark })
	// 	}
	// }

	// const handleRightSideBar = () => {
	// 	updateSettings({ rightSidebar: ThemeSettings.rightSidebar.show })
	// }
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
						{/* Topbar Search Form */}
						{/* <div className="app-search d-none d-lg-block">
							<form>
								<div className="input-group">
									<input
										type="search"
										className="form-control"
										placeholder="Search..."
									/>
									<span className="ri-search-line search-icon text-muted" />
								</div>
							</form>
						</div> */}
					</div>
					<ul className="topbar-menu d-flex align-items-center gap-3">
						<li className="dropdown d-lg-none">
							<SearchDropDown />
						</li>
						<li className="dropdown">
							<LanguageDropdown />
						</li>
						<li className="dropdown notification-list">
							<MessageDropdown messages={Messages} />
						</li>


						<li className="dropdown">
							<ProfileDropdown
								menuItems={profileMenus}
								userImage={profilePic}
								username={empName || 'Guest'} // Provide a fallback value
								userid={empID || 'Guest ID'} // Provide a fallback value
							/>
						</li>
					</ul>
				</div>
			</div>
		</>
	)
}

export default Topbar