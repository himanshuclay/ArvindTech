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
        text: '',
      },
    },
    {
      key: 'Modules',
      label: 'Modules',
      isTitle: false,
      url: '/pages/Modules',
      icon: 'ri-dashboard-3-line',
    },
    {
      key: 'Process',
      label: 'Process',
      isTitle: false,
      url: '/pages/Process',
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
          key: 'systemmaster-FormList',
          label: 'Form Master',
          url: '/pages/FormList',
          icon: 'ri-slideshow-line',
          parentKey: 'systemmaster',
        },
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
        // {
        //   key: 'CreateNotification',
        //   label: 'Notification',
        //   url: '/pages/CreateNotification',
        //   icon: 'ri-notification-line',
        //   parentKey: 'systemmaster',
        // },

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
          key: 'ModulesDropdown',
          label: 'Modules Master ',
          parentKey: 'ProcessDataMaster',
          url: '/pages/ModulesMaster',
          icon: 'ri-list-check-3',
        },
        // {
        //   key: 'Account Masters',
        //   label: 'Account Masters',
        //   parentKey: 'ProcessDataMaster',
        //   icon: 'ri-list-check-3',
        //   children: [
        //     {
        //       key: 'Mess-Master',
        //       label: 'Mess Master',
        //       url: '/pages/MessMaster',
        //       parentKey: 'Account Masters',
        //     },

        //   ],
        // },
        // {
        //   key: 'BD Masters',
        //   label: 'BD Masters',
        //   parentKey: 'ProcessDataMaster',
        //   icon: 'ri-list-check-3',
        //   children: [
        //     {
        //       key: 'Tender-Master',
        //       label: 'Tender Master',
        //       url: '/pages/TenderMaster',
        //       parentKey: 'BD Masters',
        //     },

        //   ],
        // },
        // {
        //   key: 'HR Masters',
        //   label: 'HR Masters',
        //   parentKey: 'ProcessDataMaster',
        //   icon: 'ri-list-check-3',
        //   children: [
        //     {
        //       key: 'RequirementMaster',
        //       label: 'Staff Requirement Master',
        //       url: '/pages/RequirementMaster',
        //       parentKey: 'HR Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //     {
        //       key: 'DesignationMaster',
        //       label: 'Designation Master',
        //       url: '/pages/DesignationMaster',
        //       parentKey: 'HR Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //     {
        //       key: 'CandidateMaster',
        //       label: 'Candidate Master',
        //       url: '/pages/HrCandidateMaster',
        //       parentKey: 'HR Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //     {
        //       key: 'HrResumeMaster',
        //       label: 'Hr Resume Master',
        //       url: '/pages/HrResumeMaster',
        //       parentKey: 'HR Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //   ],
        // },
        // {
        //   key: 'BTS Masters',
        //   label: 'BTS Masters',
        //   parentKey: 'ProcessDataMaster',
        //   icon: 'ri-list-check-3',
        //   children: [
        //     {
        //       key: 'RequirementMaster',
        //       label: 'Staff Requirement Master',
        //       url: '/pages/RequirementMaster',
        //       parentKey: 'BTS Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //     {
        //       key: 'DesignationMaster',
        //       label: 'Designation Master',
        //       url: '/pages/DesignationMaster',
        //       parentKey: 'BTS Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //     {
        //       key: 'CandidateMaster',
        //       label: 'Candidate Master',
        //       url: '/pages/HrCandidateMaster',
        //       parentKey: 'BTS Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //     {
        //       key: 'HrResumeMaster',
        //       label: 'Hr Resume Master',
        //       url: '/pages/HrResumeMaster',
        //       parentKey: 'BTS Masters',
        //       // icon: 'ri-list-check-3',
        //     },
        //   ],
        // },
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
      key: 'FormMaster',
      label: 'Form Master',
      url: '/pages/AdhocTempleteList',
      icon: 'ri-survey-line',
      // parentKey: 'systemmaster',
      children: [
        {
          key: 'HR Templete',
          label: 'HR Templete Master',
          url: '/pages/AdhocTempleteList',
          parentKey: 'FormMaster',
        },
        {
          key: 'Account Templete',
          label: 'Account Templete Master',
          url: '/pages/AdhocTempleteList',
          parentKey: 'FormMaster',
        },
        {
          key: 'BD Templete',
          label: 'BD Templete Master',
          url: '/pages/AdhocTempleteList',
          parentKey: 'FormMaster',
        },
        {
          key: 'Adhoc Master',
          label: 'Adhoc Master',
          url: '/pages/AdhocMaster',
          parentKey: 'FormMaster',
        },
      ],
    },
    {
      key: 'WorkflowBuilderList',
      label: 'Workflow BuilderList',
      url: '/pages/WorkflowBuilderList',
      icon: 'ri-survey-line',
    },
    {
      key: 'ProcessConfiguration',
      label: 'Process Configuration',
      url: '/pages/ProcessConfiguration',
      icon: 'ri-survey-line',
    },
    {
      key: 'Notifications',
      label: 'Notification',
      url: '/pages/Notification',
      icon: 'ri-survey-line',
      children: [
        {
          key: 'MyNotification',
          label: 'Create Notification',
          url: '/pages/CreateNotification',
          parentKey: 'Notifications',
        },
        {
          key: 'ScheduledNotification',
          label: 'Scheduled Notification',
          url: '/pages/ScheduledNotification',
          parentKey: 'Notifications',
        }
      ],
    },
    {
      key: 'SeekHelp',
      label: 'Seek Help',
      url: '/pages/SeekHelp',
      icon: 'ri-survey-line',
      children: [
        {
          key: 'CreateHelp',
          label: 'Create Help',
          url: '/pages/CreateHelp',
          parentKey: 'SeekHelp',
        },
        {
          key: 'ViewHelp',
          label: 'View Help',
          url: '/pages/ViewHelp',
          parentKey: 'SeekHelp',
        }
      ],
    },
    {
      key: 'Suggestion',
      label: 'Suggestion',
      url: '/pages/Suggestion',
      icon: 'ri-survey-line',
      children: [
        {
          key: 'SuggestionMasterinsert',
          label: 'Create',
          url: '/pages/SuggestionMasterinsert',
          parentKey: 'Suggestion',
        },
        {
          key: 'SuggestionMaster',
          label: 'View',
          url: '/pages/SuggestionMaster',
          parentKey: 'Suggestion',
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
      item.key === 'Modules' ||
      item.key === 'FormMaster' ||
      item.key === 'WorkflowBuilderList' ||
      item.key === 'ProcessConfiguration' ||
      item.key === 'Notifications' ||
      item.key === 'SeekHelp' ||
      item.key === 'Suggestion' ||
      item.key === 'Settings'
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
