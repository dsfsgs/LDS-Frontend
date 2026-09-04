import { defineStore } from "pinia";
import { useEventStore } from "stores/eventStore"; // ← idagdag ito

import {
  add_schedule,
  delete_schedule,
  view_schedule,
  edit_schedule,
} from "src/service/library/event/schedule/schedule";

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    loading: false,
    error: null,
  }),

  actions: {
    async addSchedule(eventId, scheduleData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await add_schedule(eventId, scheduleData);

        if (response.data.success) {
          // subukan munang tanggalin ito, or wrap sa sarili niyang try/catch
          try {
            const eventStore = useEventStore();
            await eventStore.fetchEventById(eventId);
          } catch (refetchErr) {
            console.warn(
              "Refetch after add failed (schedule was still saved):",
              refetchErr
            );
          }

          return {
            success: true,
            message: response.data.message || "Schedule added successfully",
            data: response.data.data,
          };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to add schedule";
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async updateSchedule(scheduleId, scheduleData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await edit_schedule(scheduleId, scheduleData);

        if (response.data.success) {
          return {
            success: true,
            message: response.data.message || "Schedule updated successfully",
            data: response.data.data,
          };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to update schedule";
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async deleteSchedule(scheduleId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await delete_schedule(scheduleId);

        if (response.data.success) {
          return {
            success: true,
            message: response.data.message || "Schedule deleted successfully",
          };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to delete schedule";
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async view_schedule(scheduleId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await view_schedule(scheduleId);

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
  },
});
