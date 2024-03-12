import express, { Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import userRouter from './routers/user.router';
import dayRouter from './routers/day.router';

import { AppError, handleCastErrorDB, handleDuplicateFieldsDB, handleJWTError, handleJWTExpiredError, handleValidationErrorDB, sendErrorDev, sendErrorProd } from './utils/error-handling.utils';

const app = express();
console.info('Using env: ' + process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// * Setup & Security

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
// TODO: Give frontend message on too many requests error
app.set('trust proxy', true);
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// TODO
// Refresh tokens
// Two factor auth
// Cross Site Request Forgery (csurf)
// Maximum login attempts
// Prevent parameter pollution

// Cors
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
if (process.env.NODE_ENV === 'development') app.use(cors(corsOptions));
// TODO: Protect production mode to offer CorsOptions to URL where frontend is hosted
else app.use(cors());

// * Initial middleware

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req: Request, _res, next) => {
  req.requestTime = new Date().toISOString();
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
