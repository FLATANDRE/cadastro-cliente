import axios from "axios";
import { getToken } from "./auth";
import { getLanguage } from './locales';
import { text } from './locales'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_AICARE,
  responseType: 'json',
});

api.interceptors.request.use(async config => {

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const language = getLanguage();
  if (language) {
    config.headers['Accept-Language'] = language;
  }

  return config;
});

export const error_handling = error => {
  if(error.response){
    if(error.response.status === 403){
      return text("geral.nao_autorizado");
    }else{
        return error.response.data.message
    }                        
  }else{
    return text("geral.erro_conexao");
  }
}

export default api;