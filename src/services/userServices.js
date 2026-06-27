import axios from "axios";

const API = "https://lifetrack-e2sm.onrender.com/";

export const addUser = (user)=>{
  return axios.post(API,user);
};

export const getUser = ()=>{
  return axios.get(API);
};

export const getUserById = (id)=>{
  return axios.get(`${API}/${id}`);
};

export const updateUser = (id, user)=>{
  return axios.put(`${API}/${id}`,user);
};

export const deleteUser = (id)=>{
  return axios.delete(`${API}/${id}`);
};

module.exports = {addUser,getUser,getUserById,updateUser,deleteUser};