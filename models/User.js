const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    //passwordResetToken: { type: String, select: false},
    //passwordResetExpires: {type: date, select: false}
});
module.exports = mongoose.model('User', UserSchema);
