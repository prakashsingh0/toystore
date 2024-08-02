const express = require('express');

const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userModel = require('./api/model/user_schema');

const task = require('./api/model/toy_schema')
const protectRoute = require('./api/middleware/protect');
const api = require('./api/routes/routes');
const cors = require('cors');
const app = express();

app.use(cookieParser());
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up CORS options
app.use(cors({
  origin: process.env.BASE_URL, // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with the request
}));

require('./api/db/db');

app.use('/api/route/user', api);

app.listen(process.env.PORT, () => {
    console.log(`server started on http://localhost:${process.env.PORT}`);
});
