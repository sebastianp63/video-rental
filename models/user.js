const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
email: {
    type: String,
    minlenght: 5,
    maxlenght: 255,
   unique: true,
    required: true,
},
name: {
    type: String,
    minlenght: 3,
    maxlenght: 20,
    required: true

},
surname:{
    type: String,
    minlenght: 3,
    maxlenght: 50,
    required: true 
},
// birthday_date: {
//     required: true,
//     type: Date,
// },
phone_number: {
    type: Number,
    minlenght: 9,
    maxlenght: 9

},
password: {
    type: String,
    required: true,
    minlenght: 6,
    maxlenght:1024,
},
isAdmin: {
    type: Boolean,
    default: false,
}
})

userSchema.pre('save', function (next){
    bcrypt.genSalt(10, (err,salt) =>{
        bcrypt.hash(this.password,salt,(err,hash) =>{
            this.password = hash;
            next();
        })
    })
})


module.exports.User = mongoose.model("User", userSchema)