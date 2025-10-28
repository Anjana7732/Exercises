import axios from "axios";
const baseUrl = "h/api/persons"; 

export const getAll = () => axios.get(baseUrl).then(r => r.data);
export const create = (newPerson) => axios.post(baseUrl, newPerson).then(r => r.data);
export const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(r => r.data);
