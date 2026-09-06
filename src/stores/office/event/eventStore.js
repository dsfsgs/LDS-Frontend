import { defineStore } from "pinia";

import {

  office_event_list,
  office_event_view,

} from "src/service/office/event/eventService";

export const useOfficeEventStore = defineStore("officeEvent", {
  state: () => ({
    officeEvents: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOfficeEvents() {
      this.loading = true;
      this.error = null;

      try {
        const response = await office_event_list();

        if (response.data.success) {
          this.officeEvents = response.data.data;
        } else {
          this.error = response.data.message;
        }
      } catch (err) {
        this.error = "Failed to fetch events";
        console.error("Error fetching events:", err);
      } finally {
        this.loading = false;
      }
    },

    async view_office_event(scheduleId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await office_event_view(scheduleId);

        if (response.data.success) {
          return {
            success: true,
            message: response.data.message || "Schedule fetched successfully",
            data: response.data.data,
          };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch schedule";
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },
  }
});
