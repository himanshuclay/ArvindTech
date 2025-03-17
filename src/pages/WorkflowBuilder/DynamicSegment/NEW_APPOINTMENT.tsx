import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

interface Candidate {
    label: string;
    value: string;
    mobileNumber?: string;
    resume?: File | null;
}

interface AppointmentState {
    updateInterviewedCandidates: Candidate[];
    finalizedCandidate: string;
    attendanceAndWorkingHoursPolicy: string;
    advancePolicyAndSalaryTimeline: string;
    offerLetterAndEmploymentLetterReleasePolicy: string;
    accommodationPolicy: string;
    onsiteAndExternalTravelReimbursementPolicy: string;
    messFoodingPolicy: string;
    confirmationOfStaffDeployedAtSite: string;
    dateOfJoining: string; // Ensure this is added to the state
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const NEW_APPOINTMENT = () => {
    const [newAppointment, setNewAppointment] = useState<AppointmentState>({
        updateInterviewedCandidates: [],
        finalizedCandidate: '',
        attendanceAndWorkingHoursPolicy: '',
        advancePolicyAndSalaryTimeline: '',
        offerLetterAndEmploymentLetterReleasePolicy: '',
        accommodationPolicy: '',
        onsiteAndExternalTravelReimbursementPolicy: '',
        messFoodingPolicy: '',
        confirmationOfStaffDeployedAtSite: '',
        dateOfJoining: '', // Initialize empty
    });

    // Add New Candidate
    const handleAddUpdateInterviewedCandidates = () => {
        const newCandidate: Candidate = {
            label: `Candidate ${newAppointment.updateInterviewedCandidates.length + 1}`,
            value: `candidate-${newAppointment.updateInterviewedCandidates.length + 1}`,
            mobileNumber: "",
            resume: null,
        };

        setNewAppointment(prevState => ({
            ...prevState,
            updateInterviewedCandidates: [...prevState.updateInterviewedCandidates, newCandidate],
        }));
    };

    // Update Candidate Fields
    const handleInputChange = (index: number, key: keyof Candidate, value: string | File | null) => {
        const updatedCandidates = [...newAppointment.updateInterviewedCandidates];
        updatedCandidates[index] = { ...updatedCandidates[index], [key]: value };
        setNewAppointment(prevState => ({
            ...prevState,
            updateInterviewedCandidates: updatedCandidates,
        }));
    };

    // Remove Candidate
    const handleRemoveUpdateInterviewCandidates = (index: number) => {
        setNewAppointment(prevState => ({
            ...prevState,
            updateInterviewedCandidates: prevState.updateInterviewedCandidates.filter((_, i) => i !== index),
        }));
    };

    // Handle Select Changes for Policies
    const handleSelectChange = (selectedOption: any, fieldName: keyof AppointmentState) => {
        setNewAppointment(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Handle Date Change for Flatpickr
    const handleDateChange = (selectedDates: Date[]) => {
        setNewAppointment(prev => ({
            ...prev,
            dateOfJoining: selectedDates.length > 0 ? selectedDates[0].toISOString().split('T')[0] : ''
        }));
    };

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; // Safely access the first file or null
        handleInputChange(index, "resume", file);
    };


    return (
        <div>
            <Row>
                <div>
                    <p>Update Interviewed Candidates</p>
                    <Button variant="primary" onClick={handleAddUpdateInterviewedCandidates}>
                        Add Candidate
                    </Button>
                </div>
                <Col lg={6}>
                    <Form.Group controlId="updateInterviewedCandidates">
                        {newAppointment.updateInterviewedCandidates.map((updatedInterview, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
                                <Form.Control
                                    type="text"
                                    value={updatedInterview.label}
                                    onChange={(e) => handleInputChange(index, "label", e.target.value)}
                                    placeholder="Enter Candidate Name"
                                />
                                <Form.Control
                                    type="text"
                                    value={updatedInterview.mobileNumber || ""}
                                    onChange={(e) => handleInputChange(index, "mobileNumber", e.target.value)}
                                    placeholder="Enter Mobile Number"
                                />
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleFileChange(index, e as React.ChangeEvent<HTMLInputElement>)} // Type Assertion
                                />

                                <Button variant="danger" size="sm" onClick={() => handleRemoveUpdateInterviewCandidates(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </Form.Group>
                </Col>

                <Col lg={6}>
                    {/* Finalized Candidate Selection */}
                    <Form.Group controlId="finalizedCandidate">
                        <Form.Label>Select Finalized Candidate</Form.Label>
                        <Select
                            name="finalizedCandidate"
                            value={newAppointment.updateInterviewedCandidates.find(option => option.value === newAppointment.finalizedCandidate) || null}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "finalizedCandidate")}
                            options={newAppointment.updateInterviewedCandidates}
                            isSearchable={true}
                            placeholder="Select Candidate"
                        />
                    </Form.Group>
                </Col>

                <Col lg={6}>
                    <h5>Finalized Candidate has agreed on the below policies:</h5>

                    {/* ✅ Converted all policies to Select Dropdowns */}
                    <Form.Group>
                        <Form.Label>Attendance and Working Hours Policy</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.attendanceAndWorkingHoursPolicy)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "attendanceAndWorkingHoursPolicy")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Advance Policy and Salary Timeline</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.advancePolicyAndSalaryTimeline)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "advancePolicyAndSalaryTimeline")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Offer Letter and Employment Letter Release Policy</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.offerLetterAndEmploymentLetterReleasePolicy)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "offerLetterAndEmploymentLetterReleasePolicy")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Accommodation Policy</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.accommodationPolicy)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "accommodationPolicy")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Onsite and External Travel Reimbursement Policy</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.onsiteAndExternalTravelReimbursementPolicy)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "onsiteAndExternalTravelReimbursementPolicy")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Mess / Fooding Policy</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.messFoodingPolicy)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "messFoodingPolicy")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirmation of staff Deployed at Site</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === newAppointment.confirmationOfStaffDeployedAtSite)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfStaffDeployedAtSite")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>

                    {/* ✅ Date of Joining Field */}
                    <Form.Group>
                        <Form.Label>Date of Joining</Form.Label>
                        <Flatpickr
                            value={newAppointment.dateOfJoining}
                            onChange={(selectedDates) => handleDateChange(selectedDates)}
                            options={{ dateFormat: "Y-m-d" }}
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default NEW_APPOINTMENT;
