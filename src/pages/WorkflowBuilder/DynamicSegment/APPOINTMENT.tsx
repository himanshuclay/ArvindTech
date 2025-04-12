import config from '@/config';
import axios from 'axios';
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';

interface RECRUITER {
    empId?: string;
    employeeName?: string;
}

const APPOINTMENT = forwardRef((props: any, ref) => {
    const [blockValue, setBlockValue] = useState<{ [key: string]: string }>(props.blockValue ? props.blockValue : {});
    const [recruiterList, setRecruiterList] = useState<RECRUITER[]>([]);

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
        console.log(field)
        console.log(selectedOption)
        setBlockValue((prev) => ({
            ...prev,
            [field]: selectedOption ? selectedOption.value : '', // Only store the value part of the selected option
        }));
        console.log(blockValue)
    };

    const fetchInit = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/CommonDropdown/GetEmployeeListWithId`);
            console.log(response)
            if (response.data.isSuccess) {
                setRecruiterList(response.data.employeeLists)
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchInit();
    },[])

    const recruiterOptions = recruiterList.map(rec => ({
        label: rec.employeeName || '',
        value: rec.empId || ''
    }));


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
                            <Select
                                placeholder="Enter Recruiter Name"
                                name="selectRecruiter"
                                value={recruiterOptions.find(option => option.value === blockValue.selectRecruiter) || null}
                                onChange={(selectedOption) =>
                                    handleSelectChange('selectRecruiter')(selectedOption || null)
                                }
                                options={recruiterOptions}
                                isSearchable={true}
                                className='h45'
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
                                placeholder="Enter Recruiter Name"
                                name="employeeToBeTransferred"
                                value={recruiterOptions.find(option => option.value === blockValue.employeeToBeTransferred) || null}
                                onChange={(selectedOption) =>
                                    handleSelectChange('employeeToBeTransferred')(selectedOption || null)
                                }
                                options={recruiterOptions}
                                isSearchable={true}
                                className='h45'
                            />
                        </Form.Group>
                    </Col>
                )}
            </Row>
        </div>
    );
});

export default APPOINTMENT;
