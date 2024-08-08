import axios from "axios";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: "https://api.spotify.com/v1/browse",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
  timeout: 10000,
});

export default api;
