import { api } from "src/boot/axios";



export const bpm_list = (params = {}) => {
  return api.get(`office/bpm/list`, { params });
};

export const bpm_store = (payload) => {
  return api.post(`/office/bpm/store`, payload);
};

export const bpm_employee = () => {
  return api.get(`office/employee`);
};


export const bpm_view = (bpmDateId) => {
  return api.get(`/office/bpm/view/${bpmDateId}`);
};

export const bpm_delete = (bpmDateId) => {
  return api.delete(`/office/bpm/delete/${bpmDateId}`);
};


export const bpm_edit = (bpmDateId,payload) => {
  return api.post(`/office/bpm/edit/${bpmDateId}`, payload);
};