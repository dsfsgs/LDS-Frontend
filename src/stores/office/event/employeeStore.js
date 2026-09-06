import { defineStore } from "pinia";

import {
  office_employee_list_nomation,
  office_employee_nominate,
  office_employee_remove_nominated_event,
  office_list_of_employee_nominated,
  office_employee_reason
} from "src/service/office/event/employeeService";

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    loading: false,
    error: null,
    employees: [],
    nominatedEmployee: [],
  }),

  actions: {
    async fetchEmployeeListNomination(titleName) {
      this.loading = true;
      this.error = null;
      try {
        const response = await office_employee_list_nomation(titleName);
        this.employees = response.data.data || response.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load employees.";
        this.employees = [];
      } finally {
        this.loading = false;
      }
    },

    async storeNominateEmployee(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await office_employee_nominate(payload);
        return {
          success: true,
          message: response.data.message || "Employees nominated successfully",
          data: response.data.data,
        };
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to nominate employees.";
        this.error = message;
        return { success: false, message, errors: err.response?.data?.errors };
      } finally {
        this.loading = false;
      }
    },

    async fetchEmployeeListNominated(scheduleId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await office_list_of_employee_nominated(scheduleId);
        this.nominatedEmployee = response.data.data || response.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load employees.";
        this.nominatedEmployee = [];
      } finally {
        this.loading = false;
      }
    },
    async deleteEmployeeNominated(nominatedEmployeeId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await office_employee_remove_nominated_event(
          nominatedEmployeeId
        );
        return {
          success: true,
          message:
            response.data.message || "Employee nomination deleted successfully",
        };
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to delete nominated employee";
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

        async editEmployeeReason(nominatedEmployeeId, payload) {
        this.loading = true;
        this.error = null;

        try {
          const response = await office_employee_reason(nominatedEmployeeId, payload);
          return {
            success: true,
            message: response.data.message || "Reason updated successfully",
          };
        } catch (err) {
          const message = err.response?.data?.message || "Failed to update Reason";
          this.error = message;
          return { success: false, message };
        } finally {
          this.loading = false;
        }
      },
  },
});
