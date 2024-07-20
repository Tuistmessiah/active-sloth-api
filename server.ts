import mongoose from 'mongoose';
import { app } from './app';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

console.info('Connecting to: ' + process.env.MONGO_DB);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.info('DB connection successful!');
  mongoose.connection.db
    .listCollections()
    .toArray()
    .then((res) => {
      console.info('Server connections:');
      console.info(res);
    });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.info(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  if (err instanceof Error) console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export { app };
