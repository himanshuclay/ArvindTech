import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Optional styling

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue?: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>; // optional if you want direct control
}

const DateRange: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {

    const isRequired = block.property.validation === "required";
    const isDisabled = !!(block.property.disabled);

    const startDateId = block.property.startDateId || `${block.property.id}_start`;
    const endDateId = block.property.endDateId || `${block.property.id}_end`;

    // Direct update function for Flatpickr's output
    const handleDateChange = (selectedDates: Date[], dateStr: string, id: string) => {
        // Optional: format or process dateStr as needed before updating state
        if (setBlockValue) {
            setBlockValue(prev => ({
                ...prev,
                [id]: dateStr
            }));
        }
    };

    return (
        <div>
            {(block.property.isShow || editMode) && (
                <Form.Group controlId={block.property.id} className="mb-3">
                    <Form.Label>
                        {block.property.label}
                        {isRequired && <span className='text-danger'>*</span>}
                    </Form.Label>

                    <div className="d-flex gap-2 align-items-center">
                        <Flatpickr
                            name={startDateId}
                            value={blockValue[startDateId] || ''}
                            onChange={(dates, dateStr) => handleDateChange(dates, dateStr, startDateId)}
                            placeholder="Start Date"
                            disabled={isDisabled}
                            style={{ width: '50%' }}
                            options={{
                                enableTime: false,
                                dateFormat: "Y-m-d",
                                time_24hr: false,
                            }}
                            className={`form-control ${validationErrors[startDateId] ? "is-invalid" : ""}`}
                        />

                        <Flatpickr
                            name={endDateId}
                            value={blockValue[endDateId] || ''}
                            onChange={(dates, dateStr) => handleDateChange(dates, dateStr, endDateId)}
                            placeholder="End Date"
                            disabled={isDisabled}
                            style={{ width: '50%' }}
                            options={{
                                enableTime: false,
                                dateFormat: "Y-m-d",
                                time_24hr: false,
                            }}
                            className={`form-control ${validationErrors[endDateId] ? "is-invalid" : ""}`}
                        />
                    </div>

                    {validationErrors[startDateId] && (
                        <Form.Text className="text-danger d-block">{validationErrors[startDateId]}</Form.Text>
                    )}
                    {validationErrors[endDateId] && (
                        <Form.Text className="text-danger d-block">{validationErrors[endDateId]}</Form.Text>
                    )}
                </Form.Group>
            )}
        </div>
    );
};

export default DateRange;
