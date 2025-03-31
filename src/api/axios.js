import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://roxiler-store-rating-app-backend.onrender.com/api", //"http://127.0.0.1:8080/api", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
    "x-access-token": Cookies.get("token") || "", // Set token if available
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  },
});

export default api;
