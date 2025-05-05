import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // Optional: include Flatpickr theme

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const TimeInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {
    const { id, label, placeholder, validation, disabled, isShow, dateFormate } = block.property;

    const isRequired = validation === "required";
    const isDisabled = !!(disabled || (!editMode && !isShow));
    const value = blockValue[id] || ''; // Time as string or empty

    const handleTimeChange = (selectedDates: Date[]) => {
        const time = selectedDates.length > 0
            ? selectedDates[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

        setBlockValue((prev) => ({
            ...prev,
            [id]: time,
        }));

        const syntheticEvent = {
            target: { value: time }
        } as React.ChangeEvent<HTMLInputElement>;

        handleChange(syntheticEvent, id);
    };

    return (
        <div>
            {(isShow || editMode) && (
                <Form.Group controlId={id} className="mb-3">
                    <Form.Label>
                        {label}
                        {isRequired && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Flatpickr
                        value={value}
                        onChange={handleTimeChange}
                        placeholder={placeholder || "Select time"}
                        disabled={isDisabled}
                        options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i", // 24-hour format (change to "h:i K" for 12-hour with AM/PM)
                            altInput: true,
                            altFormat: dateFormate || "h:i K",
                        }}
                        className={`form-control ${validationErrors[id] ? "is-invalid" : ""}`}
                    />
                    {validationErrors[id] && (
                        <Form.Text className="text-danger">
                            {validationErrors[id]}
                        </Form.Text>
                    )}
                </Form.Group>
            )}
        </div>
    );
};

export default TimeInput;
