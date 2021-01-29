import { Server, Socket } from 'socket.io';
import * as http from 'http';

import { HOSTNAME } from './../env';
import { IUserParams } from './../types';
import Room from './roomsController';

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
    // Get user params from query
    const user_params: IUserParams = {
      io: io,
      socket: socket,
      username: '',
      room_name: '',
      action: '',
      ...socket.handshake.query,
    };

    console.log(
      'Client Connected:',
      user_params.username,
      user_params.room_name,
      user_params.action,
      user_params.socket.id
    );

    const room = new Room(user_params);
    const in_room: boolean = await room.init();

    if (in_room) {
      console.log('In room');
    }

    // Attach the change_room event to the socket
    // room.onRoomChange();

    // Attach the disconnecting event to the socket
    room.onDisconnecting();
  });

  return io;
}
