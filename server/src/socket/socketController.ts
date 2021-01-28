import { Server, Socket } from 'socket.io';
import * as http from 'http';

export default function socket(httpServer: http.Server): Server {
  const io: Server = new Server(httpServer);

  console.log('Socket.io initialised!');
  io.on('connection', (socket: Socket) => {
    console.log('Client Connected', socket);
  });

  return io;
}
