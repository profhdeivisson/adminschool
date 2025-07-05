const validator = require('validator');
const { UserRoles } = require('../constants/enums');
const environment = require('../config/environment');

class UserValidator {
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email inválido');
    }

    if (!validator.isEmail(email)) {
      throw new Error('Email inválido');
    }

    return email.toLowerCase().trim();
  }

  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Senha inválida');
    }

    if (password.length <= environment.MIN_PASSWORD_LENGTH) {
      throw new Error(`A senha deve ter mais de ${environment.MIN_PASSWORD_LENGTH} caracteres`);
    }

    return password;
  }

  static validateRole(role) {
    if (!role || typeof role !== 'string') {
      throw new Error('Role deve ser uma string não vazia');
    }

    const normalizedRole = role.trim().toUpperCase();
    
    if (!UserRoles.isValid(normalizedRole)) {
      throw new Error(`Role inválida: ${role}. Roles permitidas: ${UserRoles.values().join(', ')}`);
    }
    
    return normalizedRole;
  }

  static validateName(name) {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Nome é obrigatório');
    }

    return name.trim();
  }

  static validateUserData({ name, email, password, role }) {
    return {
      name: this.validateName(name),
      email: this.validateEmail(email),
      password: this.validatePassword(password),
      role: this.validateRole(role)
    };
  }

  static validateUpdateData(updateData) {
    const allowedFields = ['name', 'email', 'role', 'password'];
    const validatedData = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        switch (key) {
          case 'name':
            validatedData[key] = this.validateName(value);
            break;
          case 'email':
            validatedData[key] = this.validateEmail(value);
            break;
          case 'role':
            validatedData[key] = this.validateRole(value);
            break;
          case 'password':
            validatedData[key] = this.validatePassword(value);
            break;
        }
      }
    }

    return validatedData;
  }
}

module.exports = UserValidator; 