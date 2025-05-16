import React, { useEffect, useRef, useState } from 'react';
import { FIELD, PROPERTY } from './Constant/Interface';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import { getBlockName } from '../WorkflowBuilder/Constant/function';
import axios from 'axios';
import config from '@/config';


interface Props {
    actionProps: {
        form: FIELD;
        setForm: React.Dispatch<React.SetStateAction<FIELD>>;
        property: PROPERTY;
        setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
        showRule: boolean;
        setShowRule: (id: boolean) => void;
        handleSaveForm: () => void;
        handleAdhocSaveForm: () => void;
        showWorkflowBuilder?: boolean;
        isShowSaveButton?: boolean;
        configureSelectionLogic: boolean,
        setConfigureSelectionLogic: (id: boolean) => void;
    }
}

interface Option {
    label: string;
    value: string;
}

const Action: React.FC<Props> = ({ actionProps }) => {
    const [showBinding, setShowBinding] = useState(false);
    const [blockName, setBlockName] = useState<string[]>([]);
    const [mastersLists, setMasterLists] = useState<Option[]>([]);
    const [columnLists, setColumnLists] = useState<{ [key: string]: Option[] }>({}); // Store column options
    const fetchedMastersRef = useRef<Set<string>>(new Set());

    const handleEditMode = () => {
        actionProps.setForm((prevForm) => ({
            ...prevForm,
            editMode: !actionProps.form.editMode,
        }))
        actionProps.setProperty({
            label: '',
            id: '',
            placeholder: '',
            required: "false",
            value: '',
            type: '',
            options: [{ label: '', value: '' }],
            advance: {
                backgroundColor: '',
                color: ''
            },
            isShow: false,
            disabled: "false",
        });
        // setProperty({ label: '', id: ''})
    }
    const handleRule = () => {
        actionProps.setShowRule(!actionProps.showRule);
    }
    const handleLinks = () => {
        actionProps.setConfigureSelectionLogic(!actionProps.configureSelectionLogic);
    }
    const handleResetForm = () => {
        actionProps.setForm({
            name: '',
            blocks: [],
            blockCount: 0,
            editMode: true,
            rules: [],
            configureSelectionLogics: [],
            advance: {
                backgroundColor: '',
                color: '',
            }
        })
    }
    const handleResponsive = (size: number) => {

    }
    const handleFormName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        actionProps.setForm((prevForm) => ({
            ...prevForm,
            name: newName
        }));
    };
    const setShowMasterBinding = () => {
        setShowBinding(true);
    }

    useEffect(() => {
        const blockNames = getBlockName(actionProps.form.blocks);
        setBlockName(blockNames);
        axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetMasterList`).then(response => {
            setMasterLists(response.data.masterForms);
        });
    }, [showBinding])

    const fetchColumnNames = async (masterName: string) => {
        if (!fetchedMastersRef.current.has(masterName)) {
            try {
                const response = await axios.get(`${config.API_URL_APPLICATION}/FormBuilder/GetColumnList`, { params: { id: masterName } });
                setColumnLists((prev) => ({ ...prev, [masterName]: response.data.columnFormLists }));
                fetchedMastersRef.current.add(masterName); // Mark this master as fetched
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        }
    };

    // const addNewBlock = (block: any) => {
    //     // Add new block logic
    //     actionProps.setForm((prev) => ({
    //         ...prev,
    //         bindingValues: {
    //             ...prev.bindingValues,
    //             [block]: {
    //                 master: '',
    //                 column: '',
    //             },
    //         },
    //     }));
    //     setBlockName((prev) => [...prev, block]);
    // };

    const addNewBlock = (block: any, index: number) => {
        // Add new block logic
         actionProps.setForm((prev) => ({
            ...prev,
            bindingValues: {
                ...prev.bindingValues,
                [index + '-' + block]: {
                    master: '',
                    column: '',
                },
            },
        }));
        setBlockName((prev) => [...prev, block]);
    };

    const removeBlock = (index: any) => {
        // Remove block logic
        const updatedBlockNames = blockName.filter((_, idx) => idx !== index);
        actionProps.setForm((prev) => {
            const updatedBindingValues = { ...prev.bindingValues };
            delete updatedBindingValues[blockName[index]];
            return {
                ...prev,
                bindingValues: updatedBindingValues,
            };
        });
        setBlockName(updatedBlockNames);
    };

    return (

        <div className='bg-white  my-2 p-2 d-flex justify-content-between align-items-center rounded'>
            <div>
                <Form.Control
                    type="text"
                    className='border-bottom border-0 ' placeholder='Form Name' style={{ width: '400px' }}
                    value={actionProps.form.name}
                    onChange={handleFormName}
                />
            </div>
            <div className='d-flex gap-2 align-items-center '>

                <div className='border rounded-2 px-1 cursor-pointer p-1'>
                    <a data-tooltip-id="tooltip" data-tooltip-content="Reset Form">
                        <i className="ri-smartphone-line fs-18 mr-1" onClick={() => handleResponsive(12)}></i>
                    </a>
                    <a data-tooltip-id="tooltip" data-tooltip-content="Preview Form">
                        <i className="ri-tablet-line cursor-pointer p-1 fs-18" onClick={() => handleResponsive(6)}></i>
                    </a>
                    <a data-tooltip-id="tooltip" data-tooltip-content="Rules">
                        <i className="ri-macbook-line cursor-pointer p-1 fs-18" onClick={() => handleResponsive(3)}></i>
                    </a>
                </div>
                <div className='border rounded-2 px-1 cursor-pointer p-1'>
                    {actionProps.showWorkflowBuilder ? '' : <a data-tooltip-id="tooltip" data-tooltip-content="Reset Form">
                        <i className="ri-git-merge-line fs-18 mr-1" onClick={setShowMasterBinding}></i>
                    </a>}
                    <a data-tooltip-id="tooltip" data-tooltip-content="Reset Form">
                        <i className="ri-loop-left-line fs-18 mr-1" onClick={handleResetForm}></i>
                    </a>
                    {actionProps.form.editMode
                        ?
                        <a data-tooltip-id="tooltip" data-tooltip-content="Preview Form">
                            <i className="ri-eye-fill cursor-pointer p-1 fs-18" onClick={handleEditMode}></i>
                        </a>
                        :
                        <a data-tooltip-id="tooltip" data-tooltip-content="Edit Form">
                            <i className="ri-pencil-fill cursor-pointer p-1 fs-18" onClick={handleEditMode}></i>
                        </a>
                    }
                    <a data-tooltip-id="tooltip" data-tooltip-content="Rules">
                        <i className="ri-menu-line cursor-pointer p-1 fs-18" onClick={handleRule}></i>
                    </a>
                    <a data-tooltip-id="tooltip" data-tooltip-content="Links">
                        <i className="ri-links-fill cursor-pointer p-1 fs-18" onClick={handleLinks}></i>
                    </a>
                </div>

                {actionProps.isShowSaveButton && (<Button onClick={actionProps.handleSaveForm}>Save</Button>)}
                {actionProps.showWorkflowBuilder ? '' : <Button onClick={actionProps.handleAdhocSaveForm}>Adhoc Save</Button>}
            </div>


            {/* Binding Modal */}
            <Modal show={showBinding} backdrop="static" size="xl">
                <div onClick={(e) => e.stopPropagation()}>
                    <Modal.Header>
                        <Modal.Title>Binding Forms to Masters</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {blockName?.map((block, index) => {
                            const currentBindingValue = actionProps.form.bindingValues?.[index+'-'+block];
                            const masterName = currentBindingValue?.master;
                            const columnName = currentBindingValue?.column;

                            return (
                                <div key={index} style={{ marginBottom: '1rem' }}>
                                    <Row>
                                        <Col lg="10" md="10">
                                            {/* Block Name Display */}
                                            <Form.Control
                                                type="text"
                                                value={block}
                                                readOnly
                                                style={{
                                                    marginBottom: '0.5rem',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                            />
                                            <Select
                                                options={mastersLists}
                                                value={mastersLists.find((option) => option.value === masterName) || null}
                                                onChange={(selectedOption) => {
                                                    const newMasterName = selectedOption?.value || '';
                                                    actionProps.setForm((prev) => ({
                                                        ...prev,
                                                        bindingValues: {
                                                            ...prev.bindingValues,
                                                            [index+'-'+block]: {
                                                                master: newMasterName,
                                                                column: columnName || '',
                                                            },
                                                        },
                                                    }));

                                                    fetchColumnNames(newMasterName);
                                                }}
                                                placeholder={`Select a Master for ${block}`}
                                                isClearable
                                            />
                                            {masterName && columnLists[masterName] && (
                                                <Select
                                                    options={columnLists[masterName] || []}
                                                    value={columnLists[masterName]?.find((option) => option.value === columnName)}
                                                    onChange={(selectedOption) => {
                                                        const newColumnName = selectedOption?.value || '';

                                                        // Update the column value in bindingValues
                                                        actionProps.setForm((prev) => ({
                                                            ...prev,
                                                            bindingValues: {
                                                                ...prev.bindingValues,
                                                                [index+'-'+block]: {
                                                                    column: newColumnName,
                                                                    master: masterName || '',
                                                                },
                                                            },
                                                        }));
                                                    }}
                                                    placeholder={`Select a Column for ${block}`}
                                                    isClearable
                                                />
                                            )}
                                        </Col>
                                        <Col className="d-flex align-items-center">
                                            <div className="action-btn bg-primary cursor-pointer" onClick={() => addNewBlock(block, index)}>
                                                <i className="ri-add-fill text-white fs-4"></i>
                                            </div>
                                            {index > 0 && (
                                                <div className="action-btn bg-secondary ms-2 cursor-pointer" onClick={() => removeBlock(index)}>
                                                    <i className="ri-close-large-line text-white"></i>
                                                </div>
                                            )}
                                        </Col>

                                    </Row>
                                </div>
                            );
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="close-button" onClick={() => setShowBinding(false)}>
                            Close
                        </button>
                        {/* <button className="save-button" onClick={handleSaveDoer}>
                            Save
                        </button> */}
                    </Modal.Footer>
                </div>
            </Modal>

        </div>
    );
};

export default Action;
