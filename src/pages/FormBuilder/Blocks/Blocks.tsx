import React from 'react';
import Fields from './Fields';

interface FIELD {
    name: string,
    is: string,
    blocks: never[],
    editMode: boolean,
    
}

interface BlocksProps {
  form: FIELD;
  setForm: React.Dispatch<React.SetStateAction<FIELD>>;
}

const Blocks: React.FC<BlocksProps> = ({ form, setForm }) => {
  return (
    <div>
      <Fields form={form} setForm={setForm} />
    </div>
  );
};

export default Blocks;
