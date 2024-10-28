const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const patientAccessControlMiddleware = require('../middleware/patientAccessControl');
const router = express.Router();

// Create a new patient record (Doctors and Admins only)
router.post('/', authMiddleware(['Doctor', 'Admin']), async (req, res) => {
    try {
        const patient = new Patient({
            ...req.body,
            doctor: req.user.role === 'Doctor' ? req.user._id : req.body.doctor,
        });
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error creating patient record', error: err.message });
    }

  });

// Read all accessible patient records (Doctors, Admins, and Patients can access)
router.get('/', [authMiddleware(['Admin', 'Doctor', 'Patient']), patientAccessControlMiddleware], async (req, res) => {
    try {
        const patients = await Patient.find(req.patientFilter);
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patient records', error: err.message });
    }
});

// Read a specific patient record (All roles with access control)
router.get('/:patientId', [authMiddleware(['Admin', 'Doctor', 'Patient']), patientAccessControlMiddleware], async (req, res) => {
    try {
        const patient = await Patient.findOne({ ...req.patientFilter, _id: req.params.patientId });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patient record', error: err.message });
    }
});

// Update a patient record (Doctors and Admins with access control)
router.put('/:patientId', [authMiddleware(['Doctor', 'Admin']), patientAccessControlMiddleware], async (req, res) => {
    try {
        const updatedPatient = await Patient.findOneAndUpdate(
            { ...req.patientFilter, _id: req.params.patientId },
            req.body,
            { new: true }
        );
        if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
        res.json(updatedPatient);
    } catch (err) {
        res.status(500).json({ message: 'Error updating patient record', error: err.message });
    }
});

// Delete a patient record (Admin only)
router.delete('/:patientId', authMiddleware(['Admin']), async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.patientId);
        if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });
        res.json({ message: 'Patient record deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting patient record', error: err.message });
    }
});

module.exports = router;
