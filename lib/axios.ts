import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },

});

// Browser automatically sends the accessToken cookie for all same-origin /api requests.
// No need for manual Authorization header.

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is 401, the token is likely invalid or expired
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
