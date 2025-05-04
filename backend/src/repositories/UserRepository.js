const supabase = require('../config/supabase');
const { UserRoles } = require('../constants/enums');

class UserRepository {
  normalizeRole(role) {
    if (typeof role !== 'string' || !role.trim()) {
      throw new Error('Role deve ser uma string não vazia');
    }

    const normalizedRole = role.trim().toUpperCase();
    
    if (!UserRoles.isValid(normalizedRole)) {
      throw new Error(`Role inválida: ${role}. Roles permitidas: ${UserRoles.values().join(', ')}`);
    }
    
    return normalizedRole;
  }

  async create(userData) {
    const normalizedData = { ...userData };
    if (userData.role) {
      normalizedData.role = this.normalizeRole(userData.role);
    }

    const { data, error } = await supabase
      .from('users')
      .insert(normalizedData)
      .select();

      if (error) {
        console.error('Erro no Supabase:', error);
        throw new Error(`Falha ao criar usuário: ${error.message}`);
      }
    return data[0];
  }

  async findByEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email inválido');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao buscar usuário: ${error.message}`);
    }

    return data || null;
  }

  async findAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao buscar usuários: ${error.message}`);
    }

    return data || [];
  }

  async findById(id) {
    if (!id) {
      throw new Error('ID inválido');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao buscar usuário: ${error.message}`);
    }

    return data || null;
  }
}

module.exports = UserRepository;