import { Server, Socket } from 'socket.io';
import { IUserParams } from '../types';
import consola from 'consola';

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
    Object.assign(this, { io, socket, username });
    this.current_room = '';
    this.on_room = false;
    consola.info('Room.init()');
  } /* End constructor(). */

  /**
   * init: register listeners to events
   *
   * @return none.
   */
  public init() {
    consola.info('Room.init()');
    // register the join_room event to the socket
    this.onJoin();
    // register the change_room event to the socket
    this.onRoomChange();
    // register the disconnecting event to the socket
    this.onDisconnecting();
    // register on message event to the socket
    this.onMessage();
  }

  /**
   * onJoin: register on join room event
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
        consola.info(`Client joined room: ${this.current_room}`);
      } catch (error) {
        consola.info('Room.join() ERROR when trying to join room');
      }
    });
  } /* end onJoin() */

  /**
   * onRoomChange: register on room change event.
   *
   * @return none.
   */
  private onRoomChange() {
    this.socket.on('room_change', (new_room: string) => {
      consola.info(
        `Client changed from room ${this.current_room} to ${new_room}`
      );

      // Let others in the room know someone just left
      for (const room of this.socket.rooms) {
        if (room !== this.socket.id) {
          this.socket.to(room).emit(`user_left`, this.socket.id);
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
          this.socket.to(room).emit(`user_joined`, this.socket.id);
        }
      }
    });
  } /* end onRoomChange() */

  /**
   * onDisconnect: register on disconnecting event to emit message to other users in the room.
   *
   * @return none.
   */
  private onDisconnecting() {
    this.socket.on('disconnecting', (reason: any) => {
      consola.info('Room.onDisconnect()');
      for (const room of this.socket.rooms) {
        if (room !== this.socket.id) {
          this.socket
            .to(room)
            .emit(`user has left ${this.socket.id}`, this.socket.id);
          consola.info(`user ${this.socket.id} has left`);
        }
      }
    });
  } /* end onDisconnecting() */

  /**
   * onMessage: register on message event
   *
   * @return none.
   */
  private onMessage() {
    consola.info('Room.onMessage()');
    this.socket.on('message', (message: string) => {
      consola.info(`Room.onMessage(${message})`);
      this.socket
        .to(this.current_room)
        .emit(`Message from ${this.socket.id}`, message);
    });
  } /* End of onMessage() */
} /* end of Class */
