const express = require('express');
const mongoose = require('mongoose');

const db = require('./config/config').get(process.env.NODE_ENV);

const userRoutes = require('./routes/user.route');

const app = express();

// app use
app.use(express.json());

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  db.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) console.log(err);
    console.log('database is connected');
  }
);

//routes
app.use('/api/user', userRoutes);

// listening port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});

module.exports = server;
