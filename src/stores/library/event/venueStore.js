import { defineStore } from "pinia";
import { ref } from "vue";
import {
  venue_name,
  create_venue,
  update_venue,
  delete_venue,
} from "src/service/library/event/venueService";

export const useVenueStore = defineStore("venue", () => {
  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  const Venues = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  function clearError() {
    error.value = null;
  }

  async function fetchVenues() {
    loading.value = true;
    error.value = null;

    try {
      const response = await venue_name();

      console.log("fetchVenues response:", response.data);

      Venues.value = response.data.data || [];
    } catch (err) {
      console.log("fetchVenues error:", err);
      error.value = err.response?.data?.message || "Failed to load venues.";
    } finally {
      loading.value = false;
    }
  }

  async function createVenue(payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await create_venue(payload);

      console.log("createVenue response:", response.data);

      await fetchVenues();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("createVenue error:", err);
      error.value = err.response?.data?.message || "Failed to create venue.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateVenue(venueId, payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await update_venue(venueId, payload);

      console.log("updateVenue response:", response.data);

      await fetchVenues();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("updateVenue error:", err);
      error.value = err.response?.data?.message || "Failed to update venue.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteVenue(venueId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await delete_venue(venueId);

      console.log("deleteVenue response:", response.data);

      Venues.value = Venues.value.filter((t) => t.venueId !== venueId);

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("deleteVenue error:", err);
      error.value = err.response?.data?.message || "Failed to delete venue.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  return {
    Venues,
    loading,
    error,
    clearError,
    fetchVenues,
    createVenue,
    updateVenue,
    deleteVenue,
  };
});
