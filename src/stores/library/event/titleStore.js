import { defineStore } from "pinia";
import { ref } from "vue";
import {
  title_name,
  create_title,
  update_title,
  delete_title,
} from "src/service/library/event/titleService";

export const useTitleStore = defineStore("title", () => {
  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  const Titles = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  function clearError() {
    error.value = null;
  }

  async function fetchTitles() {
    loading.value = true;
    error.value = null;

    try {
      const response = await title_name();

      console.log("fetchTitles response:", response.data);

      Titles.value = response.data.data || [];
    } catch (err) {
      console.log("fetchTitles error:", err);
      error.value = err.response?.data?.message || "Failed to load titles.";
    } finally {
      loading.value = false;
    }
  }

  async function createTitle(payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await create_title(payload);

      console.log("createTitle response:", response.data);

      await fetchTitles();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("createTitle error:", err);
      error.value = err.response?.data?.message || "Failed to create title.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateTitle(titleId, payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await update_title(titleId, payload);

      console.log("updateTitle response:", response.data);

      await fetchTitles();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("updateTitle error:", err);
      error.value = err.response?.data?.message || "Failed to update title.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteTitle(titleId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await delete_title(titleId);

      console.log("deleteTitle response:", response.data);

      Titles.value = Titles.value.filter((t) => t.titleId !== titleId);

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("deleteTitle error:", err);
      error.value = err.response?.data?.message || "Failed to delete title.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  return {
    Titles,
    loading,
    error,
    clearError,
    fetchTitles,
    createTitle,
    updateTitle,
    deleteTitle,
  };
});
