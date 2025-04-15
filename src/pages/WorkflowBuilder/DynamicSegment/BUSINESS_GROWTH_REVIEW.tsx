import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Col, Form, Row, InputGroup } from "react-bootstrap";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import config from "@/config";
import axios from "axios";

interface UpdateEmployee {
    projectName: string;
    projectInchargeName: string;
    tenderingToStartWork: string;
    EarliestExpectedDateofProjectCompletion: string;
    DelayedExpectedDateofProjectCompletion: string;
    ExpectedNextValueofWorkItemforteam: string;
    confirmationOfEmployeeMasterUpdated: string;
    expectedNextValueAmount: string;
}
 interface PROJECTLIST {
    projectName: string;
    projectInchargeName: string;
 }


const BUSINESS_GROWTH_REVIEW = forwardRef((props: any, ref) => {
    const [projectList, setProjectList] = useState<PROJECTLIST[]>([]);
    const [blockValue, setBlockValue] = useState<UpdateEmployee>(props.blockValue ?? {
        projectName: '',
        projectInchargeName: '',
        tenderingToStartWork: '',
        EarliestExpectedDateofProjectCompletion: '',
        DelayedExpectedDateofProjectCompletion: '',
        ExpectedNextValueofWorkItemforteam: '',
        confirmationOfEmployeeMasterUpdated: '',
        expectedNextValueAmount: ''
    });


    const fetch = async () => {
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ProjectMaster/GetProjectDetails`);
            if (response.data.isSuccess) {
                console.log(response)
                setProjectList(response.data.projectDetails);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        fetch();
    })

    const handleDateChange = (field: keyof UpdateEmployee, dateStr: string) => {
        setBlockValue(prev => ({
            ...prev,
            [field]: dateStr
        }));
    };


    const handleFloatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBlockValue(prev => ({
            ...prev,
            expectedNextValueAmount: value
        }));
    };

    useImperativeHandle(ref, () => ({
        UPDATE_EMPLOYEE: () => blockValue
    }));

    return (
        <div>
            {projectList.map((project, idx) => (
                <Row key={idx} className="mb-3">
                    <Col lg={4}>
                        <Form.Group controlId={`projectName-${idx}`}>
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" value={project.projectName} disabled />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId={`gm-${idx}`}>
                            <Form.Label>GM</Form.Label>
                            <Form.Control type="text" value={project.projectInchargeName} disabled />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId={`tenderingToStartWork-${idx}`}>
                            <Form.Label>Tendering To Start Work</Form.Label>
                            <Flatpickr
                                value={blockValue.tenderingToStartWork}
                                onChange={([date]) => handleDateChange("tenderingToStartWork", date?.toISOString().split('T')[0] || "")}
                                options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today" }}
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId={`EarliestExpectedDateofProjectCompletion-${idx}`}>
                            <Form.Label>Earliest Expected Date of Project Completion</Form.Label>
                            <Flatpickr
                                value={blockValue.EarliestExpectedDateofProjectCompletion}
                                onChange={([date]) => handleDateChange("EarliestExpectedDateofProjectCompletion", date?.toISOString().split('T')[0] || "")}
                                options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today" }}
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId={`DelayedExpectedDateofProjectCompletion-${idx}`}>
                            <Form.Label>Delayed Expected Date of Project Completion</Form.Label>
                            <Flatpickr
                                value={blockValue.DelayedExpectedDateofProjectCompletion}
                                onChange={([date]) => handleDateChange("DelayedExpectedDateofProjectCompletion", date?.toISOString().split('T')[0] || "")}
                                options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today" }}
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId={`ExpectedNextValueofWorkItemforteam-${idx}`}>
                            <Form.Label>Expected Next Value of Work Item for Team</Form.Label>
                            <Flatpickr
                                value={blockValue.ExpectedNextValueofWorkItemforteam}
                                onChange={([date]) => handleDateChange("ExpectedNextValueofWorkItemforteam", date?.toISOString().split('T')[0] || "")}
                                options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today" }}
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                        <Form.Group controlId={`expectedNextValueAmount-${idx}`}>
                            <Form.Label>Expected Value (in Lakhs)</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>₹</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={blockValue.expectedNextValueAmount}
                                    onChange={handleFloatChange}
                                    placeholder="Enter amount"
                                    inputMode="decimal"
                                    pattern="^\d*\.?\d{0,2}$"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
            ))}
        </div>
    );
});

export default BUSINESS_GROWTH_REVIEW;
