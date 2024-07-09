import React, { useState } from 'react';
import { Button, Offcanvas, Table } from 'react-bootstrap';

// Define the type for a notification
type Notification = {
  id: number;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, subject: 'Notification 1', message: 'This is notification 1', date: '2024-07-01', isRead: false },
    { id: 2, subject: 'Notification 2', message: 'This is notification 2', date: '2024-07-02', isRead: false },
    { id: 3, subject: 'Notification 1', message: 'This is notification 1', date: '2024-07-01', isRead: false },
    { id: 4, subject: 'Notification 2', message: 'This is notification 2', date: '2024-07-02', isRead: false },
    { id: 5, subject: 'Notification 1', message: 'This is notification 1', date: '2024-07-01', isRead: false },
    { id: 6, subject: 'Notification 2', message: 'This is notification 2', date: '2024-07-02', isRead: false },
    // Add more notifications as needed
  ]);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Handler for showing notification details
  const handleShowDetail = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetail(true);
    // Mark the notification as read
    setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
  };

  // Handler for marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Handler for deleting a notification
  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Handler for deleting all notifications
  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-2 rounded mt-2">
        <h4>Notifications</h4>
        <div>
          <Button variant="primary" className="me-2" onClick={handleMarkAllAsRead}>Mark all as read</Button>
          <Button variant="danger" onClick={handleDeleteAll}>Delete all</Button>
        </div>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map(notification => (
            <tr
              key={notification.id}
              className={notification.isRead ? 'table-white-custom' : 'table-info-custom'}
            >
              <td>{notification.subject}</td>
              <td>{notification.message}</td>
              <td>{notification.date}</td>
              <td>
                <Button variant="info" className="me-2" onClick={() => handleShowDetail(notification)}>Detail</Button>
                <Button variant="danger" onClick={() => handleDeleteNotification(notification.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Offcanvas show={showDetail} onHide={() => setShowDetail(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notification Detail</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedNotification && (
            <div>
              <h5>Subject: {selectedNotification.subject}</h5>
              <p>Message: {selectedNotification.message}</p>
              <p>Date: {selectedNotification.date}</p>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default NotificationsPage;
