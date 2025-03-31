import React, { useEffect, useRef, useState } from "react";
import Editor from "../FormBuilder/Editor";
import { FIELD, PROPERTY } from "../FormBuilder/Constant/Interface";
// import axios from "axios";
// import config from "@/config";
// import { toast } from "react-toastify";
import STAFF_ALLOCATION_PLAN from "./DynamicSegment/STAFF_ALLOCATION_PLAN";
import APPOINTMENT from "./DynamicSegment/APPOINTMENT";
import NEW_APPOINTMENT from "./DynamicSegment/NEW_APPOINTMENT";
import OLD_STAFF_TRANSFER from "./DynamicSegment/OLD_STAFF_TRANSFER";
import INDUCTION from "./DynamicSegment/INDUCTION";
import UPDATE_EMPLOYEE from "./DynamicSegment/UPDATE_EMPLOYEE";
import APPOINTMENT_LETTER from "./DynamicSegment/APPOINTMENT_LETTER";
import ASSIGN_TASK from "./DynamicSegment/ASSIGN_TASK";
import axios from "axios";
import config from "@/config";
import { toast } from "react-toastify";

const ActiveNode = ({ activeNode, activeTaskId, setActiveNode, completedNodes, setCompletedNodes }: { activeNode: any; activeTaskId: number; setActiveNode: (value: any) => void; completedNodes: any; setCompletedNodes: (value: any) => void; }) => {
    const [form, setForm] = useState<FIELD>(
        activeNode.data?.form?.blocks?.length
            ? {
                ...activeNode.data.form,
                editMode: true, // You probably want to override editMode to true if an existing form is found
            }
            : {
                name: '',
                blocks: [],
                blockCount: 0,
                editMode: true,
                rules: [],
                advance: {
                    backgroundColor: '',
                    color: '',
                },
            }
    );
    const [dynamicComponent,] = useState<string>(activeNode.data?.form?.blocks?.length ? '' : activeNode.data.form);
    const componentRefMap = useRef<{ [key: string]: any }>({});


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
            activeNode.data.form = dynamicComponent ? dynamicComponent : form;
            // let formData;
            if (componentRefMap.current[dynamicComponent]) {
                activeNode.data['blockValue'] = componentRefMap.current[dynamicComponent]?.[dynamicComponent]?.();
                // formData = componentRefMap.current[dynamicComponent]?.getAppointmentData?.().typeOfAppointment;
            }
            const query: any = {
                id: activeTaskId,
                jsonInput: JSON.stringify(activeNode)
            }
            if (activeNode.data.outputLabels.length > 1) {
                console.log('activeNode', activeNode)
                const filteredOutputLabels = activeNode.data.outputLabels.filter((label: any) => 
                    label === activeNode.data.blockValue.typeOfAppointment
                );
                query["outputLabel"] = filteredOutputLabels;
            }
            console.log('query', query);
            const response = await axios.post(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateTemplateJson`,
                query
            );
            if (response.data.isSuccess) {
                toast.success(response.data.message);
                setActiveNode("");
            }


        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // Debugging: log the current completedNodes
        console.log('completedNodes', completedNodes);
        if (completedNodes.length) {

            // Ensure that `completeNode.data` and `completeNode.data.form` exist
            const updatedNodes = completedNodes.map((completeNode: any) => ({
                ...completeNode,
                data: {
                    ...completeNode.data, // Ensure completeNode.data is spread

                }
            }));

            // Debugging: log the updatedNodes
            console.log(updatedNodes);

            // Update state with the new array of completed nodes
            setCompletedNodes(updatedNodes);
        }
    }, []);
    const componentMap: { [key: string]: React.FC<any> } = {
        STAFF_ALLOCATION_PLAN,
        APPOINTMENT,
        NEW_APPOINTMENT,
        OLD_STAFF_TRANSFER,
        INDUCTION,
        UPDATE_EMPLOYEE,
        APPOINTMENT_LETTER,
        ASSIGN_TASK,
    };

    return (
        <div>
            {completedNodes.map((completeNode: any) => (
                <>
                    {/* {JSON.stringify(completeNode.data.blockValue)} */}
                    {completeNode.data.form?.blocks?.length ? (
                        <Editor form={completeNode.data.form} setForm={setForm} property={property} setProperty={setProperty} blockValue={completeNode.data.blockValue} setBlockValue={setBlockValue} isShowSave={false} isPreview={true} />
                    ) : (
                        React.createElement(componentMap[completeNode.data.form], {
                            ref: (instance: any) => {
                                if (instance) {
                                    componentRefMap.current[completeNode.data.form] = instance;
                                }
                            },
                            blockValue: completeNode.data.blockValue
                        })
                    )}
                </>
            ))}
            {form?.blocks?.length && (
                <Editor form={form} setForm={setForm} property={property} setProperty={setProperty} blockValue={blockValue} setBlockValue={setBlockValue} isShowSave={false} />
            )}
            {dynamicComponent && componentMap[dynamicComponent] && (
                React.createElement(componentMap[dynamicComponent], {
                    ref: (instance: any) => {
                        if (instance) {
                            componentRefMap.current[dynamicComponent] = instance;
                        }
                    }
                })
            )}
            <button type="button" onClick={handleSumbitTask}>Save</button>
        </div>
    )
}

export default ActiveNode
