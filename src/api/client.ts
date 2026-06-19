import axios from "axios";

const api = axios.create({
    baseURL: "/api", // 👈 QUAN TRỌNG
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
