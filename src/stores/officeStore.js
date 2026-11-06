// src\stores\officeStore.js

import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useOfficeStore = defineStore("office", {
  state: () => ({
    offices: [],
    employees: [],
    employeePagination: { currentPage: 1, perPage: 10, total: 0, lastPage: 1 },
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

     async fetchEmployeesByOffice(office, params = {}) {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.get(
        `/office/employee/${encodeURIComponent(office)}`,
        { params }
      );

      if (response.data.success) {
        const paginated = response.data.data;

        // paginate() => { data: [...], current_page, per_page, total, last_page }
        this.employees = Array.isArray(paginated) ? paginated : paginated?.data || [];
        this.employeePagination = {
          currentPage: paginated?.current_page ?? 1,
          perPage: Number(paginated?.per_page ?? 10),
          total: paginated?.total ?? this.employees.length,
          lastPage: paginated?.last_page ?? 1,
        };
      } else {
        this.error = response.data.message;
      }
    } catch (err) {
      this.employees = [];
      this.employeePagination = { currentPage: 1, perPage: 10, total: 0, lastPage: 1 };

      if (err.response?.status === 404) {
        this.error = err.response.data?.message || "No employees found for this office";
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
    this.employeePagination = { currentPage: 1, perPage: 10, total: 0, lastPage: 1 };
  },
    // Clear error
    clearError() {
      this.error = null;
    },
  },
});
