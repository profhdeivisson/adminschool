import { getToken } from '../utils/getToken';
import API from '../api/axios';

export async function updateUser(data, id) {
    const token = getToken();
  try {
    const response = await API.put(`/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return { error: error.response?.data?.error || 'Erro ao atualizar usuário', status: error.response?.status };
  }
}