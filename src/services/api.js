import { BASE_URL } from "../constants/index.js";

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  },
  post: async (endpoint, data, isFormData = false) => {
    const options = {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    };
    if (!isFormData) {
      options.headers = { "Content-Type": "application/json" };
    }
    
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = { 
        ...options.headers, 
        Authorization: `Bearer ${token}` 
      };
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }
    return response.json();
  },
  // Add other methods (put, delete) as needed
  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Delete failed");
    return response.json();
  }
};

export default api;
