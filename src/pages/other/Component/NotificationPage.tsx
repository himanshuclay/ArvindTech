import React, { useState } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

// Define Notification type
interface Notification {
    id: number;
    subject: string;
    content: string;
    status: 'read' | 'unread';
    receivedAt: string;
    readAt: string | null;
    attachment: string | null;
    sentBy: string;
}

const NotificationPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            subject: "System Update",
            content: "The system will be down for maintenance from 1 AM to 3 AM.",
            status: "unread",
            receivedAt: "2025-01-13T12:30:00Z",
            readAt: null,
            attachment: null,
            sentBy: "System Admin",
        },
        {
            id: 2,
            subject: "New Feature",
            content: "We've added a new feature to the dashboard.",
            status: "read",
            receivedAt: "2025-01-12T09:15:00Z",
            readAt: "2025-01-12T10:00:00Z",
            attachment: null,
            sentBy: "Product Team",
        },
        {
            id: 3,
            subject: "Weekly Report",
            content: "Your weekly report is ready for review.",
            status: "unread",
            receivedAt: "2025-01-11T14:45:00Z",
            readAt: null,
            attachment: "report.pdf",
            sentBy: "System Generated",
        },
    ]);

    // Mark a notification as read
    const markAsRead = (id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, status: "read", readAt: new Date().toISOString() } : notification
            )
        );
    };

    return (
        <div className="notification-page">
            {/* Top Bar */}
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
                        <i className="ri-mail-unread-line me-1"></i>
                        {notifications.filter((n) => n.status === "unread").length} Unread
                    </Badge>
                </div>
            </div>

            {/* Notification List */}
            <ListGroup>
                {notifications.map((notification) => (
                    <ListGroup.Item
                        key={notification.id}
                        className={`d-flex justify-content-between align-items-center p-3 ${notification.status === "unread" ? "bg-light border-primary" : ""
                            }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => markAsRead(notification.id)}
                    >
                        {/* Left Section */}
                        <div className="d-flex align-items-center">
                            {/* Status Icon */}
                            <i
                                className={`remixicon ${notification.status === "unread"
                                    ? "ri-mail-unread-line text-primary"
                                    : "ri-mail-open-line text-muted"
                                    } me-3 fs-4`}
                                title={
                                    notification.status === "unread"
                                        ? "Unread Notification"
                                        : "Read Notification"
                                }
                            ></i>

                            {/* Notification Content */}
                            <div className="d-flex flex-column justify-content-center me-3">
                                <span className="fw-bold text-truncate">{notification.subject}</span>
                                <small className="text-muted text-truncate" style={{ maxWidth: "250px" }}>
                                    {notification.content}
                                </small>
                            </div>

                            {/* Received Time */}
                            <small className="text-muted d-flex align-items-center me-3">
                                <i className="ri-time-line me-1"></i>
                                {new Date(notification.receivedAt).toLocaleString()}
                            </small>
                        </div>

                        {/* Right Section */}
                        <div className="d-flex align-items-center">
                            {/* Attachment Icon */}
                            {notification.attachment && (
                                <i
                                    className="ri-attachment-line text-primary me-3"
                                    style={{ cursor: "pointer" }}
                                    title="View Attachment"
                                ></i>
                            )}
                            {/* Delete Icon */}
                            <i
                                className="ri-delete-bin-line text-danger fs-5"
                                style={{ cursor: "pointer" }}
                                title="Delete Notification"
                            ></i>
                        </div>
                    </ListGroup.Item>

                ))}
            </ListGroup>
        </div>


    );
};

export default NotificationPage;
