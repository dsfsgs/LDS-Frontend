import { api } from "src/boot/axios";

export const suggested_employees = (office, titleName) => {
  return api.get(
    `hr/employee/list/suggested/training/${encodeURIComponent(office)}`,{
        params: { title: titleName },
    }
    
  );
};