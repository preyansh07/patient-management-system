const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const patientAccessControlMiddleware =  async (req, res, next) => {
    try {
        const { role, _id } = req.user;

        let filter = {};

        // Role-based filtering conditions
        if (role === 'Doctor') {
            // Doctors can access only their assigned patients
            filter.doctor = _id;
        } else if (role === 'Patient') {
            // Patients can access only their own record
            // filter._id = req.params.patientId; // assumes patientId is passed as a route parameter
            // filter.patient = _id; // This should match the patient's user ID
            filter._id = _id;
        } else if (role === 'Admin') {
            // Admins have access to all patient records, no filtering needed
            filter = {}; 
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Attach filter to req for route handler to use in queries
        req.patientFilter = filter;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Error in access control', error: err.message });
    }
};

module.exports = patientAccessControlMiddleware;
