import { useState, forwardRef, useImperativeHandle } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';

interface Induction {
    deployedStaffHasBeenFacilitatedWithTheBelowDetails: string;
    accommodation: string;
    foodingMessRequirement: string;
    reportingManager: string;
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
];

const INDUCTION = forwardRef((props: any, ref) => {
    // Using blockValue as the main state variable
    const [blockValue, setBlockValue] = useState<Induction>({
        deployedStaffHasBeenFacilitatedWithTheBelowDetails: '',
        accommodation: '',
        foodingMessRequirement: '',
        reportingManager: '',
    });

    // Handle Select Changes dynamically
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof Induction
    ) => {
        setBlockValue(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // Expose blockValue to parent component via useImperativeHandle
    useImperativeHandle(ref, () => ({
        INDUCTION: () => blockValue
    }));

    return (
        <div>
            <Row>
                {/* Deployed Staff Facilitated */}
                <Col lg={4}>
                    <Form.Group controlId="deployedStaffHasBeenFacilitatedWithTheBelowDetails">
                        <Form.Label>Confirmation of Staff Deployed at Site</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.deployedStaffHasBeenFacilitatedWithTheBelowDetails)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "deployedStaffHasBeenFacilitatedWithTheBelowDetails")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>

                {/* Accommodation */}
                <Col lg={4}>
                    <Form.Group controlId="accommodation">
                        <Form.Label>Accommodation</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.accommodation)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "accommodation")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>

                {/* Fooding / Mess Requirement */}
                <Col lg={4}>
                    <Form.Group controlId="foodingMessRequirement">
                        <Form.Label>Fooding / Mess Requirement</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.foodingMessRequirement)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "foodingMessRequirement")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>

                {/* Reporting Manager */}
                <Col lg={4}>
                    <Form.Group controlId="reportingManager">
                        <Form.Label>Reporting Manager</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === blockValue.reportingManager)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "reportingManager")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
});

export default INDUCTION;
