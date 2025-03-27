import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { startGrpcServer, stopGrpcServer } from "../protos/server.grpc";
import { DB } from "../db/mikro_orm";
import { amount, clientId, coin } from "./consts";
import { proto_url } from "../config/constants";

let createPaymentClient: any
let verifyPaymentClient: any
let paymentObj: any = {}

beforeAll(async () => {
    const db = new DB("test");
    await db.init();

    // Start the gRPC server
    await startGrpcServer(db);

    // Load the gRPC client definition
    const packageDefinition = protoLoader.loadSync("src/protos/multipay.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    const proto: any = grpc.loadPackageDefinition(packageDefinition).multipay;

    createPaymentClient = new proto.CreatePayment(
        proto_url,
        grpc.credentials.createInsecure()
    );

    verifyPaymentClient = new proto.VerifyPayment(
        proto_url,
        grpc.credentials.createInsecure()
    );

});

afterAll(async () => {
    await stopGrpcServer();
});

describe("gRPC Payment", () => {
    it("should process a valid payment", (done) => {

        createPaymentClient.createPayment(
            { coin, amount, clientId },
            (err: grpc.ServiceError | null, response: any) => {

                expect(err).toBeNull();

                expect(response).toEqual({
                    time: expect.any(String),
                    expiration: expect.any(String),
                    address: expect.any(String),
                    paymentId: expect.any(String),
                    coin,
                    amount,
                    clientId,
                });

                paymentObj = response
                delete paymentObj.time

                done();
            }
        );
    });

    it("should return an error for invalid input", (done) => {
        createPaymentClient.createPayment(
            { amount, clientId, coin: "eth" },
            (err: grpc.ServiceError | null, response: any) => {
                expect(err).not.toBeNull();
                expect(err?.code).toBe(grpc.status.INVALID_ARGUMENT);
                done();
            }
        );
    });

    it("should return a valid payment info", (done) => {

        verifyPaymentClient.verifyPayment(
            { paymentId: paymentObj.paymentId },
            (err: grpc.ServiceError | null, response: any) => {

                expect(err).toBeNull();

                expect(response).toEqual({
                    isPaid: false,
                    isConfirmed: false,
                    ...paymentObj
                });
                done();
            }
        );
    });

    it("should return an error for invalid input", (done) => {
        verifyPaymentClient.verifyPayment(
            { paymentId: "sdflskj" },
            (err: grpc.ServiceError | null, response: any) => {
                expect(err).not.toBeNull();
                expect(err?.code).toBe(grpc.status.NOT_FOUND);
                done();
            }
        );
    });
});
