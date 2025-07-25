import axios from 'axios';
// Créer une instance axios avec une configuration de base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 secondes
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;