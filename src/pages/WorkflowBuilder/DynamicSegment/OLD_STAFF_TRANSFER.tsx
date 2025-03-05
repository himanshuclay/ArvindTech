import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';
import Flatpickr from 'react-flatpickr';



interface AppointmentState {
    transferredEmployee: string;
    confirmationOfStaffDeployedAtSite: string;
    transferredDate: string;
    reporityManager: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const OLD_STAFF_TRANSFER = () => {
    const [oldStaffTransfer, setOldStaffTransfer] = useState<AppointmentState>({
        transferredEmployee: '',
        confirmationOfStaffDeployedAtSite: '',
        transferredDate: '',
        reporityManager: '',
    });

    const [transferredEmployeeList,] = useState([
        { label: 'ddd', value: 'ererr' }
    ]);





    // Handle Select Changes
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof AppointmentState
    ) => {
        setOldStaffTransfer(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleDateChange = (selectedDates: Date[]) => {
        setOldStaffTransfer(prev => ({
            ...prev,
            transferredDate: selectedDates.length > 0 ? selectedDates[0].toISOString().split('T')[0] : ''
        }));
    };

    return (
        <div>
            <Row>
                <Col lg={4}>
                    <Form.Group controlId="transferredEmployee">
                        <Form.Label>Select Transferred Employee</Form.Label>
                        <Select
                            name="transferredEmployee"
                            value={transferredEmployeeList.find(
                                option => option.value === oldStaffTransfer.transferredEmployee
                            ) || null}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "transferredEmployee")}
                            options={transferredEmployeeList}
                            isSearchable={true}
                            placeholder="Select Candidate"
                            noOptionsMessage={() => "No candidates available"}
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group controlId="confirmationOfStaffDeployedAtSite">
                        <Form.Label>Confirmation of Staff Deployed at Site</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === oldStaffTransfer.confirmationOfStaffDeployedAtSite)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfStaffDeployedAtSite")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group>
                        <Form.Label>Transferred Date</Form.Label>
                        <Flatpickr
                            value={oldStaffTransfer.transferredDate}
                            onChange={(selectedDates) => handleDateChange(selectedDates)}
                            options={{ dateFormat: "Y-m-d" }}
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group controlId="reporityManager">
                        <Form.Label>Repority Manager</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === oldStaffTransfer.reporityManager)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "reporityManager")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default OLD_STAFF_TRANSFER;
