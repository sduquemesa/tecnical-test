import dotenv from 'dotenv';
dotenv.config();

export const HOSTNAME: string =
  process.env.NODE_ENV === 'production' ? '' : 'localhost';

export const PORT: string = process.env.NODE_ENV === 'production' ? '' : '3000';
