import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

interface Candidate {
    label: string;
    mobileNumber?: string;
    resume?: string | null;
}

// Define BlockValue type with an index signature
interface BlockValue {
    updateInterviewedCandidates: { [key: string]: Candidate };
    finalizedCandidate: string;
    attendanceAndWorkingHoursPolicy: string;
    advancePolicyAndSalaryTimeline: string;
    offerLetterAndEmploymentLetterReleasePolicy: string;
    accommodationPolicy: string;
    onsiteAndExternalTravelReimbursementPolicy: string;
    messFoodingPolicy: string;
    confirmationOfStaffDeployedAtSite: string;
    dateOfJoining: string;
    [key: string]: string | { [key: string]: Candidate } | undefined;  // Index signature for dynamic keys
}

const NEW_APPOINTMENT = forwardRef((props: any, ref) => {
    const [blockValue, setBlockValue] = useState<BlockValue>({
        updateInterviewedCandidates: {},
        finalizedCandidate: '',
        attendanceAndWorkingHoursPolicy: '',
        advancePolicyAndSalaryTimeline: '',
        offerLetterAndEmploymentLetterReleasePolicy: '',
        accommodationPolicy: '',
        onsiteAndExternalTravelReimbursementPolicy: '',
        messFoodingPolicy: '',
        confirmationOfStaffDeployedAtSite: '',
        dateOfJoining: '',
    });

    // Add New Candidate
    const handleAddUpdateInterviewedCandidates = () => {
        const newCandidateValue = `Candidate ${Object.keys(blockValue.updateInterviewedCandidates).length + 1}`;
        setBlockValue(prev => ({
            ...prev,
            updateInterviewedCandidates: {
                ...prev.updateInterviewedCandidates,
                [newCandidateValue]: { label: newCandidateValue } // Initialize new candidate dynamically
            }
        }));
    };

    // Update Candidate Fields
    const handleInputChange = (key: string, value: string) => {
        setBlockValue(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    // Handle Select Changes for Policies
    const handleSelectChange = (selectedOption: any, fieldName: string) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
        console.log('blockValue', blockValue)

    };

    // Handle Date Change for Flatpickr
    const handleDateChange = (selectedDates: Date[]) => {
        setBlockValue(prev => ({
            ...prev,
            dateOfJoining: selectedDates.length > 0 ? selectedDates[0].toISOString().split('T')[0] : ''
        }));
    };

    // Handle File Change with correct type casting
    const handleFileChange = (candidateKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; // Explicitly cast event target to HTMLInputElement to access files
        setBlockValue(prev => ({
            ...prev,
            updateInterviewedCandidates: {
                ...prev.updateInterviewedCandidates,
                [candidateKey]: {
                    ...prev.updateInterviewedCandidates[candidateKey],
                    resume: file ? file.name : '', // Store file name or empty string
                }
            }
        }));
    };

    const handleRemoveCandidate = (candidateKey: string) => {
        setBlockValue(prev => {
            const updatedCandidates = { ...prev.updateInterviewedCandidates };
            delete updatedCandidates[candidateKey];  // Remove candidate from the object
            return {
                ...prev,
                updateInterviewedCandidates: updatedCandidates,
            };
        });
    };

    useImperativeHandle(ref, () => ({
        NEW_APPOINTMENT: () => blockValue
    }));


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
                        {Object.keys(blockValue.updateInterviewedCandidates).map((candidateKey, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
                                <Form.Control
                                    type="text"
                                    value={blockValue.updateInterviewedCandidates[candidateKey].label}
                                    onChange={(e) => handleInputChange(`updateInterviewedCandidates.${candidateKey}.label`, e.target.value)}
                                    placeholder="Enter Candidate Name"
                                />
                                <Form.Control
                                    type="text"
                                    value={blockValue.updateInterviewedCandidates[candidateKey].mobileNumber || ""}
                                    onChange={(e) => handleInputChange(`updateInterviewedCandidates.${candidateKey}.mobileNumber`, e.target.value)}
                                    placeholder="Enter Mobile Number"
                                />
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleFileChange(candidateKey, e as React.ChangeEvent<HTMLInputElement>)} // Type casting here
                                />
                                <Button variant="danger" size="sm" onClick={() => handleRemoveCandidate(candidateKey)}>
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
                            value={blockValue.finalizedCandidate ? { label: blockValue.finalizedCandidate, value: blockValue.finalizedCandidate } : null}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "finalizedCandidate")}
                            options={Object.keys(blockValue.updateInterviewedCandidates).map((key) => ({
                                label: key,
                                value: key
                            }))}
                            isSearchable={true}
                            placeholder="Select Candidate"
                        />
                    </Form.Group>
                </Col>

                <Col lg={6}>
                    <h5>Finalized Candidate has agreed on the below policies:</h5>

                    {/* Policies as Select Dropdowns */}
                    {Object.keys(blockValue).filter(key => key !== 'updateInterviewedCandidates' && key !== 'finalizedCandidate' && key !== 'dateOfJoining').map((policyKey) => (
                        <Form.Group key={policyKey}>
                            <Form.Label>{policyKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Form.Label>
                            <Select
                                options={YES_NO_OPTIONS}
                                value={YES_NO_OPTIONS.find(option => option.value === blockValue[policyKey])}
                                onChange={(selectedOption) => handleSelectChange(selectedOption, policyKey)}
                                placeholder="Select Yes or No"
                            />
                        </Form.Group>
                    ))}

                    {/* Date of Joining Field */}
                    <Form.Group>
                        <Form.Label>Date of Joining</Form.Label>
                        <Flatpickr
                            value={blockValue.dateOfJoining}
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
});

export default NEW_APPOINTMENT;
