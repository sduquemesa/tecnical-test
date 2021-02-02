import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  username: String,
  message: String,
  created_at: { type: Date, default: Date.now },
});

export default messageSchema;
