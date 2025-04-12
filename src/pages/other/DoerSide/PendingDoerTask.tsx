import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Alert } from 'react-bootstrap'; // Assuming DynamicForm is in the same directory
import { parse, format, addDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import DynamicFormContent from './DynamicFormContent';




interface ProjectAssignListWithDoer {
    id: number;
    projectName: string;
    moduleName: string;
    processName: string;
    doerName: string,
    taskCommonId: number,
    createdBy: string;
    createdDate: string;
    taskTime: string;
    taskType: string;
    roleName: string;

}

interface ApiResponse {
    isSuccess: boolean;
    message: string;
    getFilterTasks: ProjectAssignListWithDoer[];
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}
const PendingDoerTask: React.FC = () => {
    const [data, setData] = useState<ProjectAssignListWithDoer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [show, setShow] = useState(false);
    const [taskCommonIds, setTaskCommonIds] = useState<number>(0);

    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'moduleName', label: 'Module Name', visible: true },
        { id: 'processName', label: 'Process Name', visible: true },
        { id: 'projectName', label: 'Project Name', visible: true },
        { id: 'roleName', label: 'Role Name', visible: true },
        { id: 'task_Number', label: 'Task Number', visible: true },
        { id: 'taskType', label: 'Task Type', visible: true },
        { id: 'plannedDate', label: 'Planned Date', visible: true },
        { id: 'createdDate', label: 'Created Date', visible: true },

    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================



    useEffect(() => {
        const fetchData = async () => {
            try {
                const role = localStorage.getItem('EmpId') || '';
                const response = await axios.get<ApiResponse>(
                    `${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask?Flag=1&DoerId=${role}`
                );

                if (response.data && response.data.isSuccess) {
                    const fetchedData = response.data.getFilterTasks || [];
                    setData(fetchedData);
                } else {
                    console.error('API Response Error:', response.data?.message || 'Unknown error');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Axios Error Response:', error.response?.data || 'No response data');
                    console.error('Axios Error Message:', error.message);
                } else {
                    console.error('Unexpected Error:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    if (loading) {
        return <div className="loader-fixed">
            <div className="loader"></div>
            <div className="mt-2">Please Wait!</div>
        </div>;
    }



    const handleShow = () => setShow(true);

    const handleEdit = (taskCommonId: number) => {
        handleShow();
        setTaskCommonIds(taskCommonId)

    };


    const formatAndUpdateDate = (createdDate: string, taskTime: string) => {
        const createdDateObj = parse(createdDate, 'MM/dd/yyyy HH:mm:ss', new Date());
        if (isNaN(createdDateObj.getTime())) {
            throw new Error('Invalid created date format');
        }
        const taskTimeValue = parseInt(taskTime, 10);
        const daysToAdd = Math.floor(taskTimeValue / 24);
        const updatedDate = addDays(createdDateObj, daysToAdd);
        return format(updatedDate, 'MM/dd/yyyy HH:mm:ss');
    };



    return (

        <>
            <div className="d-flex p-2 bg-white mt-2 mb-2 rounded shadow"><h5 className='mb-0'>Pending Task</h5></div>
            <div className='overflow-auto'>
                {data.length === 0 ? (
                    <Container className="mt-5">
                        <Row className="justify-content-center">
                            <Col xs={12} md={8} lg={6}>
                                <Alert variant="info" className="text-center">
                                    <h4>No Data Found</h4>
                                    <p>You currently don't have any Data.</p>
                                </Alert>
                            </Col>
                        </Row>
                    </Container>
                ) : (

                    <>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Table hover className='bg-white '>
                                <thead>
                                    <Droppable droppableId="columns" direction="horizontal">

                                        {(provided) => (
                                            <tr
                                                {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}
                                                className='text-nowrap'>
                                                <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                {columns.filter(col => col.visible).map((column, index) => (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th >
                                                                <div ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}>
                                                                    {column.id === 'processName' && (<i className="ri-map-2-line"></i>)}
                                                                    {column.id === 'projectName' && (<i className="ri-building-line"></i>)}
                                                                    {column.id === 'task_Number' && (<i className="ri-health-book-line"></i>)}
                                                                    {column.id === 'roleName' && (<i className="ri-shield-user-line"></i>)}
                                                                    {column.id === 'taskType' && (<i className="ri-bookmark-line"></i>)}
                                                                    {column.id === 'taskTime' && (<i className="ri-calendar-line"></i>)}
                                                                    {column.id === 'createdDate' && (<i className="ri-hourglass-line"></i>)}
                                                                    {column.id === 'completedDate' && (<i className="ri-focus-3-line"></i>)}
                                                                    {column.id === 'moduleName' && (<i className="ri-box-3-line"></i>)}


                                                                    &nbsp; {column.label}
                                                                </div>
                                                            </th>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                <th>Action</th>
                                            </tr>
                                        )}

                                    </Droppable>
                                </thead>
                                <tbody>

                                    {data.length > 0 ? (
                                        data.slice(0, 10).map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                {columns.filter(col => col.visible).map((col) => (
                                                    <td key={col.id}

                                                        className={
                                                            // Add class based on column id
                                                            col.id === 'processName' ? 'fw-bold fs-14 text-dark text-nowrap' :
                                                                col.id === 'task_Number' ? 'fw-bold fs-13 text-dark text-nowrap task1' :
                                                                    col.id === 'processOwnerName' ? 'fw-bold fs-13 text-dark text-nowrap' :
                                                                        col.id === 'plannedDate' ? ' text-nowrap ' :
                                                                            col.id === 'createdDate' ? ' text-nowrap ' :
                                                                                // Add class based on value (e.g., expired tasks)
                                                                                (col.id === 'moduleName' && item[col.id] === 'Accounts') ? 'text-nowrap task4' :
                                                                                    (col.id === 'moduleName' && item[col.id] === 'Accounts Checklist') ? 'text-nowrap task3' :
                                                                                        ''
                                                        }
                                                    >
                                                        <div className=''>

                                                            {col.id === 'plannedDate' ? (
                                                                <td>
                                                                    {formatAndUpdateDate(item.createdDate, item.taskTime)}
                                                                </td>
                                                            ) : (<>{item[col.id as keyof ProjectAssignListWithDoer]}</>
                                                            )}

                                                        </div>
                                                    </td>

                                                ))}
                                                <td>
                                                    <Button onClick={() => handleEdit(item.taskCommonId)}>
                                                        Show
                                                    </Button>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={12}>

                                            <Container className="mt-5">
                                                <Row className="justify-content-center">
                                                    <Col xs={12} md={8} lg={6}>
                                                        <Alert variant="info" className="text-center">
                                                            <h4>No Data Found</h4>
                                                            <p>You currently don't have any Data.</p>
                                                        </Alert>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </td>
                                        </tr>
                                    )}


                                </tbody>
                            </Table>
                        </DragDropContext>
                    </>
                )}
            </div>
            <DynamicFormContent show={show} setShow={setShow} taskCommonId={taskCommonIds} />

        </>

    );
};

export default PendingDoerTask;