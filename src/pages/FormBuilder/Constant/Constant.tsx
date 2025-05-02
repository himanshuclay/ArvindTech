import Select from "react-select";
import { Form } from 'react-bootstrap';

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
            size: '12',
            value: '',
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
            dateValue: '',
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
            maxSelections: '',
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
            groupName: '',
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

// const BLOCK_DROP_DOWN = ['Select', 'NumberInput']


// const CONFIGURE_SELECTION_LOGIC = {
//     Select: `<Select
//                 name="start2"
//                 isMulti
//                 value={rule.start2.map((value) => ({
//                     label: handleStart2(rule).options.find(option => option.value === value)?.label || '',
//                     value
//                 }))}
//                 options={handleStart2(rule).options}
//                 onChange={(selectedOptions) => {
//                     const selectedValues = selectedOptions.map((option: Option) => option.value);
//                     handleRuleChange( 'start2', selectedValues , index);
//                     selectedValues.forEach(value => fetchColumnNames(value));
//                 }}
//                 placeholder="Please select"
//             />`,
//     NumberInput: `ddd`,
//     TextInput: `'''`,
//     EmailInput: '',
//     PhoneInput: '',
//     Password: '',
//     DateInput: '',
//     FileUpload: '',
//     DateRange: '',
//     MultiSelectDropdown: '',
//     AmountInput: '',
//     FloatInput: '',
//     Paragraph: '',
//     CheckboxInput: '',
// }

const CONFIGURE_SELECTION_LOGIC: {
    [key: string]: (
        rule: any,
        index: number,
        handleRuleChange: (...args: any[]) => void,
        handleStart2: (...args: any[]) => { isShow: boolean; options: any[] },
        fetchColumnNames: (...args: any[]) => void
    ) => React.ReactNode;
} = {
    '': () => null,
    TextInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) => (
        <Form.Control
            type="text"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    NumberInput: () => null,
    EmailInput: () => null,
    PhoneInput: () => null,
    Password: () => null,
    DateInput: () => null,
    FileUpload: () => null,
    DateRange: () => null,
    MultiSelectDropdown: () => null,
    AmountInput: () => null,
    FloatInput: () => null,
    Paragraph: () => null,
    CheckboxInput: () => null,
    Select: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[], index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) => (
        <Select
            name="start2"
            isMulti
            value={rule.start2.map((value: any) => ({
                label:
                    handleStart2(rule).options.find((option: any) => option.value === value)?.label || '',
                value,
            }))}
            options={handleStart2(rule).options}
            onChange={(selectedOptions: any) => {
                const selectedValues = selectedOptions.map((option: any) => option.value);
                handleRuleChange('start2', selectedValues, index);
                selectedValues.forEach((value: any) => fetchColumnNames(value));
            }}
            placeholder="Please select"
        />
    ),
};


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
    OPTIONS_SUNDAY_LOGIC,
    CONFIGURE_SELECTION_LOGIC
}