const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UserRoles } = require('../constants/enums');
const UserRepository = require('../repositories/UserRepository');
const UserValidator = require('../validators/UserValidator');
const AuthorizationStrategy = require('./AuthorizationStrategy');
const environment = require('../config/environment');

class UserService {
  constructor(repository = null, authorizationStrategy = null) {
    this.repository = repository || new UserRepository();
    this.authorizationStrategy = authorizationStrategy || new AuthorizationStrategy();
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
      environment.JWT_SECRET,
      { expiresIn: environment.JWT_EXPIRES_IN }
    );

    return { token, user };
  }

  async getAllUsers(requestingUserRole) {
    const users = await this.repository.findAll();
    return this.authorizationStrategy.executeStrategy(requestingUserRole, users);
  }

  async getUserById(userId, requestingUser) {
    const user = await this.repository.findById(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (!this.authorizationStrategy.canAccessUser(requestingUser, user)) {
      throw new Error('Acesso não autorizado');
    }

    return user;
  }

  async updateUser(id, updateData, requestingUser) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    if (!this.authorizationStrategy.canUpdateUser(requestingUser, user)) {
      throw new Error('Acesso não autorizado');
    }

    // Valida e filtra os dados de atualização
    const validatedData = UserValidator.validateUpdateData(updateData);
  
    const updatedUser = await this.repository.updateUser(id, validatedData);
    return updatedUser;
  }


  async register({ name, email, password, role}) {
    // Valida todos os dados de entrada
    const validatedData = UserValidator.validateUserData({ name, email, password, role });
  
    // Verifica email duplicado
    if (await this.repository.findByEmail(validatedData.email)) {
      throw new Error('Email já cadastrado');
    }
  
    // Cria o usuário 
    const user = new User({
      name: validatedData.name,
      email: validatedData.email,
      password_hash: await bcrypt.hash(validatedData.password, environment.BCRYPT_ROUNDS),
      role: validatedData.role
    });
    
    // Valida o usuário antes de salvar
    user.isValid();
    
    // Salva no banco de dados
    return await this.repository.create(user);
  }

  async deleteUser(userId, requestingUser) {
    const userToDelete = await this.repository.findById(userId);
    if(!userToDelete) {
      throw new Error('Usuário não encontrado');
    }

    if (!this.authorizationStrategy.canDeleteUser(requestingUser, userToDelete)) {
      throw new Error('Acesso não autorizado');
    }

    const deletedUser = await this.repository.delete(userId);
    return {
      message: `Usuário ${deletedUser.name} foi excluído com sucesso`
    };
  }

}

module.exports = UserService;