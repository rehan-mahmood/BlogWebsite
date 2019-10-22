const mongoose = require('mongoose');

var Schema = mongoose.Schema;
//const bcrypt = require('bcrypt-nodejs');
const bcrypt = require('bcrypt');
let saltRounds = 10


var UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

UserSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password')) return next();

  // bcrypt.hash(user.paaword, null, null, function(err, hash){
  //   if(err) return next(err);
  //
  //   user.password = hash;
  //   next();
  // });

  bcrypt.hash(user.password, saltRounds, (err, hash) => {
  if(err){
    return next(err);
  }else{
    user.password = hash;
    next();
  }
});
});

// UserSchema.methods.comparePassword = function(password) {
//   var user =this;
//   return bcrypt.compareSync(password, user.password);
// }
UserSchema.methods.comparePassword = function(password){
  var user = this;
  return bcrypt.compareSync(password, user.password);
 // bcrypt.compare(password,user.password, (err, res) => {
 //      console.log(res);
 //      //return res;
 //      GLOBAL.auth = res
 //  })
 // var auth = bcrypt.compareSync(password,user.password)
 // console.log("auth",auth);
 // return auth
}



module.exports = mongoose.model('User', UserSchema);
