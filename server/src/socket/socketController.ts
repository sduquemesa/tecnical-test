import { Server, Socket } from 'socket.io';
import * as http from 'http';

import { HOSTNAME } from './../env';
import { IUserParams } from './../types';
import Room from './roomManager';

export default function socket(httpServer: http.Server): Server {
  const io: Server = new Server(httpServer, {
    cors: {
      // TODO: Fix CORS when deploying
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('Socket.io initialised!');
  io
    // TODO: .use(verify) to check user has logged in
    .on('connection', async (socket: Socket) => {
      // Get user params from query
      const user_params: IUserParams = {
        io: io,
        socket: socket,
        username: '',
        ...socket.handshake.query,
      };

      console.log(
        'Client Connected:',
        user_params.username,
        user_params.socket.id
      );

      const room = new Room(user_params);
      room.init();
    });

  return io;
}
