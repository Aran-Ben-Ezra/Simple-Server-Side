//Roi Katz 313299729 Aran Ben Ezra 316256403
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const costItemSchema = new Schema({
    user_id: {
        type: String
    },
    year: {
        type: Number
    },
    month: {
      type: Number
    },
    day: {
        type: Number
    },
    id: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    sum: {
        type: Number
    },
});

const costs = mongoose.model('costItemSchema',costItemSchema);
module.exports = costs;
