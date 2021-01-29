import { Server, Socket } from 'socket.io';
import { IUserParams } from './../types';

export default class Room {
  /**
   * Constructor.
   */
  private static params: IUserParams;
  constructor(params: IUserParams) {
    console.log(`Rooms.constructor socket_id=${params.socket.id}`);
    Room.params = params;
  } /* End constructor(). */

  /**
   * init: Init connection to room
   *
   * @return boolean if connection to room was established.
   */
  public async init(): Promise<boolean> {
    console.log('Room.init()');
    // destructure params
    let { io, socket, username, room_name, action } = Room.params;

    try {
      await socket.join('${room_id}');
      console.log(`Client joined room: ${room_name}`);
      return true;
    } catch (error) {
      console.log('Room.init() ERROR when trying to join room');
    }

    return false;
  } /* end init() */

  /**
   * onDisconnect: Emit message to other users in the room.
   *
   * @return none.
   */
  public onDisconnecting() {
    let { socket } = Room.params;

    socket.on('disconnecting', (reason: any) => {
      console.log('Room.onDisconnect()');
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit(`user has left ${socket.id}`, socket.id);
          console.log(`user ${socket.id} has left`);
        }
      }
    });
  }
}
