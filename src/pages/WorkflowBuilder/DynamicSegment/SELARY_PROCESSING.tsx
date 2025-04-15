import { useState, forwardRef, useImperativeHandle } from "react";
import { Col, Form, Row } from "react-bootstrap";

interface UpdateEmployee {
  employeeID: string;
  employeeName: string;
  designation: string;
  totalWorkingDays: string;
  present: string;
  holiday: string;
  totalLeave: string;
}

const SALARY_PROCESSING = forwardRef((props: any, ref) => {
  const [blockValue, setBlockValue] = useState<UpdateEmployee>(props.blockValue ?? {
    employeeID: '',
    employeeName: '',
    designation: '',
    totalWorkingDays: '',
    present: '',
    holiday: '',
    totalLeave: '',
  });

  const projectList = [
    { employeeID: 'EMP001', employeeName: 'John', designation: 'Developer' },
    { employeeID: 'EMP002', employeeName: 'Jane', designation: 'Designer' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof UpdateEmployee) => {
    const value = e.target.value;
    setBlockValue(prev => ({
      ...prev,
      [field]: value
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
            <Form.Group controlId={`employeeID-${idx}`}>
              <Form.Label>Employee ID</Form.Label>
              <Form.Control type="text" value={project.employeeID} disabled />
            </Form.Group>
          </Col>

          <Col lg={4}>
            <Form.Group controlId={`employeeName-${idx}`}>
              <Form.Label>Employee Name</Form.Label>
              <Form.Control type="text" value={project.employeeName} disabled />
            </Form.Group>
          </Col>

          <Col lg={4}>
            <Form.Group controlId={`designation-${idx}`}>
              <Form.Label>Designation</Form.Label>
              <Form.Control type="text" value={project.designation} disabled />
            </Form.Group>
          </Col>

          <Col lg={4}>
            <Form.Group controlId={`totalWorkingDays-${idx}`}>
              <Form.Label>Total Working Days</Form.Label>
              <Form.Control
                type="number"
                value={blockValue.totalWorkingDays}
                onChange={(e) => handleChange(e, "totalWorkingDays")}
                placeholder="Enter total working days"
              />
            </Form.Group>
          </Col>

          <Col lg={4}>
            <Form.Group controlId={`present-${idx}`}>
              <Form.Label>Present Days</Form.Label>
              <Form.Control
                type="number"
                value={blockValue.present}
                onChange={(e) => handleChange(e, "present")}
                placeholder="Enter present days"
              />
            </Form.Group>
          </Col>

          <Col lg={4}>
            <Form.Group controlId={`holiday-${idx}`}>
              <Form.Label>Holidays</Form.Label>
              <Form.Control
                type="number"
                value={blockValue.holiday}
                onChange={(e) => handleChange(e, "holiday")}
                placeholder="Enter number of holidays"
              />
            </Form.Group>
          </Col>

          <Col lg={4}>
            <Form.Group controlId={`totalLeave-${idx}`}>
              <Form.Label>Total Leave</Form.Label>
              <Form.Control
                type="number"
                value={blockValue.totalLeave}
                onChange={(e) => handleChange(e, "totalLeave")}
                placeholder="Enter leave days"
              />
            </Form.Group>
          </Col>
        </Row>
      ))}
    </div>
  );
});

export default SALARY_PROCESSING;
