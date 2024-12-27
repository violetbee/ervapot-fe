import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: Her istekte Authorization header ekler
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error(
            "Refresh token bulunamadı. Giriş sayfasına yönlendiriliyor."
          );
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          null,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);

          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error("Token yenileme başarısız:", refreshError);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
