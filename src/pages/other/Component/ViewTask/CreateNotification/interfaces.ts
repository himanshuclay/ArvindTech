export interface DoerDetail {
    doerID: string;
    isRead: number;
    readAt: string;
}

export interface NotificationFromAPI {
    id: number;
    subject: string;
    content: string;
    attachment: string;
    getDoerDetails: DoerDetail[];
    createdDate: string;
    levelType: string;

}

export interface Notification {
    id: number;
    subject: string;
    content: string;
    attachment: string;
    doerIDs: string[];
    roleNames: string[];
    createdBy: string;
    levelType: string;
    updatedBy: string;
}
