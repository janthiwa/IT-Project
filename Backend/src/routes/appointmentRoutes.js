const express = require('express');
const router = express.Router();
const appoController = require('../controllers/appointmentController');

router.get('/', appoController.getAllAppointments);
router.get('/:id', appoController.getAppointmentCard);
router.get('/card/:id', appoController.getAppointmentCard);
router.put('/:id', appoController.updateAppointment);
router.post('/', appoController.createAppointment);
router.delete('/:id', appoController.deleteAppointment);

module.exports = router;