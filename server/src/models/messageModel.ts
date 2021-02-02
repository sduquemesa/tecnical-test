import mongoose from 'mongoose';
import { messageSchema } from '../schema';

const Message = mongoose.model('Message', messageSchema);

export default Message;
