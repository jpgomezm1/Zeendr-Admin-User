import axios from 'axios';
import store from './redux/store';

axios.defaults.baseURL = 'https://zeendr-app-b1cfca69f998.herokuapp.com';

axios.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

