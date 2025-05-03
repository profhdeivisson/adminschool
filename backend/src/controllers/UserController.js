const UserService = require('../services/UserService');

class UserController {
    async register(req, res) {
        try {
          const { name, email, password, role } = req.body;
          const user = await new UserService().register({ name, email, password, role });
          res.status(201).json(user);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
}

module.exports = new UserController();