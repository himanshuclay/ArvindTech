import React, { useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import { BASIC_FIELD, BLOCK_VALUE, TableHeader } from '../Constant/Interface';
import { TABLE_APIS, TABLE_INPUT_HEADERS } from '../Constant/Constant';
import axios from 'axios';

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
    const [rows, setRows] = React.useState<BLOCK_VALUE[]>([]);

    // const handleInputChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    //     key: string
    // ) => {
    //     const { value } = e.target;

    //     setBlockValue((prevState) => ({
    //         ...prevState,
    //         [key]: value,
    //     }));

    //     handleChange(e as React.ChangeEvent<HTMLInputElement>, key); // force-cast if needed
    // };

    const calculateValue = (
        calculation: TableHeader['calculation'],
        row: BLOCK_VALUE
    ): string => {
        if (!calculation) return '';

        const addTotal = (calculation.add || []).reduce((total, key) => {
            const rawValue = row[key];
            const val = parseFloat(Array.isArray(rawValue) ? rawValue.join('') : rawValue || '0');
            return total + (isNaN(val) ? 0 : val);
        }, 0);

        const subtractTotal = (calculation.subtract || []).reduce((total, key) => {
            const rawValue = row[key];
            const val = parseFloat(Array.isArray(rawValue) ? rawValue.join('') : rawValue || '0');
            return total + (isNaN(val) ? 0 : val);
        }, 0);

        return (addTotal - subtractTotal).toFixed(2);
    };


    const fetch = async (tableName: string, projectId: string) => {
        const [apiUrl, dataKey] = TABLE_APIS(projectId)[tableName];
        const response = await axios.get(apiUrl);
        if (response.data.isSuccess) {
            setRows(response.data[dataKey]);
        }
    };



    useEffect(() => {
        if (editMode) {
            const existing = blockValue[block.property.id];

            if (typeof existing === 'string') {
              try {
                const parsed = JSON.parse(existing);
                if (Array.isArray(parsed)) {
                  setRows(parsed);
                  return;
                }
              } catch (err) {
                console.warn('Invalid JSON in blockValue:', err);
              }
            }
            
      
          // fallback to fetch
          fetch(tableName, '');
        }
      }, [editMode]);
      

    const handleRowInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        rowIndex: number,
        key: string
      ) => {
        const { value } = e.target;
      
        // Step 1: update rows
        setRows(prev => {
          const updated = prev.map((row, i) =>
            i === rowIndex ? { ...row, [key]: value } : row
          );
      
          // Step 2: update blockValue with JSON string
          setBlockValue(prev => ({
            ...prev,
            [block.property.id]: JSON.stringify(updated)
          }));
      
          // Step 3: (optional) call handleChange for tracking
          handleChange(e as React.ChangeEvent<HTMLInputElement>, key);
      
          return updated;
        });
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
                {(block.property.isShow || block.property.isPermanent || editMode) &&
                    rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header) => (
                                <td key={header.key}>
                                    {/* {header.disable || header.calculation ? (
                                        <div className="pt-2">
                                            {header.calculation
                                                ? calculateValue(header.calculation, row)
                                                : row[header.key] || ''}
                                        </div>
                                    ) : (
                                        <Form.Group controlId={`${header.key}-${rowIndex}`} className="mb-0">
                                            <Form.Control
                                                type="text"
                                                name={header.key}
                                                value={row[header.key] || ''}
                                                onChange={(e) =>
                                                    handleRowInputChange(e, rowIndex, header.key)
                                                }
                                                placeholder={header.displayName}
                                                disabled={isDisabled}
                                                className={
                                                    validationErrors[header.key] ? 'is-invalid' : ''
                                                }
                                            />
                                            {validationErrors[header.key] && (
                                                <Form.Text className="text-danger">
                                                    {validationErrors[header.key]}
                                                </Form.Text>
                                            )}
                                        </Form.Group>
                                    )} */}
                                    {header.autoFill ? (
                                        <div className="pt-2">
                                            {/* {JSON.stringify(row)} */}
                                            {/* {JSON.stringify(header.autoFill)} */}
                                            {row[header.autoFill] || ''}
                                        </div>
                                    ) : header.disable || header.calculation ? (
                                        <div className="pt-2">
                                            {header.calculation
                                                ? calculateValue(header.calculation, row)
                                                : row[header.key] || ''}
                                        </div>
                                    ) : (
                                        <Form.Group controlId={`${header.key}-${rowIndex}`} className="mb-0">
                                            <Form.Control
                                                type="text"
                                                name={header.key}
                                                value={row[header.key] || ''}
                                                onChange={(e) => handleRowInputChange(e, rowIndex, header.key)}
                                                placeholder={header.displayName}
                                                disabled={isDisabled}
                                                className={validationErrors[header.key] ? 'is-invalid' : ''}
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
                    ))}
            </tbody>

        </Table>
    );
};

export default TableInput;
