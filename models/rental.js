const mongoose = require('mongoose');


const rentalSchema = new mongoose.Schema({

    user: {
        email: {
          type: String,
          required: true
        },
        userId: {
          type:  mongoose.Schema.ObjectId,
          required: true,
          ref: 'User'
        }
      },

    cart: {
        type: Object,
        required: true
    },

    dateRental: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date,
    },
 
})


module.exports.Rental = mongoose.model("Rental", rentalSchema);