import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';
// import Flatpickr from 'react-flatpickr';



interface AppointmentLetter {
    confirmationOfAppointmentLetterSentToEmployee: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const APPOINTMENT_LETTER = () => {
    const [appointmentLetter, setAppointmentLetter] = useState<AppointmentLetter>({
        confirmationOfAppointmentLetterSentToEmployee: '',
    });

    // const [transferredEmployeeList,] = useState([
    //     { label: 'ddd', value: 'ererr' }
    // ]);





    // Handle Select Changes
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof AppointmentLetter
    ) => {
        setAppointmentLetter(prev => ({
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
                    <Form.Group controlId="confirmationOfAppointmentLetterSentToEmployee">
                        <Form.Label>Confirmation of Appointment Letter Sent to Employee</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === appointmentLetter.confirmationOfAppointmentLetterSentToEmployee)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "confirmationOfAppointmentLetterSentToEmployee")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default APPOINTMENT_LETTER;
