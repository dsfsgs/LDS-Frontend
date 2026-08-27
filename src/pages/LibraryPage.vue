<template>
  <q-page class="role-permission-page">
    <!-- =====================================================
         TABS
    ====================================================== -->
    <q-card flat class="main-card">
      <q-tabs
        v-model="activeTab"
        dense
        class="tab-header"
        active-class="tab-active"
      >
        <q-tab name="roles" label="Roles" class="tab-item" />
        <q-tab name="permissions" label="Permissions" class="tab-item" />
      </q-tabs>

      <q-separator />

      <!-- =====================================================
           ROLES TAB
    ====================================================== -->
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="roles" class="tab-panel">
          <!-- Roles Header -->
          <div class="tab-header-actions">
            <div>
              <h6>Roles</h6>
              <span class="subtitle"
                >Manage user roles and their permissions</span
              >
            </div>
            <q-btn
              unelevated
              no-caps
              icon="add"
              label="Add Role"
              class="add-btn"
              @click="openAddRole"
            />
          </div>

          <!-- Roles Table -->
          <div class="table-wrapper">
            <q-table
              flat
              :rows="store.roles"
              :columns="roleColumns"
              row-key="id"
              hide-pagination
              :rows-per-page-options="[0]"
              :loading="store.rolesLoading"
              class="data-table"
            >
              <!-- NAME -->
              <template #body-cell-name="props">
                <q-td :props="props">
                  <div class="name-cell">
                    <span class="name-text">{{ props.row.name }}</span>
                  </div>
                </q-td>
              </template>

              <!-- CREATED AT -->
              <template #body-cell-created_at="props">
                <q-td :props="props">
                  {{ formatDate(props.row.created_at) }}
                </q-td>
              </template>

              <!-- ACTIONS -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <div class="action-buttons">
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      class="action-edit"
                      @click="editRole(props.row)"
                    >
                      <q-tooltip> Edit Role </q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="delete"
                      class="action-delete"
                      @click="confirmDeleteRole(props.row)"
                    >
                      <q-tooltip> Delete Role </q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <!-- EMPTY STATE -->
              <template #no-data>
                <div class="table-empty">No roles found.</div>
              </template>
            </q-table>
          </div>

          <!-- Table Footer -->
          <div class="table-footer">
            <span>
              Showing <strong>{{ store.roles.length }}</strong> roles
            </span>
          </div>
        </q-tab-panel>

        <!-- =====================================================
             PERMISSIONS TAB
        ====================================================== -->
        <q-tab-panel name="permissions" class="tab-panel">
          <!-- Permissions Header -->
          <div class="tab-header-actions">
            <div>
              <h6>Permissions</h6>
              <span class="subtitle"
                >Manage individual permissions for access control</span
              >
            </div>
            <q-btn
              unelevated
              no-caps
              icon="add"
              label="Add Permission"
              class="add-btn"
              @click="openAddPermission"
            />
          </div>

          <!-- Permissions Table -->
          <div class="table-wrapper">
            <q-table
              flat
              :rows="store.permissions"
              :columns="permissionColumns"
              row-key="id"
              hide-pagination
              :rows-per-page-options="[0]"
              :loading="store.permissionsLoading"
              class="data-table"
            >
              <!-- NAME -->
              <template #body-cell-name="props">
                <q-td :props="props">
                  <div class="name-cell">
                    <span class="name-text">{{ props.row.name }}</span>
                  </div>
                </q-td>
              </template>

              <!-- CREATED AT -->
              <template #body-cell-created_at="props">
                <q-td :props="props">
                  {{ formatDate(props.row.created_at) }}
                </q-td>
              </template>

              <!-- ACTIONS -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <div class="action-buttons">
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      class="action-edit"
                      @click="editPermission(props.row)"
                    >
                      <q-tooltip> Edit Permission </q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="delete"
                      class="action-delete"
                      @click="confirmDeletePermission(props.row)"
                    >
                      <q-tooltip> Delete Permission </q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <!-- EMPTY STATE -->
              <template #no-data>
                <div class="table-empty">No permissions found.</div>
              </template>
            </q-table>
          </div>

          <!-- Table Footer -->
          <div class="table-footer">
            <span>
              Showing
              <strong>{{ store.permissions.length }}</strong> permissions
            </span>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- =====================================================
         ADD/EDIT ROLE DIALOG
    ====================================================== -->
    <q-dialog v-model="showRoleDialog">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-title">
              {{ editingRole ? "Edit Role" : "Add New Role" }}
            </div>
            <div class="dialog-subtitle">
              {{
                editingRole ? "Update role name." : "Create a new system role."
              }}
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <q-banner
            v-if="store.rolesError"
            dense
            rounded
            class="bg-red-2 text-red-9 q-mb-md"
          >
            {{ store.rolesError }}
          </q-banner>

          <q-input
            v-model="roleForm.name"
            outlined
            dense
            label="Role Name"
            hint="e.g. Admin, Supervisor, User"
          />
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />
          <q-btn
            unelevated
            no-caps
            :label="editingRole ? 'Save Changes' : 'Create Role'"
            class="save-btn"
            :loading="store.rolesLoading"
            @click="saveRole"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =====================================================
         ADD/EDIT PERMISSION DIALOG
    ====================================================== -->
    <q-dialog v-model="showPermissionDialog">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-title">
              {{ editingPermission ? "Edit Permission" : "Add New Permission" }}
            </div>
            <div class="dialog-subtitle">
              {{
                editingPermission
                  ? "Update permission name."
                  : "Create a new system permission."
              }}
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <q-banner
            v-if="store.permissionsError"
            dense
            rounded
            class="bg-red-2 text-red-9 q-mb-md"
          >
            {{ store.permissionsError }}
          </q-banner>

          <q-input
            v-model="permissionForm.name"
            outlined
            dense
            label="Permission Name"
            hint="e.g. view_reports, manage_users, delete_data"
          />
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />
          <q-btn
            unelevated
            no-caps
            :label="editingPermission ? 'Save Changes' : 'Create Permission'"
            class="save-btn"
            :loading="store.permissionsLoading"
            @click="savePermission"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =====================================================
         DELETE CONFIRMATION DIALOG
    ====================================================== -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="delete-dialog">
        <q-card-section class="dialog-body">
          <div class="delete-title">Delete {{ deleteType }}</div>
          <div class="delete-message">
            Are you sure you want to delete
            <strong>{{ itemToDelete?.name }}</strong
            >? This action cannot be undone.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />
          <q-btn
            unelevated
            no-caps
            label="Delete"
            class="delete-btn"
            :loading="store.rolesLoading || store.permissionsLoading"
            @click="deleteItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRolePermissionStore } from "stores/rolePermissionStore";

export default defineComponent({
  name: "RolePermissionPage",

  setup() {
    const $q = useQuasar();
    const store = useRolePermissionStore();

    const activeTab = ref("roles");

    // Role states
    const showRoleDialog = ref(false);
    const editingRole = ref(null);
    const roleForm = ref({ name: "" });

    // Permission states
    const showPermissionDialog = ref(false);
    const editingPermission = ref(null);
    const permissionForm = ref({ name: "" });

    // Delete states
    const showDeleteDialog = ref(false);
    const itemToDelete = ref(null);
    const deleteType = ref("");

    // Role columns
    const roleColumns = [
      { name: "name", label: "ROLE NAME", field: "name", align: "left" },
      {
        name: "guard_name",
        label: "GUARD",
        field: "guard_name",
        align: "left",
      },
      {
        name: "created_at",
        label: "CREATED AT",
        field: "created_at",
        align: "left",
      },
      { name: "actions", label: "", field: "actions", align: "right" },
    ];

    // Permission columns
    const permissionColumns = [
      { name: "name", label: "PERMISSION NAME", field: "name", align: "left" },
      {
        name: "guard_name",
        label: "GUARD",
        field: "guard_name",
        align: "left",
      },
      {
        name: "created_at",
        label: "CREATED AT",
        field: "created_at",
        align: "left",
      },
      { name: "actions", label: "", field: "actions", align: "right" },
    ];

    // Utility functions
    function formatDate(dateString) {
      if (!dateString) return "—";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function notify(type, message) {
      $q.notify({
        type: type === "success" ? "positive" : "negative",
        message,
        position: "top",
      });
    }

    // ============ ROLE FUNCTIONS ============

    function openAddRole() {
      editingRole.value = null;
      roleForm.value = { name: "" };
      store.rolesError = null;
      showRoleDialog.value = true;
    }

    function editRole(role) {
      editingRole.value = role;
      roleForm.value = { name: role.name };
      store.rolesError = null;
      showRoleDialog.value = true;
    }

    async function saveRole() {
      if (!roleForm.value.name.trim()) {
        notify("error", "Role name is required");
        return;
      }

      store.clearErrors();
      let result;

      if (editingRole.value) {
        result = await store.updateRole(editingRole.value.id, {
          name: roleForm.value.name,
        });
      } else {
        result = await store.createRole({
          name: roleForm.value.name,
        });
      }

      if (result.success) {
        showRoleDialog.value = false;
        notify("success", result.message || "Role saved successfully.");
      } else {
        notify("error", result.message || "Failed to save role.");
      }
    }

    // ============ PERMISSION FUNCTIONS ============

    function openAddPermission() {
      editingPermission.value = null;
      permissionForm.value = { name: "" };
      store.permissionsError = null;
      showPermissionDialog.value = true;
    }

    function editPermission(permission) {
      editingPermission.value = permission;
      permissionForm.value = { name: permission.name };
      store.permissionsError = null;
      showPermissionDialog.value = true;
    }

    async function savePermission() {
      if (!permissionForm.value.name.trim()) {
        notify("error", "Permission name is required");
        return;
      }

      store.clearErrors();
      let result;

      if (editingPermission.value) {
        result = await store.updatePermission(editingPermission.value.id, {
          name: permissionForm.value.name,
        });
      } else {
        result = await store.createPermission({
          name: permissionForm.value.name,
        });
      }

      if (result.success) {
        showPermissionDialog.value = false;
        notify("success", result.message || "Permission saved successfully.");
      } else {
        notify("error", result.message || "Failed to save permission.");
      }
    }

    // ============ DELETE FUNCTIONS ============

    function confirmDeleteRole(role) {
      itemToDelete.value = role;
      deleteType.value = "Role";
      showDeleteDialog.value = true;
    }

    function confirmDeletePermission(permission) {
      itemToDelete.value = permission;
      deleteType.value = "Permission";
      showDeleteDialog.value = true;
    }

    async function deleteItem() {
      if (!itemToDelete.value) return;

      let result;
      if (deleteType.value === "Role") {
        result = await store.deleteRole(itemToDelete.value.id);
      } else {
        result = await store.deletePermission(itemToDelete.value.id);
      }

      if (result.success) {
        showDeleteDialog.value = false;
        notify(
          "success",
          result.message || `${deleteType.value} deleted successfully.`
        );
      } else {
        notify(
          "error",
          result.message ||
            `Failed to delete ${deleteType.value.toLowerCase()}.`
        );
      }
    }

    // Lifecycle
    onMounted(() => {
      store.fetchRoles();
      store.fetchPermissions();
    });

    return {
      store,
      activeTab,
      roleColumns,
      permissionColumns,
      showRoleDialog,
      editingRole,
      roleForm,
      showPermissionDialog,
      editingPermission,
      permissionForm,
      showDeleteDialog,
      itemToDelete,
      deleteType,
      formatDate,
      openAddRole,
      editRole,
      saveRole,
      openAddPermission,
      editPermission,
      savePermission,
      confirmDeleteRole,
      confirmDeletePermission,
      deleteItem,
    };
  },
});
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */
.role-permission-page {
  min-height: 100%;
  padding: 20px;
  background: #f8f9fa;
  color: #19354a;
}

/* =========================================================
   PAGE HEADER
========================================================= */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.page-header h5 {
  margin: 5px 0 3px;
  color: #19354a;
  font-size: 18px;
  font-weight: 750;
}

.page-header p {
  margin: 0;
  color: #718089;
  font-size: 12px;
}

/* =========================================================
   MAIN CARD
========================================================= */
.main-card {
  overflow: hidden;
  border-radius: 13px;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(30, 70, 42, 0.055);
}

/* =========================================================
   TABS
========================================================= */
.tab-header {
  min-height: 48px;
  padding: 0 20px;
  background: #fafbfa;
}

.tab-item {
  font-size: 12px;
  font-weight: 600;
  color: #718089;
  text-transform: none;
}

.tab-active {
  color: #0ca344 !important;
}

/* =========================================================
   TAB PANEL
========================================================= */
.tab-panel {
  padding: 20px;
}

.tab-header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.tab-header-actions h6 {
  margin: 0;
  color: #19354a;
  font-size: 15px;
  font-weight: 700;
}

.tab-header-actions .subtitle {
  display: block;
  margin-top: 2px;
  color: #8a989e;
  font-size: 11px;
}

.add-btn {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, #18b64d, #0ca344);
  font-size: 11px;
  font-weight: 650;
  box-shadow: 0 4px 10px rgba(16, 167, 70, 0.18);
}

/* =========================================================
   TABLE
========================================================= */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  box-shadow: none;
}

.data-table :deep(th) {
  height: 44px;
  color: #819097;
  background: #fafbfa;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.data-table :deep(td) {
  height: 60px;
  color: #425b68;
  border-color: #edf1ef;
  font-size: 11px;
}

.data-table :deep(tbody tr:hover) {
  background: #fafffb;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.name-text {
  font-weight: 500;
}

.guard-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
}

.table-empty {
  padding: 30px 0;
  text-align: center;
  color: #8a989e;
  font-size: 12px;
}

/* =========================================================
   ACTIONS
========================================================= */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

.action-edit {
  color: #16a84a;
}

.action-delete {
  color: #d35d5d;
}

/* =========================================================
   TABLE FOOTER
========================================================= */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 0;
  border-top: 1px solid #edf1ef;
  color: #87949a;
  font-size: 10px;
}

.table-footer strong {
  color: #405967;
}

/* =========================================================
   DIALOGS
========================================================= */
.dialog-card {
  width: 500px;
  max-width: 92vw;
  border-radius: 14px;
}

.delete-dialog {
  width: 420px;
  max-width: 92vw;
  border-radius: 14px;
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
}

.dialog-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 9px;
  border-radius: 9px;
  color: #087c42;
  background: #e5f8ea;
}

.dialog-title {
  color: #19354a;
  font-size: 17px;
  font-weight: 750;
}

.dialog-subtitle {
  margin-top: 3px;
  color: #839097;
  font-size: 10px;
}

.dialog-body {
  padding: 20px;
}

.dialog-actions {
  padding: 13px 20px;
  background: #fcfdfc;
}

.cancel-btn {
  color: #718089;
  font-size: 11px;
}

.save-btn {
  min-height: 37px;
  padding: 0 16px;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, #18b64d, #0ca344);
  font-size: 11px;
}

.delete-btn {
  min-height: 37px;
  padding: 0 16px;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, #e05353, #c73f3f);
  font-size: 11px;
}

.delete-title {
  color: #19354a;
  font-size: 15px;
  font-weight: 750;
}

.delete-message {
  margin-top: 8px;
  color: #5c6b73;
  font-size: 12px;
  line-height: 1.5;
}

/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 650px) {
  .role-permission-page {
    padding: 14px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .tab-header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .data-table {
    min-width: 600px;
  }
}
</style>
