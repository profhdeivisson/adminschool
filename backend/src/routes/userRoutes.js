const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const { UserRoles } = require('../constants/enums');

const router = express.Router();
const userController = new UserController();

// Rotas públicas
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Rotas protegidas
router.get('/', authMiddleware([UserRoles.ADMIN, UserRoles.PROFESSOR]), userController.getAllUsers.bind(userController));
router.get('/:id', authMiddleware([UserRoles.ADMIN, UserRoles.PROFESSOR, UserRoles.ALUNO]), userController.getUserById.bind(userController));

router.delete('/:id', authMiddleware([UserRoles.ADMIN]), userController.deleteUser.bind(userController));
module.exports = router;