import { Server, Socket } from 'socket.io';

export interface IUserInfo {
  io: Server;
  socket: Socket;
  username: string;
  room_id: number;
  password: string;
  action: string;
}
