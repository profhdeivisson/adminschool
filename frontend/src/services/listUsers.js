import { getToken } from '../utils/getToken';
import API from '../api/axios';

export async function listUsers() {
  const token = getToken();
  try {
    const response = await API.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    // Retorna um objeto de erro padronizado
    return { error: error.response?.data?.error || 'Erro ao buscar usuários', status: error.response?.status };
  }
}