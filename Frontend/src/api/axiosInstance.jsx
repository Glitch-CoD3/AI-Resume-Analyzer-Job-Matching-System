import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://ai-resume-analyzer-v89d.onrender.com/api/v1",
  timeout: 60000,
  withCredentials: true, // Include credentials (cookies) in requests
});

export default AxiosInstance;