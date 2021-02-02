import { Server, Socket } from 'socket.io';
import { IUserParams } from '../types';
import consola from 'consola';
import { Message } from './../models';

import mongoose from 'mongoose';

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
      // Join room
      await this.joinRoom(room);
      consola.info(`Client joined room: ${this.current_room}`);
    });
  } /* end onJoin() */

  /**
   * onRoomChange: register on room change event.
   *
   * @return none.
   */
  private onRoomChange() {
    this.socket.on('room_change', async (new_room: string) => {
      consola.info(
        `Client changed from room ${this.current_room} to ${new_room}`
      );

      // Leave current room
      await this.leaveRoom();

      // Join the new room
      this.current_room = new_room;
      await this.joinRoom(this.current_room);
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
    this.socket.on('message', (message: string) => {
      consola.info(`Room.onMessage(${message})`);
      this.socket
        .to(this.current_room)
        .emit(`Message from ${this.socket.id}`, message);
      this.storeMessage(message);
    });
  } /* End of onMessage() */

  /**
   * storeMessage: store message on DB
   *
   * @return none.
   */
  private storeMessage(message: string) {
    consola.info(`Room.storeOnDB(${message})`);
    const messageDB = new Message({
      username: this.username,
      message: message,
      room: this.current_room,
    });
    messageDB.save();
  } /* End of storeMessage() */

  private async joinRoom(new_room: string) {
    await this.socket.join(`${new_room}`);
    this.current_room = new_room;
    this.on_room = true;
    // Let others in the room know someone has joined
    for (const room of this.socket.rooms) {
      if (room !== this.socket.id) {
        this.socket
          .to(room)
          .emit(`user has joined ${this.socket.id}`, this.socket.id);
      }
    }
    // send last messages
    this.socket.emit('message_history', this.getLastMessages());
  }

  private async leaveRoom() {
    // Let others in the curret room know someone just left
    for (const room of this.socket.rooms) {
      if (room !== this.socket.id) {
        this.socket.to(room).emit(`user_left`, this.socket.id);
      }
    }
    // Leave current room
    await this.socket.leave(`${this.current_room}`);
    this.on_room = false;
    this.current_room = '';
  }

  private async getLastMessages() {
    const messages = await Message.find({ room: this.current_room })
      .sort({ created_at: -1 })
      .limit(20);
    consola.log(messages);
    return messages;
  }
} /* end of Class */
