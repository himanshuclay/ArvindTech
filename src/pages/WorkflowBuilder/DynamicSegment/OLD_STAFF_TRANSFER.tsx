import { useState, forwardRef, useImperativeHandle } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';
import Flatpickr from 'react-flatpickr';

// Define types for the state
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

// The main component
const OLD_STAFF_TRANSFER = forwardRef((props: any, ref) => {
    // Use blockValue as the main state variable
    const [blockValue, setBlockValue] = useState<AppointmentState>(props.blockValue? props.blockValue :{
        transferredEmployee: '',
        confirmationOfStaffDeployedAtSite: '',
        transferredDate: '',
        reporityManager: '',
    });

    // Example list of transferred employees, you can replace it with dynamic data from API or DB
    const [transferredEmployeeList,] = useState([
        { label: 'Employee 1', value: 'emp1' },
        { label: 'Employee 2', value: 'emp2' }
    ]);

    // Handle Select Changes dynamically
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof AppointmentState
    ) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Handle Date Change for Flatpickr
    const handleDateChange = (selectedDates: Date[]) => {
        setBlockValue(prev => ({
            ...prev,
            transferredDate: selectedDates.length > 0 ? selectedDates[0].toISOString().split('T')[0] : ''
        }));
    };

    useImperativeHandle(ref, () => ({
        OLD_STAFF_TRANSFER: () => blockValue
    }));

    return (
        <div>
            <Row>
                {/* Transferred Employee */}
                <Col lg={4}>
                    <Form.Group controlId="transferredEmployee">
                        <Form.Label>Select Transferred Employee</Form.Label>
                        <Select
                            name="transferredEmployee"
                            value={transferredEmployeeList.find(
                                option => option.value === blockValue.transferredEmployee
                            ) || null}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "transferredEmployee")}
                            options={transferredEmployeeList}
                            isSearchable={true}
                            placeholder="Select Candidate"
                            noOptionsMessage={() => "No candidates available"}
                        />
                    </Form.Group>
                </Col>

                {/* Confirmation of Staff Deployed at Site */}
                <Col lg={4}>
                    <Form.Group controlId="confirmationOfStaffDeployedAtSite">
                        <Form.Label>Confirmation of Staff Deployed at Site</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.confirmationOfStaffDeployedAtSite)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfStaffDeployedAtSite")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>

                {/* Transferred Date */}
                <Col lg={4}>
                    <Form.Group>
                        <Form.Label>Transferred Date</Form.Label>
                        <Flatpickr
                            value={blockValue.transferredDate}
                            onChange={(selectedDates) => handleDateChange(selectedDates)}
                            options={{ dateFormat: "Y-m-d" }}
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                        />
                    </Form.Group>
                </Col>

                {/* Reporting Manager */}
                <Col lg={4}>
                    <Form.Group controlId="reporityManager">
                        <Form.Label>Repority Manager</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.reporityManager)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "reporityManager")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
});

export default OLD_STAFF_TRANSFER;
