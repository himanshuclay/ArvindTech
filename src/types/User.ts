export type User = {
	email?: string // Updated from `email`
	emailID?: string // Updated from `email`
	userName?: string // Updated from `username`
	password?: string
	employeeName?: string // Added from API response
	officeLandLine?: string // Added from API response
	extensionNumber?: string // Added from API response
	mobileNumber?: string
	departmentID?: number // Added from API response
	departmentName?: string // Added from API response
	roleID?: number // Added from API response
	roleName?: string // Updated from `role`
	status?: number // Added from API response
	createdBy?: string // Added from API response
	createdDate?: string // Added from API response
	updatedBy?: string // Added from API response
	updatedDate?: string // Added from API response
	token?: string // To store authentication token
	roles?: string // To store authentication token
}
