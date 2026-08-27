import { api } from "src/boot/axios";

// GET all speakers
export const speaker_name = () => {
  return api.get(`speaker/index`);
};

// CREATE speaker
export const create_speaker = (payload) => {
  return api.post(`speaker/store`, payload);
};

// UPDATE speaker
export const update_speaker = (speakerId, payload) => {
  return api.put(`speaker/update/${speakerId}`, payload);
};

// DELETE speaker
export const delete_speaker = (speakerId) => {
  return api.delete(`speaker/delete/${speakerId}`);
};