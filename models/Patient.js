const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contact: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
