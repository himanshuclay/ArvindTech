import { useState, forwardRef, useImperativeHandle } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';

interface AppointmentLetter {
    confirmationOfAppointmentLetterSentToEmployee: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const APPOINTMENT_LETTER = forwardRef((props: any, ref) => {
    const [blockValue, setBlockValue] = useState<AppointmentLetter>({
        confirmationOfAppointmentLetterSentToEmployee: '',
    });

    // Handle Select Changes dynamically
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof AppointmentLetter
    ) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Expose blockValue to parent component via useImperativeHandle
    useImperativeHandle(ref, () => ({
        APPOINTMENT_LETTER: () => blockValue
    }));

    return (
        <div>
            <Row>
                {/* Confirmation of Appointment Letter Sent */}
                <Col lg={4}>
                    <Form.Group controlId="confirmationOfAppointmentLetterSentToEmployee">
                        <Form.Label>Confirmation of Appointment Letter Sent to Employee</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.confirmationOfAppointmentLetterSentToEmployee)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfAppointmentLetterSentToEmployee")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
});

export default APPOINTMENT_LETTER;
