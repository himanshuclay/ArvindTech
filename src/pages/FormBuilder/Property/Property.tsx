import React, { useEffect, useState } from 'react';
import { Accordion, Col, Form, Row } from 'react-bootstrap';
import { FIELD, PROPERTY } from '../Constant/Interface';
import { updatePropertyByID } from '../Constant/Functions';
import Flatpickr from 'react-flatpickr';
import axios from 'axios';
import config from '@/config';


interface Props {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    property: PROPERTY;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    removeFormBlock: (id: string) => void;
}

interface Option {
    label: string;
    value: string;
}

const Property: React.FC<Props> = ({ form, setForm, property, setProperty, removeFormBlock }) => {
    const [mastersLists, setMasterLists] = useState<Option[]>([]);
    const [columnLists, setColumnLists] = useState<Option[]>([]); // Store column options

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'required') {
            setProperty(prevProperty => ({
                ...prevProperty,
                [name]: value,
            }));

        } else if (name === 'backgroundColor' || name === 'color') {
            setProperty(prevProperty => ({
                ...prevProperty,
                advance: {
                    ...prevProperty.advance,
                    [name]: value,
                }
            }));
        } else {
            setProperty(prevProperty => ({
                ...prevProperty,
                [name]: value,
            }));
        }
        setTimeout(() => {
            handleSave();

        }, 0);
    };

    const handleSave = () => {
        // const updatedBlocks = form.blocks.map(block =>
        //     block.property.id === property.id ? { ...block, property } : block
        // );
        console.log('property', property)
        const updatedBlocks = updatePropertyByID(form.blocks, property.id, property)
        console.log('updatedBlocks', updatedBlocks)
        setForm(prevForm => ({
            ...prevForm,
            blocks: updatedBlocks,
        }));
    };

    const handleOption = (action: string, index?: number) => {
        if (action === 'add') {
            setProperty(prevProperty => ({
                ...prevProperty,
                options: [...prevProperty.options, { label: '', value: '' }]
            }));
        } else if (action === 'remove' && typeof index === 'number') {
            setProperty(prevProperty => ({
                ...prevProperty,
                options: prevProperty.options.filter((_, i) => i !== index)
            }));
        }
    };
    const fetchColumnNames = async (id: string) => {
        const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetColumnList`, { params: { id } });
        console.log(response)
        setColumnLists(response.data.columnFormLists);
    };

    useEffect(() => {
        axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetMasterList`)
            .then(response => {
                setMasterLists(response.data.masterForms);
            });
    
        if (property.masterID) {
            fetchColumnNames(property.masterID);
        }
    }, [property.masterID]); // Corrected dependency array
    

return (
    <div className='bg-white p-3 border rounded shadow-md'>
        <div className='d-flex justify-content-end mb-1'>
            <button
                type='button'
                onClick={() => removeFormBlock(property.id)} // Pass block id to remove
                className="px-2 py-2 border-0 bg-white"
            >
                <i className="ri-delete-bin-6-fill"></i>
            </button>
            <button
                type='button'
                onClick={handleSave}
                className="px-2 py-2 border-0 bg-white"
            >
                <i className="ri-save-fill"></i>
            </button>
        </div>

        {/* Label Field */}
        {property.hasOwnProperty('label') && (
            <div className='d-flex justify-content-between align-items-center'>
                <label className='col-6'>Label</label>
                <input
                    type="text"
                    name="label"
                    className="border p-2 rounded col-6"
                    value={property.label}
                    onChange={handleChange}
                    placeholder="Enter label"
                />
            </div>
        )}

        {/* Placeholder Field */}
        {property.hasOwnProperty('placeholder') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Placeholder</label>
                <input
                    type="text"
                    name="placeholder"
                    className="border p-2 rounded col-6"
                    value={property.placeholder}
                    onChange={handleChange}
                    placeholder="Enter placeholder"
                />
            </div>
        )}

        {property.hasOwnProperty('disabled') !== undefined && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Disabled</label>
                <select
                    name="disabled"
                    className="border p-2 rounded col-6"
                    value={property.disabled.toString()}
                    onChange={handleChange}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('size') !== undefined && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Size</label>
                <select
                    name="size"
                    className="border p-2 rounded col-6"
                    value={property.size}
                    onChange={handleChange}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('dateSelection') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Date Selection</label>
                <select
                    name="dateSelection"
                    className="border p-2 rounded col-6"
                    value={property.dateSelection}
                    onChange={handleChange}
                >
                    <option value="none">None</option>
                    <option value="futureDateOnly(includingToday)">Future Date Only (including Today)</option>
                    <option value="today">Today</option>
                    <option value="futureDateOnly(Max15Days)">Future Date Only (Max 15 Days)</option>
                    <option value="anyPastDateSelection">Any past Date selection</option>
                    <option value="anyPastDateWithNotBeyondPastDate">Any Past Date With Not Beyond Past Date</option>
                    <option value="anyFutureDateWithNotBeyondFutureDate">Any Future Date With Not Beyond Future Date</option>
                    <option value="notToday">Not Today</option>
                    <option value="notThisDate">Not This Date</option>
                    <option value="blockWeek">Block Week</option>
                    <option value="blockMonth">Block Month</option>
                    <option value="blockYear">Block Year</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('validation') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Validation</label>
                <select
                    name="validation"
                    className="border p-2 rounded col-6"
                    value={property.validation}
                    onChange={handleChange}
                >
                    <option value="none">None</option>
                    <option value="required">Required</option>
                    {['NumberInput'].includes(property.type) && (
                        <>
                            <option value="nonNegativeInteger">Non Negative Integer</option>
                            <option value="positiveIntegerGreaterZero">Positive Integer Greater Zero</option>
                        </>
                    )}
                    <option value="duplicacyChecker">Duplicacy Checker</option>
                </select>
            </div>
        )}
        {property.validation === "duplicacyChecker" && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Master</label>
                <select
                    name="masterID"
                    className="border p-2 rounded col-6"
                    value={property.masterID}
                    onChange={handleChange}
                >
                    <option value="">please select</option>
                    {mastersLists.map(master => (
                        <option value={master.value}>{master.label}</option>
                    ))}
                </select>
            </div>
        )}
        {property.validation === "duplicacyChecker" && property.masterID && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>ColumnID</label>
                <select
                    name="ColumnID"
                    className="border p-2 rounded col-6"
                    value={property.ColumnID}
                    onChange={handleChange}
                >
                    <option value="">please select</option>
                    {columnLists.map(master => (
                        <option value={master.value}>{master.label}</option>
                    ))}
                </select>
            </div>
        )}
        {property.dateSelection && ["notThisDate", "anyPastDateWithNotBeyondPastDate", "anyFutureDateWithNotBeyondFutureDate", "blockWeek", "blockMonth", "blockYear"].includes(property.dateSelection) && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Date Selection</label>
                <Flatpickr
                    name="minAllowedDate"
                    value={property.minAllowedDate}
                    onChange={(selectedDates) => {
                        const formattedDate = selectedDates.length > 0
                            ? selectedDates[0].toISOString().split('T')[0]
                            : '';

                        const syntheticEvent = {
                            target: { name: 'minAllowedDate', value: formattedDate }
                        } as React.ChangeEvent<HTMLInputElement>;

                        handleChange(syntheticEvent); // Your existing handler
                    }}
                    options={{
                        enableTime: false,
                        altInput: true,
                        altFormat: 'Y-m-d',
                        dateFormat: "Y-m-d",
                        time_24hr: false,
                        mode: 'single',  // Use the validated dateMode here
                    }}
                />
            </div>
        )}
        {property.hasOwnProperty('dateFormate') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Date Formate</label>
                <select
                    name="dateFormate"
                    className="border p-2 rounded col-6"
                    value={property.dateFormate}
                    onChange={handleChange}
                >
                    <option value="none">None</option>
                    <option value="Y-m-d">YYYY/MM/DD</option>
                    <option value="F, Y">M, YYYY(March, 2025)</option>
                    <option value="m/y">MMM/YY</option>
                    <option value="d-m-y">d-m-Y</option>
                    <option value="D-M-Y">D-m-Y</option>
                    <option value="d-m-y">j-n-Y</option>
                    <option value="y-m-d">Y-m-d</option>
                    <option value="M-D-Y">m-d-Y</option>
                    <option value="D, d M Y">D, d M Y</option>
                    <option value="F j, Y">F j, Y</option>
                    <option value="l, d F Y">l, d F Y</option>
                    <option value="H:M">H:i</option>
                    <option value="H:M:S">H:i:S</option>
                    <option value="Y-M-D H:M">Y-m-d H:i</option>
                    <option value="d-m-y H:M">d-m-Y H:i</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('mode') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Mode</label>
                <select
                    name="mode"
                    className="border p-2 rounded col-6"
                    value={property.mode}
                    onChange={handleChange}
                >
                    <option value="range">Range</option>
                    <option value="single">Single</option>
                    <option value="multiple">Multiple</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('currencySymbol') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Currency Icon</label>
                <select
                    name="currencySymbol"
                    className="border p-2 rounded col-6"
                    value={property.currencySymbol}
                    onChange={handleChange}
                >
                    <option value="₹">₹</option>
                    <option value="$">$</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('decimalLimit') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Decimal Values</label>
                <select
                    name="decimalLimit"
                    className="border p-2 rounded col-6"
                    value={property.decimalLimit}
                    onChange={handleChange}
                >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('prefix') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Icon</label>
                <select
                    name="prefix"
                    className="border p-2 rounded col-6"
                    value={property.prefix}
                    onChange={handleChange}
                >
                    <option value="%">%</option>
                    <option value="₹">₹</option>

                </select>
            </div>
        )}
        {property.hasOwnProperty('isLooping') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Is Looping</label>
                <select
                    name="isLooping"
                    className="border p-2 rounded col-6"
                    value={property.isLooping}
                    onChange={handleChange}
                >
                    <option value="true">yes</option>
                    <option value="false">no</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('tableConfiguration') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Configuration</label>
                <select
                    name="tableConfiguration"
                    className="border p-2 rounded col-6"
                    value={property.tableConfiguration}
                    onChange={handleChange}
                >
                    <option value="">Please select</option>
                    <option value="Rolling_Program_Material">Rolling_Program_Material</option>
                    <option value="DemobManpowerTemplate">Demob Manpower Template</option>
                    <option value="DemobMachineryTemplate">Demob Machinery Template</option>
                    <option value="DemobCampTemplate">Demob Camp Template</option>
                </select>
            </div>
        )}
        {property.hasOwnProperty('value') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Value</label>
                <input
                    type="text"
                    name="value"
                    className="border p-2 rounded col-6"
                    value={property.value}
                    onChange={handleChange}
                    placeholder="Enter value"
                />
            </div>
        )}
        {property.hasOwnProperty('maxSelections') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Max Selections</label>
                <input
                    type="number"
                    name="maxSelections"
                    className="border p-2 rounded col-6"
                    value={property.maxSelections}
                    onChange={handleChange}
                    placeholder="Enter Max Selections"
                />
            </div>
        )}
        {property.hasOwnProperty('dateValue') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Value</label>
                <Flatpickr
                    name="dateValue"
                    value={property.dateValue || ''}
                    onChange={(selectedDates) => {
                        const formattedDate = selectedDates.length > 0
                            ? selectedDates[0].toISOString().split('T')[0]
                            : '';

                        const syntheticEvent = {
                            target: { name: 'dateValue', value: formattedDate }
                        } as React.ChangeEvent<HTMLInputElement>;

                        handleChange(syntheticEvent); // Your existing handler
                    }}
                    options={{
                        enableTime: false,
                        altInput: true,
                        altFormat: 'Y-m-d',
                        dateFormat: "Y-m-d",
                        time_24hr: false,
                        mode: 'single',  // Use the validated dateMode here
                    }}
                />
            </div>
        )}
        {property.hasOwnProperty('groupName') && (
            <div className='d-flex justify-content-between align-items-center mt-2'>
                <label className='col-6'>Group Name</label>
                <input
                    type="text"
                    name="groupName"
                    className="border p-2 rounded col-6"
                    value={property.groupName || ''}
                    onChange={handleChange}
                    placeholder="Enter Group Name"
                />
            </div>
        )}

        {/* Options Fields */}
        {property.hasOwnProperty('options') && (
            <div className='mt-4'>
                <Row className='m-0 mb-1'>
                    <Col><h5>Options</h5></Col>
                    <Col className='d-flex justify-content-end'>
                        <button onClick={() => handleOption('add')} className='border'><i className="ri-add-fill"></i></button>
                    </Col>
                </Row>

                {property.options.map((option, index) => (
                    <div key={index}>
                        <Row className='m-0'>
                            <Col lg={5}>
                                <Form.Control
                                    type="text"
                                    placeholder="Label"
                                    value={option.label}
                                    onChange={(e) => {
                                        const updatedOptions = [...property.options];
                                        updatedOptions[index].label = e.target.value;
                                        setProperty(prev => ({ ...prev, options: updatedOptions }));
                                        handleSave();
                                    }}
                                />
                            </Col>
                            <Col lg={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Value"
                                    value={option.value}
                                    onChange={(e) => {
                                        const updatedOptions = [...property.options];
                                        updatedOptions[index].value = e.target.value;
                                        setProperty(prev => ({ ...prev, options: updatedOptions }));
                                    }}
                                />
                            </Col>
                            <Col lg={1} className='d-flex align-items-center'>
                                <button onClick={() => handleOption('remove', index)} className='border m-0'>
                                    <i className="ri-subtract-fill"></i>
                                </button>
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        )}

        {/* Advance Section */}
        {property.hasOwnProperty('advance') && (
            <Accordion defaultActiveKey="0" className='w-100 mt-3'>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Advance</Accordion.Header>
                    <Accordion.Body>
                        {/* Background Color */}
                        {property.advance.backgroundColor && (
                            <div>
                                <label className='col-6'>Background Color</label>
                                <input
                                    type="color"
                                    name="backgroundColor"
                                    className="border p-2 rounded col-6"
                                    value={property.advance.backgroundColor}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {/* Color */}
                        {property.advance.color && (
                            <div className="mt-3">
                                <label className='col-6'>Color</label>
                                <input
                                    type="color"
                                    name="color"
                                    className="border p-2 rounded col-6"
                                    value={property.advance.color}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )}
    </div>
);
};

export default Property;
