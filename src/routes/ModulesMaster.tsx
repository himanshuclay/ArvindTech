import PrivateRoute from "./PrivateRoute"
import DrawingMaster from "@/pages/other/AdminSide/ModulesMaster/DDPSMasters/DrawingMaster/DrawingMaster"
import BTSPaymentMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/BTSPaymentMaster/BTSPaymentMaster"
import BTSPaymentMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/BTSPaymentMaster/AddEditMaster"
import DrawingMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/DDPSMasters/DrawingMaster/AddEditMaster"
import ChallanMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/ChallanMaster/ChallanMaster"
import ChallanMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/ChallanMaster/AddEditMaster"
const DDPS_MASTER = [
    {
        path: '/pages/DrawingMaster',
        name: 'Drawing Master',
        element: <DrawingMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/DrawingMasterAddEdit',
        name: 'Drawing Master',
        element: <DrawingMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/DrawingMasterAddEdit/:id',
        name: 'Drawing Master',
        element: <DrawingMasterAddEdit />,
        route: PrivateRoute,
    },
    // {
    //     path: '/pages/HSEObervationMaster',
    //     name: 'HSE Obervation Master',
    //     element: <HSEObervationMaster />,
    //     route: PrivateRoute,
    // },
    // {
    //     path: '/pages/HSEObervationMasterAddEdit',
    //     name: 'HSE Obervation Master',
    //     element: <HSEObervationMasterAddEdit />,
    //     route: PrivateRoute,
    // },
    // {
    //     path: '/pages/HSEObervationMasterAddEdit/:id',
    //     name: 'HSE Obervation Master',
    //     element: <HSEObervationMasterAddEdit />,
    //     route: PrivateRoute,
    // },
]
const MECHANICAL_MASTER = [
    // {
    //     path: '/pages/AssetCategoryMaster',
    //     name: 'HSE Obervation Master',
    //     element: <AssetCategoryMaster />,
    //     route: PrivateRoute,
    // },
    // {
    //     path: '/pages/HSEObervationMasterAddEdit',
    //     name: 'HSE Obervation Master',
    //     element: <HSEObervationMasterAddEdit />,
    //     route: PrivateRoute,
    // },
    // {
    //     path: '/pages/HSEObervationMasterAddEdit/:id',
    //     name: 'HSE Obervation Master',
    //     element: <HSEObervationMasterAddEdit />,
    //     route: PrivateRoute,
    // },
]
const BTS_MASTER = [
    {
        path: '/pages/ChallanMaster',
        name: 'Challan Master',
        element: <ChallanMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/ChallanMasterAddEdit',
        name: 'Challan Master',
        element: <ChallanMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/ChallanMasterAddEdit/:id',
        name: 'Challan Master',
        element: <ChallanMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/BTSPaymentMaster',
        name: 'BTS Payment Master',
        element: <BTSPaymentMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/BTSPaymentMasterAddEdit',
        name: 'BTS Payment Master',
        element: <BTSPaymentMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/BTSPaymentMasterAddEdit/:id',
        name: 'BTS Payment Master',
        element: <BTSPaymentMasterAddEdit />,
        route: PrivateRoute,
    },
]

const MODULES_MASTER = [
    ...DDPS_MASTER,
    ...BTS_MASTER,
]


export {
    MODULES_MASTER
}