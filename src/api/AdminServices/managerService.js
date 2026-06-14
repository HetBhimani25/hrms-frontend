import api from "../axios";

const BASE = "/admin/manager";

export const createManager = (data) =>
  api.post(`${BASE}`, data);

export const getAllManagers = (params) =>
  api.get(BASE, { params });

export const getManagerById = (id) =>
  api.get(`${BASE}/${id}`);

export const updateManager = (id, data) =>
  api.put(`${BASE}/${id}`, data);

export const disableManager = (id) =>
  api.patch(`${BASE}/${id}/disable`);

export const enableManager = (id) => 
  api.patch(`${BASE}/${id}/enable`);

export const deleteManager = (id) =>
  api.delete(`${BASE}/${id}`);