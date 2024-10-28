const express = require('express');
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create a new appointment (Patients and Admins only)
router.post('/', authMiddleware(['Patient', 'Admin']), async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            patient: req.user.role === 'Patient' ? req.user._id : req.body.patient,
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error creating appointment', error: err.message });
    }
});

// Read all accessible appointments (Doctors, Admins, and Patients with access control)
router.get('/', authMiddleware(['Patient', 'Doctor', 'Admin']), async (req, res) => {
    try {
        let filter = {};

        // Role-based filtering conditions
        if (req.user.role === 'Doctor') {
            filter.doctor = req.user._id;
        } else if (req.user.role === 'Patient') {
            filter.patient = req.user._id;
        }

        const appointments = await Appointment.find(filter);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
});

// Read a specific appointment by ID (All roles with access control)
router.get('/:appointmentId', authMiddleware(['Patient', 'Doctor', 'Admin']), async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Role-based access validation
        if (
            (req.user.role === 'Doctor' && appointment.doctor.toString() !== req.user._id.toString()) ||
            (req.user.role === 'Patient' && appointment.patient.toString() !== req.user._id.toString())
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointment', error: err.message });
    }
});

// Update an appointment (Doctors and Admins can update; Patients can update their own)
router.put('/:appointmentId', authMiddleware(['Patient', 'Doctor', 'Admin']), async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Role-based access validation
        if (
            (req.user.role === 'Doctor' && (appointment.doctor.toString() !== req.user._id.toString() || req.body.doctor !== req.user._id.toString())) ||
            (req.user.role === 'Patient' && (appointment.patient.toString() !== req.user._id.toString() || req.body.patient !== req.user._id.toString()))
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }


        Object.assign(appointment, req.body);
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error updating appointment', error: err.message });
    }
});

// Delete an appointment (Admin and Patients for their own)
router.delete('/:appointmentId', authMiddleware(['Admin', 'Patient']), async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Only Admins and the Patient who owns it can delete
        if (req.user.role !== 'Admin' && appointment.patient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await appointment.deleteOne();
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting appointment', error: err.message });
    }
});

module.exports = router;
