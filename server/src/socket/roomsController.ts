import { Server, Socket } from 'socket.io';
import { IUserParams } from './../types';

export default class Room {
   /**
   * Constructor.
   */
  private io: Server;
  private socket: Socket;
  public username: string;
  public room_name: string;
  private action: string;
  constructor({ io, socket, username, room_name, action }: IUserParams) {
    Object.assign(this, { io, socket, username, room_name, action });
  } /* End constructor(). */

  /**
   * init: Init connection to room
   *
   * @return boolean if connection to room was established.
   */
  public async init(): Promise<boolean> {
    console.log('Room.init()');
    // destructure params

    try {
      await this.socket.join('${room_id}');
      console.log(`Client joined room: ${this.room_name}`);
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
    this.socket.on('disconnecting', (reason: any) => {
      console.log('Room.onDisconnect()');
      for (const room of this.socket.rooms) {
        if (room !== this.socket.id) {
          this.socket
            .to(room)
            .emit(`user has left ${this.socket.id}`, this.socket.id);
          console.log(`user ${this.socket.id} has left`);
        }
      }
    });
  } /* end onDisconnecting() */
} /* end of Class */
