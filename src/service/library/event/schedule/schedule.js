import { api } from "src/boot/axios";

// add schedule
export const add_schedule = (eventId, scheduleData) => {
  return api.post(`event/schedule/store`, {
    event_id: eventId,
    ...scheduleData,
  });
};

// delete schedule
export const delete_schedule = (scheduleId) => {
  return api.delete(`event/schedule/delete/${scheduleId}`);
};


// view schedule
export const view_schedule = (scheduleId) => {
  return api.get(`event/schedule/view/${scheduleId}`);
};


// edit schedule
export const edit_schedule = (scheduleId, scheduleData) => {
  return api.put(`event/schedule/edit/${scheduleId}`, {
   
    ...scheduleData,
  });
};


