const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userValidationRules, validate } = require('../middlewares/validator');

router.get('/', userController.getAllUsers);
router.post('/', userValidationRules(), validate, userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userValidationRules(), validate, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;