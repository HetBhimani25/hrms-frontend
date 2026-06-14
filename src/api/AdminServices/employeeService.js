import api from "../axios";

const BASE = "/admin/employees";

export const getAllEmployeesForAdmin = (params) => 
  api.get(BASE, { params });

export const getEmployeeByIdForAdmin = (id) => 
  api.get(`${BASE}/${id}`);
