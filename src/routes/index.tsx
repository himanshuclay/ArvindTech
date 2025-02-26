import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

// components
import PrivateRoute from './PrivateRoute'
import AdhocMaster from '@/pages/other/AdminSide/AdhocMaster.tsx'
import ModulesMaster from '@/pages/other/ModulesMaster/ModulesMaster.tsx'
import { MODULES_MASTER } from './ModulesMaster.tsx'
// import FormBuilder from '@/pages/FormBuilder/FormBuilder.tsx'

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
const MisReport = React.lazy(() => import('../pages/other/Component/MisReport.tsx'))
const AdhocTempleteList = React.lazy(() => import('../pages/other/AdminSide/AdhocTempleteList.tsx'))
const FAQPages = React.lazy(() => import('../pages/other/FAQ'))
const PricingPages = React.lazy(() => import('../pages/other/Pricing'))
const MaintenancePages = React.lazy(() => import('../pages/other/Maintenance'))
const TemplateMaster = React.lazy(() => import('../pages/other/Modules-Master.tsx'))
const ActiveTasks = React.lazy(() => import('../pages/other/ActiveTasks.tsx'))
const ActiveProject = React.lazy(() => import('../pages/other/ActiveProject.tsx'))
const ApprovalConsole = React.lazy(() => import('../pages/other/ApprovalConsole.tsx'))
const NotificationPage = React.lazy(() => import('../pages/other/Component/NotificationPage.tsx'))
const Notification = React.lazy(() => import('../pages/other/DoerSide/Notification.tsx'))
const FormMaster = React.lazy(() => import('../pages/other/FormMaster.tsx'))
const LnMaster = React.lazy(() => import('../pages/other/AdminSide/LnMaster/LnMaster.tsx'))
const ChkLnMaster = React.lazy(() => import('../pages/other/ChkLnMaster.tsx'))
const TicketMaster = React.lazy(() => import('../pages/other/TicketMaster.tsx'))
const SystemLogs = React.lazy(() => import('../pages/other/SystemLogs.tsx'))
const ChkTaskMaster = React.lazy(() => import('../pages/other/ChkTaskMaster.tsx'))
const ChecklistMaster = React.lazy(() => import('../pages/other/ChecklistCollection.tsx'))
const CompletedTask = React.lazy(() => import('../pages/other/DoerSide/CompletedTask.tsx'))
const TaskPlanned = React.lazy(() => import('../pages/other/TaskPlanned.tsx'))
const ExpireTask = React.lazy(() => import('../pages/other/DoerSide/ExpireTask.tsx'))
const PendingTask = React.lazy(() => import('../pages/other/DoerSide/PendingTask.tsx'))
const RunningTask = React.lazy(() => import('../pages/other/RunningTask.tsx'))
const ModuleMasterNew = React.lazy(() => import('../pages/other/AdminSide/ModuleMaster/ModuleMaster.tsx'))
const FormList = React.lazy(() => import('../pages/other/AdminSide/FormBuilderMaster/FormList.tsx'))
const FormBuilder = React.lazy(() => import('../pages/FormBuilder/FormBuilder.tsx'))
const ModuleMasterinsert = React.lazy(() => import('../pages/other/AdminSide/ModuleMaster/ModuleMasterInsert.tsx'))
const ProcessMasterNew = React.lazy(() => import('../pages/other/AdminSide/ProcessMaster/ProcessMaster.tsx'))
const ProcessMasterinsert = React.lazy(() => import('../pages/other/AdminSide/ProcessMaster/ProcessMasterInsert.tsx'))
const DoerMasterNew = React.lazy(() => import('../pages/other/AdminSide/DoerMaster/DoerMaster.tsx'))
const DoerMasterinsert = React.lazy(() => import('../pages/other/AdminSide/DoerMaster/DoerMasterinsert.tsx'))
const ProjectMasterNew = React.lazy(() => import('../pages/other/AdminSide/ProjectMaster/ProjectMaster.tsx'))
const ProjectMasterinsert = React.lazy(() => import('../pages/other/AdminSide/ProjectMaster/ProjectMasterinsert.tsx'))
const ProjectSubmasterinsert = React.lazy(() => import('../pages/other/AdminSide/ProjectMaster/ProjectSubmasterinsert.tsx'))
const EmployeeMasterNew = React.lazy(() => import('../pages/other/AdminSide/EmployeeMaster/EmployeeMaster.tsx'))
const EmployeeMasterinsert = React.lazy(() => import('../pages/other/AdminSide/EmployeeMaster/EmployeeMasterinsert.tsx'))
const RoleMasterNew = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/RoleMaster/RoleMaster.tsx'))
const RoleMasterinsert = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/RoleMaster/RoleMasterinsert.tsx'))
const IdentifierMaster = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/Identifier/IdentifierMaster.tsx'))
const IdentifierMasterinsert = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/Identifier/Identifiermasterinsert.tsx'))
const MessMaster = React.lazy(() => import('../pages/other/AdminSide/MessMaster/MessMaster.tsx'))
const MessMasterinsert = React.lazy(() => import('../pages/other/AdminSide/MessMaster/MessMasterinsert.tsx'))
const Requirementmaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/RequirementMaster/Requirementmaster.tsx'))
const Requirementmasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/RequirementMaster/RequirementMasterinsert.tsx'))
const DesignationMaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/DesignationMaster/DesignationMaster.tsx'))
const DesignationMasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/DesignationMaster/DesignationMasterinsert.tsx'))
const DepartmentMaster = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/DepartmentMaster/DepartmentMaster.tsx'))
const DepartmentMasterinsert = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/DepartmentMaster/DepartmentMasterinsert.tsx'))
const TenderMaster = React.lazy(() => import('../pages/other/AdminSide/TenderMaster/TenderMaster.tsx'))
const TenderMasterinsert = React.lazy(() => import('../pages/other/AdminSide/TenderMaster/TenderMasterinsert.tsx'))
const HrInputMaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrInputMaster/HrInputmaster.tsx'))
const HrInputMasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrInputMaster/HrInputMasterinsert.tsx'))
const HrTaskMaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrTaskMaster/HrTaskMaster.tsx'))
const HrTaskMasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrTaskMaster/HrTaskMasterinsert.tsx'))
const HrDoerMaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrDoerMaster/HrDoerMaster.tsx'))
const HrDoerMasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrDoerMaster/HrDoerMasterinsert.tsx'))
const HrResumeMaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrResumeMaster/HrResumeMaster.tsx'))
const HrResumeMasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrResumeMaster/HrResumeMasterinsert.tsx'))
const HrCandidateMaster = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrCandidateMaster/HrCandidateMaster.tsx'))
const HrCandidateMasterinsert = React.lazy(() => import('../pages/other/AdminSide/HrMaster/HrCandidateMaster/HrCandidateMasterinsert.tsx'))
const AddressMaster = React.lazy(() => import('../pages/other/AdminSide/AddressMaster/AddressMaster.tsx'))
const AddressMasterinsert = React.lazy(() => import('../pages/other/AdminSide/AddressMaster/AddressMasterinsert.tsx'))
const BankMaster = React.lazy(() => import('../pages/other/AdminSide/BankMaster/BankMaster.tsx'))
const BankMasterinsert = React.lazy(() => import('../pages/other/AdminSide/BankMaster/BankMasterinsert.tsx'))
const ContactMaster = React.lazy(() => import('../pages/other/AdminSide/ContactMaster/ContactMaster.tsx'))
const ContactMasterinsert = React.lazy(() => import('../pages/other/AdminSide/ContactMaster/ContactMasterInsert.tsx'))
const FillingFrequencyMaster = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/FillingFrequencyMaster/FillingFrequencyMaster.tsx'))
const FillingFrequencyMasterinsert = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/FillingFrequencyMaster/FillingFrequencyMasterinsert.tsx'))
const ManagementContractMaster = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/ManagementContractMaster/ManagementContractMaster.tsx'))
const ManagementContractMasterinsert = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/ManagementContractMaster/ManagementContractMasterinsert.tsx'))
const TrackTask = React.lazy(() => import('../pages/other/AdminSide/TrackTask/TrackTask.tsx'))

const ProjectTypeMaster = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/ProjectTypeMaster/ProjectTypeMaster.tsx'))
const ProjectTypeMasterinsert = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/ProjectTypeMaster/ProjectTypeMasterinsert.tsx'))

const VenderMaster = React.lazy(() => import('../pages/other/AdminSide/VenderMaster/VenderMaster.tsx'))
const VenderMasterinsert = React.lazy(() => import('../pages/other/AdminSide/VenderMaster/VenderMasterinsert.tsx'))
const MyPendingTask = React.lazy(() => import('../pages/other/DoerSide/PendingDoerTask.tsx'))
const ProcessManualInitiation = React.lazy(() => import('../pages/other/AdminSide/ProcessMaster/ProcessManualInitiation.tsx'))
const ProcessInitiation = React.lazy(() => import('../pages/other/AdminSide/ProcessMaster/ProcessInitiation.tsx'))
const TaskMasterNew = React.lazy(() => import('../pages/other/AdminSide/TaskMaster/TaskMaster.tsx'))
const CommonMaster = React.lazy(() => import('../pages/other/AdminSide/CommonMaster/CommonMasterPage.tsx'))
const CommonModule = React.lazy(() => import('../pages/other/CommonModule-process/Module.tsx'))
const CommonProcess = React.lazy(() => import('../pages/other/CommonModule-process/Process.tsx'))
const CreateNotification = React.lazy(() => import('../pages/other/Component/ViewTask/CreateNotification/CreateNotification.tsx'))



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
			path: '/pages/AdhocTempleteList',
			name: 'AdhocTempleteList',
			element: <AdhocTempleteList />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MisReport',
			name: 'MisReport',
			element: <MisReport />,
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
			name: 'Active Project',
			element: <ActiveProject />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DoerMaster',
			name: 'ModuleMaster ',
			element: <DoerMasterNew />,
			route: PrivateRoute,
			roles: ['Admin'],
		},
		{
			path: '/pages/DoerMasterinsert/:id',
			name: 'DoerMasterinsert ',
			element: <DoerMasterinsert />,
			route: PrivateRoute,
			roles: ['Admin', 'ProjectCoordinator'],
		},
		{
			path: '/pages/DoerMasterinsert',
			name: 'DoerMasterinsert ',
			element: <DoerMasterinsert />,
			route: PrivateRoute,
			roles: ['Admin', 'ProjectCoordinator'],

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
			path: '/pages/admin/Notification',
			name: 'Notification',
			element: <Notification />,
			route: PrivateRoute,
		},
		{
			path: '/pages/admin/CompletedTask',
			name: 'CompletedTask',
			element: <CompletedTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ApprovalConsole',
			name: 'Approval Console',
			element: <ApprovalConsole />,
			route: PrivateRoute,
		},

		{
			path: '/pages/MessMaster',
			name: 'Mess Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},



		{
			path: '/pages/FormMaster',
			name: 'Form Master',
			element: <FormMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/AdhocMaster',
			name: 'Adhoc Master',
			element: <AdhocMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/LnMaster',
			name: 'LnMaster',
			element: <LnMaster />,
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
			element: <ChkTaskMaster />,
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
			path: '/pages/FormList',
			name: 'FormList ',
			element: <FormList />,
			route: PrivateRoute,
		},
		{
			path: '/pages/FormBuilder/:id',
			name: 'FormBuilder ',
			element: <FormBuilder />,
			route: PrivateRoute,
		},
		{
			path: '/pages/FormBuilder',
			name: 'FormBuilder ',
			element: <FormBuilder />,
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
			path: '/pages/HrCandidateMaster',
			name: 'HrCandidateMaster ',
			element: <HrCandidateMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrCandidateMasterinsert/:id',
			name: 'HrCandidateMasterinsert ',
			element: <HrCandidateMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HrCandidateMasterinsert',
			name: 'HrCandidateMasterinsert ',
			element: <HrCandidateMasterinsert />,
			route: PrivateRoute,
		},

		{
			path: '/pages/AddressMaster',
			name: 'Address Master',
			element: <AddressMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/AddressMasterinsert/:id',
			name: 'AddressMasterinsert ',
			element: <AddressMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/AddressMasterinsert',
			name: 'AddressMasterinsert ',
			element: <AddressMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BankMaster',
			name: 'BankMaster',
			element: <BankMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ContactMaster',
			name: 'ContactMaster',
			element: <ContactMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ContactMasterinsert',
			name: 'ContactMasterinsert ',
			element: <ContactMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ContactMasterinsert/:id',
			name: 'ContactMasterinsert ',
			element: <ContactMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/BankMasterinsert',
			name: 'BankMasterinsert ',
			element: <BankMasterinsert />,
			route: PrivateRoute,
		},

		{
			path: '/pages/FillingFrequencyMaster',
			name: 'FillingFrequencyMaster',
			element: <FillingFrequencyMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/FillingFrequencyMasterinsert/:id',
			name: 'FillingFrequencyMasterinsert ',
			element: <FillingFrequencyMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/FillingFrequencyMasterinsert',
			name: 'FillingFrequencyMasterinsert ',
			element: <FillingFrequencyMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ManagementContractMaster',
			name: 'ManagementContractMaster',
			element: <ManagementContractMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ManagementContractMasterinsert/:id',
			name: 'ManagementContractMasterinsert ',
			element: <ManagementContractMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ManagementContractMasterinsert',
			name: 'ManagementContractMasterinsert ',
			element: <ManagementContractMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectTypeMaster',
			name: 'ProjectTypeMaster',
			element: <ProjectTypeMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectTypeMasterinsert/:id',
			name: 'ProjectTypeMasterinsert ',
			element: <ProjectTypeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProjectTypeMasterinsert',
			name: 'ProjectTypeMasterinsert ',
			element: <ProjectTypeMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/VendorMaster',
			name: 'VendorMaster',
			element: <VenderMaster />,
			route: PrivateRoute,
		},

		{
			path: '/pages/VendorMasterinsert/:id',
			name: 'VendorMasterinsert ',
			element: <VenderMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/VendorMasterinsert',
			name: 'VendorMasterinsert ',
			element: <VenderMasterinsert />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MyPendingTask',
			name: 'MyPendingTask',
			element: <MyPendingTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProcessManualInitiation/:moduleID-Module/:processID/Process/:id',
			name: 'ProcessManualInitiation',
			element: <ProcessManualInitiation />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TaskMaster',
			name: 'TaskMaster',
			element: <TaskMasterNew />,
			route: PrivateRoute,
		},
		{
			path: '/pages/NotificationPage',
			name: 'NotificationPage',
			element: <NotificationPage />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProcessInitiation',
			name: 'ProcessInitiation',
			element: <ProcessInitiation />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CommonMaster',
			name: 'CommonMaster',
			element: <CommonMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ModulesMaster',
			name: 'ModulesMaster',
			element: <ModulesMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Module',
			name: 'CommonModule',
			element: <CommonModule />,
			route: PrivateRoute,
		},
		{
			path: '/pages/Process',
			name: 'CommonProcess',
			element: <CommonProcess />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TrackTask',
			name: 'TrackTask',
			element: <TrackTask />,
			route: PrivateRoute,
		},
		{
			path: '/pages/CreateNotification',
			name: 'CreateNotification',
			element: <CreateNotification />,
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
		// {
		// 	path: 'pages/formBuilder',
		// 	name: 'Form Builder',
		// 	element: <FormBuilder />,
		// 	route: PrivateRoute,
		// },

		// MODULES_MASTER
		
		
		
		
		
		
		
		{
			path: '/pages/CampMaster',
			name: 'Camp Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PreliminaryWorkMaster',
			name: 'Preliminary Work Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/RequirementMaster',
			name: 'Requirement Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/InwardCorrespondanceMaster',
			name: 'Inward Correspondance Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MaterialMaster',
			name: 'Material Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MaterialRequisitionMaster',
			name: 'Material Requisition Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ComparativeMaster',
			name: 'Comparative Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PMRequisitionMaster',
			name: 'PM Requisition Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TransportationMaster',
			name: 'Transportation Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HORequisitionMaster',
			name: 'HO Requisition Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/FAHOMaster',
			name: 'FA HO Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ProcurementBBEJMaster',
			name: 'Procurement BBEJ Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/LowInventoryTrackingMaster',
			name: 'Low Inventory Tracking Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/AssetCategorMaster',
			name: 'Asset Categor Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		
		{
			path: '/pages/TABillMaster',
			name: 'TA Bill Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PRWRequirementMaster',
			name: 'PRW Requirement Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PRWAllocationMaster',
			name: 'PRW Allocation Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PRWContractorMaster',
			name: 'PRW Contractor Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PRWSubContractorMaster',
			name: 'PRW Sub Contractor Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/ScrapMaster',
			name: 'Scrap Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PurchaseRateReviewMaster',
			name: 'Purchase Rate Review Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/PhysicalReconciliationMaster',
			name: 'Physical Reconciliation Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MaterialMaster',
			name: 'Material Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/DelegationMaster',
			name: 'Delegation Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/HelpTicketMaster',
			name: 'Help Ticket Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/AppHelpMaster',
			name: 'App Help Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/TrainingRequirementMaster',
			name: 'Training Requirement Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/SCMaster',
			name: 'SC Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		
		
		...MODULES_MASTER,

		
		{
			path: '/pages/RecurringBillMaster',
			name: 'Recurring Bill Master',
			element: <MessMaster />,
			route: PrivateRoute,
		},
		{
			path: '/pages/MismatchMaster',
			name: 'Mismatch Master',
			element: <MessMaster />,
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