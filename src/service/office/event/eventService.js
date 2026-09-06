import { api } from "src/boot/axios";

// event list for office
export const office_event_list = () => {
  return api.get(`office/event/list-of-event`);
};

// view event 
export const office_event_view = (scheduleId) => {
  return api.get(`office/event/view-event/${scheduleId}`);
};

