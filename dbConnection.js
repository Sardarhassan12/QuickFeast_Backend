const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser : true
        });
        console.log("Mongo DB Connected");
    }catch(error){
        console.log(`Error in COnnectign DB ${error.message}`);
    }
}

module.exports = connectDB;