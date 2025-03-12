const FIELD_LIST = [
    {
        name: "Text Input",
        is: "TextInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',
            },
            isShow: true,
            disabled: false,
            size: '12'
        }
    },
    {
        name: "Number Input",
        is: "NumberInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12'


        }
    },
    {
        name: "Email",
        is: "EmailInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12'

        }
    },
    {
        name: "Phone Number",
        is: "PhoneInput",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12'

        }
    },
    {
        name: "Password",
        is: "Password",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12'

        }
    },
    {
        name: "DateInput",
        is: "DateInput",
        property: {
            label: "DateInput",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            dateSelection: "none",

        }
    },
    {
        name: "DateRange",
        is: "DateRange",
        property: {
            label: "Label",
            placeholder: "placeholder",
            required: "false",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            startDateId: "",
            endDateId: "",
            size: '12'

        }
    },
    {
        name: "Select",
        is: "Select",
        property: {
            label: "Select",
            placeholder: "placeholder",
            required: "false",
            options: [],

            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12'

        }
    },
    {
        name: "FileUpload",
        is: "FileUpload",
        property: {
            label: "FileUpload",
            placeholder: "placeholder",
            required: "false",

            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12'

        }
    },
]

const START1 = [
    { label: "If", value: 'IF' },
    { label: "Bind", value: 'BIND' },
    { label: "Map", value: 'MAP' },
]

const END1 = {
    THEN: [
        { label: "Then", value: "THEN" },
    ],
    WHERE: [
        { label: "Where", value: "WHERE" },
    ],
    FILTER: [
        { label: "Filter", value: "FILTER" },
    ]
}


// List of tables with labels and values
const TABLE_NAME = [
    { label: 'Table Tender Master', value: "tbl_tendermaster" },
    { label: 'Table Country Master', value: "tbl_countrymaster" },
];

// Map table names to their corresponding fields
const TABLE_FIELD: { [key: string]: { label: string, value: string }[] } = {
    'tbl_tendermaster': [{ label: 'Tender ID', value: 'TenderID' }],
    'tbl_countrymaster': [{ label: 'Country List', value: 'CountryName' }],
};

const SHOW_HIDE = [
    { label: 'Show', value: 'SHOW' },
    { label: 'Hide', value: 'HIDE' },
]

const END2 = {
    SHOW_HIDE: [{ label: "Show", value: 'SHOW' }, { label: 'Hide', value: 'HIDE' }],
    COUNTRY: [{ label: "Country", value: 'COUNTRY' }],
}
const START3 = [
    { label: 'state', value: 'STATE' }
]



export {
    FIELD_LIST,
    START1,
    TABLE_NAME,
    TABLE_FIELD,
    END1,
    SHOW_HIDE,
    END2,
    START3
}