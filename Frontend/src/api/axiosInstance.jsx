import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 60000,
  withCredentials: true, // Include credentials (cookies) in requests
});

export default AxiosInstance;