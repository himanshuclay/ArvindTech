import { BASIC_FIELD, BLOCK_VALUE, FIELD, RULE } from "./Interface";

const getBlockById = (form: FIELD, id: string) => {
    return form.blocks.find(block => block.id === id);
}

const manageShowHide = (block:BASIC_FIELD, rule: RULE, blockValue: BLOCK_VALUE) => {
    if(blockValue[rule.start2] === rule.start3){
        block.property.isShow = true;
    }else {
        block.property.isShow = false;
    }
    return block;
}

export {
    getBlockById,
    manageShowHide,
}