export interface INotification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: Date;
  recipientId: string;
  recipientType: "user" | "admin" | "technician";
  isRead: boolean;
}