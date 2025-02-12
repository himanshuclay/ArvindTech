import EmailInput from "../Components/EmailInput";
import NumberInput from "../Components/NumberInput";
import Password from "../Components/Password";
import PhoneInput from "../Components/PhoneInput";
import Select from "../Components/Select";
import TextInput from "../Components/TextInput";

const componentsMap = {
    TextInput,
    NumberInput,
    EmailInput,
    PhoneInput,
    Password,
    Select,
};

interface FIELD {
    name: string;  
    blocks: BASIC_FIELD[];  
    editMode: boolean;  
    rules: RULE[];  
    advance: ADVANCE;  
}

interface BASIC_FIELD {
    id: string;
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
    options: { label: string; value: string }[];
    advance: ADVANCE;  
    isShow: boolean;

}
interface BLOCK_VALUE {
    [key: string]: string;  
}
export type { FIELD, PROPERTY, BASIC_FIELD, RULE, BLOCK_VALUE, ADVANCE };

