const express = require('express');
const morgan = require('morgan');

// import i18n
const i18n = require('./src/i18n/i18n');

// set port
const port = process.env.PORT || 3002 ;

// create express application
const app = express();

// app configuration
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(express.static('public'));
app.set('view engine', 'html');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(i18n);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    next();
});


// import routes
const indexRoute = require('./src/routes');
app.use('/', indexRoute);

// environment configuration
require('./src/Config/enviroment');
require('./src/Config/database');

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
})
