import { Row, Col, Container, Alert, Modal, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


interface Employee {
    id: number;
    employeeName: string;
    empID: string;
    userUpdatedMobileNo: string
    createdBy: string;
    updatedBy: string;
}
interface EmployeePopusProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any; // Ensure this is defined as a string
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}





const EmployeeBankPopup: React.FC<EmployeePopusProps> = ({ showView, setShowView, id }) => {

    const [employee, setEmployee] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [columns, setColumns] = useState<Column[]>([
        { id: 'salaryBankName', label: 'Bank Name ', visible: true },
        { id: 'salaryBankIfsc', label: 'Bank Ifsc', visible: true },
        { id: 'salaryBranchName', label: 'Branch Name', visible: true },
        { id: 'salaryBankAccountType', label: 'Bank Account Type', visible: true },
        { id: 'salaryBankAccountNumber', label: 'Bank Account Number', visible: true },

    ]);

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await fetchEmployee(id);
            }
        };
        fetchData();
    }, [id]);

    const fetchEmployee = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/EmployeeMaster/GetEmployee`, {
                params: { id: id }
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.employeeMasterList[0]);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
        finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        setShowView(false);
    };


    return (
        <div>
            <Modal className="" show={showView} placement="end" onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">View Bank Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className='loader-container'>
                            <div className="loader"></div>
                            <div className='mt-2'>Please Wait!</div>
                        </div>
                    ) : (
                        <>
                            <h3 className='text-dark'>{employee.employeeName}</h3>


                            <div className="overflow-auto text-nowrap ">
                                {!employee ? (
                                    <Container className="mt-5">
                                        <Row className="justify-content-center">
                                            <Col xl={12} md={8} lg={6}>
                                                <Alert variant="info" className="text-center">
                                                    <h4>No Task Found</h4>
                                                    <p>You currently don't have Completed tasks</p>
                                                </Alert>
                                            </Col>
                                        </Row>
                                    </Container>
                                ) : (
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Table hover className='bg-white'>
                                            <thead>
                                                <Droppable droppableId="columns" direction="horizontal">
                                                    {(provided) => (
                                                        <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                            <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                            {columns.filter(col => col.visible).map((column, index) => (
                                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                    {(provided) => (
                                                                        <th>
                                                                            <div ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}>
                                                                                {column.id === 'salaryBankIfsc' && (<i className="ri-barcode-line"></i>)}
                                                                                {column.id === 'salaryBankAccountNumber' && (<i className="ri-numbers-line"></i>)}
                                                                                {column.id === 'salaryBankName' && (<i className="ri-bank-line"></i>)}
                                                                                {column.id === 'salaryBankAccountType' && (<i className="ri-account-circle-line"></i>)}
                                                                                {column.id === 'salaryBranchName' && (<i className="ri-building-line"></i>)}



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
                                                {employee.length > 0 ? (
                                                    employee.slice(0, 10).map((item, index) => (
                                                        <tr key={item.id}>
                                                            {columns.filter(col => col.visible).map((col) => (
                                                                <td key={col.id}
                                                                    className={
                                                                        col.id === 'employeeName' ? 'fw-bold fs-13 text-dark' : ''
                                                                    }
                                                                >
                                                                   <>{item[col.id as keyof Employee]}</>
                                                                </td>
                                                            ))}
                                                            {/* Action Button */}
                                                            <td><Link to={`/pages/EmployeeMasterinsert/${item.id}`}>
                                                                <Button variant='primary' className='p-0 text-white'>
                                                                    <i className='btn ri-edit-line text-white' ></i>
                                                                </Button>
                                                            </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={12}> <Container className="mt-5">
                                                            <Row className="justify-content-center">
                                                                <Col xs={12} md={8} lg={6}>
                                                                    <Alert variant="info" className="text-center">
                                                                        <h4>No Bank Detials Found</h4>
                                                                        <p>You currently don't have Bank Detial</p>
                                                                    </Alert>
                                                                </Col>
                                                            </Row>
                                                        </Container></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </DragDropContext>
                                )}
                            </div>
                        </>
                    )}


                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EmployeeBankPopup;
