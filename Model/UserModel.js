const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name : {type:String, require: true, maxlength : 100},
    userName : {type: String,unique : true, require: true, maxlength: 300},
    role : {type: String, require: true, maxlength: 100},
    password : {type: String, require:true, maxlength: 300}
})

const UserModel = model("User", userSchema);
module.exports = UserModel;