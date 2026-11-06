import { api } from "src/boot/axios";

export const get_notifications = (params = {}) => api.get("notifications", { params });
export const mark_notification_read = (id) => api.put(`notifications/${id}/read`);
export const get_unread_notification = () => api.get("notifications/unread/count");