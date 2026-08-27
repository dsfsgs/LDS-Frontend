// src\stores\officeStore.js

import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useOfficeStore = defineStore("office", {
  state: () => ({
    offices: [],
    employees: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOffices() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/office/index");

        if (response.data.success) {
          this.offices = response.data.data;
        } else {
          this.error = response.data.message;
        }
      } catch (err) {
        this.error = "Failed to fetch offices";
      } finally {
        this.loading = false;
      }
    },

    async fetchEmployeesByOffice(office) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(
          `/employee/show/${encodeURIComponent(office)}`
        );

        if (response.data.success) {
          this.employees = response.data.data;
        } else {
          this.error = response.data.message;
        }
      } catch (err) {
        if (err.response?.status === 404) {
          this.employees = [];
          this.error =
            err.response.data?.message || "No employees found for this office";
        } else {
          this.error = "Failed to fetch employees";
        }
      } finally {
        this.loading = false;
      }
    },

    // Clear employees data
    clearEmployees() {
      this.employees = [];
    },

    // Clear error
    clearError() {
      this.error = null;
    },
  },
});
