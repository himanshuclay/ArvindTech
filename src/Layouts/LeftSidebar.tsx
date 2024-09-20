import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logonew.png';
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
      label: 'Expire Task',
      url: '/pages/ExpireTask',
      icon: 'ri-slideshow-line',
      parentKey: 'Modules-Master',
    },
    {
      key: 'TaskPlanned',
      label: 'Task Planned',
      url: '/pages/TaskPlanned',
      icon: 'ri-slideshow-line',
      parentKey: 'Modules-Master',
    },
    {
      key: 'Filtertask',
      label: 'Filtertask',
      isTitle: false,
      icon: 'ri-settings-fill',
      children: [
        {
          key: 'Action',
          label: 'Active Project',
          url: '/pages/ActiveProject',
          icon: 'ri-slideshow-line',
          parentKey: 'Modules-Master',
        }, 
        {
          key: 'ActiveTasks',
          label: 'Active Task',
          url: '/pages/FilterTasks',
          icon: 'ri-slideshow-line',
          parentKey: 'Modules-Master',
        },
        {
          key: 'FilterTasks',
          label: 'Running Task',
          url: '/pages/RunningTask',
          icon: 'ri-slideshow-line',
          parentKey: 'Modules-Master',
        },
      ],
    },
    {
      key: 'GetTestData',
      label: 'Test Data',
      url: '/pages/Invoice',
      icon: 'ri-user-settings-line',
      parentKey: 'pages',
    },



    {
      key: 'ChkLnMaster',
      label: 'Action Center',
      url: '/pages/ChkLnMaster',
      icon: 'ri-user-settings-line',
      parentKey: 'pages',
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
          label: 'Task List',
          url: '/pages/MyTask',
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
          label: 'CHK Task Master',
          url: '/pages/ChkTaskMaster',
          icon: 'ri-user-settings-line',
          parentKey: 'pages',
        },
        {
          key: 'ChkInputMaster',
          label: 'CHK Input Master',
          url: '/pages/ChkInputMaster',
          icon: 'ri-user-settings-line',
          parentKey: 'pages',
        },
        {
          key: 'ChecklistMaster',
          label: 'Checklist Master',
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
      ],
    },
  ];

  // Example logic to filter items based on role
  if (role === 'ADMIN') {
    // Admin role: Exclude 'CompleteTask' and 'LocalTask'
    return MENU_ITEMS.filter(item => {
      return item.key !== 'CompletedTask' && item.key !== 'ExpireTask'  && item.key !== 'TaskPlanned' && item.key !== 'Action'  && item.key !== 'Notification';
    });
  }
  // Filter out items or customize based on other roles
  return MENU_ITEMS.filter(item => {
    // Add your filtering logic here
    if (role === 'EMPLOYEE') {
      // For example, remove specific items for 'user' role
      return item.key !== 'Filtertask' && item.key !== 'master'&&  item.key !== 'Modules-Master' && item.key !== 'Action'  && item.key !== 'ChkLnMaster'  && item.key !== 'systemmaster' && item.key !== 'Modules-Master'; // Exclude 'System Master' and 'Modules-Master' for 'user' role
    }

    // Default: show all items if role is not 'admin' or 'user'
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
        {/* Brand Logo Light */}
        <Link to="/ModuleMaster" className="logo logo-light">
          <span className="logo-lg">
            <img src={logo} style={{ width: '86%', height: 'auto', padding: '10px' }} alt="logo" />
          </span>
          <span className="logo-sm">
            <img src={logoSm} alt="small logo" />
          </span>
        </Link>
        {/* Brand Logo Dark */}
        <a href="ModuleMaster" className="logo logo-dark">
          <span className="logo-lg">
            <img src={logoDark} alt="dark logo" style={{ height: '50px' }} />
          </span>
          <span className="logo-sm">
            <img src={logoSm} alt="small logo" />
          </span>
        </a>
        {/* Sidebar -left */}
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