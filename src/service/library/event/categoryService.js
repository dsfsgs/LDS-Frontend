import { api } from "src/boot/axios";

// GET all categorys
export const category_name = () => {
  return api.get(`category/index`);
};

// CREATE category
export const create_category = (payload) => {
  return api.post(`category/store`, payload);
};

// UPDATE category
export const update_category = (categoryId, payload) => {
  return api.put(`category/update/${categoryId}`, payload);
};

// DELETE category
export const delete_category = (categoryId) => {
  return api.delete(`category/delete/${categoryId}`);
};