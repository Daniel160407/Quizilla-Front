import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/quizilla`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const useAxios = async (url, method, data = null, config = {}) => {
  try {
    const response = await apiClient.request({
      url,
      method,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || error.message;
      console.error("API request failed:", {
        url,
        method,
        status: error.response?.status,
        error: errorData,
      });
      throw new Error(
        errorData.message || `API request to ${url} failed: ${error.message}`
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

useAxios.get = (url, config = {}) => useAxios(url, "get", null, config);
useAxios.post = (url, data, config = {}) => useAxios(url, "post", data, config);
useAxios.put = (url, data, config = {}) => useAxios(url, "put", data, config);
useAxios.patch = (url, data, config = {}) => useAxios(url, "patch", data, config);
useAxios.delete = (url, config = {}) => useAxios(url, "delete", null, config);

export default useAxios;