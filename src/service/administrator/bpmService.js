import { api } from "src/boot/axios";

export const bpm_list_submitted = (params = {}) => {
  return api.get(`hr/bpm/submitted`, { params });
};

export const bpm_view_submitted = (bpmDateId) => {
  return api.get(`/hr/bpm/view/${bpmDateId}`);
};