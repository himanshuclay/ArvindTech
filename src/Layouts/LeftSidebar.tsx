import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark.png';
import logoSm from '@/assets/images/logo-sm.png';
import SimpleBar from 'simplebar-react';
import AppMenu from './Menu';

// Function to get filtered menu items based on user role
const getFilteredMenuItems = () => {
  const role = localStorage.getItem('role'); // Retrieve role from local storage

  // Define your menu items array
  const MENU_ITEMS = [
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
      ],
    },

    {
      key: 'Action',
      label: 'Action',
      icon: 'ri-file-settings-line',
      children: [
        {
          key: 'Action',
          label: 'My Task',
          url: '/pages/Notification',
          icon: 'ri-slideshow-line',
          parentKey: 'Action',
        },
        {
          key: 'ActiveTasks',
          label: 'Active Tasks',
          url: '/pages/ActiveTasks',
          icon: 'ri-slideshow-line',
          parentKey: 'Action',
        },
        {
          key: 'FilterTasks',
          label: 'Filter Tasks',
          url: '/pages/FilterTasks',
          icon: 'ri-slideshow-line',
          parentKey: 'Action',
        },
      ],
    },





    {
      key: 'Notification',
      label: 'My Task',
      url: '/pages/Notification',
      icon: 'ri-notification-3-line',
      parentKey: 'pages',
    },
    {
      key: 'CompletedTask',
      label: 'Completed Task',
      url: '/pages/CompletedTask',
      icon: 'ri-slideshow-line',
      parentKey: 'Modules-Master',
    },
    {
      key: 'ExpireTask',
      label: 'Expired Tasks',
      url: '/pages/ExpireTask',
      icon: 'ri-slideshow-line',
      parentKey: 'Modules-Master',
    },
    {
      key: 'TaskPlanned',
      label: 'Planned Tasks',
      url: '/pages/TaskPlanned',
      icon: 'ri-slideshow-line',
      parentKey: 'Modules-Master',
    },
    {
      key: 'Filtertask',
      label: 'Filter Task',
      isTitle: false,
      icon: 'ri-settings-fill',
      children: [
        {
          key: 'Action',
          label: 'Active Project',
          url: '/pages/ActiveProject',
          icon: 'ri-slideshow-line',
          parentKey: 'Filtertask',
        },
        // {
        //   key: 'ActiveTasks',
        //   label: 'Active Task',
        //   url: '/pages/FilterTasks',
        //   icon: 'ri-slideshow-line',
        //   parentKey: 'Modules-Master',
        // },
        {
          key: 'FilterTasks',
          label: 'Running Task',
          url: '/pages/RunningTask',
          icon: 'ri-slideshow-line',
          parentKey: 'Filtertask',
        },
      ],
    },
    {
      key: 'GetTestData',
      label: 'Templates',
      url: '/pages/Invoice',
      icon: 'ri-user-settings-line',
      children: [
        {
          key: 'GetTestData-Templates',
          label: 'Create Templates',
          url: '/pages/CreateTemplates',
          icon: 'ri-slideshow-line',
          parentKey: 'GetTestData',
        },
        {
          key: 'GetTestData-Lists',
          label: 'Template Lists',
          url: '/pages/invoice',
          icon: 'ri-slideshow-line',
          parentKey: 'GetTestData',
        },

      ],
    },



    // {
    //   key: 'ChkLnMaster',
    //   label: 'Action Center',
    //   url: '/pages/ChkLnMaster',
    //   icon: 'ri-user-settings-line',
    //   parentKey: 'pages',
    // },
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
          key: 'systemmaster-TaskMaster',
          label: 'Task Master',
          url: '/pages/TaskMaster',
          icon: 'ri-pie-chart-2-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'Roles',
          label: 'Role Master',
          url: '/pages/RoleMaster',
          icon: 'ri-user-settings-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'Identifier',
          label: 'Identifier Master',
          url: '/pages/IdentifierMaster',
          icon: 'ri-user-settings-line',
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
          key: 'FormMaster',
          label: 'Form Master',
          url: '/pages/FormMaster',
          icon: 'ri-survey-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'LnMaster',
          label: 'Task List',
          url: '/pages/MyTask',
          icon: 'ri-user-settings-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'TicketMaster',
          label: 'Ticket Master',
          url: '/pages/TicketMaster',
          icon: 'ri-coupon-2-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'SystemLogs',
          label: 'System Logs',
          url: '/pages/SystemLogs',
          icon: 'ri-login-circle-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'ChkTaskMaster',
          label: 'CHK Task Master',
          url: '/pages/ChkTaskMaster',
          icon: 'ri-user-settings-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'ChkInputMaster',
          label: 'CHK Input Master',
          url: '/pages/ChkInputMaster',
          icon: 'ri-user-settings-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'ChecklistMaster',
          label: 'Checklist Master',
          url: '/pages/ChecklistMaster',
          icon: 'ri-list-check-3',
          parentKey: 'systemmaster',
        },
        {
          key: 'HR Masters',
          label: 'HR Masters',
          parentKey: 'systemmaster',
          icon: 'ri-list-check-3',
          children: [
            {
              key: 'RequirementMaster',
              label: 'Staff Requirement Master',
              url: '/pages/RequirementMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
            {
              key: 'DesignationMaster',
              label: 'Designation Master',
              url: '/pages/DesignationMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
            {
              key: 'CandidateMaster',
              label: 'Candidate Master',
              url: '/pages/CandidateMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
            {
              key: 'HrInputMaster',
              label: 'Hr Input Master',
              url: '/pages/HrInputMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
            {
              key: 'HrTaskMaster',
              label: 'Hr Task Master',
              url: '/pages/HrTaskMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
            {
              key: 'HrDoerMaster',
              label: 'Hr Doer Master',
              url: '/pages/HrDoerMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
            {
              key: 'ResumeMaster',
              label: 'Resume Master',
              url: '/pages/ResumeMaster',
              parentKey: 'HR Masters',
              icon: 'ri-list-check-3',
            },
          ],
        },
        {
          key: 'second-level-2',
          label: 'BD Masters',
          parentKey: 'systemmaster',
          icon: 'ri-list-check-3',
          children: [
            {
              key: 'BD Input Master',
              label: 'BD Input Master',
              url: '/pages/HrInputMaster',
              parentKey: 'second-level-2',
              icon: 'ri-list-check-3',
            },
            {
              key: 'BD Task Master',
              label: 'BD Task Master',
              url: '/pages/HrTaskMaster',
              parentKey: 'second-level-2',
              icon: 'ri-list-check-3',
            },
            {
              key: 'BD Doer Master',
              label: 'BD Doer Master',
              url: '/pages/HrDoerMaster',
              parentKey: 'second-level-2',
              icon: 'ri-list-check-3',
            },
          ],
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
          key: 'Mess-Master',
          label: 'Mess Master',
          url: '/pages/MessMaster',
          icon: 'ri-restaurant-line',
          parentKey: 'master',
        },
        {
          key: 'Tender',
          label: 'Tender Master',
          url: '/pages/Tender',
          icon: 'ri-service-line',
          parentKey: 'master',
        },
        {
          key: 'Vender',
          label: 'Vender Master',
          url: '/pages/Vender',
          icon: 'ri-store-line',
          parentKey: 'master',
        },
        {
          key: 'Bank',
          label: 'Bank Master',
          url: '/pages/Bank',
          icon: 'ri-bank-line',
          parentKey: 'master',
        },
        {
          key: 'AddressMaster',
          label: 'Address Master',
          url: '/pages/AddressMaster',
          icon: 'ri-restaurant-line',
          parentKey: 'master',
        },
      ],
    },
  ];

  if (role === 'Admin') {
    return MENU_ITEMS.filter(item => {
      return item.key !== 'CompletedTask' && item.key !== 'ExpireTask' && item.key !== 'TaskPlanned' && item.key !== 'Action' && item.key !== 'Notification';
    });
  }
  return MENU_ITEMS.filter(item => {
    if (role === 'EMPLOYEE') {
      return item.key !== 'Filtertask' && item.key !== 'master' && item.key !== 'Modules-Master' && item.key !== 'Action' && item.key !== 'ChkLnMaster' && item.key !== 'systemmaster' && item.key !== 'Modules-Master'; // Exclude 'System Master' and 'Modules-Master' for 'user' role
    }

    return true;
  });
}

// Sidebar content
const SideBarContent = () => {
  return (
    <>
      <AppMenu menuItems={getFilteredMenuItems()} />
      <div className="clearfix" />
    </>
  );
}

const LeftSidebar = () => {
  return (
    <>
      <div className="leftside-menu">
        <Link to="/ModuleMaster" className="logo logo-light">
          <span className="logo-lg">
            <img src={logo} style={{ width: '86%', height: 'auto', padding: '10px' }} alt="logo" />
          </span>
          <span className="logo-sm">
            <img src={logoSm} alt="small logo" />
          </span>
        </Link>
        <a href="ModuleMaster" className="logo logo-dark">
          <span className="logo-lg">
            <img src={logoDark} alt="dark logo" style={{ height: '50px' }} />
          </span>
          <span className="logo-sm">
            <img src={logoSm} alt="small logo" />
          </span>
        </a>
        <SimpleBar className="h-100" id="leftside-menu-container" data-simplebar="">
          {/*- Sidemenu */}
          <SideBarContent />
          {/*- End Sidemenu */}
          <div className="clearfix" />
        </SimpleBar>
      </div>
    </>
  );
}

export default LeftSidebar;
