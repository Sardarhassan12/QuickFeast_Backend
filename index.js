const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./dbConnection');
const route = require('./Routes/route')
const cors = require('cors');
const path = require('path');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', route);

app.listen(port, ()=>{
    console.log("App Listening on Port");
})