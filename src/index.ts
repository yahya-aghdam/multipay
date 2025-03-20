import { validateEnv } from './lib';
import { proto_url } from './config/constants';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { CreatePaymentService, VerifyPaymentService } from './protos/multipay';
import { createPayment, verifyPayment } from './protos/multipay.service.proto';
import { DB } from './db/mikro_orm';
import { graphQlServer } from './qraphql/server';

async function main() {

    // Make sure that all necessary vars are in .env file
    validateEnv();

    // Creating an instance of the DB class
    const db = new DB();
    await db.init().then(async () => {


        // gRPC Server Initialization
        const gRPCServer = new Server();

        // Adding the CreatePaymentService to the gRPC server with the createPayment function as the handler
        gRPCServer.addService(CreatePaymentService, { createPayment: createPayment(db) });

        // Adding the VerifyPaymentService to the gRPC server with the verifyPayment function as the handler
        gRPCServer.addService(VerifyPaymentService, { verifyPayment: verifyPayment(db) });

        // Binding the gRPC server to the specified address and port with insecure credentials (no SSL/TLS)
        gRPCServer.bindAsync(
            proto_url, // The address and port for the gRPC server to listen on
            ServerCredentials.createInsecure(), // Use insecure credentials (no SSL/TLS) for simplicity in development
            () => {
                // Callback function executed once the gRPC server is bound successfully
                console.log(`gRPC server running on ==> grpc://${proto_url}`);
            }
        );

        graphQlServer(db).catch(console.error);

    }).catch((err) => {
        throw err;
    })
}

main().catch(console.error);