import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Prevent infinite loops if the refresh endpoint itself returns 401
      // Also do not attempt to refresh if the login request itself fails (e.g. wrong password)
      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login')) {
         if (originalRequest.url.includes('/auth/refresh')) {
             localStorage.removeItem("auth");
             window.location.href = "/login";
         }
         return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            // The browser will automatically attach the new HttpOnly accessToken cookie
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // We don't need to pass the refresh token in the body anymore;
        // it will be sent automatically as an HttpOnly cookie if it exists.
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshed();

        // Retry the original request; the new HttpOnly cookie will be included automatically
        return api(originalRequest);

      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;