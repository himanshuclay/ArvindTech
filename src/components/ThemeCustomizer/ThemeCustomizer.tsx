import { ThemeSettings } from '@/common/context'
import LayoutPosition from './LayoutPosition'
// import LayoutTheme from './LayoutTheme'
// import LayoutType from './LayoutType'
// import LayoutWidth from './LayoutWidth'
// import SideBarTheme from './SideBarTheme'
// import SideBarType from './SideBarType'
// import TopBarTheme from './TopBarTheme'
import useThemeCustomizer from './useThemeCustomizer'

const ThemeCustomizer = () => {
	const {

		layoutPosition,

		handleChangeLayoutPosition,
	} = useThemeCustomizer()
	return (
		<div className="p-3">
			<LayoutPosition
				handleChangeLayoutPosition={handleChangeLayoutPosition}
				layoutPosition={layoutPosition}
				layoutConstants={ThemeSettings.layout.menuPosition}
			/>
		</div>
	)
}

export default ThemeCustomizer
