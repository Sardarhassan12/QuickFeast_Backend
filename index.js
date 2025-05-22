require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./dbConnection');
const route = require('./Routes/route');
const cors = require('cors');
const path = require('path');

// Add this at the very top, before other middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://quick-feast-frontend-nc3i.vercel.app'); // NO trailing slash here
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// You can keep or remove this CORS middleware; with the above, it’s not required but won’t hurt
app.use(cors({
  origin: 'https://quick-feast-frontend-nc3i.vercel.app',  // no trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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