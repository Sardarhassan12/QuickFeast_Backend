require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./dbConnection');
const route = require('./Routes/route');
const path = require('path');

// CORS configuration
const allowedOrigins = ['https://quick-feast-frontend-nc3i.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api', route);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});







// require('dotenv').config();
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;
// const connectDB = require('./dbConnection');
// const route = require('./Routes/route');
// const cors = require('cors');
// const path = require('path');

// // const allowedOrigins = [
// //   'https://quick-feast-frontend.vercel.app/' // change this
// // ];

// // app.use(cors({
// //   origin: allowedOrigins,
// //   credentials: true
// // }));
// app.use(cors({
//   origin: 'https://quick-feast-frontend-nc3i.vercel.app/',  // frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,  // if you use cookies/auth
// }));

// connectDB();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api', route);
// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });














// const express = require('express');
// const app = express();
// const port = 3000;
// // const port = process.env.PORT || 3000;
// const connectDB = require('./dbConnection');
// const route = require('./Routes/route')
// const cors = require('cors');
// const path = require('path');

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// connectDB();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api', route);

// app.listen(port, ()=>{
//     console.log("App Listening on Port");
// })