import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://llt-nest.railway.internal/'
})
