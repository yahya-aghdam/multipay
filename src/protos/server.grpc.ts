import { Server, ServerCredentials } from '@grpc/grpc-js';
import { proto_url } from "../config/constants";
import { CreatePaymentService, VerifyPaymentService } from "./multipay";
import { createPayment, verifyPayment } from "./multipay.service.proto";
import { DB } from '../db/mikro_orm';

// gRPC Server Initialization
const gRPCServer = new Server();

export async function startGrpcServer(db: DB): Promise<void> {


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
}

export function stopGrpcServer(): Promise<void> {
    return new Promise((resolve) => {
        gRPCServer.tryShutdown(() => resolve());
    });
}