import axios from 'axios';
import { API_URL } from '../config/constants';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getRecommendations = async (userId: string) => {
    try {
        const response = await api.get(`/recommendations/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

// Test connection
const testApiConnection = async () => {
    try {
        const response = await api.get('/health');
        console.log('API Connection successful:', response.data);
        return true;
    } catch (error) {
        console.error('API Connection failed:', error);
        return false;
    }
}; 