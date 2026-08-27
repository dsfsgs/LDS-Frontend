import { api } from "src/boot/axios";

// GET all modes
export const mode_name = () => {
  return api.get(`mode/index`);
};

// CREATE mode
export const create_mode = (payload) => {
  return api.post(`mode/store`, payload);
};

// UPDATE mode
export const update_mode = (modeId, payload) => {
  return api.put(`mode/update/${modeId}`, payload);
};

// DELETE mode
export const delete_mode = (modeId) => {
  return api.delete(`mode/delete/${modeId}`);
};