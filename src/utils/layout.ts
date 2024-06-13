// import { LayoutWidth, SideBarWidth } from '../appConstants';
// import { LayoutActionTypes } from '../store/layout/constants';
// import { LayoutActionType } from '../store/actions';

// type ConfigType = {
//   leftSideBarType:
//   | SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED
//   | SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
//   | SideBarWidth.LEFT_SIDEBAR_TYPE_SCROLLABLE;
// };

// // add property to change in particular option
// const config: ConfigType = {
//   leftSideBarType: SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED,
// };

// const getLayoutConfigs = (actionType: LayoutActionType<string | boolean | null>['type'], value: string | boolean) => {
//   switch (actionType) {
//     case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
//       switch (value) {
//         case LayoutWidth.LAYOUT_WIDTH_FLUID:
//           config.leftSideBarType = SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED;
//           break;
//         case LayoutWidth.LAYOUT_WIDTH_BOXED:
//           config.leftSideBarType = SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED;
//           break;
//         default:
//           return config;
//       }
//       break;
//     default:
//       return config;
//   }
//   return config;
// };

/**
 * Changes the HTML attributes
 */
const changeHTMLAttribute = (attribute: string, value: string): void => {
	if (document.body)
		document.getElementsByTagName('html')[0].setAttribute(attribute, value)
}

export {
	// getLayoutConfigs,
	changeHTMLAttribute,
}
