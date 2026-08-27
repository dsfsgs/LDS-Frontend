// stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "boot/axios";

const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "authUser";
const STORAGE_PERMISSIONS_KEY = "authPermissions";

export const useAuthStore = defineStore("auth", () => {
  // ---------------------------------------------------------------------
  // State - Store token in localStorage
  // ---------------------------------------------------------------------
  const token = ref(localStorage.getItem(STORAGE_TOKEN_KEY) || null);
  const user = ref(readStoredUser());
  const permissions = ref(readStoredPermissions());
  const isLoading = ref(false);
  const error = ref(null);
  const isInitialized = ref(false);

  // ---------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------
  const isAuthenticated = computed(() => {
    return !!token.value;
  });

  const fullName = computed(() => user.value?.name || "");
  const email = computed(() => user.value?.email || "");
  const office = computed(() => user.value?.office || "No Office Assigned");
  const roles = computed(() => user.value?.roles || []);

  const hasRole = (role) => roles.value.includes(role);
  const hasPermission = (permission) => permissions.value.includes(permission);

  // ---------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------
  async function login(credentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await api.post("/user/login", credentials);

      if (!data.success) {
        error.value = data.message || "Invalid username or password.";
        return { success: false, message: error.value };
      }

      // Store token in localStorage
      const authToken = data.data.token;
      token.value = authToken;
      localStorage.setItem(STORAGE_TOKEN_KEY, authToken);

      // Store user data in localStorage
      const userData = data.data.user;
      setUserData(userData);

      user.value = userData;
      permissions.value = userData.permissions || [];
      isInitialized.value = true;

      return { success: true, message: data.message };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        "Unable to reach the server. Please try again.";
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch {
      // Ignore logout errors
    } finally {
      // Clear everything
      token.value = null;
      user.value = null;
      permissions.value = null;
      isInitialized.value = false;

      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_PERMISSIONS_KEY);
    }
  }

  function clearError() {
    error.value = null;
  }

  function setUserData(userData) {
    const safeUserData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      office: userData.office || "No Office Assigned",
      username: userData.username || "",
      control_no: userData.control_no || "",
      roles: userData.roles || [],
    };

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUserData));
    localStorage.setItem(
      STORAGE_PERMISSIONS_KEY,
      JSON.stringify(userData.permissions || [])
    );
  }

  function hasStoredUserData() {
    return !!localStorage.getItem(STORAGE_USER_KEY);
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  function readStoredUser() {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function readStoredPermissions() {
    try {
      const raw = localStorage.getItem(STORAGE_PERMISSIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function initialize() {
    if (hasStoredUserData()) {
      user.value = readStoredUser();
      permissions.value = readStoredPermissions();
      isInitialized.value = true;
    }
  }

  // Initialize on store creation
  initialize();

  return {
    // state
    token,
    user,
    permissions,
    isLoading,
    error,
    isInitialized,

    // getters
    isAuthenticated,
    fullName,
    email,
    office,
    roles,
    hasRole,
    hasPermission,
    hasStoredUserData,

    // actions
    login,
    logout,
    clearError,
  };
});
