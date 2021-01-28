import express, { Application, Request, Response, NextFunction } from 'express';
import * as http from 'http';
import cors from 'cors';

import { PORT, HOSTNAME } from './env';
import { socket } from './socket';

// Create express app
const app: Application = express();

// Create socket server
const httpServer = http.createServer();
socket(httpServer);

// Set CORS policy
app.use((inRequest: Request, inResponse: Response, inNext: NextFunction) => {
  inResponse.header('Access-Control-Allow-Origin', '*');
  inResponse.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  inResponse.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept'
  );
  inNext();
});

// Add json parsing middleware to app
app.use(express.json());

// Application routing
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello from server!' });
});

// Start server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));

// Plug servers on ports
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}!`);
});

httpServer.listen(PORT, () => {
  console.log(`SOCKET listening on port ${PORT}!`);
});
