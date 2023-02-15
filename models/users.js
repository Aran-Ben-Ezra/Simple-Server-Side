//Roi Katz 313299729 Aran Ben Ezra 316256403
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    birthday: {
        type: String
    },
});

const users = mongoose.model('userSchema',userSchema);
module.exports = users;
