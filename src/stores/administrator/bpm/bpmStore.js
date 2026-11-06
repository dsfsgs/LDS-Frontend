import { defineStore } from "pinia";
import { bpm_list_submitted, bpm_view_submitted } from "src/service/administrator/bpmService";

export const useBpmSubmittedStore = defineStore("bpmSubmitted", {
  state: () => ({
    loading: false,
    error: null,
    bpmListSubmitted: [],
    pagination: { currentPage: 1, perPage: 10, total: 0, lastPage: 1 },

  }),

  actions: {
  async fetchBpmSubmitted(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const response = await bpm_list_submitted(params);
      const paginated = response.data.data;

      // paginate() => { data: [...], current_page, total, ... }
      this.bpmListSubmitted = Array.isArray(paginated) ? paginated : paginated?.data || [];
      this.pagination = {
        currentPage: paginated?.current_page ?? 1,
        perPage: Number(paginated?.per_page ?? 10),
        total: paginated?.total ?? this.bpmListSubmitted.length,
        lastPage: paginated?.last_page ?? 1,
      };
    } catch (err) {
      this.error = err.response?.data?.message || "Failed to load BPM list.";
      this.bpmListSubmitted = [];
      this.pagination = { currentPage: 1, perPage: 10, total: 0, lastPage: 1 };
    } finally {
      this.loading = false;
    }
  },

  // Para sa duplicate check (hindi ginagalaw ang bpmList)
  async existsBpm(year, month, week) {
    const response = await bpm_list_submitted({ year, month, week, per_page: 1 });
    const paginated = response.data.data;
    return (paginated?.total ?? paginated?.length ?? 0) > 0;
  },

   async viewBpm(bpmDateId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await bpm_view_submitted(bpmDateId);
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
  },
});
