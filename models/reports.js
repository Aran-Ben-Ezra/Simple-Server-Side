//Roi Katz 313299729 Aran Ben Ezra 316256403
const mongoose = require('mongoose');
const costs = require("../models/costs");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    report: {
        type: JSON,
        default: {
            food: [],
            health: [],
            housing: [],
            sport: [],
            education: [],
            transportation: [],
            other: []
        },
    },
    user_id: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
});

const reports = mongoose.model('reportSchema', reportSchema);

module.exports = reports;