var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''}
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
    // item: { type: Schema.Types.ObjectId, ref: ''}
  }]
});

// encriptacion del password antes de guardarlo en la base de datos
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//se comparan el password ingresado con el guardado en la base de datos
UserSchema.methods.passwordVerification = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
