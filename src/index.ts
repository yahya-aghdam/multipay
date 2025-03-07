import { validateEnv } from './lib';
import {  proto_url } from './config/constants';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { CreatePaymentService, VerifyPaymentService } from './protos/multipay';
import { createPayment, verifyPayment } from './protos/multipay.service.proto';

// Make sure that all necessary vars are in .env file
validateEnv();


// gRPC Server Initialization
const server = new Server();

// Create a new gRPC server instance
server.addService(CreatePaymentService, { createPayment });
server.addService(VerifyPaymentService, { verifyPayment });

server.bindAsync(
    proto_url, // The address and port for the gRPC server to listen on
    ServerCredentials.createInsecure(), // Use insecure credentials (no SSL/TLS) for simplicity in development
    () => {
        // Callback function executed once the gRPC server is bound successfully
        console.log(`gRPC server running on ==> grpc://${proto_url}`);
    }
);
