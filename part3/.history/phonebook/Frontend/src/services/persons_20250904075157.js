import axios from "axios";
const baseUrl = "/api/persons"; 

export const getAll = () => axios.get(baseUrl).then(r => r.data);
export const create = (newPerson) => axios.post(baseUrl, newPerson).then(r => r.data);
export const remove = (id) => axios.delete(`${baseUrl}/${id}`);
