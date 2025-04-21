const FIELD_LIST = [
    {
        name: "Text Input",
        is: "TextInput",
        property: {
            type: "TextInput",
            label: "Label",
            placeholder: "placeholder",
            validation: "",
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
        name: "Paragraph",
        is: "Paragraph",
        property: {
            type: "Paragraph",
            label: "Paragraph Label",
            placeholder: "This is a read-only paragraph meant for displaying static information.",
            validation: "",
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
            type: "NumberInput",
            label: "Label",
            placeholder: "placeholder",
            validation: "",
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
        name: "AmountInput",
        is: "AmountInput",
        property: {
            type: "AmountInput",
            label: "AmountInput",
            placeholder: "placeholder",
            validation: "",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            currencySymbol: '₹',

        }
    },
    {
        name: "FloatInput",
        is: "FloatInput",
        property: {
            type: "FloatInput",
            label: "FloatInput",
            placeholder: "placeholder",
            validation: "",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            prefix: '%',
            decimalLimit: 2,
        }
    },
    {
        name: "Email",
        is: "EmailInput",
        property: {
            type: "EmailInput",
            label: "Label",
            placeholder: "placeholder",
            validation: "",
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
            type: "PhoneInput",
            label: "Label",
            placeholder: "placeholder",
            validation: "",
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
            type: "Password",
            label: "Label",
            placeholder: "placeholder",
            validation: "",
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
            type: "DateInput",
            label: "DateInput",
            placeholder: "placeholder",
            validation: "",
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            dateSelection: "none",
            dateFormate: 'Y-m-d',
            mode: 'single',
        }
    },
    {
        name: "Select",
        is: "Select",
        property: {
            type: "Select",
            label: "Select",
            placeholder: "placeholder",
            validation: "",
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
        name: "MultiSelect",
        is: "MultiSelectDropdown",
        property: {
            type: "MultiSelectDropdown",
            label: "MultiSelect",
            placeholder: "placeholder",
            validation: "",
            options: [],

            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            isLooping: false,
            loopBlocks: [],
            blockCount: 0,
        }
    },
    {
        name: "Looper",
        is: "Looper",
        property: {
            type: "Looper",
            label: "Looper",
            placeholder: "placeholder",
            validation: "",
            options: [],

            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            isLooping: "true",
            loopBlocks: [],
            blockCount: 0,
        }
    },
    {
        name: "FileUpload",
        is: "FileUpload",
        property: {
            type: "FileUpload",
            label: "FileUpload",
            placeholder: "placeholder",
            validation: "",

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
        name: "RadioInput",
        is: "RadioInput",
        property: {
            type: "RadioInput",
            label: "Radio",
            placeholder: "placeholder",
            validation: "",
            groupInput: '',
            value: '',
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
        name: "CheckboxInput",
        is: "CheckboxInput",
        property: {
            type: "CheckboxInput",
            label: "Checkbox",
            placeholder: "placeholder",
            validation: "",
            value: '',
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
    STATUS: [{ label: "Status", value: 'STATUS' }],
    ON_GOING: [{ label: "On Going", value: 'Ongoing' }],
}
const START3 = [
    { label: 'state', value: 'STATE' }
]

const EXPIRY_LOGIC = [
    { label: 'Expire On Defined Time', value: 'expireOnDefinedTime' },
    { label: 'Expire On Next Task Initiation', value: 'expireOnNextTaskInitiation' },
]

const OPTIONS_SUNDAY_LOGIC = [
    {
        value: 'Increase Planned day by 1 Day ',
        label: 'Increase Planned day by 1 Day ',
    },
    {
        value: 'Keep making task as per logic ',
        label: 'Keep making task as per logic ',
    },
    { value: 'Skip Creating task', label: 'Skip Creating task' },
]



export {
    FIELD_LIST,
    START1,
    TABLE_NAME,
    TABLE_FIELD,
    END1,
    SHOW_HIDE,
    END2,
    START3,
    EXPIRY_LOGIC,
    OPTIONS_SUNDAY_LOGIC
}