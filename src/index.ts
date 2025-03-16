import { validateEnv } from './lib';
import {  proto_url } from './config/constants';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { CreatePaymentService, VerifyPaymentService } from './protos/multipay';
import { createPayment, verifyPayment } from './protos/multipay.service.proto';

// Make sure that all necessary vars are in .env file
validateEnv();


// gRPC Server Initialization
const server = new Server();

// Adding the CreatePaymentService to the gRPC server with the createPayment function as the handler
server.addService(CreatePaymentService, { createPayment });

// Adding the VerifyPaymentService to the gRPC server with the verifyPayment function as the handler
server.addService(VerifyPaymentService, { verifyPayment });

// Binding the gRPC server to the specified address and port with insecure credentials (no SSL/TLS)
server.bindAsync(
    proto_url, // The address and port for the gRPC server to listen on
    ServerCredentials.createInsecure(), // Use insecure credentials (no SSL/TLS) for simplicity in development
    () => {
        // Callback function executed once the gRPC server is bound successfully
        console.log(`gRPC server running on ==> grpc://${proto_url}`);
    }
);

