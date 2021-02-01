import dotenv from 'dotenv';
dotenv.config();

export let HOSTNAME: string = '';
export let PORT: number = 0;
export let DB_URL: string = '';

if (process.env.NODE_ENV === 'production') {
  HOSTNAME = '';
  PORT = 0;
  DB_URL = '';
} else {
  HOSTNAME = 'localhost';
  PORT = 3000;
  DB_URL = 'mongodb://127.0.0.1:27017/chatdb';
}
