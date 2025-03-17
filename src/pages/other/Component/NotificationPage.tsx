import { useCommonContext } from '@/common';
import config from '@/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Pagination, Table, Collapse, Row, Col, Container, Alert } from 'react-bootstrap';

// Define Notification type
interface DoerDetail {
    doerID: string;
    isRead: number;     // 0 or 1
    readAt: string;
}

interface Notification {
    id: number;
    subject: string;
    createdBy: string;
    createdDate: string;
    content: string;
    attachment: string | null;
    getDoerDetails: DoerDetail[];

}

const NotificationPage: React.FC = () => {
    const { setUnreadCount } = useCommonContext()
    const storedEmpID = localStorage.getItem('EmpId')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchStaffRequirements();
    }, [currentPage]);

    const fetchStaffRequirements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL_APPLICATION}/NotificationMaster/GetUserNotification`, {
                params: { PageIndex: currentPage, DoerID: storedEmpID }
            });
            if (response.data.isSuccess) {
                setNotifications(response.data.notificationMaster);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
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

    // API call to mark as read
    const markAsRead = async (id: number) => {
        try {
            const payload = {
                id: id,
                doerID: storedEmpID,
                isRead: 1
            };

            const response = await axios.post(`${config.API_URL_APPLICATION}/NotificationMaster/UserUpdateNotification`, payload);

            if (response.data.isSuccess) {
                console.log("Notification marked as read.");
                fetchStaffRequirements();
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    const toggleExpandRow = async (id: number) => {
        const notification = notifications.find((n) => n.id === id);
        const userDoerDetail = notification?.getDoerDetails.find(d => d.doerID === storedEmpID);

        if (userDoerDetail && userDoerDetail.isRead === 0) {
            await markAsRead(id);
        }
        setExpandedRow(expandedRow === id ? null : id);
    };

    const unreadCount = notifications.filter((n) => {
        const userDoerDetail = n.getDoerDetails.find(d => d.doerID === storedEmpID);
        return userDoerDetail?.isRead === 0;
    }).length;

    setUnreadCount(unreadCount);

    return (
        <div className="notification-page">
            <div
                className="d-flex justify-content-between align-items-center px-3 py-2 my-2"
                style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                <h5 className="mb-0 d-flex align-items-center">
                    <i className="ri-notification-4-line me-2 text-primary"></i>
                    Notifications
                </h5>

                <div className="d-flex align-items-center">
                    <span className="text-muted me-3">
                        <i className="ri-list-check me-1"></i> {notifications.length} Total
                    </span>

                    <Badge bg="primary" className="d-flex align-items-center">
                        <i className="ri-mail-unread-line me-1 p-1"></i>
                        {unreadCount} Unread
                    </Badge>
                </div>
            </div>

            {/* Loader */}
            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <Table hover className='bg-white'>
                    <thead></thead>
                    <tbody>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 10).map((item) => {
                                const isUnread = item.getDoerDetails.length > 0 && item.getDoerDetails[0].isRead === 0;

                                return (
                                    <React.Fragment key={item.id}>
                                        <tr className={isUnread ? 'unread-row' : 'read-row'}>
                                            <td>
                                                <span className={isUnread ? 'fw-bold text-dark' : ''}>
                                                    {isUnread ? (
                                                        <i className="ri-mail-line fs-4 me-2 ml-2 "></i>
                                                    ) : (
                                                        <i className="ri-mail-open-line fs-4 ml-2 me-2"></i>
                                                    )}
                                                    {item.subject}
                                                </span>
                                            </td>
                                            <td className="text-right p-3">
                                                <div className="d-flex justify-content-end align-items-center">
                                                    <div className='me-2'>

                                                        <div>{item.createdDate}</div>
                                                    </div>
                                                    <i
                                                        onClick={() => toggleExpandRow(item.id)}
                                                        className={`fs-16 mr-2  ${expandedRow === item.id ? 'ri-eye-off-line ' : 'ri-eye-line text-dark'}`}
                                                        style={{ cursor: "pointer" }}
                                                    ></i>
                                                </div>
                                            </td>

                                        </tr>
                                        {expandedRow === item.id && (
                                            <tr key={`expanded-${item.id}`}>
                                                <td colSpan={12}>
                                                    <Collapse in={expandedRow === item.id}>
                                                        <div className="p-3">
                                                            <div className='d-flex justify-content-between'>
                                                                {/* Render HTML content */}
                                                                <div
                                                                    className="notification-content"
                                                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                                                />
                                                                <div className="text-end text-nowrap">Created By: {item.createdBy}</div>
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={12}>
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
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
                <Pagination >
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </div>
    );
};

export default NotificationPage;
