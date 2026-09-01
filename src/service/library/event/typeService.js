import { api } from "src/boot/axios";

// GET all types
export const type_name = (search = "") => {
  return api.get("type", {
    params: { search },
  });
};
// CREATE type
export const create_type = (payload) => {
  return api.post(`type/store`, payload);
};

// UPDATE type
export const update_type = (typeId, payload) => {
  return api.put(`type/update/${typeId}`, payload);
};

// DELETE type
export const delete_type = (typeId) => {
  return api.delete(`type/delete/${typeId}`);
};

