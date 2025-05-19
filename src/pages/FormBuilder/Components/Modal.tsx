import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE } from '../Constant/Interface';
import Adhoc from '@/pages/other/AdminSide/Adhoc';

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}


const Modal: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {
    const isRequired = block.property.validation === 'required';

    // Only allow numbers with optional 2 decimal places
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setBlockValue((prevState) => ({
            ...prevState,
            [block.property.id]: value,
        }));

        handleChange(e, block.property.id);
    };

    return (
        <div>
            {block.property.modalConfiguration === 'Adhoc_Inititition' ?
                <Adhoc />
                : 'please select property first'}
        </div>
    );
};

export default Modal;
