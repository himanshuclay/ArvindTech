import { useEffect, useState } from "react";
import Editor from "../FormBuilder/Editor";
import { FIELD, PROPERTY } from "../FormBuilder/Constant/Interface";

const ActiveNode = ({ activeNode }: { activeNode: any; }) => {
    const [form, setForm] = useState<FIELD>({ ...activeNode.data.form, editMode: true });
    const [property, setProperty] = useState<PROPERTY>({
        label: '',
        id: '',
        placeholder: '',
        value: '',
        required: "false",
        options: [{ label: '', value: '' }],
        advance: {
            backgroundColor: '',
            color: '',
        },
        isShow: false,
        disabled: false,
    })
    const [blockValue, setBlockValue] = useState({})
    useEffect(() => {
        setForm((preForm) => ({
            ...preForm,
            editMode: false,
        }))
    }, [])
    return (
        <div>
            {/* {JSON.stringify(activeNode)} */}
            <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} isShowSave={false} />

        </div>
    )
}

export default ActiveNode
