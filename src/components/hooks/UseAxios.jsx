import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAxios = async (url, requestType, body) => {
  try {
    switch (requestType) {
      case "get":
        return await axios.get(`${API_BASE_URL}/quizilla${url}`);
      case "post":
        return await axios.post(`${API_BASE_URL}/quizilla${url}`, body || "");
      case "put":
        return await axios.put(`${API_BASE_URL}/quizilla${url}`, body || "");
      case "delete":
        return await axios.delete(`${API_BASE_URL}/quizilla${url}`);
      default:
        throw new Error(`Unsupported request type: ${requestType}`);
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export default useAxios;
