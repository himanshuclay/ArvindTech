import { Link } from 'react-router-dom';
import logo from '@/assets/images/Clayimage.png';
import logoDark from '@/assets/images/Clayimage.png';
import logoSm from '@/assets/images/Clayimage.png';
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
        text: '',
      },
    },
    {
      key: 'Modules',
      label: 'Modules',
      isTitle: false,
      url: '/pages/Notification',
      icon: 'ri-dashboard-3-line',
    },
    {
      key: 'Process',
      label: 'Process',
      isTitle: false,
      url: '/pages/Notification',
      icon: 'ri-dashboard-3-line',
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
      isTitle: false,
      icon: 'ri-settings-fill',
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
    },
    {
      key: 'ExpireTask',
      label: 'Expired Tasks',
      url: '/pages/ExpireTask',
      icon: 'ri-slideshow-line',
      parentKey: 'ExpireTask',
    },
    {
      key: 'TaskPlanned',
      label: 'Planned Tasks',
      url: '/pages/TaskPlanned',
      icon: 'ri-slideshow-line',
      parentKey: 'TaskPlanned',
    },
    {
      key: 'TaskAdmin',
      label: 'Task',
      isTitle: false,
      icon: 'ri-settings-fill',
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
          url: '/pages/TrackTask',
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
          key: 'ExpireTask',
          label: 'Expired Tasks',
          url: '/pages/ExpireTask',
          icon: 'ri-slideshow-line',
          parentKey: 'TaskAdmin',
        },
      ],
    },
    {
      key: 'GetTestData',
      label: 'Templates',
      url: '/pages/AdhocTempleteList',
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
          url: '/pages/AdhocTempleteList',
          icon: 'ri-slideshow-line',
          parentKey: 'GetTestData',
        },

      ],
    },

    {
      key: 'Analytics',
      label: 'Analytics',
      url: '/pages/AdhocTempleteList',
      icon: 'ri-user-settings-line',
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
          key: 'CreateNotification',
          label: 'Notification',
          url: '/pages/CreateNotification',
          icon: 'ri-notification-line',
          parentKey: 'systemmaster',
        },
        {
          key: 'FormMaster',
          label: 'Form Master',
          url: '/pages/AdhocTempleteList',
          // icon: 'ri-survey-line',
          parentKey: 'systemmaster',
          children: [
            {
              key: 'Mess-Master',
              label: 'HR Templete Master',
              url: '/pages/AdhocTempleteList',
              parentKey: 'FormMaster',
            },
            {
              key: 'Mess-Master',
              label: 'Account Templete Master',
              url: '/pages/AdhocTempleteList',
              parentKey: 'FormMaster',
            },
            {
              key: 'Mess-Master',
              label: 'BD Templete Master',
              url: '/pages/AdhocTempleteList',
              parentKey: 'FormMaster',
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
          key: 'Vendor',
          label: 'Vendor Master',
          url: '/pages/VendorMaster',
          icon: 'ri-store-line',
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
      key: 'ProcessDataMaster',
      label: 'PD Master',
      isTitle: false,
      icon: 'ri-settings-fill',
      children: [

        {
          key: 'Account Masters',
          label: 'Account Masters',
          parentKey: 'ProcessDataMaster',
          icon: 'ri-list-check-3',
          children: [
            {
              key: 'Mess-Master',
              label: 'Mess Master',
              url: '/pages/MessMaster',
              parentKey: 'Account Masters',
            },

          ],
        },
        {
          key: 'BD Masters',
          label: 'BD Masters',
          parentKey: 'ProcessDataMaster',
          icon: 'ri-list-check-3',
          children: [
            {
              key: 'Tender-Master',
              label: 'Tender Master',
              url: '/pages/TenderMaster',
              parentKey: 'BD Masters',
            },

          ],
        },
        {
          key: 'HR Masters',
          label: 'HR Masters',
          parentKey: 'ProcessDataMaster',
          icon: 'ri-list-check-3',
          children: [
            {
              key: 'RequirementMaster',
              label: 'Staff Requirement Master',
              url: '/pages/RequirementMaster',
              parentKey: 'HR Masters',
              // icon: 'ri-list-check-3',
            },
            {
              key: 'DesignationMaster',
              label: 'Designation Master',
              url: '/pages/DesignationMaster',
              parentKey: 'HR Masters',
              // icon: 'ri-list-check-3',
            },
            {
              key: 'CandidateMaster',
              label: 'Candidate Master',
              url: '/pages/HrCandidateMaster',
              parentKey: 'HR Masters',
              // icon: 'ri-list-check-3',
            },
            {
              key: 'HrResumeMaster',
              label: 'Hr Resume Master',
              url: '/pages/HrResumeMaster',
              parentKey: 'HR Masters',
              // icon: 'ri-list-check-3',
            },
          ],
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

  ];



  if (role === 'Employee') {
    return MENU_ITEMS.filter(item =>
      item.key === 'dashboard' ||
      item.key === 'CompletedTask' ||
      item.key === 'ExpireTask' ||
      item.key === 'TaskPlanned' ||
      item.key === 'Notification'
    );
  }
  if (role === 'Management') {
    return MENU_ITEMS.filter(item =>
      item.key === 'dashboard' ||
      item.key === 'CompletedTask' ||
      item.key === 'ExpireTask' ||
      item.key === 'TaskPlanned' ||
      item.key === 'Notification'
      // item.key === 'TaskAdmin' ||
      // item.key === 'Analytics' ||
      // item.key === 'Process' ||
      // item.key === 'Modules'
    );
  }
  if (role === 'ProcessCoordinator') {
    return MENU_ITEMS.filter(item =>
      item.key === 'dashboard' ||
      item.key === 'TaskAdmin' ||
      item.key === 'Analytics' ||
      item.key === 'master' ||
      item.key === 'systemmaster' ||
      item.key === 'Process' ||
      item.key === 'ProcessDataMaster' ||
      item.key === 'Modules'
    );
  }
  if (role === 'Admin') {
    return MENU_ITEMS.filter(item =>
      item.key === 'dashboard' ||
      item.key === 'TaskAdmin' ||
      item.key === 'Analytics' ||
      item.key === 'master' ||
      item.key === 'systemmaster' ||
      item.key === 'Process' ||
      item.key === 'ProcessDataMaster' ||
      item.key === 'Modules'
    );
  }
  return MENU_ITEMS.filter(item => {
    if (role === 'DME') {
      return item.key === 'dashboard' ||
        item.key === 'TaskAdmin' ||
        item.key === 'Analytics' ||
        item.key === 'master' ||
        item.key === 'systemmaster' ||
        item.key === 'Process' ||
        item.key === 'ProcessDataMaster' ||
        item.key === 'Modules'
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
        <a href="/" className="logo logo-dark">
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
