import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { SingleValue } from 'react-select';
// import Flatpickr from 'react-flatpickr';



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

const INDUCTION = () => {
    const [induction, setInduction] = useState<Induction>({
        deployedStaffHasBeenFacilitatedWithTheBelowDetails: '',
        accommodation: '',
        foodingMessRequirement: '',
        reportingManager: '',
    });

    // const [transferredEmployeeList,] = useState([
    //     { label: 'ddd', value: 'ererr' }
    // ]);





    // Handle Select Changes
    const handleSelectChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
        fieldName: keyof Induction
    ) => {
        setInduction(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    // const handleDateChange = (selectedDates: Date[]) => {
    //     setInduction(prev => ({
    //         ...prev,
    //         transferredDate: selectedDates.length > 0 ? selectedDates[0].toISOString().split('T')[0] : ''
    //     }));
    // };

    return (
        <div>
            <Row>
                <Col lg={4}>
                    <Form.Group controlId="deployedStaffHasBeenFacilitatedWithTheBelowDetails">
                        <Form.Label>Confirmation of Staff Deployed at Site</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === induction.deployedStaffHasBeenFacilitatedWithTheBelowDetails)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "deployedStaffHasBeenFacilitatedWithTheBelowDetails")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group controlId="accommodation">
                        <Form.Label>Accommodation</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === induction.accommodation)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "accommodation")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group controlId="foodingMessRequirement">
                        <Form.Label>Fooding / Mess Requirement</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === induction.foodingMessRequirement)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "foodingMessRequirement")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group controlId="reportingManager">
                        <Form.Label>Reporting Manager</Form.Label>
                        <Select
                            options={YES_NO_OPTIONS}
                            value={YES_NO_OPTIONS.find(option => option.value === induction.reportingManager)}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "reportingManager")}
                            placeholder="Select Yes or No"
                        />
                    </Form.Group>
                </Col>
                
            </Row>
        </div>
    );
};

export default INDUCTION;
