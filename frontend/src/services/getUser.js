import { getToken } from '../utils/getToken';
import API from '../api/axios';

export async function getUser(id) {
    const token = getToken();
  try {
    const response = await API.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return { error: error.response?.data?.error || 'Erro ao buscar usuário', status: error.response?.status };
  }
}