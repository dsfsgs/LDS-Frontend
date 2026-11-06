import { defineStore } from "pinia";
import {
  get_notifications,
  mark_notification_read,
  get_unread_notification,
} from "src/service/notificationService";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unread: 0,
    page: 1,
    lastPage: 1,
    loading: false,
    loadingMore: false,
    error: null,
  }),

  getters: {
    unreadCount: (state) => state.unread,
    hasMore: (state) => state.page < state.lastPage,
  },

  actions: {
    // Page 1 lang: ginagamit sa unang load at sa polling.
    // Hindi binubura ang mga na-load na sa "See more".
    async fetchNotifications() {
      this.loading = true;
      this.error = null;
      try {
        const response = await get_notifications({ page: 1 });
        const paginator = response.data.data;
        const incoming = paginator?.data ?? [];

        const ids = new Set(incoming.map((n) => n.id));
        this.notifications = [
          ...incoming,
          ...this.notifications.filter((n) => !ids.has(n.id)),
        ];
        this.lastPage = paginator?.last_page ?? 1;

        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load notifications.";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // "See more": susunod na 10
    async loadMore() {
      if (this.loadingMore || !this.hasMore) return;
      this.loadingMore = true;
      try {
        const response = await get_notifications({ page: this.page + 1 });
        const paginator = response.data.data;
        const incoming = paginator?.data ?? [];

        const ids = new Set(this.notifications.map((n) => n.id));
        this.notifications = [
          ...this.notifications,
          ...incoming.filter((n) => !ids.has(n.id)),
        ];
        this.page = paginator?.current_page ?? this.page + 1;
        this.lastPage = paginator?.last_page ?? this.lastPage;

        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || "Failed to load more." };
      } finally {
        this.loadingMore = false;
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await get_unread_notification();
        this.unread = response.data.data?.unread_count ?? 0;
      } catch {
        // tahimik lang, hindi kritikal ang badge
      }
    },

    async markAsRead(id) {
      try {
        const target = this.notifications.find((n) => n.id === id);
        const wasUnread = target && !target.read_at;

        await mark_notification_read(id);

        if (target) target.read_at = new Date().toISOString();
        if (wasUnread && this.unread > 0) this.unread--;

        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || "Failed to mark as read." };
      }
    },
  },
});