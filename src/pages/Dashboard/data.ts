// import profilePic from '@/assets/images/users/avatar-1.jpg'
// import profilePic2 from '@/assets/images/users/avatar-5.jpg'

interface Statistic {
	title: string
	stats: string
	change: string
	icon: string
	variant: string
}

interface ProjectData {
	id: number
	projectName: string
	dueDate: string
	status: string
	variant: string
}
export const statistics: Statistic[] = [
	{
		title: 'Daily Visits',
		stats: '8,652',
		change: '2.97%',
		icon: 'ri-eye-line',
		variant: 'text-bg-pink',
	},
	{
		title: 'Revenue',
		stats: '$9,254.62',
		change: '18.25%',
		icon: 'ri-wallet-2-line',
		variant: 'text-bg-purple',
	},
	{
		title: 'Orders',
		stats: '753',
		change: '-5.75%',
		icon: 'ri-shopping-basket-line',
		variant: 'text-bg-info',
	},
	{
		title: 'Users',
		stats: '63,154',
		change: '8.21%',
		icon: 'ri-group-2-line',
		variant: 'text-bg-primary',
	},
]

// export const chatMessages = [
// 	{
// 		id: 1,
// 		userPic: profilePic2,
// 		userName: 'Geneva',
// 		text: 'Hello!',
// 		postedOn: '10:00',
// 	},
// 	{
// 		id: 2,
// 		userPic: profilePic,
// 		userName: 'Thomson',
// 		text: 'Hi, How are you? What about our next meeting?',
// 		postedOn: '10:01',
// 	},
// 	{
// 		id: 3,
// 		userPic: profilePic2,
// 		userName: 'Geneva',
// 		text: 'Yeah everything is fine',
// 		postedOn: '10:02',
// 	},
// 	{
// 		id: 4,
// 		userPic: profilePic,
// 		userName: 'Thomson',
// 		text: "Wow that's great!",
// 		postedOn: '10:03',
// 	},
// 	{
// 		id: 5,
// 		userPic: profilePic2,
// 		userName: 'Geneva',
// 		text: 'Cool!',
// 		postedOn: '10:03',
// 	},
// ]

export const projects: ProjectData[] = [
	{
		id: 1,
		projectName: 'Ad Automation Enhancement',
		dueDate: 'N/A',
		status: 'Urgent',
		variant: 'danger', // Red-like for urgency
	},
	{
		id: 2,
		projectName: 'Times of India Project',
		dueDate: '12/04/2025',
		status: 'Urgent',
		variant: 'danger',
	},
	{
		id: 3,
		projectName: 'Times of India Premium Plan',
		dueDate: '09/04/2025',
		status: 'Urgent',
		variant: 'danger',
	},
	{
		id: 4,
		projectName: 'Times of India Live Chat',
		dueDate: '25/04/2025',
		status: 'Urgent',
		variant: 'danger',
	},
	{
		id: 5,
		projectName: 'Times of India Login System',
		dueDate: '09/04/2025',
		status: 'Medium',
		variant: 'warning',
	},
]
