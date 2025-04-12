import React from 'react';
import Fields from './Fields';
import { FIELD } from '../Constant/Interface';



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
