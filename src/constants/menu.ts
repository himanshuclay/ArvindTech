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
	roles?: string[]
}


const MENU_ITEMS: MenuItemTypes[] = [

	{
		key: 'dashboard',
		label: 'Dashboards',
		isTitle: false,
		url: '/',
		icon: 'ri-dashboard-3-line',
		badge: {
			variant: 'success',
			text: '',
		},
	},
	{
		key: 'systemmaster',
		label: 'System Master',
		isTitle: false,
		icon: 'ri-settings-fill',
		children: [
			{
				key: 'systemmaster-ModuleMaster',
				label: 'Module Master',
				url: '/pages/ModuleMaster',
				icon: 'ri-slideshow-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'systemmaster-ProcessMaster',
				label: 'Process Master',
				url: '/pages/ProcessMaster',
				icon: 'ri-bubble-chart-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'systemmaster-ProcessInitiation',
				label: ' Initiation Master',
				url: '/pages/ProcessInitiation',
				icon: 'ri-bubble-chart-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'systemmaster-TaskMaster',
				label: 'Task Master',
				url: '/pages/TaskMaster',
				icon: 'ri-pie-chart-2-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'RoleMaster',
				label: 'Role Master',
				url: '/pages/RoleMaster',
				icon: 'ri-brain-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'Identifier',
				label: 'Identifier Master',
				url: '/pages/IdentifierMaster',
				icon: 'ri-brain-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'DoerMaster',
				label: 'Doer Master',
				url: '/pages/DoerMaster',
				icon: 'ri-brain-line',
				parentKey: 'systemmaster',
			},


			{
				key: 'LnMaster',
				label: 'LN Master',
				url: '/pages/LnMaster',
				icon: 'ri-user-settings-line',
				parentKey: 'systemmaster',
			},
			{
				key: 'SystemLogs',
				label: 'System Logs',
				url: '/pages/SystemLogs',
				icon: 'ri-login-circle-line',
				parentKey: 'systemmaster',
			},
		],
	},
	{
		key: 'master',
		label: 'Business Master',
		isTitle: false,
		icon: 'ri-settings-4-line',
		children: [
			{
				key: 'Projects',
				label: 'Project Master',
				url: '/pages/ProjectMaster',
				icon: 'ri-file-chart-line',
				parentKey: 'master',
			},
			{
				key: 'Employee-Master',
				label: 'Employee Master',
				url: '/pages/EmployeeMaster',
				icon: 'ri-user-settings-line',
				parentKey: 'master',
			},


			{
				key: 'Bank',
				label: 'Bank Master',
				url: '/pages/BankMaster',
				icon: 'ri-bank-line',
				parentKey: 'master',
			},
			{
				key: 'Contact',
				label: 'Contact Master',
				url: '/pages/ContactMaster',
				icon: 'ri-bank-line',
				parentKey: 'master',
			},
			{
				key: 'AddressMaster',
				label: 'Address Master',
				url: '/pages/AddressMaster',
				icon: 'ri-map-pin-line',
				parentKey: 'master',
			},
		],
	},

	{
		key: 'FormMaster',
		label: 'Form / Template ',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-survey-line',
		roles: ['Admin'],
		children: [
			{
				key: 'Adhoc Master',
				label: 'Adhoc Master',
				url: '/pages/AdhocMaster',
				parentKey: 'FormMaster',
			},
			{
				key: 'Adhoc',
				label: 'Adhoc',
				url: '/pages/Adhoc',
				parentKey: 'FormMaster',
			},
			{
				key: 'Template Master',
				label: 'Template Master',
				url: '/pages/WorkflowBuilderList',
				parentKey: 'FormMaster',
			},

		],
	},
	// {
	// 	key: 'Action',
	// 	label: 'Action',
	// 	icon: 'ri-file-settings-line',
	// 	children: [
	// 		{
	// 			key: 'Action',
	// 			label: 'My Task',
	// 			url: '/pages/Notification',
	// 			icon: 'ri-slideshow-line',
	// 			parentKey: 'Action',
	// 		},
	// 		{
	// 			key: 'ActiveTasks',
	// 			label: 'Active Tasks',
	// 			url: '/pages/ActiveTasks',
	// 			icon: 'ri-slideshow-line',
	// 			parentKey: 'Action',
	// 		},
	// 		{
	// 			key: 'FilterTasks',
	// 			label: 'Filter Tasks',
	// 			url: '/pages/FilterTasks',
	// 			icon: 'ri-slideshow-line',
	// 			parentKey: 'Action',
	// 		},
	// 	],
	// },


	{
		key: 'Notification',
		label: 'My Task',
		isTitle: false,
		icon: 'ri-settings-fill',
		roles: ['Employee', 'Management'],
		children: [
			{
				key: 'Mytask',
				label: 'My Task',
				url: '/pages/admin/Notification',
				icon: 'ri-slideshow-line',
				parentKey: 'Notification',
			},
			{
				key: 'Approval',
				label: 'Approval Console',
				url: '/pages/ApprovalConsole',
				icon: 'ri-dashboard-3-line',
				parentKey: 'Notification',
			}
		]
	},
	{
		key: 'CompletedTask',
		label: 'Completed Task',
		url: '/pages/CompletedTask',
		icon: 'ri-slideshow-line',
		parentKey: 'CompletedTask',
		roles: ['Employee', 'Management']
	},
	{
		key: 'ExpireTask',
		label: 'Expired Tasks',
		url: '/pages/ExpireTask',
		icon: 'ri-slideshow-line',
		parentKey: 'ExpireTask',
		roles: ['Employee', 'Management']
	},
	{
		key: 'TaskPlanned',
		label: 'Planned Tasks',
		url: '/pages/TaskPlanned',
		icon: 'ri-slideshow-line',
		parentKey: 'TaskPlanned',
		roles: ['Employee', 'Management']
	},
	{
		key: 'TaskAdmin',
		label: 'Task Management',
		isTitle: false,
		icon: 'ri-settings-fill',
		roles: ['ProcessCoordinator', 'Admin', 'DME'],
		children: [
			{
				key: 'Mytask',
				label: 'My Task',
				url: '/pages/admin/Notification',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'Track Task',
				label: 'Track Task',
				url: '/pages/TrackTask',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'Other Task',
				label: 'Other Task',
				url: '/pages/OtherTask',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'Approval',
				label: 'Approval Console',
				url: '/pages/ApprovalConsole',
				icon: 'ri-dashboard-3-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'CompletedTask',
				label: 'Completed Task',
				url: '/pages/admin/CompletedTask',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'plannedTask',
				label: 'Planned Task',
				url: '/pages/admin/plannedTask',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'adhocRequest',
				label: 'Adhoc Request',
				url: '/pages/admin/adhocRequest',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
			{
				key: 'ExpireTask',
				label: 'Expired Tasks',
				url: '/pages/ExpireTask',
				icon: 'ri-slideshow-line',
				parentKey: 'TaskAdmin',
			},
		],
	},
	{
		key: 'Analytics',
		label: 'Analytics & Reports',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-user-settings-line',
		roles: ['ProcessCoordinator', 'Admin', 'DME'],
		children: [
			{
				key: 'MIS',
				label: 'MIS Report',
				url: '/pages/MisReport',
				icon: 'ri-slideshow-line',
				parentKey: 'Analytics',
			}
		],
	},
	// {
	// 	key: 'GetTestData',
	// 	label: 'Templates',
	// 	url: '/pages/AdhocTempleteList',
	// 	icon: 'ri-user-settings-line',
	// 	children: [
	// 		{
	// 			key: 'GetTestData-Templates',
	// 			label: 'Create Templates',
	// 			url: '/pages/CreateTemplates',
	// 			icon: 'ri-slideshow-line',
	// 			parentKey: 'GetTestData',
	// 		},
	// 		{
	// 			key: 'GetTestData-Lists',
	// 			label: 'Template Lists',
	// 			url: '/pages/AdhocTempleteList',
	// 			icon: 'ri-slideshow-line',
	// 			parentKey: 'GetTestData',
	// 		},

	// 	],
	// },
	{
		key: 'ConfigMaster',
		label: 'Config Master',
		url: '/pages/Settings',
		icon: 'ri-survey-line',
		children: [
			{
				key: 'Modules',
				label: 'Modules',
				url: '/pages/Modules',
				parentKey: 'ConfigMaster',
			},
			{
				key: 'Process',
				label: 'Process',
				url: '/pages/Process',
				parentKey: 'ConfigMaster',
			},
			{
				key: 'Initiation Master',
				label: ' Initiation Master',
				url: '/pages/ProcessInitiation',
				parentKey: 'ConfigMaster',
			},
			{
				key: 'VendorMaster',
				label: 'Vendor Master',
				url: '/pages/VendorMaster',
				parentKey: 'ConfigMaster',
			},


		],
	},
	{
		key: 'ProcessDataMaster',
		label: 'PD Master',
		isTitle: false,
		icon: 'ri-settings-fill',
		roles: ['ProcessCoordinator', 'Admin', 'DME'],
		children: [
			{
				key: 'ModulesDropdown',
				label: 'Modules Master ',
				parentKey: 'ProcessDataMaster',
				url: '/pages/ModulesMaster',
				icon: 'ri-list-check-3',
			},
			{
				key: 'CommonDropdown',
				label: 'Common Master ',
				parentKey: 'ProcessDataMaster',
				url: '/pages/CommonMaster',
				icon: 'ri-list-check-3',
			},
		],
	},

	{
		key: 'Collaboration',
		label: 'Collaboration',
		url: '/pages/Suggestion',
		icon: 'ri-survey-line',
		roles: ['Admin'],
		children: [
			{
				key: 'MyNotification',
				label: 'Notification',
				url: '/pages/CreateNotification',
				parentKey: 'Collaboration',
			},
			{
				key: 'SuggestionMaster',
				label: 'Suggestions',
				url: '/pages/SuggestionMaster',
				parentKey: 'Collaboration',
			},
			{
				key: 'ViewHelp',
				label: 'Seek Help',
				url: '/pages/ViewHelp',
				parentKey: 'Collaboration',
			}
		],
	},

	{
		key: 'Settings',
		label: 'Settings',
		url: '/pages/Settings',
		icon: 'ri-survey-line',
		children: [
			{
				key: 'Profile',
				label: 'Profile',
				url: '/pages/Profile',
				parentKey: 'Settings',
			},
			{
				key: 'ChangePassword',
				label: 'Change Password',
				url: '/pages/ChangePassword',
				parentKey: 'Settings',
			}
		],
	},








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
				key: 'pages-starter',
				label: 'Starter Page',
				url: '/pages/starter',
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
	{
		key: 'ui',
		icon: 'ri-stack-line',
		label: 'Components',
		isTitle: true,
		children: [
			{
				key: 'base1',
				label: 'Base UI 1',
				parentKey: 'ui',
				children: [
					{
						key: 'ui-accordions',
						label: 'Accordions',
						url: '/ui/accordions',
						parentKey: 'base1',
					},
					{
						key: 'ui-alerts',
						label: 'Alerts',
						url: '/ui/alerts',
						parentKey: 'base1',
					},
					{
						key: 'ui-avatars',
						label: 'Avatars',
						url: '/ui/avatars',
						parentKey: 'base1',
					},
					{
						key: 'ui-badges',
						label: 'Badges',
						url: '/ui/badges',
						parentKey: 'base1',
					},
					{
						key: 'ui-breadcrumb',
						label: 'Breadcrumb',
						url: '/ui/breadcrumb',
						parentKey: 'base1',
					},
					{
						key: 'ui-buttons',
						label: 'Buttons',
						url: '/ui/buttons',
						parentKey: 'base1',
					},
					{
						key: 'ui-cards',
						label: 'Cards',
						url: '/ui/cards',
						parentKey: 'base1',
					},
					{
						key: 'ui-carousel',
						label: 'Carousel',
						url: '/ui/carousel',
						parentKey: 'base1',
					},
					{
						key: 'ui-dropdowns',
						label: 'Dropdowns',
						url: '/ui/dropdowns',
						parentKey: 'base1',
					},
					{
						key: 'ui-embed-video',
						label: 'Embed Video',
						url: '/ui/embed-video',
						parentKey: 'base1',
					},
					{
						key: 'ui-grid',
						label: 'Grid',
						url: '/ui/grid',
						parentKey: 'base1',
					},
					{
						key: 'ui-list-group',
						label: 'List Group',
						url: '/ui/list-group',
						parentKey: 'base1',
					},
					{
						key: 'ui-links',
						label: 'Links',
						url: '/ui/links',
						parentKey: 'base1',
					},
				],
			},
			{
				key: 'base2',
				label: 'Base UI 2',
				parentKey: 'ui',
				children: [
					{
						key: 'ui-modals',
						label: 'Modals',
						url: '/ui/modals',
						parentKey: 'base2',
					},
					{
						key: 'ui-notifications',
						label: 'Notifications',
						url: '/ui/notifications',
						parentKey: 'base2',
					},
					{
						key: 'ui-offcanvas',
						label: 'Offcanvas',
						url: '/ui/offcanvas',
						parentKey: 'base2',
					},
					{
						key: 'ui-placeholders',
						label: 'Placeholders',
						url: '/ui/placeholders',
						parentKey: 'base2',
					},
					{
						key: 'ui-pagination',
						label: 'Pagination',
						url: '/ui/pagination',
						parentKey: 'base2',
					},
					{
						key: 'ui-popovers',
						label: 'Popovers',
						url: '/ui/popovers',
						parentKey: 'base2',
					},
					{
						key: 'ui-progress',
						label: 'Progress',
						url: '/ui/progress',
						parentKey: 'base2',
					},

					{
						key: 'ui-spinners',
						label: 'Spinners',
						url: '/ui/spinners',
						parentKey: 'base2',
					},
					{
						key: 'ui-tabs',
						label: 'Tabs',
						url: '/ui/tabs',
						parentKey: 'base2',
					},
					{
						key: 'ui-tooltips',
						label: 'Tooltips',
						url: '/ui/tooltips',
						parentKey: 'base2',
					},
					{
						key: 'ui-typography',
						label: 'Typography',
						url: '/ui/typography',
						parentKey: 'base2',
					},
					{
						key: 'ui-utilities',
						label: 'Utilities',
						url: '/ui/utilities',
						parentKey: 'base2',
					},
				],
			},
			{
				key: 'extended',
				label: 'Extended UI',
				parentKey: 'ui',
				children: [
					{
						key: 'extended-portlets',
						label: 'Portlets',
						url: '/extended-ui/portlets',
						parentKey: 'extended',
					},
					{
						key: 'extended-scrollbar',
						label: 'Scrollbar',
						url: '/extended-ui/scrollbar',
						parentKey: 'extended',
					},
					{
						key: 'extended-range-slider',
						label: 'Range Slider',
						url: '/extended-ui/range-slider',
						parentKey: 'extended',
					},
				],
			},
			{
				key: 'forms',
				label: 'Forms',
				parentKey: 'ui',
				children: [
					{
						key: 'forms-basic-elements',
						label: 'Basic Elements',
						url: '/ui/forms/basic-elements',
						parentKey: 'forms',
					},
					{
						key: 'forms-form-advanced',
						label: 'Form Advanced',
						url: '/ui/forms/form-advanced',
						parentKey: 'forms',
					},
					{
						key: 'forms-validation',
						label: 'Form Validation',
						url: '/ui/forms/validation',
						parentKey: 'forms',
					},
					{
						key: 'forms-wizard',
						label: 'Form Wizard',
						url: '/ui/forms/wizard',
						parentKey: 'forms',
					},
					{
						key: 'forms-file-uploads',
						label: 'File Uploads',
						url: '/ui/forms/file-uploads',
						parentKey: 'forms',
					},
					{
						key: 'forms-editors',
						label: 'Form Editors',
						url: '/ui/forms/editors',
						parentKey: 'forms',
					},
					{
						key: 'forms-image-crop',
						label: 'Image Crop',
						url: '/ui/forms/image-crop',
						parentKey: 'forms',
					},
					{
						key: 'forms-editable',
						label: 'Editable',
						url: '/ui/forms/editable',
						parentKey: 'forms',
					},
				],
			},
			{
				key: 'charts',
				label: 'Charts',
				isTitle: false,
				children: [
					{
						key: 'apex-charts',
						label: 'Apex Charts',
						url: '/charts/apex-charts',
						parentKey: 'charts',
					},
					{
						key: 'chartjs-charts',
						label: 'ChartJS',
						url: '/charts/chartjs',
						parentKey: 'charts',
					},
					{
						key: 'Sparkline-charts',
						label: 'Sparkline Charts',
						url: '/charts/sparkline-charts',
						parentKey: 'charts',
					},
				],
			},
			{
				key: 'tables',
				label: 'Tables',
				isTitle: false,
				children: [
					{
						key: 'tables-basic',
						label: 'Basic Tables',
						url: '/ui/tables/basic-tables',
						parentKey: 'tables',
					},
					{
						key: 'tables-data',
						label: 'Data Tables',
						url: '/ui/tables/data-tables',
						parentKey: 'tables',
					},
				],
			},
			{
				key: 'icons',
				label: 'Icons',
				isTitle: false,
				children: [
					{
						key: 'icons-remix',
						label: 'Remix icons',
						url: '/ui/icons/remix-icons',
						parentKey: 'icons',
					},
					{
						key: 'icons-Bootstrap',
						label: 'Bootstrap icons',
						url: '/ui/icons/Bootstrap-icons',
						parentKey: 'icons',
					},
					{
						key: 'icons-Material Icons',
						label: 'Material Design Icons',
						url: '/ui/icons/Material-icons',
						parentKey: 'icons',
					},
				],
			},
			{
				key: 'maps',
				label: 'Maps',
				isTitle: false,
				children: [
					{
						key: 'maps-google-maps',
						label: 'Google maps',
						url: '/ui/maps/google-maps',
						parentKey: 'maps',
					},
					{
						key: 'maps-vector-maps',
						label: 'Vector maps',
						url: '/ui/maps/vector-maps',
						parentKey: 'maps',
					},
				],
			},
		],
	},
]

export { MENU_ITEMS, HORIZONTAL_MENU_ITEMS }
