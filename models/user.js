const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

   email:{

    type:String,
    required:true
   } ,

   password:{
    type:String,
    required:true
    
   },
   role:{

    type:String,
    required:true

   }


});

const userModel = new mongoose.Model(userSchema);

module.exports = userModel;

