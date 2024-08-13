import { Link } from 'react-router-dom'

//images
import logo from '@/assets/images/logo.png'
import logoDark from '@/assets/images/logo-dark.png'
import logoSm from '@/assets/images/logo-sm.png'
import { getMenuItems, getSwitchMenuItems } from '@/common'
import AppMenu from './Menu'
import SimpleBar from 'simplebar-react'

/* Sidebar content */
const SideBaradminContent = () => {
	return (
		<>
			<AppMenu menuItems={getMenuItems()} />
			<div className="clearfix" />
		</>
	)
}
const SideBaruserContent = () => {
	return (
		<>
			<AppMenu menuItems={getSwitchMenuItems()} />
			<div className="clearfix" />
		</>
	)
}
const LeftSidebar = () => {

	const currentUrl = window.location.href;

	return (
		<>
			<div className="leftside-menu">
				{/* Brand Logo Light */}
				<Link to="/" className="logo logo-light">
					<span className="logo-lg" >
						<img src={logo} style={{ width: '86%', height: 'auto', padding: '10px' }} alt="logo" />
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</Link>
				{/* Brand Logo Dark */}
				<a href="index.html" className="logo logo-dark">
					<span className="logo-lg">
						<img src={logoDark} alt="dark logo" style={{ height: '50px' }} />
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</a>
				{/* Sidebar -left */}
				<SimpleBar
					className="h-100"
					id="leftside-menu-container"
					data-simplebar=""
				>
					{/*- Sidemenu */}


					{
						 ( currentUrl === 'http://localhost:3000/pages/Module-list') || ( currentUrl === 'http://localhost:3000/pages/MyTask') ? <SideBaruserContent /> : <SideBaradminContent />
					}



					{/*- End Sidemenu */}
					<div className="clearfix" />
				</SimpleBar>
			</div>
		</>
	)
}

export default LeftSidebar
