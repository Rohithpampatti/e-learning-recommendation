import axios from 'axios';

const API_URL = 'https://e-learning-recommendation.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export default api;