import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.capitalxinvest.com.br/api/',
});

// Interceptador: Antes de cada requisição, insere o token se existir
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;