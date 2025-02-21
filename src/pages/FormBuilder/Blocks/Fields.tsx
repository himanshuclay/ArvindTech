import React from 'react';
import { FIELD_LIST } from '../Constant/Constant';
import { FIELD } from '../Constant/Interface';



interface FieldProps {
    form: FIELD;
    setForm: React.Dispatch<React.SetStateAction<FIELD>>;
}

interface BasicField {
    id?: string,
    name: string;
    is: string;
    property: object;
}

const Fields: React.FC<FieldProps> = ({ form, setForm }) => {
    const FieldsList: BasicField[] = FIELD_LIST;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, field: BasicField) => {
        e.dataTransfer.setData('application/json', JSON.stringify(field));
        console.log('Dragging:', field);
    };

    return (
        <div className='bg-white p-2 rounded'>
            {FieldsList.map((field) => (
                <div className='p-1 border m-1 rounded cursor-pointer' key={field.is} draggable={true} onDragStart={(e) => handleDragStart(e, field)}>
                    {field.name}
                </div>
            ))}
        </div>
    );
};

export default Fields;
