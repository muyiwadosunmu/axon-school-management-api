const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    capacity:  { type: Number, required: true },
    resources: { type: [String], default: [] },
    schoolId:  { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
}, { timestamps: true });

// Ensure unique classroom name per school
ClassroomSchema.index({ name: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model('Classroom', ClassroomSchema);
