import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'

const TenderMaster = () => {
        const [ifscError, setIfscError] = useState('')
    
    const [tenderMaster, setTenderMaster] = useState({
		tenderId: '',
		tenderStatus: '',
		notificationDate: '',
		tenderLink: '',
		country: '',
		state: '',
		workName: '',
		deptPrincipal: '',
		employer: '',
		contractType: '',
		estimatedCost: '',
		docPurchaseDeadline: '',
		initialBidSubmitDeadline: '',
		completionPeriod: '',
		uploadNotification: '',
		tenderReferredBy: '',
		executorCompany: '',
		entryEmployeeId: '',
		entryEmployeeName: '',
		entryDate: '',
	})
    const [isTenderMaster, setIsTenderMaster] = useState(false);
	const handleClose3 = () => setIsTenderMaster(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target
            setTenderMaster((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }))
        }
        const handleIfscBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
                const ifsc = e.target.value.trim()
        
                if (!ifsc || ifsc.length !== 11) {
                    setIfscError(
                        ifsc
                            ? 'Invalid IFSC code. Please enter an 11-character code.'
                            : 'IFSC code is required.'
                    )
                    setTenderMaster((prevState) => ({
                        ...prevState,
                        reimbursementBankName: '',
                        reimbursementBranchName: '',
                    }))
                    return
                }
        
                setIfscError('')
                // await fetchBankByIFSC(ifsc)
            }
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Tender Master:</h4>
                <form>
                    <Row>
                        <Col lg={3}>
                            <div className="mt-3">
                                <label>Tender ID</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="tenderId"
                                    value={tenderMaster.tenderId}
                                    placeholder="Enter Tender ID"
                                    onChange={handleInputChange}
                                    onBlur={handleIfscBlur}
                                />
                            </div>
                            {ifscError && (
                                <div className="text-danger mt-1">
                                    {ifscError}
                                </div>
                            )}
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3">
                                <label>Tender Status</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="tenderStatus"
                                    value={
                                        tenderMaster.tenderStatus
                                    }
                                    placeholder="Enter Tender Status"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Notification Date</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="notificationDate"
                                    value={tenderMaster.notificationDate}
                                    placeholder="Enter Notification Date"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Tender Link</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="tenderLink"
                                    value={tenderMaster.tenderLink}
                                    placeholder="Enter Tender Link"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Country</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="country"
                                    value={tenderMaster.country}
                                    placeholder="Enter Country"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>State</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="state"
                                    value={tenderMaster.state}
                                    placeholder="Enter State"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Work Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="workName"
                                    value={tenderMaster.workName}
                                    placeholder="Enter Work Name"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Dept/Principal</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="deptPrincipal"
                                    value={tenderMaster.deptPrincipal}
                                    placeholder="Enter Dept/Principal"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Employer</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="employer"
                                    value={tenderMaster.employer}
                                    placeholder="Enter Employer"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Contract Type</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="contractType"
                                    value={tenderMaster.contractType}
                                    placeholder="Enter Contract Type"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Estimated Cost</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="estimatedCost"
                                    value={tenderMaster.estimatedCost}
                                    placeholder="Enter Estimated Cost"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Doc purchase Deadline</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="docPurchaseDeadline"
                                    value={tenderMaster.docPurchaseDeadline}
                                    placeholder="Enter Doc purchase Deadline"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Initial Bid Submit Deadline</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="initialBidSubmitDeadline"
                                    value={tenderMaster.initialBidSubmitDeadline}
                                    placeholder="Enter Initial Bid Submit Deadline"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Completion Period</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="completionPeriod"
                                    value={tenderMaster.completionPeriod}
                                    placeholder="Enter Completion Period"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Upload Notification</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="uploadNotification"
                                    value={tenderMaster.uploadNotification}
                                    placeholder="Enter Upload Notification"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Tender referred By</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="tenderReferredBy"
                                    value={tenderMaster.tenderReferredBy}
                                    placeholder="Enter Tender referred By"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Executor Company</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="executorCompany"
                                    value={tenderMaster.executorCompany}
                                    placeholder="Enter Executor Company"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Entry Employee ID</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="entryEmployeeId"
                                    value={tenderMaster.entryEmployeeId}
                                    placeholder="Enter Entry Employee ID"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Entry Employee Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="entryEmployeeName"
                                    value={tenderMaster.entryEmployeeName}
                                    placeholder="Enter Entry Employee Name"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mt-3 ">
                                <label>Entry Date</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="entryDate"
                                    value={tenderMaster.entryDate}
                                    placeholder="Enter Entry Date"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <div className="modal-buttons mt-3 d-flex justify-content-end">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={handleClose3}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TenderMaster
