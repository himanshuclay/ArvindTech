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
    const { id, label, placeholder, required, disabled, isShow, dateFormate, mode } = block.property;

    const isRequired = required === "true";
    const isDisabled = !!(disabled || (!editMode && !isShow));
    const value = blockValue[id] || undefined; // ✅ use undefined instead of null

    // Type check for valid mode values
    const validModes: ("time" | "multiple" | "single" | "range")[] = ["time", "multiple", "single", "range"];
    const dateMode: "time" | "multiple" | "single" | "range" | undefined = validModes.includes(mode as "time" | "multiple" | "single" | "range") ? (mode as "time" | "multiple" | "single" | "range") : "single";

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
                <>
                    <div className={`${editMode ? 'cursor-not-allowed' : ''}`}>
                        <fieldset className={`${editMode ? 'pointer-events-none select-none' : ''}`}>
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
                                        altInput: true,
                                        altFormat: dateFormate,
                                        dateFormat: "Y-m-d",
                                        time_24hr: false,
                                        mode: dateMode,  // Use the validated dateMode here
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
                        </fieldset>
                    </div>
                </>
            )}
        </div>
    );
};

export default DateInput;
