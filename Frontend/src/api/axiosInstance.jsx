import axios from "axios";
const AxiosInstance = axios.create({
  baseURL:"https://ai-backend-peach.vercel.app/api/v1"|| "http://localhost:5173",
  timeout: 60000,
  withCredentials: true, // Include credentials (cookies) in requests
});

export default AxiosInstance;