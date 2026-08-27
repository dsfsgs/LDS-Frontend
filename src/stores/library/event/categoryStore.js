import { defineStore } from "pinia";
import { ref } from "vue";
import {
  category_name,
  create_category,
  update_category,
  delete_category,
} from "src/service/library/event/categoryService";

export const useCategoryStore = defineStore("category", () => {
  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  const Categorys = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  function clearError() {
    error.value = null;
  }

  async function fetchCategorys() {
    loading.value = true;
    error.value = null;

    try {
      const response = await category_name();

      console.log("fetchCategorys response:", response.data);

      Categorys.value = response.data.data || [];
    } catch (err) {
      console.log("fetchCategorys error:", err);
      error.value = err.response?.data?.message || "Failed to load categorys.";
    } finally {
      loading.value = false;
    }
  }

  async function createCategory(payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await create_category(payload);

      console.log("createCategory response:", response.data);

      await fetchCategorys();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("createCategory error:", err);
      error.value = err.response?.data?.message || "Failed to create category.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateCategory(categoryId, payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await update_category(categoryId, payload);

      console.log("updateCategory response:", response.data);

      await fetchCategorys();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("updateCategory error:", err);
      error.value = err.response?.data?.message || "Failed to update category.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteCategory(categoryId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await delete_category(categoryId);

      console.log("deleteCategory response:", response.data);

      Categorys.value = Categorys.value.filter((t) => t.categoryId !== categoryId);

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("deleteCategory error:", err);
      error.value = err.response?.data?.message || "Failed to delete category.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  return {
    Categorys,
    loading,
    error,
    clearError,
    fetchCategorys,
    createCategory,
    updateCategory,
    deleteCategory,
  };
});
