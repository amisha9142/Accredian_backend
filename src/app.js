const express = require('express');
const cors = require("cors")
const referralRoutes = require('./routes/referralRoutes');
const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/api/referrals', referralRoutes);

module.exports = app;
