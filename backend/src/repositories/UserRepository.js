const { supabase, supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcrypt');

class UserRepository {

  async create(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
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

    const { data, error } = await supabaseAdmin
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

  async updateUser(id, updateData) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
  
    const allowedFields = ['name', 'email', 'role', 'password_hash'];
    const filteredData = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    }
  
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(filteredData)
      .eq('id', id)
      .select();
  
    if (error) {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao atualizar usuário: ${error.message}`);
    }
  
    return data[0];
  }

  async updateUserRole(userId, newRole) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao atualizar role do usuário: ${error.message}`);
    }

    return data[0];
  }

  async findAll() {
    const { data, error } = await supabaseAdmin
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

    const { data, error } = await supabaseAdmin
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

  async delete(id) {
    if (!id) {
      throw new Error('ID inválido');
    }

    // Busca os dados do usuário antes de excluir
    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao excluir usuário: ${error.message}`);
    }

    return user;
  }
}

module.exports = UserRepository;