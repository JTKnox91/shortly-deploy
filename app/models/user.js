var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  id: Number,
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

userSchema.pre('save',function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this).then(function(hash){
    this.password = hash;
  });
});

User.prototype.comparePassword = function(attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

module.exports = User;