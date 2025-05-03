const bcrypt = require('bcrypt');
const User = require('../models/User');
const { UserRoles } = require('../constants/enums');
const UserRepository = require('../repositories/UserRepository');

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

  async register({ name, email, password, role}) {
    if (!name || !email || !password || typeof role === 'undefined') {
      throw new Error('Nome, email, senha e role são obrigatórios');
    }
  
    // Normaliza a role (remove espaços, converte para maiúsculas)
    const normalizedRole = role.trim().toUpperCase();
    
    if (!UserRoles.isValid(normalizedRole)) {
      throw new Error(`Role inválida: ${role}. Use: ${UserRoles.values().join(', ')}`);
    }
  
    // Verifica email duplicado
    if (await this.repository.findByEmail(email)) {
      throw new Error('Email já cadastrado');
    }
  
    // Cria o usuário (agora com role normalizada)
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
}

module.exports = UserService;