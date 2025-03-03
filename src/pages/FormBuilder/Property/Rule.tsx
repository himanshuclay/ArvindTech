import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { END1, END2, START1 } from '../Constant/Constant';
import { getBlockById } from '../Constant/Functions';
import { FIELD } from '../Constant/Interface';
import axios from 'axios';
import config from '@/config';

interface Option {
    label: string;
    value: string;
}

interface RULE {
    start1: string;
    start2: string;
    start3: string;
    start4: string;
    end1: string;
    end2: string;
    end3: string;
}

interface Props {
    showRule: boolean;
    setShowRule: (id: boolean) => void;
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
}

const Rule: React.FC<Props> = ({ showRule, setShowRule, form, setForm }) => {
    const [rules, setRules] = useState<RULE[]>(form.rules || []);
    const [mastersLists, setMasterLists] = useState<Option[]>([]);
    const [columnLists, setColumnLists] = useState<{ [key: string]: Option[] }>({}); // Store column options

    const handleClose = () => {
        setShowRule(false);
    };

    const handleRule = (action: 'add' | 'remove', index?: number) => {
        if (action === 'add') {
            setRules(prevRules => [...prevRules, {
                start1: '',
                start2: '',
                start3: '',
                start4: '',
                end1: '',
                end2: '',
                end3: '',
            }]);
        } else if (action === 'remove' && typeof index === 'number') {
            setRules(prevRules => prevRules.filter((_, i) => i !== index));
        }
    };

    const handleRuleChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number, field: keyof RULE) => {
        const { value } = e.target;
        setRules(prevRules => {
            const updatedRules = [...prevRules];
            updatedRules[index][field] = value;
            return updatedRules;
        });
    };

    const saveChanges = () => {
        setForm(prevForm => ({
            ...prevForm,
            rules: rules,
        }));
        handleClose();
    };

    const handleStart2 = (rule: RULE) => {
        if (['BIND', 'IF', 'MAP'].includes(rule.start1)) {
            const options: Option[] = form.blocks.map(block => ({
                label: `${block.property.label} (${block.property.id})`,
                value: block.property.id,
            }));
            return { isShow: true, options };
        }
        return { isShow: false, options: [] };
    };

    const handleStart3 = (rule: RULE) => {
        if (['MAP', 'BIND'].includes(rule.start1) && rule.start2) {
            // if (rule.start2.includes('Select')) {
            return { isShow: true, options: mastersLists };
            // } else if (rule.start2.includes('Text')) {
            // return { isShow: true, options: TABLE_NAME.TEXT };
            // }
        } else if (rule.start1 === 'IF' && rule.start2) {
            let block = getBlockById(form, rule.start2);
            if (block?.is === 'Select') {
                return { isShow: true, options: block.property.options }
            }
        }
        return { isShow: false, options: [] };
    };
    const handleEnd1 = (rule: RULE) => {
        if (rule.start1 === 'IF') {
            const options: Option[] = END1.THEN || [];
            return { isShow: true, options };
        } else if (rule.start1 === 'MAP') {
            const options: Option[] = END1.WHERE || [];
            return { isShow: true, options };
        }
        return { isShow: false, options: [] };
    }
    const handleEnd2 = (rule: RULE) => {
        if (rule.start1 === 'IF') {
            if (rule.end1 === 'THEN') {
                const options: Option[] = END2.SHOW_HIDE || [];
                return { isShow: true, options };
            }
        } else if (rule.start1 === 'MAP') {
            if (rule.end1 === 'WHERE') {
                const options: Option[] = mastersLists || [];
                return { isShow: true, options };
            }
        }
        return { isShow: false, options: [] };
    }
    const handleEnd3 = (rule: RULE) => {
        if (['IF', 'MAP'].includes(rule.start1)) {
            if (['THEN', 'WHERE'].includes(rule.end1)) {
                if (rule.end2) {
                    const options: Option[] = form.blocks
                        .filter(block => block.property.id !== rule.start2) // Filter blocks based on the condition
                        .map(block => ({
                            label: `${block.property.label} (${block.property.id})`,
                            value: block.property.id,
                        }));

                    return { isShow: true, options };
                }
            }
        }
        return { isShow: false, options: [] };
    }


    const fetchColumnNames = async (id: string) => {
        if (!columnLists[id]) {
            const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetColumnList`, { params: { id } });
            console.log(response)
            setColumnLists(prev => ({ ...prev, [id]: response.data.columnFormLists }));
        }
    };

    useEffect(() => {
        setRules(form.rules || []);
        axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetMasterList`).then(response => {
            setMasterLists(response.data.masterForms);
        });
    }, [form.rules]);

    return (
        <Modal show={showRule} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="col-6">Conditions Form</Modal.Title>
                <div className="col-5 d-flex justify-content-end">
                    <button onClick={() => handleRule('add')} className="border">
                        <i className="ri-add-fill"></i> Add Rule
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="mt-4">
                    {rules.map((rule, index) => (
                        <div key={index} className="mb-2 d-flex align-items-center justify-content-center text-center">
                            <div className="col-11 d-flex">
                                {/* START1 */}
                                <Form.Group controlId={`rule-${index}-start1`} className="mr-1">
                                    <Form.Select
                                        name="start1"
                                        value={rule.start1}
                                        onChange={(e) => handleRuleChange(e, index, 'start1')}
                                    >
                                        <option value="">Please select</option>
                                        {START1.map((option, optionIndex) => (
                                            <option key={optionIndex} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {/* START2 */}
                                {handleStart2(rule).isShow && (
                                    <Form.Group controlId={`rule-${index}-start2`} className="mr-1">
                                        <Form.Select
                                            name="start2"
                                            value={rule.start2}
                                            onChange={(e) => handleRuleChange(e, index, 'start2')}
                                        >
                                            <option value="">Please select</option>
                                            {handleStart2(rule).options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {/* START3 */}
                                {handleStart3(rule).isShow && (
                                    <Form.Group controlId={`rule-${index}-start3`} className="mr-1">
                                        <Form.Select
                                            name="start3"
                                            value={rule.start3}
                                            onChange={(e) => {
                                                handleRuleChange(e, index, 'start3');
                                                fetchColumnNames(e.target.value);
                                            }}
                                        >
                                            <option value="">Please select</option>
                                            {handleStart3(rule).options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {/* START4 */}
                                {columnLists[rule.start3] && (
                                    <Form.Group controlId={`rule-${index}-start4`} className="mr-1">
                                        <Form.Select
                                            name="start4"
                                            value={rule.start4}
                                            onChange={(e) => handleRuleChange(e, index, 'start4')}
                                        >
                                            <option value="">Please select</option>
                                            {columnLists[rule.start3].map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                {/* END1 */}
                                {handleEnd1(rule).isShow && (
                                    <Form.Group controlId={`rule - ${index}- end1`} className="mr-1">
                                        <Form.Select
                                            name="end1"
                                            value={rule.end1}
                                            onChange={(e) => handleRuleChange(e, index, 'end1')}
                                        >
                                            <option value="">Please select</option>
                                            {handleEnd1(rule).options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                {/* END2 */}
                                {handleEnd2(rule).isShow && (
                                    <Form.Group controlId={`rule - ${index}- end2`} className="mr-1">
                                        <Form.Select
                                            name="end2"
                                            value={rule.end2}
                                            onChange={(e) => handleRuleChange(e, index, 'end2')}
                                        >
                                            <option value="">Please select</option>
                                            {handleEnd2(rule).options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                {/* END3 */}
                                {handleEnd3(rule).isShow && (
                                    <Form.Group controlId={`rule - ${index}- end3`} className="mr-1">
                                        <Form.Select
                                            name="end3"
                                            value={rule.end3}
                                            onChange={(e) => handleRuleChange(e, index, 'end3')}
                                        >
                                            <option value="">Please select</option>
                                            {handleEnd3(rule).options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
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

export default Rule;
