
export interface NotificationModel {
  id: number;
  title: string;
  message: string;
  messageAr: string;
  type: string;
  date: Date;
  isRead: boolean;
  productId?: number;
}
