const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name:     { type: String, required: true, unique: true },
    address:  { type: String, required: true },
    phone:    { type: String },
    email:    { type: String },
    website:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);
