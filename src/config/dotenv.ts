import dotenv from 'dotenv';
dotenv.config({ path: "src/config/.env" });

// Exporting the PROTO_URL environment variable as a string
export const PROTO_URL = process.env.PROTO_URL as string || "localhost";

// Exporting the PROTO_PORT environment variable as a string
export const PROTO_PORT = process.env.PROTO_PORT as string || "50051";

// Exporting the GRAPHQL_PORT environment variable as a string
export const GRAPHQL_PORT = process.env.GRAPHQL_PORT as string || "4000";

// Exporting the DB_URL environment variable as a string
export const DB_URL = process.env.DB_URL as string;

// Exporting the DB_NAME environment variable as a string
export const DB_NAME = process.env.DB_NAME as string || "multipay";

// Exporting the PAYMENT_EXPIRATION_TIME_MIN environment variable as a string
export const PAYMENT_EXPIRATION_TIME_MIN = process.env.PAYMENT_EXPIRATION_TIME_MIN as string || "20";

// Exporting the WALLET_STRENGTH environment variable as a string
export const WALLET_STRENGTH = process.env.WALLET_STRENGTH as string || "128";

// Exporting the ETHER_SCAN_API_KEY for Ethereum environment variable as a string
export const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY as string;

// Exporting the BSC_SACN_API_KEY for Binance Smart Chain environment variable as a string
export const BSC_SACN_API_KEY = process.env.BSC_SACN_API_KEY as string;
