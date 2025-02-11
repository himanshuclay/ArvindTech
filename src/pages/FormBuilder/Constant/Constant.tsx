const FIELD_LIST = [
    {
        id: "",
        name: "Text Input",
        is: "TextInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '',
                color: '',
            },
            isShow: true,
        }
    },
    {
        id: "",
        name: "Number Input",
        is: "NumberInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '',
                color: '',

            }
        }
    },
    {
        id: "",
        name: "Email",
        is: "EmailInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '',
                color: '',

            }
        }
    },
    {
        id: "",
        name: "Phone Number",
        is: "PhoneInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '',
                color: '',

            }
        }
    },
    {
        id: "",
        name: "Password",
        is: "Password",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '',
                color: '',

            }
        }
    },
    {
        id: "",
        name: "Select",
        is: "Select",
        property: {
            label: "Select",
            placeholder: "placeholder",
            required: "false",
            options: [],
            advance: {
                backgroundColor: '',
                color: '',

            }
        }
    }
]

const START1 = [
    { label: "If", value: 'IF' },
    { label: "Bind", value: 'BIND' },
]

const END1 = [
    { label: "Then", value: "THEN" },
]

// List of tables with labels and values
const TABLE_NAME = [
    { label: 'Table Tender Master', value: "tbl_tendermaster" }
];

// Map table names to their corresponding fields
const TABLE_FIELD: { [key: string]: { label: string, value: string }[] } = {
    'tbl_tendermaster': [{ label: 'Tender ID', value: 'TenderID' }]
};

const SHOW_HIDE = [
    {label: 'Show', value: 'SHOW'},
    {label: 'Hide', value: 'HIDE'},
]



export {
    FIELD_LIST,
    START1,
    TABLE_NAME,
    TABLE_FIELD,
    END1,
    SHOW_HIDE,
}