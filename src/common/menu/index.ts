import {
	HORIZONTAL_MENU_ITEMS,
	MENU_ITEMS,
	MenuItemTypes,
} from '@/constants/menu'
const getMenuItems = () => {
	// NOTE - You can fetch from server and return here as well
	return MENU_ITEMS
}

const getHorizontalMenuItems = () => {
	// NOTE - You can fetch from server and return here as well
	return HORIZONTAL_MENU_ITEMS
}

const findAllParent = (
	menuItems: MenuItemTypes[],
	menuItem: MenuItemTypes,
	visitedKeys: Set<string> = new Set()
  ): string[] => {
	let parents: string[] = []
  
	const parent = findMenuItem(menuItems, menuItem.parentKey, visitedKeys)
  
	if (parent) {
	  parents.push(parent.key)
	  if (parent.parentKey && !visitedKeys.has(parent.parentKey)) {
		// Mark the parent as visited before recursion
		visitedKeys.add(parent.key)
		parents = [...parents, ...findAllParent(menuItems, parent, visitedKeys)]
	  }
	}
	return parents
  }
  
  const findMenuItem = (
	menuItems: MenuItemTypes[] | undefined,
	menuItemKey: MenuItemTypes['key'] | undefined,
	visitedKeys: Set<string> = new Set()
  ): MenuItemTypes | null => {
	if (menuItems && menuItemKey) {
	  for (let i = 0; i < menuItems.length; i++) {
		// Skip already visited items to prevent infinite recursion
		if (visitedKeys.has(menuItems[i].key)) continue
  
		if (menuItems[i].key === menuItemKey) {
		  return menuItems[i]
		}
  
		visitedKeys.add(menuItems[i].key)
		let found = findMenuItem(menuItems[i].children, menuItemKey, visitedKeys)
		if (found) return found
	  }
	}
	return null
  }
  
  export { findAllParent, findMenuItem, getMenuItems, getHorizontalMenuItems }
  
