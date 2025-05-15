import Select from "react-select";
import { Form } from 'react-bootstrap';
import { TableHeader } from "./Interface";
import config from "@/config";

const FIELD_LIST = [
    {
        name: "Text Input",
        is: "TextInput",
        property: {
            type: "TextInput",
            label: "TextInput",
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
        name: "Text Area",
        is: "TextArea",
        property: {
            type: "TextArea",
            label: "TextArea label",
            placeholder: "Please fill the data",
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
            label: "NumberInput",
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
            label: "EmailInput",
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
            label: "PhoneInput",
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
            label: "Password",
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
        name: "TimeInput",
        is: "TimeInput",
        property: {
            type: "TimeInput",
            label: "TimeInput",
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
    {
        name: "TableInput",
        is: "TableInput",
        property: {
            type: "TableInput",
            label: "Table",
            placeholder: "placeholder",
            validation: "",
            value: '',
            advance: {
                backgroundColor: '#fff',
                color: '#000',

            },
            isShow: true,
            disabled: false,
            size: '12',
            tableConfiguration: '',

        }
    }
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
    NumberInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) => (
        <Form.Control
            type="number"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    EmailInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="email"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    PhoneInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="phone"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    Password: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="password"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    DateInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="date"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    FileUpload: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="file"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    DateRange: () => null,
    MultiSelectDropdown: () => null,
    AmountInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="number"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
    FloatInput: (
        rule: any,
        index: number,
        handleRuleChange: (name: string, value: string[] | string, index: number) => void,
        handleStart2: (rule: any) => { isShow: boolean; options: any[] },
        fetchColumnNames: (id: string) => void
    ) =>
    (
        <Form.Control
            type="number"
            name="start2"
            value={rule.start2}
            onChange={(e) => handleRuleChange('start2', e.target.value, index)}
            placeholder="Please Enter"
        />
    ),
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




export const TABLE_APIS = (projectId: string): Record<string, [string, string]> => ({
    Rolling_Program_Material: [
        `${config.API_URL_APPLICATION1}/MaterialMaster/GetMaterial`,
        'materialMasters'
    ]
});



export const TABLE_INPUT_HEADERS: { [key: string]: TableHeader[] } = {
    Rolling_Program_Material: [
        { key: "MaterialGroup", displayName: "Material Group", autoFill: 'materialGroupName' },
        { key: "MaterialName", displayName: "Material Name", autoFill: 'materialName' },
        { key: "Specification", displayName: "Specification" },
        { key: "AnyOtherSpectification", displayName: "Any Other Spectification" },
        { key: "Unit", displayName: "Unit", autoFill: 'unit' },
        { key: "CoreCategory", displayName: "Core Category", autoFill: 'coreCategory' },
        { key: "TotalProjectRequirement", displayName: "Total Project Requirement" },
        { key: "TotalTransferMaterialofpreviousmonth", displayName: "Total Transfer Material of previous month" },
        { key: "TotalMatreialReceivedason", displayName: "Total Matreial Received as on" },
        { key: "ClosingBalanceERPason", displayName: "Closing Balance (ERP)as on" },
        { key: "IMSQty(Physical)ason", displayName: "IMS Qty (Physical) as on", autoFill: '' },
        { key: "ClosingQty(Physical)ason", displayName: "Closing Qty (Physical) as on" },
        { key: "SteelWorkinProgressCutBentason", displayName: "Steel Work in Progress (Cut & Bent) as on" },
        { key: "SteelProjectedoutfromconcretebutnotmeasuredason", displayName: "Steel Projected out from concrete but not measured as on" },
        { key: "ConsumptionDuring1", displayName: "Consumption During" },
        { key: "ConsumptionDuring2", displayName: "Consumption During" },
        { key: "ConsumptionDuring3", displayName: "Consumption During" },
        {
            key: "RequirementasperPlanningAfterAddingScrap/wastage/ClosingBalanceDuring(AutoCalculateField)",
            displayName: "Requirement as per Planning After Adding Scrap/ wastage/ Closing Balance During (Auto Calculate Field)",
            calculation: {
                operation: "sum-subtract",
                add: ["ConsumptionDuring1", "ConsumptionDuring2", "ConsumptionDuring3", "SteelWorkinProgressCutBentason", "SteelProjectedoutfromconcretebutnotmeasuredason"],
                subtract: ["ClosingBalanceERPason"]
            }
        },
        { key: "RequirementofStockAsperNew3_Month_Policy", displayName: "Requirement of Stock As per New 3_Month_Policy" },
        { key: "InProcessPRQty", displayName: "In Process PR Qty" },
        { key: "InProcessPOQty", displayName: "In Process PO Qty" },
        { key: "InProcessPRQty[Editable]", displayName: "In Process PR Qty[Editable]" },
        { key: "InProcessPOQty[Editable]", displayName: "In Process PO Qty[Editable]" },
        { key: "ProposedRequirement", displayName: "Proposed Requirement" },
    ],
    DemobManpowerTemplate: [
        { key: "Project", displayName: "Project" },
        { key: "Month", displayName: "Month" },
        { key: "PercentageofWorkDone", displayName: "Percentage of Work Done" },
        { key: "UID", displayName: "UID" },
        { key: "EmployeeID", displayName: "Employee ID" },
        { key: "EmployeeName", displayName: "Employee Name" },
        { key: "Designation", displayName: "Designation" },
        { key: "EmployeeMasterStatus", displayName: "Employee Master Status" },
        { key: "DemobTemplateStatus1", displayName: "Demob Template Status" },
        { key: "ReleaseDate1", displayName: "Release Date" },
        { key: "DemobTemplateStatus2", displayName: "Demob Template Status" },
        { key: "ReleaseDate2", displayName: "Release Date" },
        { key: "DemobTemplateStatus3", displayName: "Demob Template Status" },
        { key: "ReleaseDate3", displayName: "Release Date" }
    ],
    DemobMachineryTemplate: [
        { key: "Project", displayName: "Project" },
        { key: "Month", displayName: "Month" },
        { key: "PercentageofWorkDone", displayName: "Percentage of Work Done" },
        { key: "UID", displayName: "UID" },
        { key: "AssetID", displayName: "Asset ID" },
        { key: "AssetCategory", displayName: "Asset Category" },
        { key: "AssetGroup", displayName: "Asset Group" },
        { key: "AssetName", displayName: "Asset Name" },
        { key: "Specification", displayName: "Specification" },
        { key: "AssetMake", displayName: "Asset Make" },
        { key: "CurrentOwnership1", displayName: "Current Ownership" },
        { key: "CurrentOwnership2", displayName: "Current Ownership" },
        { key: "DemobAssetTemplateStatus1", displayName: "Demob Asset Template Status" },
        { key: "ReleaseDate1", displayName: "Release Date" },
        { key: "AssetTrackingMasterStatus1", displayName: "Asset Tracking Master Status" },
        { key: "DemobAssetTemplateStatus2", displayName: "Demob Asset Template Status" },
        { key: "ReleaseDate2", displayName: "Release Date" },
        { key: "AssetTrackingMasterStatus2", displayName: "Asset Tracking Master Status" },
        { key: "DemobAssetTemplateStatus3", displayName: "Demob Asset Template Status" },
        { key: "ReleaseDate3", displayName: "Release Date" }
    ],
    DemobCampTemplate: [
        { key: "Project", displayName: "Project" },
        { key: "Quarter", displayName: "Quarter" },
        { key: "PercentageofWorkDone", displayName: "Percentage of Work Done" },
        { key: "UID", displayName: "UID" },
        { key: "CampID", displayName: "CampID" },
        { key: "CampName", displayName: "Camp Name" },
        { key: "CampStatus", displayName: "Camp Status" },
        { key: "TemplateCampStatus1", displayName: "Template Camp Status" },
        { key: "A_ProposedReductioninCampAreaisApproved1", displayName: "A. Proposed Reduction in Camp Area is Approved" },
        { key: "B_ReductionisExecuted1", displayName: "B. Reduction is Executed" },
        { key: "C_HandoverofCampAreaisDone1", displayName: "C. Handover of Camp Area is Done" },
        { key: "TemplateCampStatus2", displayName: "Template Camp Status" },
        { key: "A_ProposedReductioninCampAreaisApproved2", displayName: "A. Proposed Reduction in Camp Area is Approved" },
        { key: "B_ReductionisExecuted2", displayName: "B. Reduction is Executed" },
        { key: "C_HandoverofCampAreaisDone2", displayName: "C. Handover of Camp Area is Done" },
        { key: "FinalizationCompletedbyManagement", displayName: "Finalization Completed by Management" },
        { key: "NOCReceivedfromLandOwner", displayName: "NOC Received from Land Owner" }
    ],
    '': [
        { key: "label", displayName: "Label" },
        { key: "input", displayName: "Input" },
        { key: "error", displayName: "Error" },
    ]
};

export const APPROVAL = {
    "id": "4",
    "type": "custom",
    "data": {
        "label": "Approval console",
        "handles": 1,
        "form": {
            "name": "Approval console",
            "blocks": [
                {
                    "name": "Select",
                    "is": "Select",
                    "property": {
                        "type": "Select",
                        "label": "Approval",
                        "placeholder": "placeholder",
                        "validation": "",
                        "options": [
                            {
                                "label": "Approve",
                                "value": "Approve"
                            },
                            {
                                "label": "Reject",
                                "value": "Reject"
                            },
                            {
                                "label": "Amidment",
                                "value": "Amidment"
                            }
                        ],
                        "advance": {
                            "backgroundColor": "#fff",
                            "color": "#000"
                        },
                        "isShow": true,
                        "disabled": false,
                        "size": "12",
                        "id": "Block_1"
                    }
                }
            ],
            "editMode": true,
            "blockCount": 1,
            "rules": [],
            "configureSelectionLogics": [
                {
                    "start1": "Block_1",
                    "start2": [
                        "Approve",
                        "Reject",
                        "Amidment"
                    ],
                    "start3": "",
                    "start4": "",
                    "end1": "",
                    "end2": "",
                    "end3": ""
                }
            ],
            "advance": {
                "backgroundColor": "",
                "color": ""
            }
        },
        "taskNumber": "T2",
        "inputHandles": 1,
        "outputHandles": [
            "Approve",
            "Reject",
            "Amidment"
        ],
        "outputLabels": [
            "Block_1.Approve",
            "Block_1.Reject",
            "Block_1.Amidment"
        ],
        "assignDoerType": "fixedDoer",
        "doer": "LLP03299",
        "specificDate": "",
        "taskTimeOptions": "onlyDays",
        "days": "",
        "taskCreationType": "actual",
        "time": "2025-04-29T14:30:00.000Z",
        "role": "",
        "hours": "",
        "weeks": "",
        "doerAssignList": {},
        "bindingValues": {},
        "doerTaskNumber": "",
        "doerBlockName": "",
        "TaskBinding": "",
        "BindingOption": "",
        "loopingSetting": {},
        "problemSolver": "",
        "isExpirable": "",
        "taskOutputlables": "",
        "approvalSelect": "Block_1",
        "approvalOptions": "Amidment",
        "approvalTaskNumber": "3",
        "approvalBindingTask": "formAndValueWithEditMode",
        "isApprovalTask": true
    },
    "position": {
        "x": 278.00570011986804,
        "y": 404.8552508527786
    },
    "width": 200,
    "height": 204,
    "selected": true,
    "positionAbsolute": {
        "x": 278.00570011986804,
        "y": 404.8552508527786
    },
    "dragging": false
}

const INITIATION_DATA: Record<string, string[]> = {
"BD.02":["TenderID", "TenderStatus", "NotificationDate", "TenderLink", "Country", "State", "WorkName", "DeptPrincipleEmployerID", "DeptPrincipleEmployerName", "ContractType", "EstimatedCost", "DocPurchaseDeadline", "InitialBidSubmitDate", "CompletionPeriod", "TenderReferredBy", "ExecutorCompany", "EnteredByEmpID", "EnteredByEmpName", "EntryDate", "HandlingType", "ExecutionModel", "Client_JVName"],
"BD.03":["TenderID", "TenderStatus", "WorkName", "StatusLastUpdatedDate", "DeptPrincipleEmployerName", "ATBid", "L1BidderName", "L1Bid"],
"BD.05":["ContractualWorkValue", "ContractualStartDate", "ContractualCompletionDate"],
"BD.06":["RevisedContractualWorkValue", "ContractualStartDate", "ContractualCompletionDate", "ValueRecorded", "TotalWorkDoneValueuptoPreviousMonth", "PercentageofWorkDone"],
"BTS.02":["ID", "EntryDate", "ProjectName", "VendorNameAndCode", "Item", "BillAgainst", "No", "Date", "Rate", "BillStartMonth", "BillMonth"],
"BTS.03":["ID", "EntryDate", "ProjectName", "VendorNameAndCode", "Item", "BillAgainst", "No", "Date", "Rate", "BillStartMonth", "BillMonth"],
"BTS.04":["ProjectName"],
"BTS.05":["ID", "BTSID", "BillEntryDate", "ProjectName", "Client_JVName", "ReceiptType", "No", "Amount", "Date", "PaymentRequestedFor", "PaymentDueDate"],
"BTS.06":["ID", "BTSID", "ProjectName", "Client_JVName", "VendorName", "FRorIOMNumber", "FRDate", "RetentionHoldAmount"],
"BTS.07":["BTSID", "ProjectName", "VendorNameAndCode", "BillDate", "GSTHoldAmount", "GSTMonth"],
"BTS.08":["ProjectName"],
"BTS.09":["ProjectName"],
"BTS.10":["ProjectName"],
"BTS.11":["BTSID", "BillEntryDate", "ProjectName", "ClientJVName", "ReceiptType", "VendorName", "FRorIOMNumber"],
"PROC.01":["ProjectName","Client_JVName"],
"PROC.02":["ProjectName","Client_JVName"],
"PROC.03":["PONumber", "ProjectName", "VendorName", "Material_MachineryBBEJName", "Specification", "ScheduledQty", "VehicleRequiredByDate"],
"PROC.04":["ReqID", "ProjectName", "StructureID", "StructureType", "TypeofDesign", "PierorSpanorChainageNo", "DrawingBoardCategory", "CompletionDate", "DTNID", "InitiationType"],
"PROC.05":["TypeofAsset", "NameofAsset", "UploadRequisitionSlip", "Requestedby", "RequestDate"],
"PROC.06":["Red", "FlaggedDate", "ProjectName", "Material", "Unit", "MinQty", "CurrentQty", "Status", "IMSType", "MaterialCustodian"],
"PROC.07":["ProjectName"],
"PROC.08":["ProjectName"],
"HR.01":["ProjectName","ID"],
"HR.02":["ID", "EntryDate", "Project", "Department", "CoreDesignation", "SpecializedDesignation", "Source", "Count", "RequestedBy"],
"HR.03":["ID", "EntryDate", "Project", "Department", "CoreDesignation", "SpecializedDesignation", "Source", "Count", "RequestedBy"],
"HR.04":["EmployeeID", "EmployeeName", "Project", "DateOfJoining", "RecordCreationDate", "DLRequired"],
"HR.05":["EmpID", "EmployeeName", "ProjectName", "FitnessValidity"],
"HR.06":["EmpID", "EmployeeName", "CurrentProjectName", "Designation", "DateOfJoining"],
"HR.08":["ProjectName","ID","ProjectType"],
"HR.09":["ProjectName","ID"],
"HR.10":["ProjectName","ID"],
"HR.12":["CreatedDate", "ProjectName", "LicenseAgreementType", "UpdatedDate", "ExpiryDate", "UID"],
"HR.13":["ID", "AssetCode", "AssetName", "CurrentProject", "AssetOwnership", "AssetCondition"],
"MECH.01":["ProjectName", "ID", "Source"],
"MECH.02":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.03":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.04":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.05":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.06":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.07":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.08":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID", "AssetCode"],
"MECH.09":["ProjectName","ID"],
"MECH.10":["ProjectName", "AssetName", "AssetOwnership", "AssetStatus", "ID","AssetCode","ReasonOfBreakdown"],
"MECH.11":["ID"],
"MECH.12":["ProjectName", "AssetName", "AssetOwnership", "ExpiryDate", "CurrentProject", "ID"],
"MECH.13":["ProjectName", "VendorNameAndCode", "Item", "Specification", "AssetCategory", "AssetGroup", "AssetMake", "AssetOwnership", "DateOfDeployment", "ID"],
"DDPS.03":["ProjectName"],
"DDPS.04":["ProjectName"],
"DDPS.05":["ProjectName"],
"DDPS.06":["34.ID", "34.ProjectName", "34.SafetyPerson", "34.AssignDate", "34.ObservationType", "34.Observation", "34.Site_ExactLocation", "34.ResponsibleContractor", "34.Recommendation", "34.TargetDate", "34.AllocatedLineIncharge", "34.SeverityRateLevel", "34.UploadPhotoGraph"],
"MOB.01":["TenderID", "ContractType", "ExecutionModel", "ExecutorCompany", "WorkName", "State", "StatusLastUpdatedDate", "Client_JVID", "Client_JVName"],
"MOB.02":["ProjectName", "Client_JVName", "ContractType", "WorkName", "ProjectInchargeName", "ProjectCoordinatorName"],
"MOB.03":["ProjectName", "Client_JVName", "NameOfWork", "ContractualStartDate"],
"MOB.04":["ProjectName", "WorkStartDate"],
"MOB.05":["ID", "ProjectName", "WorkStartDate"],
"MOB.06":["ProjectName", "WorkStartDate"],
"MOB.07":["ProjectName", "WorkStartDate"],
"MOB.08":["ProjectName", "WorkStartDate"],
"MOB.09":["ProjectName", "WorkStartDate"],
"MOB.10":["ProjectName", "WorkStartDate"],
"MOB.11":["ProjectName", "WorkStartDate"],
"MOB.12":["ProjectName", "WorkStartDate"],
"MOB.13":["ProjectName", "WorkStartDate"],
"MOB.14":["ProjectName", "WorkStartDate"],
"MOB.15":["ProjectName", "WorkStartDate"],
"MOB.16":["ProjectName", "WorkStartDate"],
"MOB.17":["ProjectName", "WorkStartDate"],
"MOB.18":["ProjectName", "WorkStartDate"],
"MOB.19":["ProjectName", "WorkStartDate"],
"MOB.20":["ProjectName", "WorkStartDate"],
"MOB.21":["TenderID", "ProjectName", "WorkStartDate"],
"MOB.22":["TenderID", "ProjectName", "WorkStartDate"],
"MOB.23":["ProjectName", "WorkStartDate"],
"MOB.24":["ProjectName", "WorkStartDate"],
"MOB.25":["ID", "ProjectName", "WorkStartDate", "GradeType", "TypeofCement"],
"MOB.26":["ProjectName", "StructureName"],
"MOB.27":["ProjectName", "StructureName"],
"MOB.28":["ProjectName", "StructureName"],
"MOB.29":["ProjectName", "StructureName", "PreliminaryWork", "PreliminaryWorkID"],
"MOB.30":["ProjectName", "RequirementID", "RequirementName"],
"MOB.31":["ProjectName", "WorkStartDate", "ContractualCompletionDate"],
"MOB.32":["ProjectName", "WorkStartDate", "ContractualCompletionDate"],
"MOB.33":["ProjectName","ComplianceType","ID"],
"PRW.03":["SearchTeamMemberName", "SearchTeamMemberEmployeeID", "BilledProject", "BundleBilledAmount", "BundleID", "DateHandedtoPRWTeam"],
"PRW.04":["ProjectName","ProjectType","ID"],
"PRW.05":["ProjectName","ProjectType","ID"],
"PRW.06":["ProjectName","ProjectType","ID"],
"PRW.07":["ReqID", "ProjectName", "ContractorID", "ContractorName", "ContractorContactNumber", "NoofManpower", "DateofDeployment"],

}

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
    CONFIGURE_SELECTION_LOGIC,
    INITIATION_DATA,
}