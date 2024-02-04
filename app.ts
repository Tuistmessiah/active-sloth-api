import express from 'express';
import morgan from 'morgan';

import userRouter from './routers/user.router';
import dayRouter from './routers/day.router';

import { AppError, handleCastErrorDB, handleDuplicateFieldsDB, handleJWTError, handleJWTExpiredError, handleValidationErrorDB, sendErrorDev, sendErrorProd } from './utils/error-handling.utils';

// * Setup & Security

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.info(req.headers);
  next();
});

// * Main Routes

app.get('/ping', (req, res) => {
  console.info('Server pinged!');
  res.send('This is a ping message');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/day', dayRouter);

// * Unhandled routes

app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handler - catches ALL errors
app.use((err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
});

export { app };
