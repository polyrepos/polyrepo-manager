import { config } from "dotenv";
config();

export const env = (key:string)=> process.env[key] || '';