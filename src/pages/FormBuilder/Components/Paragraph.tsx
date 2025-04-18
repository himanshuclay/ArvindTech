import React from 'react';
import { Form } from 'react-bootstrap';
import { BASIC_FIELD } from '../Constant/Interface';

interface Props {
    block: BASIC_FIELD;
    editMode?: boolean;
}

const Paragraph: React.FC<Props> = ({
    block,
    editMode
}) => {
    return (
        <div>
            {(block.property.isShow || editMode) && (
                <Form.Group controlId={block.property.id} className="mb-3">
                    <Form.Label>
                        {block.property.label}
                    </Form.Label>
                    <p className="form-control-plaintext">
                        {block.property.placeholder || "—"}
                    </p>
                </Form.Group>
            )}
        </div>
    );
};

export default Paragraph;
