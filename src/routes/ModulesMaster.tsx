import PrivateRoute from "./PrivateRoute"
import DrawingMaster from "@/pages/other/AdminSide/ModulesMaster/DDPSMasters/DrawingMaster/DrawingMaster"
import BTSPaymentMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/BTSPaymentMaster/BTSPaymentMaster"
import BTSPaymentMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/BTSPaymentMaster/AddEditMaster"
import DrawingMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/DDPSMasters/DrawingMaster/AddEditMaster"
import ChallanMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/ChallanMaster/ChallanMaster"
import ChallanMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/ChallanMaster/AddEditMaster"
import FRMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/FRMaster/FRMaster"
import FRMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/FRMaster/AddEditMaster"
import MisMatchMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/MismatchMaster/MismatchMaster"
import MisMatchMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/MismatchMaster/AddEditMaster"
import RecurringBillMaster from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/RecurringBillMaster/RecurringBillMaster"
import RecurringBillMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/BTSMaster/RecurringBillMaster/AddEditMaster"
import HSEObservationMaster from "@/pages/other/AdminSide/ModulesMaster/DDPSMasters/HSEObervationMaster/HSEObervationMaster"
import HSEObservationMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/DDPSMasters/HSEObervationMaster/AddEditMaster"
import AssetCategoryMaster from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetCategoryMaster/AssetCategoryMaster"
import AssetCategoryMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetCategoryMaster/AddEditMaster"
import AssetMaster from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetMaster/AssetMaster"
import AssetMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetMaster/AddEditMaster"
import AssetTrackingMaster from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetTrackingMaster/AssetMaster"
import AssetTrackingMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetTrackingMaster/AddEditMaster"
import AssetConditionMasterAddEdit from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetConditionMaster/AddEditMaster"
import AssetConditionMaster from "@/pages/other/AdminSide/ModulesMaster/MechanicalMasters/AssetConditionMaster/AssetMaster"
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
    {
        path: '/pages/HSEObservationMaster',
        name: 'HSE Obervation Master',
        element: <HSEObservationMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/HSEObservationMasterAddEdit',
        name: 'HSE Obervation Master',
        element: <HSEObservationMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/HSEObservationMasterAddEdit/:id',
        name: 'HSE Obervation Master',
        element: <HSEObservationMasterAddEdit />,
        route: PrivateRoute,
    },
]
const MECHANICAL_MASTER = [
    {
        path: '/pages/AssetCategoryMaster',
        name: 'Asset Category Master',
        element: <AssetCategoryMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetCategoryMasterAddEdit',
        name: 'Asset Category Master',
        element: <AssetCategoryMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetCategoryMasterAddEdit/:id',
        name: 'Asset Category Master',
        element: <AssetCategoryMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetMaster',
        name: 'Asset Master',
        element: <AssetMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetMasterAddEdit',
        name: 'Asset Master',
        element: <AssetMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetMasterAddEdit/:id',
        name: 'Asset Master',
        element: <AssetMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetTrackingMaster',
        name: 'Asset Master',
        element: <AssetTrackingMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetTrackingMasterAddEdit',
        name: 'Asset Master',
        element: <AssetTrackingMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetTrackingMasterAddEdit/:id',
        name: 'Asset Master',
        element: <AssetTrackingMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetConditionMaster',
        name: 'Asset Master',
        element: <AssetConditionMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetConditionMasterAddEdit',
        name: 'Asset Master',
        element: <AssetConditionMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/AssetConditionMasterAddEdit/:id',
        name: 'Asset Master',
        element: <AssetConditionMasterAddEdit />,
        route: PrivateRoute,
    },
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
    {
        path: '/pages/FRMaster',
        name: 'FR Master',
        element: <FRMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/FRMasterAddEdit',
        name: 'FR Master',
        element: <FRMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/FRMasterAddEdit/:id',
        name: 'FR Master',
        element: <FRMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/MisMatchMaster',
        name: 'FR Master',
        element: <MisMatchMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/MisMatchMasterAddEdit',
        name: 'FR Master',
        element: <MisMatchMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/MisMatchMasterAddEdit/:id',
        name: 'FR Master',
        element: <MisMatchMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/RecurringBillMaster',
        name: 'FR Master',
        element: <RecurringBillMaster />,
        route: PrivateRoute,
    },
    {
        path: '/pages/RecurringBillMasterAddEdit',
        name: 'FR Master',
        element: <RecurringBillMasterAddEdit />,
        route: PrivateRoute,
    },
    {
        path: '/pages/RecurringBillMasterAddEdit/:id',
        name: 'FR Master',
        element: <RecurringBillMasterAddEdit />,
        route: PrivateRoute,
    },
]

const MODULES_MASTER = [
    ...DDPS_MASTER,
    ...BTS_MASTER,
    ...MECHANICAL_MASTER,
]


export {
    MODULES_MASTER
}