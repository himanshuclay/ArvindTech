import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';

const APPOINTMENT = forwardRef((props, ref) => {
    const [appointment, setAppointment] = useState({
        typeOfAppointment: '',
        selectRecruiter: '',
        uploadJD: null,
        employeeToBeTransferred: '',
    });

    const TYPE_OF_APPOINTMENT = [
        { label: 'New Appointment', value: 'newAppointment' },
        { label: 'Old Staff Transfer', value: 'oldStaffTransfer' },
        { label: 'Already appointment by site', value: 'alreadyAppointmentBySite' },
        { label: 'New Appointment at site', value: 'newAppointmentAtSite' },
        { label: 'Appointment through JV Partner', value: 'appointmentThroughJVPartner' },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAppointment((prev: any) => ({ ...prev, uploadJD: file }));
    };

    useImperativeHandle(ref, () => ({
        getAppointmentData: () => appointment
    }));

    return (
        <div>
            <Row>
                <Col lg={4}>
                    <Form.Group controlId="typeOfAppointment">
                        <Form.Label>Type of Appointment</Form.Label>
                        <Select
                            name="typeOfAppointment"
                            value={TYPE_OF_APPOINTMENT.find(option => option.value === appointment.typeOfAppointment) || null}
                            onChange={(selectedOption) =>
                                setAppointment((prev) => ({ ...prev, typeOfAppointment: selectedOption ? selectedOption.value : '' }))
                            }
                            options={TYPE_OF_APPOINTMENT}
                            isSearchable={true}
                            placeholder="Select Type of Appointment"
                            className="h45"
                        />
                    </Form.Group>
                </Col>

                {['newAppointment', 'oldStaffTransfer', 'alreadyAppointmentBySite', 'newAppointmentAtSite'].includes(appointment.typeOfAppointment) && (
                    <Col lg={4}>
                        <Form.Group controlId="selectRecruiter">
                            <Form.Label>Select Recruiter</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Recruiter Name"
                                name="selectRecruiter"
                                value={appointment.selectRecruiter}
                                onChange={(e) =>
                                    setAppointment((prev) => ({ ...prev, selectRecruiter: e.target.value }))
                                }
                            />
                        </Form.Group>
                    </Col>
                )}

                {appointment.typeOfAppointment === 'newAppointment' && (
                    <Col lg={4}>
                        <Form.Group controlId="uploadJD">
                            <Form.Label>Upload JD</Form.Label>
                            <Form.Control
                                type="file"
                                name="uploadJD"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Col>
                )}
                {appointment.typeOfAppointment === 'oldStaffTransfer' && (
                    <Col lg={4}>
                        <Form.Group controlId="employeeToBeTransferred">
                            <Form.Label>Employee to be Transferred</Form.Label>
                            <Select
                                name="employeeToBeTransferred"
                                value={TYPE_OF_APPOINTMENT.find(option => option.value === appointment.employeeToBeTransferred) || null}
                                onChange={(selectedOption) =>
                                    setAppointment((prev) => ({ ...prev, employeeToBeTransferred: selectedOption ? selectedOption.value : '' }))
                                }
                                options={TYPE_OF_APPOINTMENT}
                                isSearchable={true}
                                placeholder="Select Type of Appointment"
                                className="h45"
                            />
                        </Form.Group>
                    </Col>
                )}
            </Row>
        </div>
    );
});

export default APPOINTMENT;
