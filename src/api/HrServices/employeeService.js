import api from "../axios";

const BASE = "/hr/employee";

export const createEmployee = (data) => 
  api.post(`${BASE}`, data);

export const getAllEmployee = (params) => 
  api.get(BASE, { params });

export const getEmployeeById = (id) => 
  api.get(`${BASE}/${id}`);

export const updateEmployee = (id, data) => 
  api.put(`${BASE}/${id}`, data);

export const disableEmployee = (id) => 
  api.patch(`${BASE}/${id}/disable`);

export const deleteEmployee = (id) => 
  api.delete(`${BASE}/${id}`);

export const getManagersByDepartment = (dept) =>
  api.get(`${BASE}/managers`, { params: { department: dept } });