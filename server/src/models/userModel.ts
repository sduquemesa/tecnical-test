import mongoose from 'mongoose';
import { userSchema } from '../schema';

const User = mongoose.model('User', userSchema);

export default User;

/**
 * Checks if username already exists
 * @param {string} username
 * @returns {boolean} True if doc existing, false otherwise
 */
export async function checkExisting(username: string): Promise<boolean> {
  const match = await User.findOne({ username });
  return !!match;
}
