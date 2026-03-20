const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { appointmentValidationRules, validate } = require('../middlewares/validator');

router.get('/', appointmentController.getAllAppointments);
router.post('/', appointmentValidationRules(), validate, appointmentController.createAppointment);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentValidationRules(), validate, appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;