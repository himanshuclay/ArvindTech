import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { speak } from "@/utils/speak"; // ✅ Make sure this path is correct

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

interface Candidate {
    label: string;
    mobileNumber?: string;
    resume?: string | null;
}

interface BlockValue {
    updateInterviewedCandidates: { [key: string]: Candidate };
    candidateCount: string;
    finalizedCandidate: string;
    attendanceAndWorkingHoursPolicy: string;
    advancePolicyAndSalaryTimeline: string;
    offerLetterAndEmploymentLetterReleasePolicy: string;
    accommodationPolicy: string;
    onsiteAndExternalTravelReimbursementPolicy: string;
    messFoodingPolicy: string;
    confirmationOfStaffDeployedAtSite: string;
    dateOfJoining: string;
    [key: string]: string | { [key: string]: Candidate } | undefined;
}


const NEW_APPOINTMENT = forwardRef((props: any, ref) => {
    const [blockValue, setBlockValue] = useState<BlockValue>(props.blockValue && Object.keys(props.blockValue).length ? props.blockValue : {
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
        candidateCount: 0,
    });

    console.log("this is the number", blockValue.candidateCount);

    const handleAddUpdateInterviewedCandidates = () => {
        const newCandidateValue = `Candidate ${blockValue.candidateCount}`;
        setBlockValue(prev => ({
            ...prev,
            candidateCount: JSON.stringify(Number(prev.candidateCount) + 1),  // Fix the increment logic here
            updateInterviewedCandidates: {
                ...prev.updateInterviewedCandidates,
                [newCandidateValue]: { label: newCandidateValue }
            }
        }));

        speak(`${newCandidateValue} added`);
    };

    const handleInputChange = (key: string, value: string) => {
        const keys = key.split('.');
        if (keys.length === 3 && keys[0] === 'updateInterviewedCandidates') {
            const [_, candidateKey, fieldKey] = keys;

            if (fieldKey === 'label') {
                speak(`Candidate name updated to ${value}`);
            }

            setBlockValue(prev => ({
                ...prev,
                updateInterviewedCandidates: {
                    ...prev.updateInterviewedCandidates,
                    [candidateKey]: {
                        ...prev.updateInterviewedCandidates[candidateKey],
                        [fieldKey]: value
                    }
                }
            }));
        } else {
            setBlockValue(prev => ({
                ...prev,
                [key]: value,
            }));
        }
    };

    const handleSelectChange = (selectedOption: any, fieldName: string) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleDateChange = (selectedDates: Date[]) => {
        const dateOfJoining = selectedDates.length
            ? new Date(selectedDates[0].setHours(0, 0, 0, 0)).toLocaleDateString('en-CA') // 'en-CA' format ensures YYYY-MM-DD
            : '';
        setBlockValue(prev => ({ ...prev, dateOfJoining }));
    };
    


    const handleFileChange = (candidateKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setBlockValue(prev => ({
            ...prev,
            updateInterviewedCandidates: {
                ...prev.updateInterviewedCandidates,
                [candidateKey]: {
                    ...prev.updateInterviewedCandidates[candidateKey],
                    resume: file ? file.name : '',
                }
            }
        }));
    };

    const handleRemoveCandidate = (candidateKey: string) => {
        setBlockValue(prev => {
            const updatedCandidates = { ...prev.updateInterviewedCandidates };
            delete updatedCandidates[candidateKey];
            speak(`${candidateKey} removed`);
            return {
                ...prev,
                candidateCount: JSON.stringify(Number(prev.candidateCount) - 1),
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
                    <h5 className="my-2">Update Interviewed Candidates</h5>
                    <Button variant="primary" onClick={handleAddUpdateInterviewedCandidates}>
                        Add Candidate
                    </Button>
                </div>
                <Col lg={6}>
                    <Form.Group controlId="updateInterviewedCandidates">
                        {blockValue.updateInterviewedCandidates && Object.keys(blockValue.updateInterviewedCandidates).map((candidateKey, index) => (
                            <div className="mt-2" key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
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
                                    onChange={(e) => handleFileChange(candidateKey, e as React.ChangeEvent<HTMLInputElement>)}
                                />
                                <Button variant="danger" size="sm" onClick={() => handleRemoveCandidate(candidateKey)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </Form.Group>
                </Col>

                <Col lg={6}>
                    <Form.Group controlId="finalizedCandidate">
                        <Form.Label>Select Finalized Candidate</Form.Label>
                        <Select
                            name="finalizedCandidate"
                            value={
                                blockValue.finalizedCandidate
                                    ? {
                                        label: blockValue.updateInterviewedCandidates[blockValue.finalizedCandidate]?.label || blockValue.finalizedCandidate,
                                        value: blockValue.finalizedCandidate,
                                    }
                                    : null
                            }
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "finalizedCandidate")}
                            options={Object.keys(blockValue.updateInterviewedCandidates).map((key) => ({
                                label: blockValue.updateInterviewedCandidates[key]?.label || key,
                                value: key,
                            }))}
                            isSearchable={true}
                            placeholder="Select Candidate"
                        />

                    </Form.Group>
                </Col>

                <Row className="">
                    <h5 className="my-2">Finalized Candidate has agreed on the below policies:</h5>
                    <hr />
                    {Object.keys(blockValue).filter(key => key !== 'updateInterviewedCandidates' && key !== 'finalizedCandidate' && key !== 'dateOfJoining').map((policyKey) => (
                        <Col lg={6}>
                            <Form.Group key={policyKey}>
                                <Form.Label>{policyKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Form.Label>
                                <Select
                                    options={YES_NO_OPTIONS}
                                    value={YES_NO_OPTIONS.find(option => option.value === blockValue[policyKey])}
                                    onChange={(selectedOption) => handleSelectChange(selectedOption, policyKey)}
                                    placeholder="Select Yes or No"
                                />
                            </Form.Group>
                        </Col>
                    ))}

                    <Form.Group className="mt-2">
                        <Form.Label>Date of Joining</Form.Label>
                        <Flatpickr
                            value={blockValue.dateOfJoining}
                            onChange={(selectedDates) => handleDateChange(selectedDates)}
                            options={{ dateFormat: "Y-m-d" }}
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                        />
                    </Form.Group>

                </Row>
            </Row>
        </div>
    );
});

export default NEW_APPOINTMENT;
