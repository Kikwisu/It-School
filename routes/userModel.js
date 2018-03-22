const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   login: String,
   firstName: String,
   lastName: String,
   password: String,
   allBalls: Number,
   net: [Number],
   checNet:[Number],
   physic: [Number],
   checPhysic:[Number],
   multy: [Number],
   checMulty:[Number],
   roboto: [Number],
   checRoboto:[Number]
});

module.exports = mongoose.model('User', UserSchema);