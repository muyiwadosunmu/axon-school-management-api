const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    age:         { type: Number, required: true },
    grade:       { type: String, required: true },
    schoolId:    { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
