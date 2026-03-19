const express = require('express');
const router = express.Router();
const appoController = require('../controllers/appointmentController');

router.get('/', appoController.getAppointments);
router.get('/:id', appoController.getAppointmentCard);
router.post('/', appoController.createAppointment);
router.delete('/:id', appoController.deleteAppointment);

module.exports = router;