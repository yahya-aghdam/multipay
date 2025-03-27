import { validateEnv } from './lib';
import { DB } from './db/mikro_orm';
import { startGraphQlServer } from './qraphql/server.apollo';
import { startGrpcServer } from './protos/server.grpc';

export async function main() {

    // Make sure that all necessary vars are in .env file
    validateEnv();

    // Creating an instance of the DB class
    const db = new DB();
    await db.init().then(async () => {

        // gRPC Server Initialization
        startGrpcServer(db).catch(console.error);

        // GraphQL Server Initialization
        startGraphQlServer(db).catch(console.error);

    }).catch((err) => {
        throw err;
    })
}

main().catch(console.error);