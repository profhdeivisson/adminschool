const UserService = require('../services/UserService');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const user = await this.userService.register({ name, email, password, role });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers(req.user.role);
      res.json(users);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id, req.user);
      res.json(user);
    } catch (error) {
      if (error.message === 'Usuário não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(403).json({ error: error.message });
      }
    }
  }

  async deleteUser(req, res) {
    try {
     const { id } = req.params;
     const requestingUser = req.user;
     const result = await this.userService.deleteUser(id, requestingUser);
     res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Usuário não encontrado') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('acesso não autorizado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

module.exports = UserController;