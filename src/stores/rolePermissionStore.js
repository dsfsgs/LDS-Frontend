import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useRolePermissionStore = defineStore("rolePermission", {
  state: () => ({
    // Role states
    roles: [],
    selectedRole: null,
    rolesLoading: false,
    rolesError: null,

    // Permission states
    permissions: [],
    selectedPermission: null,
    permissionsLoading: false,
    permissionsError: null,

    // Form states
    roleForm: { name: "" },
    permissionForm: { name: "" },
  }),

  actions: {
    // ============ ROLE ACTIONS ============

    async fetchRoles() {
      this.rolesLoading = true;
      this.rolesError = null;

      try {
        const response = await api.get("/role/index");
        if (response.data.success) {
          this.roles = response.data.data;
        } else {
          this.rolesError = response.data.message;
        }
      } catch (err) {
        this.rolesError = "Failed to fetch roles";
        console.error("Error fetching roles:", err);
      } finally {
        this.rolesLoading = false;
      }
    },

    async createRole(roleData) {
      this.rolesLoading = true;
      this.rolesError = null;

      try {
        const response = await api.post("/role/store", roleData);
        if (response.data.success) {
          await this.fetchRoles();
          return { success: true, message: response.data.message };
        } else {
          this.rolesError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to create role";
        this.rolesError = message;
        return { success: false, message };
      } finally {
        this.rolesLoading = false;
      }
    },

    async fetchRoleById(roleId) {
      this.rolesLoading = true;
      this.rolesError = null;

      try {
        const response = await api.get(`/role/show/${roleId}`);
        if (response.data.success) {
          this.selectedRole = response.data.data;
          return { success: true, data: response.data.data };
        } else {
          this.rolesError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to fetch role";
        this.rolesError = message;
        return { success: false, message };
      } finally {
        this.rolesLoading = false;
      }
    },

    async updateRole(roleId, roleData) {
      this.rolesLoading = true;
      this.rolesError = null;

      try {
        const response = await api.put(`/role/update/${roleId}`, roleData);
        if (response.data.success) {
          await this.fetchRoles();
          return { success: true, message: "Role updated successfully" };
        } else {
          this.rolesError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to update role";
        this.rolesError = message;
        return { success: false, message };
      } finally {
        this.rolesLoading = false;
      }
    },

    async deleteRole(roleId) {
      this.rolesLoading = true;
      this.rolesError = null;

      try {
        const response = await api.delete(`/role/destroy/${roleId}`);
        if (response.data.success) {
          this.roles = this.roles.filter((role) => role.id !== roleId);
          return { success: true, message: response.data.message };
        } else {
          this.rolesError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to delete role";
        this.rolesError = message;
        return { success: false, message };
      } finally {
        this.rolesLoading = false;
      }
    },

    // ============ PERMISSION ACTIONS ============

    async fetchPermissions() {
      this.permissionsLoading = true;
      this.permissionsError = null;

      try {
        const response = await api.get("/permission/index");
        if (response.data.success) {
          this.permissions = response.data.data;
        } else {
          this.permissionsError = response.data.message;
        }
      } catch (err) {
        this.permissionsError = "Failed to fetch permissions";
        console.error("Error fetching permissions:", err);
      } finally {
        this.permissionsLoading = false;
      }
    },

    async createPermission(permissionData) {
      this.permissionsLoading = true;
      this.permissionsError = null;

      try {
        const response = await api.post("/permission/store", permissionData);
        if (response.data.success) {
          await this.fetchPermissions();
          return { success: true, message: response.data.message };
        } else {
          this.permissionsError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to create permission";
        this.permissionsError = message;
        return { success: false, message };
      } finally {
        this.permissionsLoading = false;
      }
    },

    async updatePermission(permissionId, permissionData) {
      this.permissionsLoading = true;
      this.permissionsError = null;

      try {
        const response = await api.put(
          `/permission/update/${permissionId}`,
          permissionData
        );
        if (response.data.success) {
          await this.fetchPermissions();
          return { success: true, message: "Permission updated successfully" };
        } else {
          this.permissionsError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to update permission";
        this.permissionsError = message;
        return { success: false, message };
      } finally {
        this.permissionsLoading = false;
      }
    },

    async deletePermission(permissionId) {
      this.permissionsLoading = true;
      this.permissionsError = null;

      try {
        const response = await api.delete(
          `/permission/destroy/${permissionId}`
        );
        if (response.data.success) {
          this.permissions = this.permissions.filter(
            (perm) => perm.id !== permissionId
          );
          return { success: true, message: response.data.message };
        } else {
          this.permissionsError = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to delete permission";
        this.permissionsError = message;
        return { success: false, message };
      } finally {
        this.permissionsLoading = false;
      }
    },

    // ============ UTILITY ACTIONS ============

    clearErrors() {
      this.rolesError = null;
      this.permissionsError = null;
    },

    resetRoleForm() {
      this.roleForm = { name: "" };
    },

    resetPermissionForm() {
      this.permissionForm = { name: "" };
    },
  },
});
