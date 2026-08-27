import { api } from "src/boot/axios";

// GET all titles
export const title_name = () => {
  return api.get(`title/index`);
};

// CREATE title
export const create_title = (payload) => {
  return api.post(`title/store`, payload);
};

// UPDATE title
export const update_title = (titleId, payload) => {
  return api.put(`title/update/${titleId}`, payload);
};

// DELETE title
export const delete_title = (titleId) => {
  return api.delete(`title/delete/${titleId}`);
};