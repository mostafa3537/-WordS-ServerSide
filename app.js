const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const testRoutes = require('./routes/testRoutes');

// Start express app
const app = express();

app.use(express.static('public'));

app.enable('trust proxy');
// 1) GLOBAL MIDDLEWARES
// Implement CORS

app.use(cors());

// Set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(compression());

// 3) ROUTES
app.use('/api/v1/', testRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
