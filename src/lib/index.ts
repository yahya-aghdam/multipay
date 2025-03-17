
import { MongoDriver } from '@mikro-orm/mongodb';
import { MySqlDriver } from '@mikro-orm/mysql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PAYMENT_EXPIRATION_TIME_MIN } from '../config/dotenv';
import { allowedCoins } from '../config/constants';

/**
 * Checks whether a given object is empty.
 * @param object - An object of type Record<string, unknown> (key-value pairs where the keys are strings and the values are of any type).
 * @returns A boolean value - true if the object has no properties, otherwise false.
 */
export function isObjectEmpty(object: Record<string, unknown>): boolean {
    for (const property in object) {
        return false; // If any property is found, the object is not empty
    }
    return true; // If no properties are found, the object is considered empty
}

/**
 * Determines the appropriate database driver based on the database URL.
 * @param db_url - The database URL as a string.
 * @returns The corresponding database driver.
 */
export function getDriver(db_url: string) {
    // Extracting the database name from the URL
    const db_name = db_url.split(':')[0];

    // Returning the appropriate driver based on the database name
    if (db_name === 'mongodb') {
        return MongoDriver;
    }
    if (db_name === 'mysql') {
        return MySqlDriver;
    }
    if (db_name === 'postgres') {
        return PostgreSqlDriver;
    }
}

/**
 * Generates a Date object based on the number of expiration days.
 * @param days - The number of days until expiration.
 * @returns A Date object representing the expiration time.
 */
export function expireTimeMaker(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/**
 * Validates that all necessary environment variables are present.
 * If any required variables are missing, logs an error and exits the process.
 */
export function validateEnv() {
    // List of required environment variables
    const requiredVars = [
        "PROTO_URL",
        "PROTO_PORT",
        "DB_URL",
        "DB_NAME",
        "PAYMENT_EXPIRATION_TIME_MIN",
        "WALLET_STRENGTH",
    ];
    // Filtering out missing environment variables
    const missingVars = requiredVars.filter((envVar) => !process.env[envVar]);

    // If there are missing variables, log an error and exit the process
    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }
}

/**
 * Returns the current Unix timestamp as a string.
 * @returns The current Unix timestamp as a string.
 */
export function nowUnixStr(): string {
    return Date.now().toString();
}

/**
 * Returns the expiration time as a Unix timestamp string.
 * @returns The expiration time as a Unix timestamp string.
 */
export function expirationTimeStr(): string {
    const date = Date.now() + (+PAYMENT_EXPIRATION_TIME_MIN * 60 * 1000);
    return date.toString();
}

/**
 * Converts a Unix timestamp to an ISO string.
 * @param unixTimestamp - The Unix timestamp as a string.
 * @returns The ISO string representation of the timestamp.
 */
export function unixToIsoStr(unixTimestamp: string): string {
    return new Date(unixTimestamp).toISOString();
}



/**
 * Handles coins that are not supported by mapping them to a supported coin by Trust wallet.
 *
 * @param coin - The coin to be checked and potentially mapped.
 * @returns An object containing:
 *  - `valid`: A boolean indicating if the coin is valid.
 *  - `coin`: The mapped coin if the original coin is not supported, otherwise an empty string.
 */
export function notSupportedCoinsHandler(coin: string): { valid: boolean, coin: string } {

    if (coin == "smartchain") {
        return { valid: allowedCoins.includes(coin), coin: "ethereum"}
    }

    if (coin == "usdt_trc20") {
        return { valid: allowedCoins.includes(coin), coin: "tron"}
    }

    if (coin == "usdt_bep20") { 
        return { valid: allowedCoins.includes(coin), coin: "smartchain"}
    }

    return {valid: false, coin:""}
}