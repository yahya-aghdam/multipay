
import { MongoDriver } from '@mikro-orm/mongodb';
import { MySqlDriver } from '@mikro-orm/mysql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

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

export function getDriver(db_url: string) {
    const db_name = db_url.split(':')[0];

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

// Return Date object based on expiration days
export function expireTimeMaker(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

// Make sure that all necessary vars are in .env file
export function validateEnv() {
    const requiredVars = [
        'JWT_SECRET',
        "COOKIE_DOMAIN",
        "MAIN_URL",
        "API_PATH",
        "HTTP_PORT",
        "PROTO_URL",
        "PROTO_PORT",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "SUCCESS_AUTH_REDIRECT_PATH"

    ];
    const missingVars = requiredVars.filter((envVar) => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }
}