import React from 'react';
import { Table, Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE, TableHeader } from '../Constant/Interface';
import { TABLE_INPUT_HEADERS } from '../Constant/Constant';

interface Props {
    block: BASIC_FIELD;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    validationErrors?: { [key: string]: string };
    editMode?: boolean;
    blockValue: BLOCK_VALUE;
    setBlockValue: React.Dispatch<React.SetStateAction<BLOCK_VALUE>>;
}

const TableInput: React.FC<Props> = ({
    block,
    handleChange,
    validationErrors = {},
    editMode,
    blockValue,
    setBlockValue
}) => {

    const isDisabled = block.property.disabled === 'true';
    const tableName = block.property.tableConfiguration || '';

    const headers = TABLE_INPUT_HEADERS[tableName] || TABLE_INPUT_HEADERS[''];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: string
    ) => {
        const { value } = e.target;

        setBlockValue((prevState) => ({
            ...prevState,
            [key]: value,
        }));

        handleChange(e as React.ChangeEvent<HTMLInputElement>, key); // force-cast if needed
    };

    const calculateValue = (calculation: TableHeader["calculation"]): string => {
        if (!calculation) return '';
      
        const addTotal = (calculation.add || []).reduce((total, key) => {
          const rawValue = blockValue[key];
          const val = parseFloat(Array.isArray(rawValue) ? rawValue.join('') : rawValue || '0');
          return total + (isNaN(val) ? 0 : val);
        }, 0);
      
        const subtractTotal = (calculation.subtract || []).reduce((total, key) => {
          const rawValue = blockValue[key];
          const val = parseFloat(Array.isArray(rawValue) ? rawValue.join('') : rawValue || '0');
          return total + (isNaN(val) ? 0 : val);
        }, 0);
      
        const result = addTotal - subtractTotal;
        return result.toFixed(2);
      };
      
      



    return (
        <Table bordered responsive>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header.key}>{header.displayName}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {(block.property.isShow || block.property.isPermanent || editMode) && (
                    <tr>
                        {headers.map((header) => (
                            <td key={header.key}>
                                {header.disable || header.calculation ? (
                                    <div className="pt-2">
                                        {header.calculation
                                            ? calculateValue(header.calculation)
                                            : blockValue[header.key] || ''}
                                    </div>
                                ) : (
                                    <Form.Group controlId={header.key} className="mb-0">
                                        <Form.Control
                                            type="text"
                                            name={header.key}
                                            value={blockValue[header.key] || ''}
                                            onChange={(e) => handleInputChange(e, header.key)}
                                            placeholder={header.displayName}
                                            disabled={isDisabled}
                                            className={validationErrors[header.key] ? "is-invalid" : ""}
                                        />
                                        {validationErrors[header.key] && (
                                            <Form.Text className="text-danger">
                                                {validationErrors[header.key]}
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                )}
                            </td>


                        ))}
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default TableInput;
