// https://axios-http.com/docs/instance

import axios from "axios";

const BACKEND_ADRESS = 'https://localhost:7215/api';

const api = axios.create({
  baseURL: BACKEND_ADRESS,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  // headers: {'Access-Control-Allow-Credentials': true},
  // withCredentials: true,
});

export default api;
