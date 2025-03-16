import dotenv from 'dotenv';
dotenv.config({ path: "src/config/.env" });

export const PROTO_URL = process.env.PROTO_URL as string;
export const PROTO_PORT = process.env.PROTO_PORT as string;
export const DB_URL = process.env.DB_URL as string;
export const DB_NAME = process.env.DB_NAME as string;
export const PAYMENT_EXPIRATION_TIME_MIN = process.env.PAYMENT_EXPIRATION_TIME_MIN as string;
export const WALLET_STRENGTH = process.env.WALLET_STRENGTH as string;
export const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY as string;
