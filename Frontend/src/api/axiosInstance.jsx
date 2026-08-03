import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
  withCredentials: true, // Include credentials (cookies) in requests
});

export default AxiosInstance;