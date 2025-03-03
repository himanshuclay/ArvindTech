import {  Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const ModulesMaster = () => {
    // const role = localStorage.getItem('role');

    const ModuleList = [
        { name: 'Account Masters', child: [{ name: 'Mess Master', to: '/pages/MessMaster' }] },
        { name: 'BD Masters', child: [{ name: 'Tender Master', to: '/pages/TenderMaster' }] },
        {
            name: 'HR Masters', child: [
                { name: 'Staff Requirement Master', to: '/pages/RequirementMaster' },
                { name: 'Designation Master', to: '/pages/DesignationMaster' },
                { name: 'Candidate Master', to: '/pages/HrCandidateMaster' },
                { name: 'Hr Resume Master', to: '/pages/HrResumeMaster' },
            ]
        },
        {
            name: 'DDPS Masters', child: [
                { name: 'Drawing Master', to: '/pages/DrawingMaster' },
                { name: 'HSE Obervation Master', to: '/pages/HSEObservationMaster' },
            ]
        },
        {
            name: 'Mechanical Masters', child: [
                { name: 'Asset Category Master', to: '/pages/AssetCategoryMaster' },
                { name: 'Asset Master', to: '/pages/AssetMaster' },
                { name: 'Asset Tracking Master', to: '/pages/AssetTrackingMaster' },
                { name: 'Asset Condition Master', to: '/pages/AssetConditionMaster' },
            ]
        },
        {
            name: 'Mobilization Masters', child: [
                { name: 'Mobilization Master', to: '/pages/MobilizationMaster' },
                { name: 'Camp Master', to: '/pages/CampMaster' },
                { name: 'Sturcture Master', to: '/pages/SturctureMaster' },
                { name: 'Preliminary Work Master', to: '/pages/PreliminaryWorkMaster' },
                { name: 'Requirement Master', to: '/pages/MRequirementMaster' },
            ]
        },
        {
            name: 'Planning Billing  Masters', child: [
                { name: 'Inward Correspondance Master', to: '/pages/InwardCorrespondanceMaster' },
            ]
        },
        {
            name: 'Procurement Masters', child: [
                { name: 'Material Master', to: '/pages/MaterialMaster' },
                { name: 'Material Requisition Master', to: '/pages/MaterialRequisitionMaster' },
                { name: 'Comparative Master', to: '/pages/ComparativeMaster' },
                { name: 'PM Requisition Master', to: '/pages/PMRequisitionMaster' },
                { name: 'Transportation Master', to: '/pages/TransportationMaster' },
                { name: 'HO Requisition Master', to: '/pages/HORequisitionMaster' },
                { name: 'FA HO Master', to: '/pages/FAHOMaster' },
                { name: 'Procurement BBEJ Master', to: '/pages/ProcurementBBEJMaster' },
                { name: 'Low Inventory Tracking Master', to: '/pages/LowInventoryTrackingMaster' },
                { name: 'Asset Category Master', to: '/pages/AssetCategoryMaster' },
                { name: 'Asset Master', to: '/pages/AssetMaster' },
            ]
        },
        {
            name: 'PRW Masters', child: [
                { name: 'TA Bill Master', to: '/pages/TABillMaster' },
                { name: 'PRW Requirement Master', to: '/pages/PRWRequirementMaster' },
                { name: 'PRW Allocation Master', to: '/pages/PRWAllocationMaster' },
                { name: 'PRW Contractor Master', to: '/pages/PRWContractorMaster' },
                { name: 'PRW SubContractor Master', to: '/pages/PRWSubContractorMaster' },
            ]
        },
        {
            name: 'Store Management Masters', child: [
                { name: 'Scrap Master', to: '/pages/ScrapMaster' },
                { name: 'Purchase Rate Review Master', to: '/pages/PurchaseRateReviewMaster' },
                { name: 'Physical Reconciliation Master', to: '/pages/PhysicalReconciliationMaster' },
                { name: 'Material Master', to: '/pages/MaterialMaster' },
            ]
        },
        {
            name: 'MDO Masters', child: [
                { name: 'Delegation Master', to: '/pages/DelegationMaster' },
                { name: 'Help Ticket Master', to: '/pages/HelpTicketMaster' },
                { name: 'App Help Master', to: '/pages/AppHelpMaster' },
                { name: 'Training Requirement Master', to: '/pages/TrainingRequirementMaster' },
                { name: 'SC Master', to: '/pages/SCMaster' },
            ]
        },
        {
            name: 'BTS Masters', child: [
                { name: 'Challan Master', to: '/pages/ChallanMaster' },
                { name: 'BTS Payment Master', to: '/pages/BTSPaymentMaster' },
                { name: 'FR Master', to: '/pages/FRMaster' },
                { name: 'Recurring Bill Master', to: '/pages/RecurringBillMaster' },
                { name: 'Mismatch Master', to: '/pages/MismatchMaster' },
            ]
        },
        // Add other modules here
    ];

    const [openModule, setOpenModule] = useState(null); // Track which parent module is expanded

    const toggleChildVisibility = (index: any) => {
        setOpenModule(openModule === index ? null : index); // Toggle visibility of the child rows
    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Modules</span></span>
            </div>

            <div className="overflow-auto text-nowrap">
                <Table hover className='bg-white'>
                    <thead>
                        <tr>
                            <th className='p-2 fs-4'> Sr. no</th>
                            <th className='p-2 fs-4'> <i className="ri-settings-2-line"></i> Master</th>
                            <th className='p-2 fs-4'>Action</th>
                            {/* <th><i className="ri-eye-line"></i> View</th>
                            {(role === 'Admin' || role === 'DME') && (
                                <th className='text-center'><i className="ri-tools-line"></i> Action</th>)} */}
                        </tr>
                    </thead>
                    <tbody>
                        {ModuleList.map((module, index) => (
                            <React.Fragment key={index}>
                                {/* Parent Module Row */}
                                <tr>
                                    <td className='p-2 fs-5'>{index + 1}</td>
                                    <td className='p-2 fs-5'><strong>{module.name}</strong></td>
                                    <td className='p-2 fs-3' onClick={() => toggleChildVisibility(index)} style={{ cursor: 'pointer' }}><i className={openModule === index ? "ri-arrow-down-s-fill" : "ri-arrow-right-s-fill"}></i></td>
                                </tr>

                                {/* Child Rows */}
                                {openModule === index && module.child.map((child, childIndex) => (
                                    <tr key={childIndex}>
                                        <td className='p-2 fs-6 pl-3'>{index + 1}.{childIndex + 1}</td>
                                        <td className='p-2 fs-6' style={{ paddingLeft: '30px' }}>
                                            {child.name}
                                        </td>
                                        <td className='p-2 fs-6'>
                                            <Link to={child.to} className="text-decoration-none text-dark">
                                                <button type="button" className="btn btn-primary"> Show </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default ModulesMaster;
