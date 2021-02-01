import { Server, Socket } from 'socket.io';

export interface IUserParams {
  io: Server;
  socket: Socket;
  username: string;
}
