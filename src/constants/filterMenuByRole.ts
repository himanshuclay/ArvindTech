import { MenuItemTypes } from '@/constants/menu';

/**
 * @param menuItems - The full list of menu items.
 * @param role - The user's role.
 * @returns Filtered menu items.
 */
export const filterMenuByRole = (menuItems: MenuItemTypes[], role: string): MenuItemTypes[] => {
    return menuItems
        .filter((item) => !item.roles || item.roles.includes(role)) // Filter items based on roles
        .map((item) => {
            if (item.children) {
                // Recursively filter children
                return {
                    ...item,
                    children: filterMenuByRole(item.children, role),
                };
            }
            return item;
        })
        .filter((item) => !item.children || item.children.length > 0); // Remove empty parents
};
