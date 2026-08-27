import { defineStore } from "pinia";
import { ref } from "vue";
import {
  speaker_name,
  create_speaker,
  update_speaker,
  delete_speaker,
} from "src/service/library/event/speakerService";

export const useSpeakerStore = defineStore("speaker", () => {
  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  const Speakers = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  function clearError() {
    error.value = null;
  }

  async function fetchSpeakers() {
    loading.value = true;
    error.value = null;

    try {
      const response = await speaker_name();

      console.log("fetchSpeakers response:", response.data);

      Speakers.value = response.data.data || [];
    } catch (err) {
      console.log("fetchSpeakers error:", err);
      error.value = err.response?.data?.message || "Failed to load speakers.";
    } finally {
      loading.value = false;
    }
  }

  async function createSpeaker(payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await create_speaker(payload);

      console.log("createSpeaker response:", response.data);

      await fetchSpeakers();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("createSpeaker error:", err);
      error.value = err.response?.data?.message || "Failed to create speaker.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateSpeaker(speakerId, payload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await update_speaker(speakerId, payload);

      console.log("updateSpeaker response:", response.data);

      await fetchSpeakers();

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("updateSpeaker error:", err);
      error.value = err.response?.data?.message || "Failed to update speaker.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteSpeaker(speakerId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await delete_speaker(speakerId);

      console.log("deleteSpeaker response:", response.data);

      Speakers.value = Speakers.value.filter((t) => t.speakerId !== speakerId);

      return { success: true, message: response.data.message };
    } catch (err) {
      console.log("deleteSpeaker error:", err);
      error.value = err.response?.data?.message || "Failed to delete speaker.";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  return {
    Speakers,
    loading,
    error,
    clearError,
    fetchSpeakers,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
  };
});
