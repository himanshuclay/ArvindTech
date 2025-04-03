import { useState, forwardRef, useImperativeHandle } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';

// Define the state structure for UpdateEmployee
interface UpdateEmployee {
    confirmationOfEmployeeMasterUpdated: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const UPDATE_EMPLOYEE = forwardRef((props: any, ref) => {
    // Use blockValue as the main state variable
    const [blockValue, setBlockValue] = useState<UpdateEmployee>(props.blockValue ? props.blockValue :{
        confirmationOfEmployeeMasterUpdated: '',
    });

    // Handle Select Changes dynamically
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof UpdateEmployee
    ) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Expose blockValue to parent component via useImperativeHandle
    useImperativeHandle(ref, () => ({
        UPDATE_EMPLOYEE: () => blockValue
    }));

    return (
        <div>
            <Row>
                {/* Confirmation of Employee Master Updated */}
                <Col lg={4}>
                    <Form.Group controlId="confirmationOfEmployeeMasterUpdated">
                        <Form.Label>Confirmation of Employee Master Updated</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.confirmationOfEmployeeMasterUpdated)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfEmployeeMasterUpdated")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
});

export default UPDATE_EMPLOYEE;
