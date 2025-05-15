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
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const DateInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {
    const { id, label, placeholder, validation, disabled, isShow, dateFormate, mode, dateValue } = block.property;

    const isRequired = validation === "required";
    const isDisabled = !!(disabled || (!editMode && !isShow));
    const value = blockValue[id] || dateValue || undefined; // ✅ use undefined instead of null

    // Type check for valid mode values
    const validModes: ("time" | "multiple" | "single" | "range")[] = ["time", "multiple", "single", "range"];
    const dateMode: "time" | "multiple" | "single" | "range" | undefined = validModes.includes(mode as "time" | "multiple" | "single" | "range") ? (mode as "time" | "multiple" | "single" | "range") : "single";

    const handleDateChange = (selectedDates: Date[]) => {
        const formattedDate = selectedDates.length > 0
            ? selectedDates[0].toISOString().split('T')[0]
            : '';

        setBlockValue((prevState) => ({
            ...prevState,
            [id]: formattedDate,
        }));

        const syntheticEvent = {
            target: { value: formattedDate }
        } as React.ChangeEvent<HTMLInputElement>;

        handleChange(syntheticEvent, id);
    };
    const enableTime = dateFormate ? /[HhGgi]/.test(dateFormate) : false;
    

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
                                        enableTime: enableTime,
                                        altInput: true,
                                        altFormat: dateFormate,
                                        dateFormat: "Y-m-d",
                                        mode: dateMode,  // Use the validated dateMode here
                                        ...(block.property.dateSelection === 'futureDateOnly(includingToday)' && {
                                            minDate: new Date(),
                                            maxDate: '',
                                        }),
                                        ...(block.property.dateSelection === 'today' && {
                                            minDate: new Date(),
                                            maxDate: new Date(),
                                        }),
                                        ...(block.property.dateSelection === 'futureDateOnly(Max15Days)' && {
                                            minDate: new Date(),
                                            maxDate: new Date(new Date().setDate(new Date().getDate() + 15)),
                                        }),
                                        ...(block.property.dateSelection === 'anyPastDateSelection' && {
                                            minDate: '',
                                            maxDate: new Date(),
                                        }),
                                        ...(block.property.dateSelection === 'anyPastDateWithNotBeyondPastDate' && {
                                            minDate: block.property.minAllowedDate,
                                            maxDate: new Date(),
                                        }),
                                        ...(block.property.dateSelection === 'anyFutureDateWithNotBeyondFutureDate' && {
                                            minDate: new Date(),
                                            maxDate: block.property.minAllowedDate,
                                        }),
                                        ...(block.property.dateSelection === 'notToday' && {
                                            disable: [new Date()],
                                        }),
                                        ...(block.property.dateSelection === 'notThisDate' && block.property.minAllowedDate && {
                                            disable: [new Date(block.property.minAllowedDate)],
                                        }),
                                        ...(block.property.dateSelection === 'blockWeek' && block.property.minAllowedDate
                                            ? {
                                                disable: [
                                                    function (date: Date) {
                                                        const minDateStr = block.property.minAllowedDate!;
                                                        const refDate = new Date(minDateStr); // Now it's definitely string

                                                        const day = refDate.getDay(); // Sunday = 0
                                                        const startOfWeek = new Date(refDate);
                                                        startOfWeek.setDate(refDate.getDate() - day); // Sunday of the week

                                                        const endOfWeek = new Date(startOfWeek);
                                                        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday of the same week

                                                        return date >= startOfWeek && date <= endOfWeek;
                                                    }
                                                ]
                                            }
                                            : {}
                                        ),
                                        ...(block.property.dateSelection === 'blockMonth' && block.property.minAllowedDate
                                            ? {
                                                disable: [
                                                    function (date: Date) {
                                                        const refDate = new Date(block.property.minAllowedDate!); // e.g., '2025-04-01'
                                                        const blockMonth = refDate.getMonth(); // April = 3 (0-indexed)
                                                        const blockYear = refDate.getFullYear();

                                                        return (
                                                            date.getMonth() === blockMonth &&
                                                            date.getFullYear() === blockYear
                                                        );
                                                    }
                                                ]
                                            }
                                            : {}
                                        ),
                                        ...(block.property.dateSelection === 'blockYear' && block.property.minAllowedDate
                                            ? {
                                                disable: [
                                                    function (date: Date) {
                                                        const refYear = new Date(block.property.minAllowedDate!).getFullYear(); // e.g., 2025

                                                        return date.getFullYear() === refYear;
                                                    }
                                                ]
                                            }
                                            : {})

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
