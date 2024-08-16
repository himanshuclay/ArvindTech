export interface MenuItemTypes {
	key: string
	label: string
	isTitle?: boolean
	icon?: string
	url?: string
	badge?: {
		variant: string
		text: string
	}
	parentKey?: string
	target?: string
	children?: MenuItemTypes[]
}

const MENU_ITEMS: MenuItemTypes[] = [
	// {
	// 	key: 'Main',
	// 	label: 'Main',
	// 	isTitle: true,
	// },
	{
		key: 'dashboard',
		label: 'Dashboards',
		isTitle: false,
		url: '/',
		icon: 'ri-dashboard-3-line',
		badge: {
			variant: 'success',
			text: '9+',
		},
	},
	
	{
		key: 'Modules-Master',
		label: 'Workflow',
		url: '/pages/Modules-Master',
		icon: 'ri-file-settings-line',	
		children: [
			{
				key: 'ModuleMaster',
				label: 'Task Creator',
				url: '/pages/Modules-Master',
				icon: 'ri-slideshow-line',
				parentKey: 'Modules-Master',
			}, 
			{
				key: 'ModuleMaster1',
				label: 'Process List',
				url: '/pages/Modules-Master',
				icon: 'ri-slideshow-line',
				parentKey: 'Modules-Master',
			},
			{
				key: 'ModuleMaster2',
				label: 'Add Task',
				url: '/pages/Modules-Master',
				icon: 'ri-slideshow-line',
				parentKey: 'Modules-Master',
			},
		],
		},
	
	// {
	// 	key: 'Notification',
	// 	label: 'Notification',
	// 	url: '/pages/Notification',
	// 	icon: 'ri-file-settings-line',
	// 	parentKey: 'pages',
	// },
	// {
	// 	key: 'Modules-List',
	// 	label: 'Modules',
	// 	url: '/pages/Module-list',
	// 	icon: 'ri-file-settings-line',
	// 	parentKey: 'pages',
	// },

	{
		key: 'Notification',
		label: 'Notification',
		url: '/pages/Notification',
		icon: 'ri-notification-3-line',
		parentKey: 'pages',
	},

	// {
	// 	key: 'Accounts',
	// 	label: 'Notification',
	// 	url: '/pages/Notification',
	// 	icon: 'ri-notification-3-line',
	// 	parentKey: 'pages',
	// },



	{
		key: 'multi-level',
		label: 'Process Initiation',
		isTitle: false,
		icon: 'ri-list-settings-line',
		children: [
			{
				key: 'second-level',
				label: 'Accounts',
				url: '/pages/Process-creator',
				parentKey: 'multi-level',
				icon: 'ri-account-circle-line',
			},
		]
	},
	{
		key: 'systemmaster',
		label: 'System Master',
		isTitle: false,
		icon: 'ri-settings-fill',
		children: [
			{
				key: 'ModuleMaster',
				label: 'Module Master',
				url: '/pages/ModuleMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'pages',
			},
			{
				key: 'ProcessMaster',
				label: 'Process Master',
				url: '/pages/ProcessMaster',
				icon: 'ri-bubble-chart-line',
				parentKey: 'pages',
			},
		
		
			{
				key: 'TaskMaster',
				label: 'Task Master',
				url: '/pages/TaskMaster',
				icon: 'ri-pie-chart-2-line',
				parentKey: 'pages',
			},
			{
				key: 'Roles',
				label: 'Role Master',
				url: '/pages/Roles',
				icon: 'ri-user-settings-line',
				parentKey: 'pages',
			},
		
			{
				key: 'DoerMaster',
				label: 'Doer Master',
				url: '/pages/DoerMaster',
				icon: 'ri-brain-line',
				parentKey: 'pages',
			},
		
			{
				key: 'FormMaster',
				label: 'Form Master',
				url: '/pages/FormMaster',
				icon: 'ri-survey-line',
				parentKey: 'pages',
			},
			{
				key: 'LnMaster',
				label: 'My Task',
				url: '/pages/MyTask',
				icon: 'ri-user-settings-line',
				parentKey: 'pages',
			},
		
		
			{
				key: 'ChkLnMaster',
				label: 'CHK LN Master',
				url: '/pages/ChkLnMaster',
				icon: 'ri-user-settings-line',
				parentKey: 'pages',
			},
		
			{
				key: 'TicketMaster',
				label: 'Ticket Master',
				url: '/pages/TicketMaster',
				icon: 'ri-coupon-2-line',
				parentKey: 'pages',
			},
		
			{
				key: 'SystemLogs',
				label: 'System Logs',
				url: '/pages/SystemLogs',
				icon: 'ri-login-circle-line',
				parentKey: 'pages',
			},
		
			{
				key: 'ChkTaskMaster',
				label: ' CHK Task Master',
				url: '/pages/ChkTaskMaster',
				icon: 'ri-user-settings-line',
				parentKey: 'pages',
			},
		
		
			{
				key: 'ChkInputMaster',
				label: ' CHK Input Master',
				url: '/pages/ChkInputMaster',
				icon: 'ri-user-settings-line',
				parentKey: 'pages',
			},
		
		
			{
				key: 'ChecklistMaster',
				label: ' Checklist Master',
				url: '/pages/ChecklistMaster',
				
				icon: 'ri-list-check-3',
				parentKey: 'pages',
			},
		
		
	
		],
	},
	{
		key: 'master',
		label: 'Business Master',
		isTitle: false,
		icon: 'ri-settings-4-line',
		children: [
			//////////////////////////////////////////////////////////////////////////
			{
				key: 'Projects',
				label: 'Projects',
				url: '/pages/Projects',
				icon: 'ri-file-chart-line',
				parentKey: 'pages',
			},
			{
				key: 'Employee-Master',
				label: 'Employee Master',
				url: '/pages/Employee-Master',
				icon: 'ri-user-settings-line',
				parentKey: 'pages',
			},
			{
				key: 'Mess-Master',
				label: 'Mess Master',
				url: '/pages/MessMaster',
				icon: 'ri-restaurant-line',
				parentKey: 'pages',
			},
			{
				key: 'Tender',
				label: 'Tender Master',
				url: '/pages/Tender',
				icon: 'ri-service-line',
				parentKey: 'pages',
			},
			{
				key: 'Vender',
				label: 'Vender Master',
				url: '/pages/Vender',
				icon: 'ri-store-line',
				parentKey: 'pages',
			},
			{
				key: 'Bank',
				label: 'Bank Master',
				url: '/pages/Bank',
				icon: 'ri-bank-line',
				parentKey: 'pages',
			},
			{
				key: 'AddressMaster',
				label: 'Address Master',
				url: '/pages/AddressMaster',
				icon: 'ri-restaurant-line',
				parentKey: 'pages',
			},
			///////////////////////////////////////////////////////////////////////////////
		
	
		],
	},
	
	// {
	// 	key: 'auth',
	// 	label: 'Authentication',
	// 	isTitle: false,
	// 	icon: 'ri-group-2-line',
	// 	children: [
	// 		{
	// 			key: 'auth-login',
	// 			label: 'Login',
	// 			url: '/auth/login',
	// 			parentKey: 'auth',
	// 		},
	// 		{
	// 			key: 'auth-register',
	// 			label: 'Register',
	// 			url: '/auth/register',
	// 			parentKey: 'auth',
	// 		},
	// 		{
	// 			key: 'auth-logout',
	// 			label: 'Logout',
	// 			url: '/auth/logout',
	// 			parentKey: 'auth',
	// 		},
	// 		{
	// 			key: 'auth-forgot-password',
	// 			label: 'Forgot Password',
	// 			url: '/auth/forgot-password',
	// 			parentKey: 'auth',
	// 		},
	// 		{
	// 			key: 'auth-lock-screen',
	// 			label: 'Lock Screen',
	// 			url: '/auth/lock-screen',
	// 			parentKey: 'auth',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'components',
	// 	label: 'Components',
	// 	isTitle: true,
	// },
	// {
	// 	key: 'base-ui',
	// 	label: 'Base UI',
	// 	isTitle: false,
	// 	icon: 'ri-briefcase-line',
	// 	children: [
	// 		{
	// 			key: 'ui-accordions',
	// 			label: 'Accordions',
	// 			url: '/ui/accordions',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-alerts',
	// 			label: 'Alerts',
	// 			url: '/ui/alerts',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-avatars',
	// 			label: 'Avatars',
	// 			url: '/ui/avatars',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-badges',
	// 			label: 'Badges',
	// 			url: '/ui/badges',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-breadcrumb',
	// 			label: 'Breadcrumb',
	// 			url: '/ui/breadcrumb',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-buttons',
	// 			label: 'Buttons',
	// 			url: '/ui/buttons',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-cards',
	// 			label: 'Cards',
	// 			url: '/ui/cards',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-carousel',
	// 			label: 'Carousel',
	// 			url: '/ui/carousel',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-collapse',
	// 			label: 'Collapse',
	// 			url: '/ui/collapse',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-dropdowns',
	// 			label: 'Dropdowns',
	// 			url: '/ui/dropdowns',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-embed-video',
	// 			label: 'Embed Video',
	// 			url: '/ui/embed-video',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-grid',
	// 			label: 'Grid',
	// 			url: '/ui/grid',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-links',
	// 			label: 'Links',
	// 			url: '/ui/links',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-list-group',
	// 			label: 'List Group',
	// 			url: '/ui/list-group',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-modals',
	// 			label: 'modals',
	// 			url: '/ui/modals',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-notifications',
	// 			label: 'Notifications',
	// 			url: '/ui/notifications',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-offcanvas',
	// 			label: 'Offcanvas',
	// 			url: '/ui/offcanvas',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-placeholders',
	// 			label: 'Placeholders',
	// 			url: '/ui/placeholders',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-pagination',
	// 			label: 'Pagination',
	// 			url: '/ui/pagination',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-popovers',
	// 			label: 'Popovers',
	// 			url: '/ui/popovers',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-progress',
	// 			label: 'Progress',
	// 			url: '/ui/progress',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-spinners',
	// 			label: 'Spinners',
	// 			url: '/ui/spinners',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-tabs',
	// 			label: 'Tabs',
	// 			url: '/ui/tabs',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-tooltips',
	// 			label: 'Tooltips',
	// 			url: '/ui/tooltips',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-typography',
	// 			label: 'Typography',
	// 			url: '/ui/typography',
	// 			parentKey: 'base-ui',
	// 		},
	// 		{
	// 			key: 'ui-utilities',
	// 			label: 'Utilities',
	// 			url: '/ui/utilities',
	// 			parentKey: 'base-ui',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'extended',
	// 	label: 'Extended UI',
	// 	isTitle: false,
	// 	icon: 'ri-compasses-2-line',
	// 	children: [
	// 		{
	// 			key: 'extended-portlets',
	// 			label: 'Portlets',
	// 			url: '/extended-ui/portlets',
	// 			parentKey: 'extended',
	// 		},
	// 		{
	// 			key: 'extended-scrollbar',
	// 			label: 'Scrollbar',
	// 			url: '/extended-ui/scrollbar',
	// 			parentKey: 'extended',
	// 		},
	// 		{
	// 			key: 'extended-range-slider',
	// 			label: 'Range Slider',
	// 			url: '/extended-ui/range-slider',
	// 			parentKey: 'extended',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'icons',
	// 	label: 'Icons',
	// 	isTitle: false,
	// 	icon: 'ri-pencil-ruler-2-line',
	// 	children: [
	// 		{
	// 			key: 'icons-remix',
	// 			label: 'Remix icons',
	// 			url: '/ui/icons/remix-icons',
	// 			parentKey: 'icons',
	// 		},
	// 		{
	// 			key: 'icons-Bootstrap',
	// 			label: 'Bootstrap icons',
	// 			url: '/ui/icons/Bootstrap-icons',
	// 			parentKey: 'icons',
	// 		},
	// 		{
	// 			key: 'icons-Material Icons',
	// 			label: 'Material Design Icons',
	// 			url: '/ui/icons/Material-icons',
	// 			parentKey: 'icons',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'charts',
	// 	label: 'Charts',
	// 	isTitle: false,
	// 	icon: 'ri-donut-chart-fill',
	// 	children: [
	// 		{
	// 			key: 'apex-charts',
	// 			label: 'Apex Charts',
	// 			url: '/charts/apex-charts',
	// 			parentKey: 'charts',
	// 		},
	// 		{
	// 			key: 'chartjs-charts',
	// 			label: 'ChartJS',
	// 			url: '/charts/chartjs',
	// 			parentKey: 'charts',
	// 		},
	// 		{
	// 			key: 'Sparkline-charts',
	// 			label: 'Sparkline Charts',
	// 			url: '/charts/sparkline-charts',
	// 			parentKey: 'charts',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'forms',
	// 	label: 'Forms',
	// 	isTitle: false,
	// 	icon: 'ri-survey-line',
	// 	children: [
	// 		{
	// 			key: 'forms-basic-elements',
	// 			label: 'Basic Elements',
	// 			url: '/ui/forms/basic-elements',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-form-advanced',
	// 			label: 'Form Advanced',
	// 			url: '/ui/forms/form-advanced',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-validation',
	// 			label: 'Form Validation',
	// 			url: '/ui/forms/validation',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-wizard',
	// 			label: 'Form Wizard',
	// 			url: '/ui/forms/wizard',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-file-uploads',
	// 			label: 'File Uploads',
	// 			url: '/ui/forms/file-uploads',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-editors',
	// 			label: 'Form Editors',
	// 			url: '/ui/forms/editors',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-image-crop',
	// 			label: 'Image Crop',
	// 			url: '/ui/forms/image-crop',
	// 			parentKey: 'forms',
	// 		},
	// 		{
	// 			key: 'forms-editable',
	// 			label: 'Editable',
	// 			url: '/ui/forms/editable',
	// 			parentKey: 'forms',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'tables',
	// 	label: 'Tables',
	// 	isTitle: false,
	// 	icon: 'ri-table-line',
	// 	children: [
	// 		{
	// 			key: 'tables-basic',
	// 			label: 'Basic Tables',
	// 			url: '/ui/tables/basic-tables',
	// 			parentKey: 'tables',
	// 		},
	// 		{
	// 			key: 'tables-data',
	// 			label: 'Data Tables',
	// 			url: '/ui/tables/data-tables',
	// 			parentKey: 'tables',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'maps',
	// 	label: 'Maps',
	// 	isTitle: false,
	// 	icon: 'ri-treasure-map-line',
	// 	children: [
	// 		{
	// 			key: 'maps-google-maps',
	// 			label: 'Google maps',
	// 			url: '/ui/maps/google-maps',
	// 			parentKey: 'maps',
	// 		},
	// 		{
	// 			key: 'maps-vector-maps',
	// 			label: 'Vector maps',
	// 			url: '/ui/maps/vector-maps',
	// 			parentKey: 'maps',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'multi-level',
	// 	label: 'Multi Level',
	// 	isTitle: false,
	// 	icon: 'ri-share-line',
	// 	children: [
	// 		{
	// 			key: 'level-one',
	// 			label: 'Level 1.1',
	// 			url: '/',
	// 			parentKey: 'multi-level',
	// 		},
	// 		{
	// 			key: 'second-level',
	// 			label: 'Level 1.2',
	// 			url: '/',
	// 			parentKey: 'multi-level',
	// 			children: [
	// 				{
	// 					key: 'second-level-1',
	// 					label: 'Item 1',
	// 					url: '/',
	// 					parentKey: 'second-level',
	// 				},
	// 				{
	// 					key: 'second-level-2',
	// 					label: 'Item 2',
	// 					url: '/',
	// 					parentKey: 'second-level',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'third-level',
	// 			label: 'Level 1.3',
	// 			url: '/',
	// 			parentKey: 'multi-level',
	// 			children: [
	// 				{
	// 					key: 'third-level-1',
	// 					label: 'Item 1',
	// 					url: '/',
	// 					parentKey: 'third-level',
	// 				},
	// 				{
	// 					key: 'third-level-2',
	// 					label: 'Item 2',
	// 					url: '/',
	// 					parentKey: 'third-level',
	// 					children: [
	// 						{
	// 							key: 'third-level-2-1',
	// 							label: 'Item 2.1',
	// 							url: '/',
	// 							parentKey: 'third-level-2',
	// 						},
	// 						{
	// 							key: 'third-level-2-2',
	// 							label: 'Item 2.2',
	// 							url: '/',
	// 							parentKey: 'third-level-2',
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 	],
	// },
]

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
	{
		key: 'dashboard',
		icon: 'ri-dashboard-3-line',
		label: 'Dashboards',
		isTitle: true,
		children: [
			{
				key: 'dashboard',
				label: 'Dashboard',
				url: '/',
				parentKey: 'dashboard',
			},
		],
	},
	{
		key: 'pages',
		icon: 'ri-pages-line',
		label: 'Pages',
		isTitle: true,
		children: [
			{
				key: 'auth',
				label: 'Authentication',
				isTitle: false,
				children: [
					{
						key: 'auth-login',
						label: 'Login',
						url: '/auth/login',
						parentKey: 'pages',
					},
					{
						key: 'auth-register',
						label: 'Register',
						url: '/auth/register',
						parentKey: 'pages',
					},
					{
						key: 'auth-logout',
						label: 'Logout',
						url: '/auth/logout',
						parentKey: 'pages',
					},
					{
						key: 'auth-forgot-password',
						label: 'Forgot Password',
						url: '/auth/forgot-password',
						parentKey: 'pages',
					},
					{
						key: 'auth-lock-screen',
						label: 'Lock Screen',
						url: '/auth/lock-screen',
						parentKey: 'pages',
					},
				],
			},
			{
				key: 'pages-error',
				label: 'Error',
				parentKey: 'pages',
				children: [
					{
						key: 'error-404',
						label: 'Error 404',
						url: '/pages/error-404',
						parentKey: 'pages-error',
					},
					{
						key: 'error-404-alt',
						label: 'Error 404-alt',
						url: '/pages/error-404-alt',
						parentKey: 'pages-error',
					},
					{
						key: 'error-500',
						label: 'Error 500',
						url: '/pages/error-500',
						parentKey: 'pages-error',
					},
				],
			},
			{
				key: 'Modules-Master',
				label: 'Modules Master',
				url: '/pages/Modules-Master',
				parentKey: 'pages',
			},
			{
				key: 'Modules-List',
				label: 'Modules List',
				url: '/pages/Module-list',
				parentKey: 'pages',
			},
			{
				key: 'Employee-Master',
				label: 'Employee Master',
				url: '/pages/Employee-Master',
				parentKey: 'pages',
			},
			{
				key: 'Notification',
				label: 'Notification',
				url: '/pages/Notification',
				parentKey: 'pages',
			},
			{
				key: 'pages-starter',
				label: 'Starter Page',
				url: '/pages/Process-creator',
				parentKey: 'pages',
			},
			{
				key: 'pages-ContactList',
				label: 'Contact List',
				url: '/pages/contact-list',
				parentKey: 'pages',
			},
			{
				key: 'pages-profile',
				label: 'Profile',
				url: '/pages/profile',
				parentKey: 'pages',
			},
			{
				key: 'pages-invoice',
				label: 'Invoice',
				url: '/pages/invoice',
				parentKey: 'pages',
			},
			{
				key: 'pages-faq',
				label: 'FAQ',
				url: '/pages/faq',
				parentKey: 'pages',
			},
			{
				key: 'pages-pricing',
				label: 'Pricing',
				url: '/pages/pricing',
				parentKey: 'pages',
			},
			{
				key: 'pages-maintenance',
				label: 'Maintenance',
				url: '/pages/maintenance',
				parentKey: 'pages',
			},
			{
				key: 'pages-timeline',
				label: 'Timeline',
				url: '/pages/timeline',
				parentKey: 'pages',
			},
		],
	},
	// {
	// 	key: 'ui',
	// 	icon: 'ri-stack-line',
	// 	label: 'Components',
	// 	isTitle: true,
	// 	children: [
	// 		{
	// 			key: 'base1',
	// 			label: 'Base UI 1',
	// 			parentKey: 'ui',
	// 			children: [
	// 				{
	// 					key: 'ui-accordions',
	// 					label: 'Accordions',
	// 					url: '/ui/accordions',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-alerts',
	// 					label: 'Alerts',
	// 					url: '/ui/alerts',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-avatars',
	// 					label: 'Avatars',
	// 					url: '/ui/avatars',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-badges',
	// 					label: 'Badges',
	// 					url: '/ui/badges',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-breadcrumb',
	// 					label: 'Breadcrumb',
	// 					url: '/ui/breadcrumb',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-buttons',
	// 					label: 'Buttons',
	// 					url: '/ui/buttons',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-cards',
	// 					label: 'Cards',
	// 					url: '/ui/cards',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-carousel',
	// 					label: 'Carousel',
	// 					url: '/ui/carousel',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-dropdowns',
	// 					label: 'Dropdowns',
	// 					url: '/ui/dropdowns',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-embed-video',
	// 					label: 'Embed Video',
	// 					url: '/ui/embed-video',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-grid',
	// 					label: 'Grid',
	// 					url: '/ui/grid',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-list-group',
	// 					label: 'List Group',
	// 					url: '/ui/list-group',
	// 					parentKey: 'base1',
	// 				},
	// 				{
	// 					key: 'ui-links',
	// 					label: 'Links',
	// 					url: '/ui/links',
	// 					parentKey: 'base1',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'base2',
	// 			label: 'Base UI 2',
	// 			parentKey: 'ui',
	// 			children: [
	// 				{
	// 					key: 'ui-modals',
	// 					label: 'Modals',
	// 					url: '/ui/modals',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-notifications',
	// 					label: 'Notifications',
	// 					url: '/ui/notifications',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-offcanvas',
	// 					label: 'Offcanvas',
	// 					url: '/ui/offcanvas',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-placeholders',
	// 					label: 'Placeholders',
	// 					url: '/ui/placeholders',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-pagination',
	// 					label: 'Pagination',
	// 					url: '/ui/pagination',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-popovers',
	// 					label: 'Popovers',
	// 					url: '/ui/popovers',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-progress',
	// 					label: 'Progress',
	// 					url: '/ui/progress',
	// 					parentKey: 'base2',
	// 				},

	// 				{
	// 					key: 'ui-spinners',
	// 					label: 'Spinners',
	// 					url: '/ui/spinners',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-tabs',
	// 					label: 'Tabs',
	// 					url: '/ui/tabs',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-tooltips',
	// 					label: 'Tooltips',
	// 					url: '/ui/tooltips',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-typography',
	// 					label: 'Typography',
	// 					url: '/ui/typography',
	// 					parentKey: 'base2',
	// 				},
	// 				{
	// 					key: 'ui-utilities',
	// 					label: 'Utilities',
	// 					url: '/ui/utilities',
	// 					parentKey: 'base2',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'extended',
	// 			label: 'Extended UI',
	// 			parentKey: 'ui',
	// 			children: [
	// 				{
	// 					key: 'extended-portlets',
	// 					label: 'Portlets',
	// 					url: '/extended-ui/portlets',
	// 					parentKey: 'extended',
	// 				},
	// 				{
	// 					key: 'extended-scrollbar',
	// 					label: 'Scrollbar',
	// 					url: '/extended-ui/scrollbar',
	// 					parentKey: 'extended',
	// 				},
	// 				{
	// 					key: 'extended-range-slider',
	// 					label: 'Range Slider',
	// 					url: '/extended-ui/range-slider',
	// 					parentKey: 'extended',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'forms',
	// 			label: 'Forms',
	// 			parentKey: 'ui',
	// 			children: [
	// 				{
	// 					key: 'forms-basic-elements',
	// 					label: 'Basic Elements',
	// 					url: '/ui/forms/basic-elements',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-form-advanced',
	// 					label: 'Form Advanced',
	// 					url: '/ui/forms/form-advanced',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-validation',
	// 					label: 'Form Validation',
	// 					url: '/ui/forms/validation',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-wizard',
	// 					label: 'Form Wizard',
	// 					url: '/ui/forms/wizard',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-file-uploads',
	// 					label: 'File Uploads',
	// 					url: '/ui/forms/file-uploads',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-editors',
	// 					label: 'Form Editors',
	// 					url: '/ui/forms/editors',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-image-crop',
	// 					label: 'Image Crop',
	// 					url: '/ui/forms/image-crop',
	// 					parentKey: 'forms',
	// 				},
	// 				{
	// 					key: 'forms-editable',
	// 					label: 'Editable',
	// 					url: '/ui/forms/editable',
	// 					parentKey: 'forms',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'charts',
	// 			label: 'Charts',
	// 			isTitle: false,
	// 			children: [
	// 				{
	// 					key: 'apex-charts',
	// 					label: 'Apex Charts',
	// 					url: '/charts/apex-charts',
	// 					parentKey: 'charts',
	// 				},
	// 				{
	// 					key: 'chartjs-charts',
	// 					label: 'ChartJS',
	// 					url: '/charts/chartjs',
	// 					parentKey: 'charts',
	// 				},
	// 				{
	// 					key: 'Sparkline-charts',
	// 					label: 'Sparkline Charts',
	// 					url: '/charts/sparkline-charts',
	// 					parentKey: 'charts',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'tables',
	// 			label: 'Tables',
	// 			isTitle: false,
	// 			children: [
	// 				{
	// 					key: 'tables-basic',
	// 					label: 'Basic Tables',
	// 					url: '/ui/tables/basic-tables',
	// 					parentKey: 'tables',
	// 				},
	// 				{
	// 					key: 'tables-data',
	// 					label: 'Data Tables',
	// 					url: '/ui/tables/data-tables',
	// 					parentKey: 'tables',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'icons',
	// 			label: 'Icons',
	// 			isTitle: false,
	// 			children: [
	// 				{
	// 					key: 'icons-remix',
	// 					label: 'Remix icons',
	// 					url: '/ui/icons/remix-icons',
	// 					parentKey: 'icons',
	// 				},
	// 				{
	// 					key: 'icons-Bootstrap',
	// 					label: 'Bootstrap icons',
	// 					url: '/ui/icons/Bootstrap-icons',
	// 					parentKey: 'icons',
	// 				},
	// 				{
	// 					key: 'icons-Material Icons',
	// 					label: 'Material Design Icons',
	// 					url: '/ui/icons/Material-icons',
	// 					parentKey: 'icons',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'maps',
	// 			label: 'Maps',
	// 			isTitle: false,
	// 			children: [
	// 				{
	// 					key: 'maps-google-maps',
	// 					label: 'Google maps',
	// 					url: '/ui/maps/google-maps',
	// 					parentKey: 'maps',
	// 				},
	// 				{
	// 					key: 'maps-vector-maps',
	// 					label: 'Vector maps',
	// 					url: '/ui/maps/vector-maps',
	// 					parentKey: 'maps',
	// 				},
	// 			],
	// 		},
	// 	],
	// },
]

export { MENU_ITEMS, HORIZONTAL_MENU_ITEMS }