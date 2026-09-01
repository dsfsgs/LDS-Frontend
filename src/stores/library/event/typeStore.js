import { defineStore } from "pinia";
import { ref } from "vue";
import {
  type_name,
  create_type,
  update_type,
  delete_type,
} from "src/service/library/event/typeService";

export const useTypeStore = defineStore("type", () => {
  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  const Types = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  function clearError() {
    error.value = null;
  }

  async function fetchTypes(search = "") {
    loading.value = true;
    error.value = null;

    try {
      const response = await type_name(search);

      console.log("fetchTypes response:", response.data);

      Types.value = response.data.data || [];
    } catch (err) {
      console.log("fetchTypes error:", err);
      error.value = err.response?.data?.message || "Failed to load types.";
    } finally {
      loading.value = false;
    }
  }

  async function createType(payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await create_type(payload);

      console.log("createType response:", response.data);

      await fetchTypes();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("createType error:", err);
      error.value = err.response?.data?.message || "Failed to create type.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateType(typeId, payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await update_type(typeId, payload);

      console.log("updateType response:", response.data);

      await fetchTypes();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("updateType error:", err);
      error.value = err.response?.data?.message || "Failed to update type.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteType(typeId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await delete_type(typeId);

      console.log("deleteType response:", response.data);

      Types.value = Types.value.filter((t) => t.typeId !== typeId);

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("deleteType error:", err);
      error.value = err.response?.data?.message || "Failed to delete type.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  return {
    Types,
    loading,
    error,
    clearError,
    fetchTypes,
    createType,
    updateType,
    deleteType,
  };
});
