const { UserRoles } = require('../constants/enums');

class User {
    constructor({ id, name, email, password_hash, role, created_at }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password_hash = password_hash;
      this.role = this.validateRole(role);
      this.created_at = created_at || new Date().toISOString();
    }

    validateRole(role) {
        if (!UserRoles.isValid(role)) {
          throw new Error(
            `Role inválida: ${role}. Roles permitidas: ${UserRoles.values().join(', ')}`
          );
        }
        return role;
      }
  
    isValid() {
      if (!this.name || !this.email || !this.password_hash || !this.role) {
        throw new Error('Nome, email, senha e role são obrigatórios');
      }
      return true;
    }
  }
  
  module.exports = User;