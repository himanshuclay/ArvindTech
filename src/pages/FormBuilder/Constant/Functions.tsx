import { BASIC_FIELD, BLOCK_VALUE, FIELD, OPTION, RULE } from "./Interface";

const getBlockById = (form: FIELD, id: string) => {
    return form.blocks.find(block => block.property.id === id);
}

const manageShowHide = (block: BASIC_FIELD, rule: RULE, blockValue: BLOCK_VALUE) => {
    if (blockValue[rule.start2] === rule.start3) {
        block.property.isShow = true;
    } else {
        block.property.isShow = false;
    }
    return block;
}
interface Rule {
    rule: RULE;
    value: string | OPTION[];
}

const manageBind = (block: BASIC_FIELD, blockValue: BLOCK_VALUE, rule: Rule): BASIC_FIELD | BLOCK_VALUE => {
    if (['Select','MultiSelect'].includes(block.is)) {
        const updatedBlock: BASIC_FIELD = {
            ...block,
            property: {
                ...block.property,
                options: Array.isArray(rule.value) ? rule.value : block.property.options
            }
        };
        return updatedBlock;
    } else {
        const updatedBlockValue: BLOCK_VALUE = {
            ...blockValue,
            [rule.rule.start2]: rule.value as string
        };
        return updatedBlockValue;
    }
};




export {
    getBlockById,
    manageShowHide,
    manageBind,
}