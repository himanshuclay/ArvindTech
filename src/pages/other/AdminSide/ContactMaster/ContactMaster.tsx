import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Table, Pagination, Form, Row, Col, Container, Alert, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';

interface Contact {
    contactID: number;
    contactName: string;
    contactMobileOfficial: string;
    contactMobilePersonal: string;
    contactEmailOfficial: string;
    contactEmailPersonal: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string | null;
}

const ContactMaster = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchContacts();
    }, [currentPage]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/ContactMaster/GetContact`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setContacts(response.data.getContactMasters);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Contact List</span></span>
                <div>
                    <Link to='/pages/ContactMasterInsert'>
                        <Button variant="primary">Add Contact</Button>
                    </Link>
                </div>
            </div>
            <div className='bg-white p-2 pb-2'>
                {loading ? (
                    <div className='loader-container'>
                        <div className="loader"></div>
                        <div className='mt-2'>Please Wait!</div>
                    </div>
                ) : (
                    <>
                        {contacts.length > 0 ? (
                            <Table hover className='bg-white'>
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Contact Name</th>
                                        <th>Official Mobile</th>
                                        <th>Personal Mobile</th>
                                        <th>Official Email</th>
                                        <th>Personal Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact, index) => (
                                        <tr key={contact.contactID}>
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            <td>{contact.contactName}</td>
                                            <td>{contact.contactMobileOfficial}</td>
                                            <td>{contact.contactMobilePersonal}</td>
                                            <td>{contact.contactEmailOfficial}</td>
                                            <td>{contact.contactEmailPersonal}</td>
                                            <td>
                                                <Link to={`/pages/ContactMasterInsert/${contact.contactID}`}>
                                                    <Button variant='primary' className='p-0 text-white'>
                                                        <i className='btn ri-edit-line text-white'></i>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>You currently don't have Data</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        )}
                    </>
                )}
            </div>

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </>
    );
};

export default ContactMaster;
