import React, {
	FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Link, useLocation } from 'react-router-dom'

// constants
import { MenuItemTypes } from '@/constants/menu'

// helpers
import { findAllParent, findMenuItem } from '@/common'

interface MenuItemsProps {
	item: MenuItemTypes
	tag?: string
	linkClassName?: string
	className?: string
	subMenuClassNames?: string
	activeMenuItems?: string[]
	toggleMenu?: (item: any, status: boolean) => void
}

const MenuItemWithChildren = ({
	item,
	tag,
	linkClassName,
	className,
	subMenuClassNames,
	activeMenuItems,
	toggleMenu,
}: MenuItemsProps) => {
	const Tag: any = tag

	const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key))

	const showMenu = window.screen.width <= 991 && open

	// const hasChild = item.children && (item.children || []).filter(
	//   (child) => child.children?.length && child.children
	// );

	// const hasGrandChild = !(hasChild!.length > 0 && hasChild) && item.children!.length >= 15;

	// let chunks: any[] = hasGrandChild ? splitArray(item.children!, 7) : [];

	useEffect(() => {
		setOpen(activeMenuItems!.includes(item.key))
	}, [activeMenuItems, item])

	/**
	 * toggles the menu
	 */
	const toggleMenuItem = (e: FormEvent) => {
		e.preventDefault()
		const status = !open
		setOpen(status)
		if (toggleMenu) toggleMenu(item, status)
		return false
	}
	return (
		<Tag
			className={`${className} ${
				activeMenuItems!.includes(item.key) ? 'active' : ''
			}`}
		>
			<Link
				to="/#"
				onClick={toggleMenuItem}
				data-menu-key={item.key}
				className={`${linkClassName} ${
					activeMenuItems!.includes(item.key) ? 'active' : ''
				}`}
				id={item.key}
				role="button"
				data-bs-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded={open}
			>
				<i className={item.icon} />
				{item.label}
				<div className="arrow-down" />
			</Link>

			<div
				className={`${subMenuClassNames} ${showMenu ? 'show' : ''}`}
				aria-labelledby={item.key}
			>
				{(item.children || []).map((child, idx) => {
					return (
						<React.Fragment key={idx}>
							{child.children ? (
								<MenuItemWithChildren
									item={child}
									tag="div"
									linkClassName={`dropdown-item ${
										activeMenuItems!.includes(child.key) ? 'active' : ''
									}`}
									activeMenuItems={activeMenuItems}
									className="dropdown"
									subMenuClassNames="dropdown-menu"
									toggleMenu={toggleMenu}
								/>
							) : (
								<MenuItemLink
									item={child}
									className={`dropdown-item ${
										activeMenuItems!.includes(child.key) ? 'active' : ''
									}`}
								/>
							)}
						</React.Fragment>
					)
				})}
			</div>
		</Tag>
	)
}

const MenuItem = ({ item, className, linkClassName }: MenuItemsProps) => {
	return (
		<li className={className}>
			<MenuItemLink item={item} className={linkClassName} />
		</li>
	)
}

const MenuItemLink = ({ item }: MenuItemsProps) => {
	return (
		<Link
			className="dropdown-item"
			to={item.url!}
			target={item.target}
			data-menu-key={item.key}
		>
			{item.label}
		</Link>
	)
}

/**
 * Renders the application menu
 */
interface AppMenuProps {
	menuItems: MenuItemTypes[]
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
	const [topNavMenuItems] = useState<MenuItemTypes[]>(menuItems)
	const [activeMenuItems, setActiveMenuItems] = useState<string[]>([])

	let location = useLocation()
	const menuRef = useRef(null)

	/**
	 * toggle the menus
	 */
	const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
		if (show) {
			setActiveMenuItems([
				menuItem.key,
				...findAllParent(topNavMenuItems, menuItem),
			])
		}
	}

	/**
	 * activate the menuitems
	 */
	const activeMenu = useCallback(() => {
		const div = document.getElementById('main-side-menu')
		let matchingMenuItem = null

		if (div) {
			let items: HTMLCollectionOf<HTMLAnchorElement> =
				div.getElementsByTagName('a')
			for (let i = 0; i < items.length; ++i) {
				if (location.pathname === items[i].pathname) {
					matchingMenuItem = items[i]
					break
				}
			}

			if (matchingMenuItem) {
				const mid = matchingMenuItem.getAttribute('data-menu-key')
				const activeMt = findMenuItem(menuItems, mid!)
				if (activeMt) {
					setActiveMenuItems([
						activeMt['key'],
						...findAllParent(menuItems, activeMt),
					])
				}
			}
		}
	}, [location.pathname, menuItems])

	useEffect(() => {
		if (topNavMenuItems && topNavMenuItems.length > 0) activeMenu()
	}, [activeMenu, topNavMenuItems])

	return (
		<ul className="navbar-nav" ref={menuRef} id="main-side-menu">
			{(topNavMenuItems || []).map((item, idx) => {
				return (
					<React.Fragment key={idx}>
						{item.children ? (
							<MenuItemWithChildren
								item={item}
								tag="li"
								className="nav-item dropdown"
								subMenuClassNames="dropdown-menu"
								activeMenuItems={activeMenuItems}
								linkClassName="nav-link dropdown-toggle arrow-none"
								toggleMenu={toggleMenu}
							/>
						) : (
							<MenuItem
								item={item}
								className={activeMenuItems.includes(item.key) ? 'active' : ''}
								linkClassName={
									activeMenuItems.includes(item.key) ? 'active' : ''
								}
							/>
						)}
					</React.Fragment>
				)
			})}
		</ul>
	)
}

export default AppMenu
