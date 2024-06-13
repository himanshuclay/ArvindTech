import { ThemeSettings } from '@/common/context'
import LayoutPosition from './LayoutPosition'
import LayoutTheme from './LayoutTheme'
import LayoutType from './LayoutType'
import LayoutWidth from './LayoutWidth'
import SideBarTheme from './SideBarTheme'
import SideBarType from './SideBarType'
import TopBarTheme from './TopBarTheme'
import useThemeCustomizer from './useThemeCustomizer'

const ThemeCustomizer = () => {
	const {
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
	} = useThemeCustomizer()
	return (
		<div className="p-3">
			<LayoutType
				handleChangeLayoutType={handleChangeLayoutType}
				layoutType={layoutType}
				layoutConstants={ThemeSettings.layout.type}
			/>
			<LayoutTheme
				handleChangeLayoutTheme={handleChangeLayoutTheme}
				layoutTheme={layoutTheme}
				layoutConstants={ThemeSettings.theme}
			/>
			<LayoutWidth
				handleChangeLayoutWidth={handleChangeLayoutWidth}
				layoutWidth={layoutWidth}
				layoutConstants={ThemeSettings.layout.mode}
			/>
			<TopBarTheme
				handleChangeTopBarTheme={handleChangeTopBarTheme}
				topBarTheme={topBarTheme}
				layoutConstants={ThemeSettings.topbar.theme}
			/>
			<SideBarTheme
				handleChangeSideBarTheme={handleChangeSideBarTheme}
				sideBarTheme={sideBarTheme}
				layoutConstants={ThemeSettings.sidebar.theme}
			/>
			<SideBarType
				handleChangeSideBarType={handleChangeSideBarType}
				sideBarType={sideBarType}
				layoutConstants={ThemeSettings.sidebar.size}
			/>
			<LayoutPosition
				handleChangeLayoutPosition={handleChangeLayoutPosition}
				layoutPosition={layoutPosition}
				layoutConstants={ThemeSettings.layout.menuPosition}
			/>
		</div>
	)
}

export default ThemeCustomizer
