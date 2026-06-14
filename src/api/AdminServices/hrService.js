import api from "../axios";

const BASE = "/admin/hr";

export const createHr = (data) => 
  api.post(`${BASE}`, data);

export const getAllHrs = (params) => 
  api.get(BASE, { params } );

export const getHrById = (id) => 
  api.get(`${BASE}/${id}`);

export const updateHr = (id, data) => 
  api.put(`${BASE}/${id}`, data);

export const disableHr = (id) => 
  api.patch(`${BASE}/${id}/disable`);

export const enableHr = (id) => 
  api.patch(`${BASE}/${id}/enable`);

export const deleteHr = (id) => 
  api.delete(`${BASE}/${id}`);