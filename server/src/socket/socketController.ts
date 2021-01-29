import { Server, Socket } from 'socket.io';
import * as http from 'http';

import { HOSTNAME } from './../env';
import { IUserInfo } from './../types';

export default function socket(httpServer: http.Server): Server {
  const io: Server = new Server(httpServer, {
    cors: {
      // TODO: Fix CORS when deploying
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('Socket.io initialised!');
  io.on('connection', async (socket: Socket) => {
    const user_info: IUserInfo = {
      io: io,
      socket: socket,
      username: '',
      room_id: 0,
      password: '',
      action: '',
      ...socket.handshake.query,
    };
    // const room = new Room(user_info);

    console.log('Client Connected', user_info);
  });

  return io;
}
