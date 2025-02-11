import React from 'react';

interface FIELD {
    name: string,
    is: string,
    blocks: never[],
    editMode: boolean,
    advance: ADVANCE;

}

interface PROPERTY {
    label: string;
    id: string;
    placeholder: string;
    required: boolean;
}

interface Props {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
    property: PROPERTY;
    setProperty: React.Dispatch<React.SetStateAction<PROPERTY>>;
    showRule: string;
    setShowRule: (id: boolean) => void;
}

const Action: React.FC<Props> = ({ form, setForm, property, setProperty, showRule, setShowRule }) => {
    const handleEditMode = () => {
        setForm((prevForm) => ({
            ...prevForm,
            editMode: !form.editMode,
        }))
        setProperty({ label: '', id: '', placeholder: '', required: false });
        // setProperty({ label: '', id: ''})
    }
    const handleRule = () => {
        setShowRule(!showRule);
    }
    return (
        <div className='bg-white p-1 m-1 d-flex justify-content-end'>
            {form.editMode
                ?
                <a data-tooltip-id="tooltip" data-tooltip-content="Preview Form">
                    <i className="ri-eye-fill cursor-pointer p-1" onClick={handleEditMode}></i>
                </a>
                :
                <a data-tooltip-id="tooltip" data-tooltip-content="Edit Form">
                    <i className="ri-pencil-fill cursor-pointer p-1" onClick={handleEditMode}></i>
                </a>
            }
            <a data-tooltip-id="tooltip" data-tooltip-content="Rules">
                <i className="ri-align-justify cursor-pointer p-1" onClick={handleRule}></i>
            </a>
        </div>
    );
};

export default Action;
