import { useEffect, useState } from "react";
import Editor from "../FormBuilder/Editor";
import { FIELD, PROPERTY } from "../FormBuilder/Constant/Interface";
import axios from "axios";
import config from "@/config";
import { toast } from "react-toastify";

const ActiveNode = ({ activeNode, activeTaskId, setActiveNode }: { activeNode: any; activeTaskId: number; setActiveNode: (value: any) => void; }) => {
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
    const handleSumbitTask = async () => {
        try {
            activeNode.data['blockValue'] = blockValue;
            activeNode.data['status'] = "completed";
            const query = {
                id: activeTaskId,
                jsonInput: JSON.stringify(activeNode)
            }
            console.log('query', query);
            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateTemplateJson`,
                query
            );
            if(response.data.isSuccess){
                toast.success(response.data.message);
                setActiveNode("");
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {/* {JSON.stringify(activeNode)} */}
            <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} isShowSave={false} />
            <button type="button" onClick={handleSumbitTask}>Save</button>
        </div>
    )
}

export default ActiveNode
