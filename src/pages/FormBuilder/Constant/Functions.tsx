import { BASIC_FIELD, BLOCK_VALUE, FIELD, OPTION, PROPERTY, RULE } from "./Interface";

const getBlockById = (form: FIELD, id: string) => {
    return form.blocks.find(block => block.property.id === id);
}

const manageShowHide = (block: BASIC_FIELD, rule: RULE, blockValue: BLOCK_VALUE) => {
    if (blockValue[rule.start2] === rule.start3) {
        block.property.isShow = true;
        block.property.isPermanent = true;
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
    if (['Select', 'MultiSelectDropdown'].includes(block.is)) {
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

const updatePropertyByID = (blocks: BASIC_FIELD[], id: string, property: PROPERTY): BASIC_FIELD[] => {
    const updatedBlocks = blocks.map(block => {
        if (block.property.loopBlocks && block.property.loopBlocks.length) {
            // Recursively update inside loopBlocks if needed
            return {
                ...block,
                property: {
                    ...block.property,
                    loopBlocks: updatePropertyByID(block.property.loopBlocks, id, property)
                }
            };
        } else if (block.property.id === id) {
            return {
                ...block,
                property
            };
        }
        return block;
    });

    return updatedBlocks;
};

const SelectiveBlockDropDown = (blocks: BASIC_FIELD[], selective: string[]) => {
    const options = blocks
        .map((block) => {
            if (selective.includes(block.is)) {
                return {
                    label: `${block.property.label} (${block.property.id})`,
                    value: block.property.id,
                };
            }
            return null; // Return null if not included in selective
        })
        .filter((option) => option !== null); // Filter out null values

    return options;
};





export {
    getBlockById,
    manageShowHide,
    manageBind,
    updatePropertyByID,
    SelectiveBlockDropDown,
}