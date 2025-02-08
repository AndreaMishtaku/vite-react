import axios from "axios";

export const clearSession = () => {
  localStorage.removeItem("X-API-KEY");
  window.location.href = "/login";
};

const axiosInit = () => {
  axios.defaults.baseURL =
    import.meta.env.MODE == "development"
      ? "/api"
      : import.meta.env.VITE_API_URL;
  axios.interceptors.request.use((request) => {
    const token = localStorage.getItem("X-API-KEY");

    if (token) {
      request.headers["X-API-KEY"] = token;
    }
    return request;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        window.location.pathname !== "/login"
      ) {
        clearSession();
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInit;
