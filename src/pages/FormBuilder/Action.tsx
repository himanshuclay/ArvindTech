import React from 'react';
import { FIELD, PROPERTY } from './Constant/Interface';
import { Button, Form } from 'react-bootstrap';


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
    }
}

const Action: React.FC<Props> = ({ actionProps }) => {
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
            options: [{ label: '', value: '' }],
            advance: {
                backgroundColor: '',
                color: ''
            },
            isShow: false,
            disabled: false,
        });
        // setProperty({ label: '', id: ''})
    }
    const handleRule = () => {
        actionProps.setShowRule(!actionProps.showRule);
    }
    const handleResetForm = () => {
        actionProps.setForm({
            name: '',
            blocks: [],
            blockCount: 0,
            editMode: true,
            rules: [],
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
                </div>

                {/* <Button onClick={actionProps.handleSaveForm}>Save</Button> */}
                {actionProps.showWorkflowBuilder ? '' : <Button onClick={actionProps.handleAdhocSaveForm}>Adhoc Save</Button>}
            </div>

        </div>
    );
};

export default Action;
