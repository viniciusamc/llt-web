import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://llt-nest.railway.internal/'
})
