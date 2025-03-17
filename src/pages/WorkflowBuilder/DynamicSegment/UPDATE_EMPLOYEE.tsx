import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';
// import Flatpickr from 'react-flatpickr';



interface UpdateEmployee {
    confirmationOfEmployeeMasterUpdated: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const UPDATE_EMPLOYEE = () => {
    const [updateEmployee, setUpdateEmployee] = useState<UpdateEmployee>({
        confirmationOfEmployeeMasterUpdated: '',
    });

    // const [transferredEmployeeList,] = useState([
    //     { label: 'ddd', value: 'ererr' }
    // ]);





    // Handle Select Changes
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof UpdateEmployee
    ) => {
        setUpdateEmployee(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // const handleDateChange = (selectedDates: Date[]) => {
    //     setUpdateEmployee(prev => ({
    //         ...prev,
    //         transferredDate: selectedDates.length > 0 ? selectedDates[0].toISOString().split('T')[0] : ''
    //     }));
    // };

    return (
        <div>
            <Row>
                <Col lg={4}>
                    <Form.Group controlId="confirmationOfEmployeeMasterUpdated">
                        <Form.Label>Confirmation of Employee Master Updated</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === updateEmployee.confirmationOfEmployeeMasterUpdated)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfEmployeeMasterUpdated")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default UPDATE_EMPLOYEE;
