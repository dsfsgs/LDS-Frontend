import { api } from "src/boot/axios";

// GET all venues
export const venue_name = () => {
  return api.get(`venue`);
};

// CREATE venue
export const create_venue = (payload) => {
  return api.post(`venue/store`, payload);
};

// UPDATE venue
export const update_venue = (venueId, payload) => {
  return api.put(`venue/update/${venueId}`, payload);
};

// DELETE venue
export const delete_venue = (venueId) => {
  return api.delete(`venue/delete/${venueId}`);
};