import AmountInput from "../Components/AmountInput";
import DateInput from "../Components/DateInput";
import DateRange from "../Components/DateRange";
import EmailInput from "../Components/EmailInput";
import FileUpload from "../Components/FileUpload";
import FloatInput from "../Components/FloatInput";
import MultiSelectDropdown from "../Components/MultiSelect";
import NumberInput from "../Components/NumberInput";
import Password from "../Components/Password";
import PhoneInput from "../Components/PhoneInput";
import Select from "../Components/Select";
import TextInput from "../Components/TextInput";
import Paragraph from "../Components/Paragraph";
import CheckboxInput from "../Components/CheckboxInput";
import TableInput from "../Components/TableInput";
import TextArea from "../Components/TextArea";

const componentsMap = {
    TextInput,
    NumberInput,
    EmailInput,
    PhoneInput,
    Password,
    Select,
    DateInput,
    FileUpload,
    DateRange,
    MultiSelectDropdown,
    AmountInput,
    FloatInput,
    Paragraph,
    CheckboxInput,
    TableInput,
    TextArea,
};

interface FIELD {
    name: string;
    blocks: BASIC_FIELD[];
    blockCount: number;
    editMode: boolean;
    rules: RULE[];
    configureSelectionLogics: CONFIGURE_SELECTION_LOGICS[];
    advance: ADVANCE;
}

interface BASIC_FIELD {
    name: string;
    is: keyof typeof componentsMap;
    property: PROPERTY;
}

interface RULE {
    start1: string;
    start2: string;
    start3: string;
    start4: string;
    end1: string;
    end2: string;
    end3: string;
}

interface CONFIGURE_SELECTION_LOGICS {
    start1: string;
    start2: string[];
}

interface ADVANCE {
    backgroundColor: string;
    color: string;
}

interface PROPERTY {
    label: string;
    id: string;
    placeholder: string;
    value: string;
    required: string;
    options: OPTION[];
    advance: ADVANCE;
    isShow: boolean;
    disabled: string;
    startDateId?: string;
    endDateId?:string;
    size?:string;
    dateSelection?: string;
    validation?: string;  
    dateFormate?: string;  
    currencySymbol?: string;  
    decimalLimit?: string;  
    prefix?: string;  
    isLooping?: string;  
    loopBlocks?: BASIC_FIELD[];  
    blocks?: BASIC_FIELD[];  
    blockCount?: number;
    mode?: string;
    groupName?: string;
    minAllowedDate?: string;
    type: string;
    isPermanent?: boolean;
    dateValue?: string;
    maxSelections?: number;
    tableConfiguration?: string;
    multiple? : boolean;
    [key: string]: any;
}
interface OPTION { label: string; value: string }
interface BLOCK_VALUE {
    [key: string]: string | string[];
}
interface TRIGGER_ACTION {
    type: string;   // e.g., 'show_hide' or 'bind'
    key: string;
    block: BASIC_FIELD;
    bindBlock: BASIC_FIELD;
    rule: {
        rule: RULE;
        value: string | OPTION[];
    };
}

interface LOGIC_ITEM{
    start1: string;
    start2: string[];
    [key: string]: any;
}

export interface TableHeader {
    key: string;
    displayName: string;
    disable?: boolean;
    calculation?: {
      operation: 'sum-subtract';
      add: string[];
      subtract?: string[];
    };
    autoFill?: string;
  }


export type { FIELD, PROPERTY, BASIC_FIELD, RULE, BLOCK_VALUE, ADVANCE, OPTION, TRIGGER_ACTION, CONFIGURE_SELECTION_LOGICS, LOGIC_ITEM };

