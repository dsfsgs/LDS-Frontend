import { api } from "src/boot/axios";


// list of employee for nomination
export const office_employee_list_nomation = (titleName) => {
  return api.get(`office/employee/nomination-list`, {
    params: { training_name: titleName },
  });
};

// nominate employee
export const office_employee_nominate = (payload) => {
  return api.post(`/office/employee/store`, payload); // ✅ ipinasa na yung payload
};

// list of employee nominated by his office 
export const office_list_of_employee_nominated = (scheduleId) => {
  return api.get(`office/event/employee/nominate/${scheduleId}`);
};

//  remove the employee on the event his nominated
export const office_employee_remove_nominated_event = (nominatedEmployeeId) => {
  return api.delete(`office/employee/delete/${nominatedEmployeeId}`);
};

//  edit the employee reason
export const office_employee_reason = (nominatedEmployeeId,payload) => {
  return api.put(`office/employee/nominated-employee/${nominatedEmployeeId}/reason`, payload); //
};

