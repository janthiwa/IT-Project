const express = require('express');
const router = express.Router();
const appoController = require('../controllers/appointmentController');

router.get('/', appoController.getAppointments);
router.post('/', appoController.createAppointment);
router.get('/card/:id', appoController.getAppointmentCard);
router.delete('/:id', appoController.deleteAppointment);

module.exports = router;