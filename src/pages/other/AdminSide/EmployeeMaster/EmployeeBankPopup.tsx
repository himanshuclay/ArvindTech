import { Row, Col, Container, Alert, Modal, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";

interface Employee {
    id: number;
    employeeName: string;
    empID: string;
    userUpdatedMobileNo: string;
    createdBy: string;
    updatedBy: string;
    salaryBankName: string;
    salaryBankIfsc: string;
    salaryBranchName: string;
    salaryBankAccountNumber: string;

    reimbursementBankName: string;
    reimbursementBankIfsc: string;
    reimbursementBranchName: string;
    reimbursementBankAccountNumber: string;

    expenseBankName: string;
    expenseBankIfsc: string;
    expenseBranchName: string;
    expenseBankAccountNumber: string;
}

interface EmployeePopusProps {
    showView: boolean;
    setShowView: (show: boolean) => void;
    id: any;
}

const EmployeeBankPopup: React.FC<EmployeePopusProps> = ({ showView, setShowView, id }) => {

    const [employee, setEmployee] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


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
                setEmployee(response.data.employeeMasterList);
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

    const hasBankDetails = employee.some(emp => emp.salaryBankName && emp.salaryBankIfsc);

    return (
        <div>
            <Modal show={showView} onHide={handleClose} size='xl'>
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
                            <h3 className='text-dark d-flex justify-content-between'>
                                {employee.map((item, index) => (
                                    <span key={index}>{item.employeeName}</span>
                                ))}

                                <Link to={`/pages/EmployeeMasterinsert/${id}`}>
                                    <Button variant='primary' className='icon-padding text-white'>
                                        <i className='fs-18 ri-edit-line text-white' ></i>
                                    </Button>
                                </Link>
                            </h3>

                            <div className="overflow-auto text-nowrap">
                                {!employee ? (
                                    <Container className="mt-5">
                                        <Row className="justify-content-center">
                                            <Col xl={12} md={8} lg={6}>
                                                <Alert variant="info" className="text-center">
                                                    <h4>No Data Found</h4>
                                                    <p>You currently don't have bank details</p>
                                                </Alert>
                                            </Col>
                                        </Row>
                                    </Container>
                                ) : (
                                    <Table hover className='bg-white'>
                                        <tbody>
                                            {hasBankDetails ? (
                                                employee.slice(0, 10).map((item, index) => (
                                                    <>
                                                        <tr>
                                                            <td>
                                                                <Table bordered hover className="mt-3">
                                                                    <thead>
                                                                        <tr className="text-center bg-light">
                                                                            <th>Salary Bank Details</th>
                                                                            <th>Reimbursement Bank Details</th>
                                                                            <th>Expense Bank Details</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr className="text-center">
                                                                            {/* Salary Bank Details */}
                                                                            <td className="py-3">
                                                                                <div><strong>Bank Name:</strong> {item.salaryBankName}</div>
                                                                                <div><strong>IFSC:</strong> {item.salaryBankIfsc}</div>
                                                                                <div><strong>Branch Name:</strong> {item.salaryBranchName}</div>
                                                                                <div><strong>Account Number:</strong> {item.salaryBankAccountNumber}</div>
                                                                            </td>

                                                                            {/* Reimbursement Bank Details */}
                                                                            <td className="py-3">
                                                                                <div><strong>Bank Name:</strong> {item.reimbursementBankName}</div>
                                                                                <div><strong>IFSC:</strong> {item.reimbursementBankIfsc}</div>
                                                                                <div><strong>Branch Name:</strong> {item.reimbursementBranchName}</div>
                                                                                <div><strong>Account Number:</strong> {item.reimbursementBankAccountNumber}</div>
                                                                            </td>

                                                                            {/* Expense Bank Details */}
                                                                            <td className="py-3">
                                                                                <div><strong>Bank Name:</strong> {item.expenseBankName}</div>
                                                                                <div><strong>IFSC:</strong> {item.expenseBankIfsc}</div>
                                                                                <div><strong>Branch Name:</strong> {item.expenseBranchName}</div>
                                                                                <div><strong>Account Number:</strong> {item.expenseBankAccountNumber}</div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>

                                                            </td>
                                                        </tr>

                                                    </>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={12}>
                                                        <Container className="mt-5">
                                                            <Row className="justify-content-center">
                                                                <Col xs={12} md={8} lg={6}>
                                                                    <Alert variant="info" className="text-center">
                                                                        <h4>No Bank Details Found</h4>
                                                                        <p>You currently don't have any bank details</p>
                                                                    </Alert>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
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
