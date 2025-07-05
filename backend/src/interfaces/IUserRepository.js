/**
 * Interface para UserRepository
 * Define o contrato que qualquer implementação de UserRepository deve seguir
 */
class IUserRepository {
  async create(userData) {
    throw new Error('Method create() must be implemented');
  }

  async findByEmail(email) {
    throw new Error('Method findByEmail() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  async updateUser(id, updateData) {
    throw new Error('Method updateUser() must be implemented');
  }

  async updateUserRole(userId, newRole) {
    throw new Error('Method updateUserRole() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }
}

module.exports = IUserRepository; 