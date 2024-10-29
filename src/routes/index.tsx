import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

// components
import PrivateRoute from './PrivateRoute'

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/auth/Login'))
const Register = React.lazy(() => import('../pages/auth/Register'))
const Logout = React.lazy(() => import('../pages/auth/Logout'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))
const LockScreen = React.lazy(() => import('../pages/auth/LockScreen'))

// // dashboard
const Dashboard = React.lazy(() => import('../pages/Dashboard'))

// // pages
const ProfilePages = React.lazy(() => import('../pages/other/Profile/'))
const InvoicePages = React.lazy(() => import('../pages/other/Invoice'))
const FAQPages = React.lazy(() => import('../pages/other/FAQ'))
const PricingPages = React.lazy(() => import('../pages/other/Pricing'))
const MaintenancePages = React.lazy(() => import('../pages/other/Maintenance'))
const TemplateMaster = React.lazy(() => import('../pages/other/Modules-Master.tsx'))
const ActiveTasks = React.lazy(() => import('../pages/other/ActiveTasks.tsx'))
const ActiveProject = React.lazy(() => import('../pages/other/ActiveProject.tsx'))
const Notification = React.lazy(() => import('../pages/other/Notification.tsx'))
const ModuleList = React.lazy(() => import('../pages/other/Module-list.tsx'))
const EmployeeMaster = React.lazy(() => import('../pages/other/Employee-Master.tsx'))
const Tender = React.lazy(() => import('../pages/other/Tender.tsx'))
const Vender = React.lazy(() => import('../pages/other/Vender.tsx'))
const Bank = React.lazy(() => import('../pages/other/Bank.tsx'))
const ModuleMaster = React.lazy(() => import('../pages/other/ModuleMaster.tsx'))
const TaskMaster = React.lazy(() => import('../pages/other/TaskMaster.tsx'))
const FormMaster = React.lazy(() => import('../pages/other/FormMaster.tsx'))
const MyTask = React.lazy(() => import('../pages/other/MyTask.tsx'))
const ChkLnMaster = React.lazy(() => import('../pages/other/ChkLnMaster.tsx'))
const TicketMaster = React.lazy(() => import('../pages/other/TicketMaster.tsx'))
const SystemLogs = React.lazy(() => import('../pages/other/SystemLogs.tsx'))
const ChkTaskMaster = React.lazy(() => import('../pages/other/ChkTaskMaster.tsx'))
const ChecklistMaster = React.lazy(() => import('../pages/other/ChecklistCollection.tsx'))
const AddressMaster = React.lazy(() => import('../pages/other/AddressMaster.tsx'))
const CompletedTask = React.lazy(() => import('../pages/other/CompletedTask.tsx'))
const TaskPlanned = React.lazy(() => import('../pages/other/TaskPlanned.tsx'))
const ExpireTask = React.lazy(() => import('../pages/other/ExpireTask.tsx'))
const PendingTask = React.lazy(() => import('../pages/other/PendingTask.tsx'))
const RunningTask = React.lazy(() => import('../pages/other/RunningTask.tsx'))
const ModuleMasterNew = React.lazy(() => import('../pages/other/ModuleMaster/ModuleMaster.tsx'))
const ModuleMasterinsert = React.lazy(() => import('../pages/other/ModuleMaster/ModuleMasterInsert.tsx'))
const ProcessMasterNew = React.lazy(() => import('../pages/other/ProcessMaster/ProcessMaster.tsx'))
const ProcessMasterinsert = React.lazy(() => import('../pages/other/ProcessMaster/ProcessMasterInsert.tsx'))
const DoerMasterNew = React.lazy(() => import('../pages/other/DoerMaster/DoerMaster.tsx'))
const DoerMasterinsert = React.lazy(() => import('../pages/other/DoerMaster/DoerMasterinsert.tsx'))
const ProjectMasterNew = React.lazy(() => import('../pages/other/ProjectMaster/ProjectMaster.tsx'))
const ProjectMasterinsert = React.lazy(() => import('../pages/other/ProjectMaster/ProjectMasterinsert.tsx'))
const ProjectSubmasterinsert = React.lazy(() => import('../pages/other/ProjectMaster/ProjectSubmasterinsert.tsx'))
const EmployeeMasterNew = React.lazy(() => import('../pages/other/EmployeeMaster/EmployeeMaster.tsx'))
const EmployeeMasterinsert = React.lazy(() => import('../pages/other/EmployeeMaster/EmployeeMasterinsert.tsx'))
const RoleMasterNew = React.lazy(() => import('../pages/other/RoleMaster/RoleMaster.tsx'))
const RoleMasterinsert = React.lazy(() => import('../pages/other/RoleMaster/RoleMasterinsert.tsx'))
const IdentifierMaster = React.lazy(() => import('../pages/other/Identifier/IdentifierMaster.tsx'))
const IdentifierMasterinsert = React.lazy(() => import('../pages/other/Identifier/Identifiermasterinsert.tsx'))
const MessMaster = React.lazy(() => import('../pages/other/MessMaster/MessMaster.tsx'))
const MessMasterinsert = React.lazy(() => import('../pages/other/MessMaster/MessMasterinsert.tsx'))
const Requirementmaster = React.lazy(() => import('../pages/other/HrMaster/RequirementMaster/Requirementmaster.tsx'))
const Requirementmasterinsert = React.lazy(() => import('../pages/other/HrMaster/RequirementMaster/RequirementMasterinsert.tsx'))
const DesignationMaster = React.lazy(() => import('../pages/other/HrMaster/DesignationMaster/DesignationMaster.tsx'))
const DesignationMasterinsert = React.lazy(() => import('../pages/other/HrMaster/DesignationMaster/DesignationMasterinsert.tsx'))
const DepartmentMaster = React.lazy(() => import('../pages/other/DepartmentMaster/DepartmentMaster.tsx'))
const DepartmentMasterinsert = React.lazy(() => import('../pages/other/DepartmentMaster/DepartmentMasterinsert.tsx'))
const TenderMaster = React.lazy(() => import('../pages/other/TenderMaster/TenderMaster.tsx'))
const TenderMasterinsert = React.lazy(() => import('../pages/other/TenderMaster/TenderMasterinsert.tsx'))
const HrInputMaster = React.lazy(() => import('../pages/other/HrMaster/HrInputMaster/HrInputmaster.tsx'))
const HrInputMasterinsert = React.lazy(() => import('../pages/other/HrMaster/HrInputMaster/HrInputMasterinsert.tsx'))
const HrTaskMaster = React.lazy(() => import('../pages/other/HrMaster/HrTaskMaster/HrTaskMaster.tsx'))
const HrTaskMasterinsert = React.lazy(() => import('../pages/other/HrMaster/HrTaskMaster/HrTaskMasterinsert.tsx'))
const HrDoerMaster = React.lazy(() => import('../pages/other/HrMaster/HrDoerMaster/HrDoerMaster.tsx'))
const HrDoerMasterinsert = React.lazy(() => import('../pages/other/HrMaster/HrDoerMaster/HrDoerMasterinsert.tsx'))
const HrResumeMaster = React.lazy(() => import('../pages/other/HrMaster/HrResumeMaster/HrResumeMaster.tsx'))
const HrResumeMasterinsert = React.lazy(() => import('../pages/other/HrMaster/HrResumeMaster/HrResumeMasterinsert.tsx'))
const BdInputMaster = React.lazy(() => import('../pages/other/BdMaster/BdInputMaster/BdInputMaster.tsx'))
const BdInputMasterinsert = React.lazy(() => import('../pages/other/BdMaster/BdInputMaster/BdInputMasterinsert.tsx'))
const BdTaskMaster = React.lazy(() => import('../pages/other/BdMaster/BdTaskMaster/BdTaskMaster.tsx'))
const BdTaskMasterinsert = React.lazy(() => import('../pages/other/BdMaster/BdTaskMaster/BdTaskMasterinsert.tsx'))
const BdDoerMaster = React.lazy(() => import('../pages/other/BdMaster/BdDoermaster/BdDoerMaster.tsx'))
const BdDoerMasterinsert = React.lazy(() => import('../pages/other/BdMaster/BdDoermaster/BdDoerMasterinsert.tsx'))






const ContactListPages = React.lazy(() => import('../pages/other/ContactList'))
const TimelinePages = React.lazy(() => import('../pages/other/Timeline'))


// // error
const Error404 = React.lazy(() => import('../pages/error/Error404'))
const Error404Alt = React.lazy(() => import('../pages/error/Error404Alt'))
const Error500 = React.lazy(() => import('../pages/error/Error500'))

export interface RoutesProps {
	path: RouteProps['path']
	name?: string
	element?: RouteProps['element']
	route?: any
	exact?: boolean
	icon?: string
	header?: string
	roles?: string[]
	children?: RoutesProps[]
}

// dashboards
const dashboardRoutes: RoutesProps = {
	path: '/admin',
	name: 'Dashboards',
	icon: 'home',
	header: 'Navigation',
	children: [
		{
			path: '/',
			name: 'Root',
			element: <Dashboard />,
			route: PrivateRoute,
		},
		{
			path: '/dashboard',
			name: 'Dashboard',
			element: <Dashboard />,
			route: PrivateRoute,
		},
	],
}

// pages
const customPagesRoutes = {
	path: '/pages',
	name: 'Pages',
	icon: 'pages',
	header: 'Custom',
	children: [
		{
			path: '/pages/profile',
			name: 'Profile',
			element: <ProfilePages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/invoice',
			name: 'Invoice',
			element: <InvoicePages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/faq',
			name: 'FAQ',
			element: <FAQPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/pricing',
			name: 'Pricing',
			element: <PricingPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Modules-Master',
			name: 'Modules Master',
			element: <TemplateMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CreateTemplates',
			name: 'Create Templates',
			element: <TemplateMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CreateTemplates',
			name: 'Modules Master',
			element: <TemplateMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ActiveTasks',
			name: 'Active Tasks',
			element: <ActiveTasks />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ActiveProject',
			name: 'Active Tasks',
			element: <ActiveProject />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DoerMaster',
			name: 'ModuleMaster ',
			element: <DoerMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DoerMasterinsert/:id',
			name: 'DoerMasterinsert ',
			element: <DoerMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DoerMasterinsert',
			name: 'DoerMasterinsert ',
			element: <DoerMasterinsert />,
			route: PrivateRoute,
		},
		// {
		// 	path: '/pages/FilterTasks',
		// 	name: 'Filter Tasks',
		// 	element: <Filtertask />,
		// 	route: PrivateRoute,
		// },
		
		{
			path: '/pages/Notification',
			name: 'Notification',
			element: <Notification />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Module-list',
			name: 'Modules List',
			element: <ModuleList />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Employee-Master',
			name: 'Employee Master',
			element: <EmployeeMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MessMaster',
			name: 'Mess Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Tender',
			name: 'Tender Master',
			element: <Tender />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Vender',
			name: 'Vender Master',
			element: <Vender />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Bank',
			name: 'Bank Master',
			element: <Bank />,
			route: PrivateRoute,
		},
	
	
		{
			path: '/pages/TaskMaster',
			name: 'Task Master',
			element: <TaskMaster />,
			route: PrivateRoute,
		},

		{
			path: '/pages/FormMaster',
			name: 'Form Master',
			element: <FormMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MyTask',
			name: 'MyTask',
			element: <MyTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ChkLnMaster',
			name: 'CHK LN Master',
			element: <ChkLnMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TicketMaster',
			name: 'Ticket Master',
			element: <TicketMaster />,
			route: PrivateRoute,
		},
		
		{
			path: '/pages/SystemLogs',
			name: 'System Logs',
			element: <SystemLogs />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ChkTaskMaster',
			name: 'CHK Task Master',
			element: <ModuleMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ChkInputMaster',
			name: 'CHK Input Master',
			element: <ChkTaskMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ChecklistMaster',
			name: 'CheckList Master',
			element: <ChecklistMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/AddressMaster',
			name: 'Address Master',
			element: <AddressMaster />,
			route: PrivateRoute,
		},


		{
			path: '/pages/CompletedTask',
			name: 'Completed Task',
			element: <CompletedTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ExpireTask',
			name: 'Expire Task',
			element: <ExpireTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TaskPlanned',
			name: 'Task Planned ',
			element: <TaskPlanned />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PendingTask',
			name: 'Pending Task ',
			element: <PendingTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RunningTask',
			name: 'Running Task ',
			element: <RunningTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ModuleMaster',
			name: 'ModuleMaster ',
			element: <ModuleMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ModuleMasterinsert/:id',
			name: 'ModuleMasterinsert ',
			element: <ModuleMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ModuleMasterinsert',
			name: 'ModuleMasterinsert ',
			element: <ModuleMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProcessMaster',
			name: 'ModuleMaster ',
			element: <ProcessMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProcessMasterinsert/:id',
			name: 'ProcessMasterinsert ',
			element: <ProcessMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProcessMasterinsert',
			name: 'ProcessMasterinsert ',
			element: <ProcessMasterinsert />,
			route: PrivateRoute,
		},

		{
			path: '/pages/EmployeeMaster',
			name: 'EmployeeMasterNew ',
			element: <EmployeeMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/EmployeeMasterinsert/:id',
			name: 'ProcessMasterinsert ',
			element: <EmployeeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/EmployeeMasterinsert',
			name: 'ProcessMasterinsert ',
			element: <EmployeeMasterinsert />,
			route: PrivateRoute,
		},
		
		{
			path: '/pages/ProjectMaster',
			name: 'ProjectMasterNew ',
			element: <ProjectMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectMasterinsert/:id',
			name: 'ProjectMasterinsert ',
			element: <ProjectMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectMasterinsert',
			name: 'ProjectMasterinsert ',
			element: <ProjectMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectSubmasterinsert/:id',
			name: 'ProjectSubmasterinsert ',
			element: <ProjectSubmasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectSubmasterinsert',
			name: 'ProjectSubmasterinsert ',
			element: <ProjectSubmasterinsert />,
			route: PrivateRoute,
		},

		{
			path: '/pages/RoleMaster',
			name: 'RoleMasterNew ',
			element: <RoleMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RoleMasterinsert/:id',
			name: 'RoleMasterinsert ',
			element: <RoleMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RoleMasterinsert',
			name: 'RoleMasterinsert ',
			element: <RoleMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/IdentifierMaster',
			name: 'IdentifierMaster ',
			element: <IdentifierMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/IdentifierMasterinsert/:id',
			name: 'IdentifierMasterinsert ',
			element: <IdentifierMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/IdentifierMasterinsert',
			name: 'IdentifierMasterinsert ',
			element: <IdentifierMasterinsert />,
			route: PrivateRoute,
		},

		{
			path: '/pages/MessMasterinsert/:id',
			name: 'MessMasterinsert ',
			element: <MessMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MessMasterinsert',
			name: 'MessMasterinsert ',
			element: <MessMasterinsert />,
			route: PrivateRoute,
		},


		{
			path: '/pages/Requirementmaster',
			name: 'Requirementmaster ',
			element: <Requirementmaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Requirementmasterinsert/:id',
			name: 'Requirementmasterinsert ',
			element: <Requirementmasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Requirementmasterinsert',
			name: 'Requirementmasterinsert ',
			element: <Requirementmasterinsert />,
			route: PrivateRoute,
		},

		{
			path: '/pages/DesignationMaster',
			name: 'DesignationMaster ',
			element: <DesignationMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DesignationMasterinsert/:id',
			name: 'DesignationMasterinsert ',
			element: <DesignationMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DesignationMasterinsert',
			name: 'DesignationMasterinsert ',
			element: <DesignationMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DepartmentMaster',
			name: 'DepartmentMaster ',
			element: <DepartmentMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DepartmentMasterinsert/:id',
			name: 'DepartmentMasterinsert ',
			element: <DepartmentMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DepartmentMasterinsert',
			name: 'DepartmentMasterinsert ',
			element: <DepartmentMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TenderMaster',
			name: 'TenderMaster ',
			element: <TenderMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TenderMasterinsert/:id',
			name: 'TenderMasterinsert ',
			element: <TenderMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TenderMasterinsert',
			name: 'TenderMasterinsert ',
			element: <TenderMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrInputMaster',
			name: 'HrInputMaster ',
			element: <HrInputMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrInputMasterinsert/:id',
			name: 'HrInputMasterinsert ',
			element: <HrInputMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrInputMasterinsert',
			name: 'HrInputMasterinsert ',
			element: <HrInputMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrTaskMaster',
			name: 'HrTaskMaster ',
			element: <HrTaskMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrTaskMasterinsert/:id',
			name: 'HrTaskMasterinsert ',
			element: <HrTaskMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrTaskMasterinsert',
			name: 'HrTaskMasterinsert ',
			element: <HrTaskMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrDoerMaster',
			name: 'HrDoerMaster ',
			element: <HrDoerMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrDoerMasterinsert/:id',
			name: 'HrDoerMasterinsert ',
			element: <HrDoerMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrDoerMasterinsert',
			name: 'HrDoerMasterinsert ',
			element: <HrDoerMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrResumeMaster',
			name: 'HrResumeMaster ',
			element: <HrResumeMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrResumeMasterinsert/:id',
			name: 'HrResumeMasterinsert ',
			element: <HrResumeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrResumeMasterinsert',
			name: 'HrResumeMasterinsert ',
			element: <HrResumeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdTaskMaster',
			name: 'BdTaskMaster ',
			element: <BdTaskMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdTaskMasterinsert/:id',
			name: 'BdTaskMasterinsert ',
			element: <BdTaskMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdTaskMasterinsert',
			name: 'BdTaskMasterinsert ',
			element: <BdTaskMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdInputMaster',
			name: 'BdInputMaster ',
			element: <BdInputMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdInputMasterinsert/:id',
			name: 'BdInputMasterinsert ',
			element: <BdInputMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdInputMasterinsert',
			name: 'BdInputMasterinsert ',
			element: <BdInputMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdDoerMaster',
			name: 'BdDoerMaster ',
			element: <BdDoerMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdDoerMasterinsert/:id',
			name: 'BdDoerMasterinsert ',
			element: <BdDoerMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BdDoerMasterinsert',
			name: 'BdDoerMasterinsert ',
			element: <BdDoerMasterinsert />,
			route: PrivateRoute,
		},

		///////////////////////////////////////////////////////////////////////////////////////////
		{
			path: '/pages/contact-list',
			name: 'Contact List',
			element: <ContactListPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/timeline',
			name: 'Timeline',
			element: <TimelinePages />,
			route: PrivateRoute,
		},
		{
			path: 'pages/error-404-alt',
			name: 'Error - 404-alt',
			element: <Error404Alt />,
			route: PrivateRoute,
		},
	],
}



// auth
const authRoutes: RoutesProps[] = [
	{
		path: '/auth/login',
		name: 'Login',
		element: <Login />,
		route: Route,
	},
	{
		path: '/auth/register',
		name: 'Register',
		element: <Register />,
		route: Route,
	},
	{
		path: '/auth/logout',
		name: 'Logout',
		element: <Logout />,
		route: Route,
	},
	{
		path: '/auth/forgot-password',
		name: 'Forgot Password',
		element: <ForgotPassword />,
		route: Route,
	},
	{
		path: '/auth/lock-screen',
		name: 'Lock Screen',
		element: <LockScreen />,
		route: Route,
	},
]

// public routes
const otherPublicRoutes = [
	{
		path: '*',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-404',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-500',
		name: 'Error - 500',
		element: <Error500 />,
		route: Route,
	},
	{
		path: '/pages/maintenance',
		name: 'Maintenance',
		element: <MaintenancePages />,
		route: Route,
	},
]

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
	let flatRoutes: RoutesProps[] = []

	routes = routes || []
	routes.forEach((item: RoutesProps) => {
		flatRoutes.push(item)
		if (typeof item.children !== 'undefined') {
			flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)]
		}
	})
	return flatRoutes
}

// All routes
const authProtectedRoutes = [dashboardRoutes, customPagesRoutes]
const publicRoutes = [...authRoutes, ...otherPublicRoutes]

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes])
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes])
export {
	publicRoutes,
	authProtectedRoutes,
	authProtectedFlattenRoutes,
	publicProtectedFlattenRoutes,
}