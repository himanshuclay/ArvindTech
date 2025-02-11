interface FIELD {
    name: string;  // Name of the form
    is: string;    // Type of the form (e.g., "form", "survey", etc.)
    blocks: BasicField[];  // Array of blocks in the form
    editMode: boolean;  // Flag to indicate if the form is in edit mode
    rules: RULE[];  // Array of rules applied to the form
    advance: ADVANCE;  // Advanced settings like background color
}

interface BASIC_FIELD {
    id: string;  // Unique ID for each block
    name: string;  // Name of the block (e.g., "Block_1")
    property: PROPERTY;
}

interface RULE {
    start1: string;  // Condition start1
    start2: string;  // Condition start2
    start3: string;  // Condition start3
    start4: string;  // Condition start4
}

interface ADVANCE {
    backgroundColor: string;  // Background color for the block
}

interface PROPERTY {
    label: string;
    id: string;
    placeholder: string;
    value: string;
    required: string;  
    options: [{
        label: string;
        value: string;
    }];
}
interface BLOCK_VALUE {
    [key: string]: string;  // Key is dynamic, and value is a string
}
// Exporting FIELD interface for use in other files
export type { FIELD, PROPERTY, BASIC_FIELD, RULE, BLOCK_VALUE };

