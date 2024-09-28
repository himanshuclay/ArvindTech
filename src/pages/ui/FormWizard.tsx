import React, { useState } from 'react';
import { Button, Offcanvas, Form } from 'react-bootstrap';

const FormWizardOffcanvas = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1); // State for controlling form steps
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShow(false); // Close the offcanvas after submission
  };

  // Stepper Component
  const Stepper = () => (
    <div className="stepper">
      <div className={`step ${step >= 1 ? 'completed' : ''}`}>
        <span>1</span>
      </div>
      <div className={`step-line ${step > 1 ? 'completed-line' : ''}`}></div>
      <div className={`step ${step >= 2 ? 'completed' : ''}`}>
        <span>2</span>
      </div>
      <div className={`step-line ${step > 2 ? 'completed-line' : ''}`}></div>
      <div className={`step ${step >= 3 ? 'completed' : ''}`}>
        <span>3</span>
      </div>
      <div className={`step-line ${step > 3 ? 'completed-line' : ''}`}></div>
      <div className={`step ${step >= 4 ? 'completed' : ''}`}>
        <span>3</span>
      </div>
    </div>
  );

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Open Form Wizard
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Form Wizard</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='d-flex'>
          {/* Stepper */}
          <Stepper />

          {/* Form Steps */}
          <Form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h4>Step 1: Please Update data for Camp1-Mess1</h4>
                <Form.Group controlId="formName">
                  <Form.Label>Mess Working status</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Asst_Accounts_Officer</Form.Label>
                  <Form.Control
                    type="text"
                    name="Asst_Accounts_Officer"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>
              </>
            )}

            {step === 2 && (
              <>
                <h4>Step 2: Please Update data for Camp1-Mess2</h4>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                  />
                </Form.Group>
              </>
            )}
            {step === 3 && (
              <>
                <h4>Step 2: Please Update data for Camp1-Mess3</h4>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                  />
                </Form.Group>
              </>
            )}

            {step === 4 && (
              <>
                <h4>Step 3: Review & Submit</h4>
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Address:</strong> {formData.address}
                </p>
                <p>
                  <strong>City:</strong> {formData.city}
                </p>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="mt-3">
              {step > 1 && (
                <Button variant="secondary" onClick={handlePrev} className="me-2">
                  Previous
                </Button>
              )}
              {step < 4 && (
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
              {step === 4 && (
                <Button variant="success" type="submit">
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FormWizardOffcanvas;
