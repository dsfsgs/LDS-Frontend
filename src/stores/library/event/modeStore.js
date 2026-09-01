import { defineStore } from "pinia";
import { ref } from "vue";
import {
  mode_name,
  create_mode,
  update_mode,
  delete_mode,
} from "src/service/library/event/modeService";

export const useModeStore = defineStore("mode", () => {
  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  const modes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  function clearError() {
    error.value = null;
  }

  async function fetchModes(search = "") {
    loading.value = true;
    error.value = null;

    try {
      const response = await mode_name(search);

      console.log("fetchmodes response:", response.data);

      modes.value = response.data.data || [];
    } catch (err) {
      console.log("fetchmodes error:", err);
      error.value = err.response?.data?.message || "Failed to load modes.";
    } finally {
      loading.value = false;
    }
  }

  async function createMode(payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await create_mode(payload);

      console.log("create Mode response:", response.data);

      await fetchModes();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("createmode error:", err);
      error.value = err.response?.data?.message || "Failed to create mode.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateMode(modeId, payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await update_mode(modeId, payload);

      console.log("update mode response:", response.data);

      await fetchModes();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("update mode error:", err);
      error.value = err.response?.data?.message || "Failed to update mode.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteMode(modeId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await delete_mode(modeId);

      console.log("delete mode response:", response.data);

      modes.value = modes.value.filter((t) => t.modeId !== modeId);

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("delete mode error:", err);
      error.value = err.response?.data?.message || "Failed to delete mode.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  return {
    modes,
    loading,
    error,
    clearError,
    fetchModes,
    createMode,
    updateMode,
    deleteMode,
  };
});
