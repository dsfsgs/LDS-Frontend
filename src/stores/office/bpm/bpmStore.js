import { defineStore } from "pinia";
import {
  bpm_delete,
  bpm_edit,
  bpm_employee,
  bpm_list,
  bpm_store,
  bpm_view,
} from "src/service/office/bpm/bpmService";

export const useBpmStore = defineStore("bpm", {
  state: () => ({
    loading: false,
    error: null,

    bpmList: [],
    employee: [],
    pagination: { currentPage: 1, perPage: 10, total: 0, lastPage: 1 },
  }),

  actions: {
    async fetchBpmList(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await bpm_list(params);
        const paginated = response.data.data;

        // paginate() => { data: [...], current_page, total, ... }
        this.bpmList = Array.isArray(paginated)
          ? paginated
          : paginated?.data || [];
        this.pagination = {
          currentPage: paginated?.current_page ?? 1,
          perPage: Number(paginated?.per_page ?? 10),
          total: paginated?.total ?? this.bpmList.length,
          lastPage: paginated?.last_page ?? 1,
        };
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load BPM list.";
        this.bpmList = [];
        this.pagination = {
          currentPage: 1,
          perPage: 10,
          total: 0,
          lastPage: 1,
        };
      } finally {
        this.loading = false;
      }
    },

    // Para sa duplicate check (hindi ginagalaw ang bpmList)
    async existsBpm(year, month, week) {
      const response = await bpm_list({ year, month, week, per_page: 1 });
      const paginated = response.data.data;
      return (paginated?.total ?? paginated?.length ?? 0) > 0;
    },

    async fetchEmployee() {
      this.loading = true;
      this.error = null;
      try {
        const response = await bpm_employee();
        this.employee = response.data.data || response.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load employees.";
        this.employee = [];
      } finally {
        this.loading = false;
      }
    },

    async storeBpm(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await bpm_store(payload);
        return {
          success: true,
          message: response.data.message || "Employee Bpm successfully",
          data: response.data.data,
        };
      } catch (err) {
        const message = err.response?.data?.message || "Failed employee bpm";
        this.error = message;
        return { success: false, message, errors: err.response?.data?.errors };
      } finally {
        this.loading = false;
      }
    },

    async viewBpm(bpmDateId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await bpm_view(bpmDateId);
        const data = response.data.data || null;

        return {
          success: !!data,
          message: data ? "" : "BPM record not found.",
          data,
        };
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load BPM record.";
        this.error = message;
        return { success: false, message, data: null };
      } finally {
        this.loading = false;
      }
    },

    async deleteBpm(bpmDateId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await bpm_delete(bpmDateId);
        if (response.data.success) {
          return { success: true, message: response.data.message };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to delete bpm";
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async editBpm(bpmDateId, payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await bpm_edit(bpmDateId, payload);
        return {
          success: true,
          message: response.data.message || "Employee Bpm successfully",
          data: response.data.data,
        };
      } catch (err) {
        const message = err.response?.data?.message || "Failed employee bpm";
        this.error = message;
        return { success: false, message, errors: err.response?.data?.errors };
      } finally {
        this.loading = false;
      }
    },
  },
});
