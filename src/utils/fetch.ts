import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // if (error.response?.status === 401) {
    //   const refreshToken = (await cookies()).get("refreshToken")?.value;

    //   if (!refreshToken) {
    //     redirect("/login");
    //   }

    //   const newAccessToken = await refreshSession(refreshToken);
    //   if (newAccessToken) {
    //     error.config.headers[
    //       "Authorization"
    //     ] = `Bearer ${newAccessToken.accessToken}`;
    //     return api.request(error.config);
    //   }
    // }
    return Promise.reject(error);
  }
);
