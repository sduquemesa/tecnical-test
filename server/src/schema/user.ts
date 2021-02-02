import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, lowercase: true, unique: true },
  password: String,
});

export default userSchema;
