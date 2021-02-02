import { Schema } from 'mongoose';

const messageSchema = new Schema({
  username: String,
  message: String,
  room: String,
  created_at: { type: Date, default: Date.now },
});

export default messageSchema;
