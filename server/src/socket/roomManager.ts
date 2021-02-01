import { Server, Socket } from 'socket.io';
import { IUserParams } from '../types';

export default class Room {
  /**
   * Constructor.
   */
  private io: Server;
  private socket: Socket;
  public username: string;
  public current_room: string;
  public on_room: boolean;
  constructor({ io, socket, username }: IUserParams) {
    console.log('Room.constructor');
    Object.assign(this, { io, socket, username });
    this.current_room = '';
    this.on_room = false;

    // Attach the join_room event to the socket
    this.onJoin();
    // Attach the change_room event to the socket
    this.onRoomChange();
    // Attach the disconnecting event to the socket
    this.onDisconnecting();
  } /* End constructor(). */

  /**
   * onJoin: attach on join room event
   *
   * @return none.
   */
  private onJoin() {
    this.socket.on('join_room', async (room: string) => {
      // Join to room
      try {
        await this.socket.join(`${room}`);
        this.current_room = room;
        this.on_room = true;
        // Let others in the room know someone has joined
        for (const room of this.socket.rooms) {
          if (room !== this.socket.id) {
            this.socket
              .to(room)
              .emit(`user has joined ${this.socket.id}`, this.socket.id);
          }
        }
        console.log(`Client joined room: ${this.current_room}`);
      } catch (error) {
        console.log('Room.join() ERROR when trying to join room');
      }
    });
  } /* end onJoin() */

  /**
   * onRoomChange: Attach on room change event.
   *
   * @return none.
   */
  private onRoomChange() {
    this.socket.on('room_change', (new_room: string) => {
      console.log(
        `Client changed from room ${this.current_room} to ${new_room}`
      );

      // Let others in the room know someone just left
      for (const room of this.socket.rooms) {
        if (room !== this.socket.id) {
          this.socket
            .to(room)
            .emit(`user has left ${this.socket.id}`, this.socket.id);
        }
      }
      // Leave current room
      this.socket.leave(`${this.current_room}`);

      // Join the new room
      this.current_room = new_room;
      this.socket.join(`${new_room}`);
      // Let others in the room know someone has joined
      for (const room of this.socket.rooms) {
        if (room !== this.socket.id) {
          this.socket
            .to(room)
            .emit(`user has joined ${this.socket.id}`, this.socket.id);
        }
      }
    });
  } /* end onRoomChange() */

  /**
   * onDisconnect: Attach on disconnecting event to emit message to other users in the room.
   *
   * @return none.
   */
  private onDisconnecting() {
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
