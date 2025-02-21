import React from 'react';
import { Accordion, Col, Form, Row } from 'react-bootstrap';
import { FIELD, PROPERTY } from '../Constant/Interface';

interface Props {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    property: PROPERTY;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    removeFormBlock: (id: string) => void;
}

const Property: React.FC<Props> = ({ form, setForm, property, setProperty, removeFormBlock }) => {
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
        const updatedBlocks = form.blocks.map(block => 
            block.property.id === property.id ? { ...block, property } : block
        );
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

            {/* Required Field */}
            {property.hasOwnProperty('required') !== undefined && (
                <div className='d-flex justify-content-between align-items-center mt-2'>
                    <label className='col-6'>Required</label>
                    <select
                        name="required"
                        className="border p-2 rounded col-6"
                        value={property.required.toString()}
                        onChange={handleChange}
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
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
