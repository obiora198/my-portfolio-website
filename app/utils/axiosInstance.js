import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VTPASS_BASE_URL
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const apiKey = process.env.NEXT_PUBLIC_VTPASS_API_KEY;
        const publicKey = process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY;

        // If token is present, add it to request's Authorization Header
        config.headers["api-key"] = apiKey;
        config.headers["public-key"] = publicKey;
        config.headers["Content-Type"] = "application/json";
        
        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);


export default AxiosInstance;