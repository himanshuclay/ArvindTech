import { ThemeSettings, useThemeContext } from '@/common/context'

export default function useThemeCustomizer() {
	const {
		settings,
		updateSettings,
		updateLayout,
		updateTopbar,
		updateSidebar,
	} = useThemeContext()

	const layoutType = settings.layout.type
	const layoutTheme = settings.theme
	const layoutWidth = settings.layout.mode
	const topBarTheme = settings.topbar.theme
	const sideBarTheme = settings.sidebar.theme
	const sideBarType = settings.sidebar.size
	const layoutPosition = settings.layout.menuPosition

	/**
	 * Changes the layout type
	 */
	const handleChangeLayoutType = (type: string) => {
		switch (type) {
			case 'horizontal':
				updateLayout({ type: ThemeSettings.layout.type.horizontal })
				break
			default:
				updateLayout({ type: ThemeSettings.layout.type.vertical })
				break
		}
	}

	/**
	 * Changes the layout theme
	 */
	const handleChangeLayoutTheme = (theme: string) => {
		switch (theme) {
			case 'dark':
				updateSettings({ theme: ThemeSettings.theme.dark })
				break
			default:
				updateSettings({ theme: ThemeSettings.theme.light })
				break
		}
	}

	/**
	 * Changes the layout width
	 */
	const handleChangeLayoutWidth = (width: string) => {
		switch (width) {
			case 'boxed':
				updateLayout({ mode: ThemeSettings.layout.mode.boxed })
				break
			default:
				updateLayout({ mode: ThemeSettings.layout.mode.fluid })
				break
		}
	}

	/**
	 * Changes the topbar theme
	 */
	const handleChangeTopBarTheme = (value: string) => {
		switch (value) {
			case 'dark':
				updateTopbar({ theme: ThemeSettings.topbar.theme.dark })
				break
			default:
				updateTopbar({ theme: ThemeSettings.topbar.theme.light })
				break
		}
	}

	/**
	 * Changes the left sidebar theme
	 */
	const handleChangeSideBarTheme = (theme: string) => {
		switch (theme) {
			case 'light':
				updateSidebar({ theme: ThemeSettings.sidebar.theme.light })
				break
			default:
				updateSidebar({ theme: ThemeSettings.sidebar.theme.dark })
				break
		}
	}

	/**
	 * Changes the left sidebar type
	 */
	const handleChangeSideBarType = (type: string) => {
		switch (type) {
			case 'fullscreen':
				updateSidebar({ size: ThemeSettings.sidebar.size.fullscreen })
				break
			case 'full':
				updateSidebar({ size: ThemeSettings.sidebar.size.full })
				break
			case 'condensed':
				updateSidebar({ size: ThemeSettings.sidebar.size.condensed })
				break
			case 'compact':
				updateSidebar({ size: ThemeSettings.sidebar.size.compact })
				break
			default:
				updateSidebar({ size: ThemeSettings.sidebar.size.default })
				break
		}
	}

	/**
	 * Changes the layout position
	 */
	const handleChangeLayoutPosition = (position: string) => {
		switch (position) {
			case 'scrollable':
				updateLayout({
					menuPosition: ThemeSettings.layout.menuPosition.scrollable,
				})
				break
			default:
				updateLayout({ menuPosition: ThemeSettings.layout.menuPosition.fixed })
				break
		}
	}

	/**
	 * Reset Layout
	 */
	const reset = () => {
		updateSettings({
			layout: {
				type: ThemeSettings.layout.type.vertical,
				mode: ThemeSettings.layout.mode.fluid,
				menuPosition: ThemeSettings.layout.menuPosition.fixed,
			},
			theme: ThemeSettings.theme.light,
			topbar: {
				theme: ThemeSettings.topbar.theme.light,
				logo: ThemeSettings.topbar.logo.show,
			},
			sidebar: {
				theme: ThemeSettings.sidebar.theme.dark,
				size: ThemeSettings.sidebar.size.default,
				user: ThemeSettings.sidebar.user.hidden,
			},
			rightSidebar: ThemeSettings.rightSidebar.show,
		})
	}

	return {
		layoutType,
		layoutTheme,
		layoutWidth,
		topBarTheme,
		sideBarTheme,
		sideBarType,
		layoutPosition,
		handleChangeLayoutType,
		handleChangeLayoutTheme,
		handleChangeLayoutWidth,
		handleChangeTopBarTheme,
		handleChangeSideBarTheme,
		handleChangeSideBarType,
		handleChangeLayoutPosition,
		reset,
	}
}
