import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
// import { END1, END2 } from '../Constant/Constant';
import { getBlockById } from '../Constant/Functions';
import { CONFIGURE_SELECTION_LOGICS, FIELD } from '../Constant/Interface';
import axios from 'axios';
import config from '@/config';
import { CONFIGURE_SELECTION_LOGIC } from '../Constant/Constant';



interface Option {
    label: string;
    value: string;
}

interface Props {
    configureSelectionLogic: boolean;
    setConfigureSelectionLogic: (id: boolean) => void;
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
}

const ConfigureSelectionLogic: React.FC<Props> = ({ configureSelectionLogic, setConfigureSelectionLogic, form, setForm }) => {
    const [configureSelectionLogics, setConfigureSelectionLogics] = useState<CONFIGURE_SELECTION_LOGICS[]>(form.configureSelectionLogics || []);
    const [, setMasterLists] = useState<Option[]>([]);
    const [columnLists, setColumnLists] = useState<{ [key: string]: Option[] }>({}); // Store column options

    const handleClose = () => {
        setConfigureSelectionLogic(false);
    };

    const handleRule = (action: 'add' | 'remove', index?: number) => {
        if (action === 'add') {
            setConfigureSelectionLogics(prevRules => [...prevRules, {
                start1: '',
                start2: [], // Ensure start2 is initialized as an array
                start3: '',
                start4: '',
                end1: '',
                end2: '',
                end3: '',
            }]);
        } else if (action === 'remove' && typeof index === 'number') {
            setConfigureSelectionLogics(prevRules => prevRules.filter((_, i) => i !== index));
        }
    };

    const handleRuleChange = (name: string, value: string | string[], index: number) => {

        // Handle multi-select case for start2, where value is an array
        if (name === 'start2') {
            const selectedValues = Array.isArray(value) ? value : [value]; // Ensure value is always an array
            setConfigureSelectionLogics(prevRules => {
                const updatedRules = [...prevRules];
                updatedRules[index][name] = selectedValues;
                return updatedRules;
            });
        } else {
            // For other names (single select or input), just assign the value directly
            const selectedValues = Array.isArray(value) ? value[0] : value; // Ensure value is always an array
            setConfigureSelectionLogics(prevRules => {
                const updatedRules = [...prevRules];
                updatedRules[index].start1 = selectedValues;
                return updatedRules;
            });
        }
    };


    const saveChanges = () => {
        setForm(prevForm => ({
            ...prevForm,
            configureSelectionLogics: configureSelectionLogics,
        }));
        handleClose();
    };

    const handleStart1 = (rule: CONFIGURE_SELECTION_LOGICS) => {
        const options: Option[] = form.blocks.map(block => ({
            label: `${block.property.label} (${block.property.id})`,
            value: block.property.id,
        }));
        if (options.length) {
            return { isShow: true, options };
        }
        return { isShow: false, options: [] };
    };

    const handleStart2 = (rule: CONFIGURE_SELECTION_LOGICS) => {
        let block = getBlockById(form, rule.start1);
        if (block?.is === 'Select') {
            return { isShow: true, options: block.property.options }
        }
        return { isShow: false, options: [] };
    };

    const fetchColumnNames = async (id: string) => {
        if (!columnLists[id]) {
            const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetColumnList`, { params: { id } });
            setColumnLists(prev => ({ ...prev, [id]: response.data.columnFormLists }));
        }
    };

    useEffect(() => {
        axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetMasterList`).then(response => {
            setMasterLists(response.data.masterForms);
        });
        form.rules.map(rule => {
            if (rule.start3) {
                fetchColumnNames(rule.start3)
            }
        });
    }, [form.rules]);

    const handleDynamicInput = (start1: string) => {
        const block = form.blocks.find(block => block.property.id === start1)
        if (block) {
            return block.is
        }
        return ''
    }

    return (
        <Modal show={configureSelectionLogic} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="col-6">Configure Selection Logic</Modal.Title>
                <div className="col-5 d-flex justify-content-end">
                    <button onClick={() => handleRule('add')} className="border">
                        <i className="ri-add-fill"></i> Add Rule
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="mt-4">
                    {configureSelectionLogics.map((rule, index) => (
                        <div key={index} className="mb-2 d-flex align-items-center justify-content-center text-center">
                            <div className="col-11 d-flex">
                                {/* START1 */}
                                {handleStart1(rule).isShow && (
                                    <Form.Group controlId={`rule-${index}-start1`} className="mr-1">
                                        <Form.Select
                                            name="start1"
                                            value={rule.start1}
                                            onChange={(e) => handleRuleChange('start1', e.target.value, index,)}
                                        >
                                            <option value="">Please select</option>
                                            {handleStart1(rule).options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {/* START2 */}
                                <Form.Group controlId={`rule-${index}-start2`}>
                                    {CONFIGURE_SELECTION_LOGIC[handleDynamicInput(rule.start1)](
                                        rule,
                                        index,
                                        handleRuleChange,
                                        handleStart2,
                                        fetchColumnNames
                                    )}
                                </Form.Group>


                            </div>
                            <div className="col-1">
                                <button onClick={() => handleRule('remove', index)} className="border">
                                    <i className="ri-subtract-fill"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div >
            </Modal.Body >
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ConfigureSelectionLogic;
