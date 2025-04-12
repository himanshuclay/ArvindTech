import React, { Suspense, useEffect } from 'react'
import { ThemeSettings, useThemeContext } from '../common/context'
import { useViewport } from '../hooks'
import { changeHTMLAttribute } from '../utils'
import { Container } from 'react-bootstrap'
import Preloader from '@/components/Preloader'

const Topbar = React.lazy(() => import('./Topbar'))
const LeftSidebar = React.lazy(() => import('./LeftSidebar'))
const RightSidebar = React.lazy(() => import('./RightSidebar'))
const Footer = React.lazy(() => import('./Footer'))

interface VerticalLayoutProps {
	children?: any
}
const VerticalLayout = ({ children }: VerticalLayoutProps) => {
	const { settings, updateSidebar } = useThemeContext()
	const { width } = useViewport()

	/*
	 * layout defaults
	 */
	useEffect(() => {
		changeHTMLAttribute('data-bs-theme', settings.theme)
	}, [settings.theme])

	useEffect(() => {
		changeHTMLAttribute('data-layout-mode', settings.layout.mode)
	}, [settings.layout.mode])

	useEffect(() => {
		changeHTMLAttribute('data-topbar-color', settings.topbar.theme)
	}, [settings.topbar.theme])

	useEffect(() => {
		changeHTMLAttribute('data-menu-color', settings.sidebar.theme)
	}, [settings.sidebar.theme])

	useEffect(() => {
		changeHTMLAttribute('data-sidenav-size', settings.sidebar.size)
	}, [settings.sidebar.size])

	useEffect(() => {
		changeHTMLAttribute('data-layout-position', settings.layout.menuPosition)
	}, [settings.layout.menuPosition])

	useEffect(() => {
		if (width < 768) {
			updateSidebar({ size: ThemeSettings.sidebar.size.full })
		} else if (width < 1140) {
			updateSidebar({ size: ThemeSettings.sidebar.size.condensed })
		} else if (width >= 1140) {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
		}
	}, [width])

	// const isCondensed =
	//   settings.sidebar.size === ThemeSettings.sidebar.size.condensed;
	// const topbarDark = settings.topbar.theme !== ThemeSettings.topbar.theme.light;
	// const leftbarDark =
	//   settings.sidebar.theme !== ThemeSettings.sidebar.theme.light;

	return (
		<Suspense fallback={<div />}>
			<div className="wrapper">
				<Suspense fallback={<div />}>
					<Topbar
					// openLeftMenuCallBack={openMenu} topbarDark={topbarDark}
					/>
				</Suspense>

				<Suspense fallback={<div />}>
					<LeftSidebar
					//  isCondensed={isCondensed} leftbarDark={leftbarDark} hideUserProfile={true}
					/>
				</Suspense>

				<div className="content-page">
					<div className="content">
						<Suspense fallback={<div />}>
							<Container fluid>
								<Suspense fallback={<Preloader />}>{children}</Suspense>
							</Container>
						</Suspense>
					</div>
					<Suspense fallback={<div />}>
						<Footer />
					</Suspense>
				</div>

				<Suspense fallback={<div />}>
					<RightSidebar />
				</Suspense>
			</div>
		</Suspense>
	)
}
export default VerticalLayout
