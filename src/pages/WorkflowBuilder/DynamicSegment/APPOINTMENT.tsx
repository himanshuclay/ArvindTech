import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';

const APPOINTMENT = forwardRef((props: any, ref) => {
    const [blockValue, setBlockValue] = useState<{ [key: string]: string }>(props.blockValue ? props.blockValue : {});

    const TYPE_OF_APPOINTMENT = [
        { label: 'New Appointment', value: 'newAppointment' },
        { label: 'Old Staff Transfer', value: 'oldStaffTransfer' },
        { label: 'Already appointment by site', value: 'alreadyAppointmentBySite' },
        { label: 'New Appointment at site', value: 'newAppointmentAtSite' },
        { label: 'Appointment through JV Partner', value: 'appointmentThroughJVPartner' },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setBlockValue((prev: any) => ({ ...prev, uploadJD: file }));
    };

    useImperativeHandle(ref, () => ({
        APPOINTMENT: () => blockValue,
    }));

    const handleSelectChange = (field: string) => (selectedOption: any) => {
        setBlockValue((prev) => ({
            ...prev,
            [field]: selectedOption ? selectedOption.value : '', // Only store the value part of the selected option
        }));
    };

    return (
        <div>
            <Row>
                <Col lg={4}>
                    <Form.Group controlId="typeOfAppointment">
                        <Form.Label>Type of Appointment</Form.Label>
                        <Select
                            name="typeOfAppointment"
                            value={TYPE_OF_APPOINTMENT.find(option => option.value === blockValue.typeOfAppointment) || null}
                            onChange={handleSelectChange('typeOfAppointment')}
                            options={TYPE_OF_APPOINTMENT}
                            isSearchable={true}
                            placeholder="Select Type of Appointment"
                            className="h45"
                        />
                    </Form.Group>
                </Col>

                {['newAppointment', 'oldStaffTransfer', 'alreadyAppointmentBySite', 'newAppointmentAtSite'].includes(blockValue.typeOfAppointment) && (
                    <Col lg={4}>
                        <Form.Group controlId="selectRecruiter">
                            <Form.Label>Select Recruiter</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Recruiter Name"
                                name="selectRecruiter"
                                value={blockValue.selectRecruiter}
                                onChange={(e) =>
                                    setBlockValue((prev) => ({ ...prev, selectRecruiter: e.target.value }))
                                }
                            />
                        </Form.Group>
                    </Col>
                )}

                {blockValue.typeOfAppointment === 'newAppointment' && (
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

                {blockValue.typeOfAppointment === 'oldStaffTransfer' && (
                    <Col lg={4}>
                        <Form.Group controlId="employeeToBeTransferred">
                            <Form.Label>Employee to be Transferred</Form.Label>
                            <Select
                                name="employeeToBeTransferred"
                                value={TYPE_OF_APPOINTMENT.find(option => option.value === blockValue.employeeToBeTransferred) || null}
                                onChange={handleSelectChange('employeeToBeTransferred')}
                                options={TYPE_OF_APPOINTMENT}
                                isSearchable={true}
                                placeholder="Select Employee to be Transferred"
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
