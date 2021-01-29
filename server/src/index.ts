import express, { Application, Request, Response, NextFunction } from 'express';
import * as http from 'http';
import path from 'path';
import cors from 'cors';

import { PORT, HOSTNAME } from './env';
import { socket } from './socket';

// Create express app
const app: Application = express();

// Create socket server
const httpServer = http.createServer();
socket(httpServer);

// Set CORS policy
// TODO Fix cors policy before deploying app
app.use(cors({ origin: '*', credentials: true }));

// Add json parsing middleware to app
app.use(express.json());

// Serve static to test server
app.use('/public', express.static('public'));

// Application routing
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello from app!' });
});

// Start server
app.listen(Number(PORT), () =>
  console.log(`Server is listening on port ${PORT}!`)
);

// Plug servers on ports
app.listen(Number(PORT), () => {
  console.log(`API listening on port ${PORT}!`);
});

httpServer.listen(Number(PORT) + 1, () => {
  console.log(`SOCKET listening on port ${PORT}!`);
});
