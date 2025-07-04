const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { UserRoles } = require('../constants/enums');
const UserRepository = require('../repositories/UserRepository');
require('dotenv').config();

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async promoteUser(userId, newRole) {
    if (!UserRoles.isValid(newRole)) {
      throw new Error(`Role inválida: ${newRole}. Roles válidas: ${UserRoles.values().join(', ')}`);
    }
    
    // Implementação da lógica de promoção
    const updatedUser = await this.repository.updateUserRole(userId, newRole);
    return updatedUser;
  }

  async login(email, password) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user };
  }

  async getAllUsers(requestingUserRole) {
    const users = await this.repository.findAll();
    
    switch (requestingUserRole) {
      case UserRoles.ADMIN:
        return users;
      case UserRoles.PROFESSOR:
        return users.filter(user => user.role === UserRoles.ALUNO);
      default:
        throw new Error('Acesso não autorizado');
    }
  }

  async updateUser(id, updateData, requestingUser) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    // Exemplo de permissão (ajuste conforme sua regra)
    if (requestingUser.role !== 'ADMIN' && requestingUser.id !== id) {
      throw new Error('acesso não autorizado');
    }
  
    // Atualize apenas os campos permitidos
    Object.assign(user, updateData);
  
    const updatedUser = await this.repository.updateUser(id, user);
    return updatedUser;
  }

  async updateUser(userId, updateData, requestingUser) {
    const user = await this.repository.findById(userId);
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    const isAdmin = requestingUser.role === UserRoles.ADMIN;
    const isSelf = requestingUser.id === userId;
  
    if (!isAdmin && !isSelf) {
      throw new Error('acesso não autorizado');
    }
  
    return await this.repository.updateUser(userId, updateData);
  }

  async register({ name, email, password, role}) {
    if (!name || !email || !password || typeof role === 'undefined') {
      throw new Error('Nome, email, senha e role são obrigatórios');
    }

    if (!validator.isEmail(email)) {
      throw new Error('Email inválido');
    }

    // Verifica se o domínio do email existe
    const [, domain] = email.split('@');
    if (!await validator.isFQDN(domain)) {
      throw new Error('Domínio do email inválido ou inexistente');
    }
  
    // Normaliza a role (remove espaços, converte para maiúsculas)
    const normalizedRole = role.trim().toUpperCase();
    
    if (!UserRoles.isValid(normalizedRole)) {
      throw new Error(`Role inválida: ${role}. Use: ${UserRoles.values().join(', ')}`);
    }

    // Verifica se a senha tem mais de 8 caracteres
    if (password.length <= 8) {
      throw new Error('A senha deve ter mais de 8 caracteres');
    }
  
    // Verifica email duplicado
    if (await this.repository.findByEmail(email)) {
      throw new Error('Email já cadastrado');
    }
  
    // Cria o usuário 
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: await bcrypt.hash(password, 10),
      role: normalizedRole // Garante formatação consistente
    });
    
    // Valida o usuário antes de salvar
    user.isValid();
    
    // Salva no banco de dados
    return await this.repository.create(user);
  }

  async deleteUser(userId, requestingUser) {
    if (requestingUser.role !== UserRoles.ADMIN) {
      throw new Error('Apenas administradores podem excluir usuários');
    }

    const userToDelete = await this.repository.findById(userId);
    if(!userToDelete) {
      throw new Error('Usuário não encontrado');
    }
    if (userToDelete.role === UserRoles.ADMIN) {
      throw new Error('Não é possível excluir um administrador');
    }
    if (userToDelete.id === requestingUser.id) {
      throw new Error('Não é possível excluir o próprio usuário');
    }
    const deletedUser = await this.repository.delete(userId);
    return {
      message: `Usuário ${deletedUser.name} foi excluído com sucesso`
    };
  }

}

module.exports = UserService;