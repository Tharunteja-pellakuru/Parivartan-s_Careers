import { BASE_URL } from "../constants/index.js";

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }
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
  put: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Update failed");
    }
    return response.json();
  },
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
