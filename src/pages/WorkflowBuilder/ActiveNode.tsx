import React, { useEffect, useRef, useState } from "react";
import Editor from "../FormBuilder/Editor";
import { BLOCK_VALUE, FIELD, PROPERTY } from "../FormBuilder/Constant/Interface";
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
// import { json } from "stream/consumers";

const ActiveNode = ({ activeNode, activeTaskId, setActiveNode, completedNodes, setCompletedNodes, pId }: { activeNode: any; activeTaskId: number; setActiveNode: (value: any) => void; completedNodes: any; setCompletedNodes: (value: any) => void; pId?: any }) => {
    console.log('activeNode', activeNode)
    const [prevForm, setPrevForm] = useState<FIELD>({
        name: '',
        blocks: [],
        blockCount: 0,
        editMode: true,
        rules: [],
        configureSelectionLogics: [],
        advance: {
            backgroundColor: '',
            color: '',
        },
    })
    const [prevBlockValue, setPrevBlockValue] = useState<BLOCK_VALUE>({})
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
        type: '',
        options: [{ label: '', value: '' }],
        advance: {
            backgroundColor: '',
            color: '',
        },
        isShow: false,
        disabled: 'false',
    })
    console.log(activeNode.data.taskLoop.loopBlockValue);
    const [blockValue, setBlockValue] = useState<BLOCK_VALUE>(activeNode.data.blockValue ? activeNode.data.blockValue : {})
    const [loopSection,] = useState(activeNode.data.taskLoop?.loopID ? JSON.parse(activeNode.data.taskLoop.loopBlockValue) : []);
    const [activeLoop, setActiveLoop] = useState(loopSection.length ? loopSection[0] : '');
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [preNodeId, setPreNodeId] = useState('');

    const approvalLogic = async (nodeId: string,) => {
        try {
            const response = await axios.get(
                `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFormandBlockValue?nodeID=${nodeId}&ID=${pId}`);
                setPreNodeId(nodeId);
            if (response.data.isSuccess) {
                let data = JSON.parse(response.data.formandBlockValue)
                console.log(data)
                setPrevBlockValue(data.blockValue);
                setPrevForm(data.form);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        setForm((preForm) => ({
            ...preForm,
            editMode: false,
        }))
        console.log(activeNode)
        if (activeNode.data.approvalSelect != '') {
            approvalLogic(activeNode.data.approvalTaskNumber);
        }
    }, [])
    const handleSumbitTask = async () => {
        try {
            const errors: { [key: string]: string } = {};

            form.blocks.forEach(block => {
                if (block.property.validation === "required" && (!block.property.value || block.property.value.trim() === "")) {
                    errors[block.property.id] = `${block.property.label} is required`;
                }
            });
            setValidationErrors(errors);
            if (Object.keys(errors).length === 0) {
                activeNode.data['blockValue'] = blockValue;
                activeNode.data['status'] = "completed";
                activeNode.data['completedBy'] = localStorage.getItem("EmpId");
                activeNode.data['completedBy'] = localStorage.getItem("EmpId");
                activeNode.data.form = dynamicComponent ? dynamicComponent : form;
                if (componentRefMap.current[dynamicComponent]) {
                    activeNode.data['blockValue'] = componentRefMap.current[dynamicComponent]?.[dynamicComponent]?.();
                }
                const query: any = {
                    id: activeTaskId,
                }
                // if (Array.isArray(activeNode.data.outputLabels) && activeNode.data.outputLabels.length > 1) {
                //     activeNode.data.outputLabels.forEach((output: any) => {
                //         const cleanedOutput = output.includes('.') ? output.split('.')[1] : output;

                //         const isMatch = Object.values(activeNode.data.blockValue).includes(cleanedOutput);

                //         if (isMatch) {
                //             console.log('Matched output:', cleanedOutput);
                //             query["outputLabel"] = cleanedOutput;
                //         }
                //     });


                //     // const activeLabel = activeNode.data.blockValue?.typeOfAppointment;
                //     // const matchedActiveLabel = activeNode.data.outputLabels.find(
                //     //     (label: any) => label === activeLabel
                //     // );

                //     // if (matchedActiveLabel) {
                //     //     // Direct match in the active node
                //     //     query["outputLabel"] = matchedActiveLabel;

                //     // } else {
                //     //     // Try matching against completed nodes
                //     //     for (const completeNode of completedNodes) {
                //     //         const completedLabel = completeNode.data.blockValue?.typeOfAppointment;
                //     //         console.log(completedLabel, activeNode.data.outputLabels)
                //     //         const matched = activeNode.data.outputLabels.find(
                //     //             (label: any) => label === completedLabel
                //     //         );
                //     //         console.log(matched)
                //     //         if (matched) {
                //     //             query["outputLabel"] = matched;
                //     //             break; // ✅ Exit loop once match is found
                //     //         }
                //     //     }
                //     // }
                // }

                // console.log('query', query);
                // activeNode.data['nextNode'] = {};
                // activeNode.data['nextNode']['id'] = activeNode.id;
                // activeNode.data['nextNode']['sourceHandle'] = query.outputLabel;
                query.jsonInput = JSON.stringify(activeNode)
                if (blockValue[activeNode.data.approvalSelect] == activeNode.data.approvalOptions) {
                    query.prevBlockValue = JSON.stringify(prevBlockValue);
                    query.preNodeId = preNodeId;
                }

                if (activeLoop) {
                    query.activeLoop = activeLoop;
                    query.loopId = activeNode.data.taskLoop.loopID;
                }
                console.log(query)
                const response = await axios.post(
                    `${config.API_URL_ACCOUNT}/ProcessInitiation/UpdateTemplateJson`,
                    query
                );

                if (response.data.isSuccess) {
                    toast.success(response.data.message);
                    setActiveNode("");
                }
            } else {
                console.log('Validation Errors:', errors);
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
        if (activeNode.data) {
            console.log(activeNode.data)
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


    const handlePrevious = () => {
        const index = loopSection.findIndex((loop: any) => loop === activeLoop);

        // Check if index is greater than 0 (to avoid accessing negative index)
        if (index > 0) {
            setActiveLoop(loopSection[index - 1]);
            const blockV = loopSection[index - 1];
            if (blockV) {
                setBlockValue(Object.values(blockV)[0] as BLOCK_VALUE);
            }
        } else {
            // Optionally, you could set it to the last item if you want to cycle through the array
            // setActiveLoop(loopSection[loopSection.length - 1]);
            console.log("Already at the first item");
        }
    }

    const handleNext = () => {
        const index = loopSection.findIndex((loop: any) => loop === activeLoop);

        // Check if index is less than loopSection.length - 1 (to avoid accessing index out of bounds)
        if (index < loopSection.length - 1) {
            setActiveLoop(loopSection[index + 1]);
            const blockV = loopSection[index + 1];
            if (blockV) {
                setBlockValue(Object.values(blockV)[0] as BLOCK_VALUE);
            }

        } else {
            // Optionally, you could set it to the first item if you want to cycle through the array
            // setActiveLoop(loopSection[0]);
            console.log("Already at the last item");
        }
    }


    return (
        <div>
            {/* {completedNodes.map((completeNode: any, index: number) => (
                <div>
                    <React.Fragment key={index}>
                        {completeNode.data.form?.blocks?.length ? (
                            <Editor
                                form={completeNode.data.form}
                                setForm={setForm}
                                property={property}
                                setProperty={setProperty}
                                blockValue={completeNode.data.blockValue}
                                setBlockValue={setBlockValue}
                                isShowSave={false}
                                isPreview={true}
                            />
                        ) : (
                            <fieldset disabled>
                                {React.createElement(componentMap[completeNode.data.form], {
                                    ref: (instance: any) => {
                                        if (instance) {
                                            componentRefMap.current[completeNode.data.form] = instance;
                                        }
                                    },
                                    blockValue: completeNode.data.blockValue
                                })}
                            </fieldset>
                        )}
                    </React.Fragment>
                    <hr />
                </div>

            ))} */}
            {/* {JSON.stringify(blockValue)} */}
            {blockValue[activeNode.data.approvalSelect] == activeNode.data.approvalOptions && (
                <>{prevForm.name}
                    {prevForm?.blocks?.length ? (
                        <Editor
                            form={prevForm}
                            setForm={setPrevForm}
                            property={property}
                            setProperty={setProperty}
                            blockValue={prevBlockValue}
                            setBlockValue={setPrevBlockValue}
                            isShowSave={false}
                            validationErrorsList={validationErrors}
                        />
                        // <>{JSON.stringify(prevBlockValue)}</>
                    ) : ''}
                </>
            )}
            {activeNode.data.label && (<div>
                {/* {activeNode.data.label}{activeLoop ? activeLoop.split('-')[1] : ''} */}
            </div>)
            }
            {JSON.stringify(blockValue)}
            <div className="my-2 position-relative">
                {form?.blocks?.length ? (
                    <Editor
                        // key={JSON.stringify(blockValue)} // forces remount on blockValue change
                        form={form}
                        setForm={setForm}
                        property={property}
                        setProperty={setProperty}
                        blockValue={blockValue}
                        setBlockValue={setBlockValue}
                        isShowSave={false}
                        validationErrorsList={validationErrors}
                    />
                ) : ''}

                {dynamicComponent && componentMap[dynamicComponent] && (
                    React.createElement(componentMap[dynamicComponent], {
                        ref: (instance: any) => {
                            if (instance) {
                                componentRefMap.current[dynamicComponent] = instance;
                            }
                        },
                        blockValue: blockValue
                    })
                )}
                {loopSection.length && (
                    <button className="position-absolute top-50" type="button" onClick={handlePrevious}><i className="ri-arrow-left-wide-line"></i></button>
                )}
                {loopSection.length && (
                    <button className="position-absolute top-50 end-0" type="button" onClick={handleNext}><i className="ri-arrow-right-wide-line"></i></button>
                )}
            </div>
            <div className="d-flex justify-content-end p-3">
                <button className="btn btn-primary" type="button" onClick={handleSumbitTask}>Save</button>
            </div>
        </div>
    )
}

export default ActiveNode
