import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';
import Flatpickr from 'react-flatpickr';

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
}

const DateInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode = false,
    blockValue
}) => {
    const { id, label, placeholder, required, disabled, isShow } = block.property;

    const isRequired = required === "true";
    const isDisabled = !!(disabled || (!editMode && !isShow));
    const value = blockValue[id] || undefined; // ✅ use undefined instead of null

    const handleDateChange = (selectedDates: Date[]) => {
        const formattedDate = selectedDates.length > 0
            ? selectedDates[0].toISOString().split('T')[0]
            : '';

        const syntheticEvent = {
            target: { value: formattedDate }
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
                        name={id}
                        value={value}
                        onChange={handleDateChange}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        options={{
                            enableTime: false,
                            dateFormat: "dateFormate",
                            time_24hr: false,
                            ...(block.property.dateSelection === 'today' && {
                                minDate: new Date(),
                                maxDate: new Date(),
                            }),
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

export default DateInput;
